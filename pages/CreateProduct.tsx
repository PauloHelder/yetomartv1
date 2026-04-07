
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category, Module } from '../types';
import CurriculumBuilder from '../components/CurriculumBuilder';

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: Category.COURSE,
    price: 0,
    pricingType: 'one-time', // one-time | subscription
    image: null as File | null,
    ebookFile: null as File | null,
    modules: [] as Module[],
    quiz: {
      title: '',
      questions: [] as any[]
    }
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const addQuestion = () => {
    setFormData({
      ...formData,
      quiz: {
        ...formData.quiz,
        questions: [
          ...formData.quiz.questions,
          { id: Date.now().toString(), text: '', options: ['', '', '', ''], correctOptionIndex: 0 }
        ]
      }
    });
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...formData.quiz.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, quiz: { ...formData.quiz, questions: newQuestions } });
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...formData.quiz.questions];
    const newOptions = [...newQuestions[qIndex].options];
    newOptions[oIndex] = value;
    newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
    setFormData({ ...formData, quiz: { ...formData.quiz, questions: newQuestions } });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = formData.quiz.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, quiz: { ...formData.quiz, questions: newQuestions } });
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Logic differentiation for Payload
    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: formData.price,
      pricingType: formData.pricingType,
    };

    if (formData.category === Category.COURSE) {
      Object.assign(payload, { 
        curriculum: formData.modules,
        quiz: formData.quiz.questions.length > 0 ? formData.quiz : null
      });
      console.log('Enviando Curso para API:', payload);
    } else if (formData.category === Category.EBOOK) {
      Object.assign(payload, { fileId: 'simulated-file-id' });
      console.log('Enviando Ebook para API:', payload);
    } else {
      console.log('Enviando Assinatura para API:', payload);
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/producer');
    }, 2000);
  };

  const steps = [
    { n: 1, label: 'Básico' },
    { n: 2, label: 'Preço' },
    { n: 3, label: 'Conteúdo' },
    { n: 4, label: 'Quiz' }
  ];

  return (
    <div className="bg-[#0f172a] min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <button onClick={() => navigate('/producer')} className="text-[10px] font-black text-slate-500 hover:text-white flex items-center mb-8 uppercase tracking-widest transition-colors">
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar ao Painel
          </button>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic font-serif">Criar Novo Infoproduto</h1>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-16 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-full bg-white/10"></div>
          {steps.map(s => (
            <div key={s.n} className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-all border-2 ${
                step >= s.n ? 'bg-yetomart-teal border-yetomart-teal text-white shadow-xl' : 'bg-[#0f172a] border-white/10 text-slate-600'
              }`}>
                {s.n}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] mt-3 ${step >= s.n ? 'text-white' : 'text-slate-600'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white/5 rounded-sm border border-white/5 p-10 shadow-2xl backdrop-blur-md">
          {step === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic border-l-4 border-yetomart-teal pl-4 font-serif">Informações Básicas</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Nome do Produto *</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-white/5 p-4 rounded-sm border border-white/10 outline-none focus:border-yetomart-teal transition-all text-white font-medium" 
                    placeholder="Ex: Dominando Next.js"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Descrição Curta *</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 p-4 rounded-sm border border-white/10 outline-none focus:border-yetomart-teal transition-all text-white font-medium h-32 resize-none" 
                    placeholder="Resuma seu produto em poucas palavras..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Categoria</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[Category.COURSE, Category.EBOOK, Category.SUBSCRIPTION].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`p-5 rounded-sm border-2 font-black text-xs uppercase tracking-widest transition-all ${
                          formData.category === cat ? 'border-yetomart-teal bg-yetomart-teal/10 text-white' : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/20'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic border-l-4 border-yetomart-teal pl-4 font-serif">Configuração de Preço</h2>
              <div className="grid grid-cols-2 gap-8">
                <div 
                  onClick={() => setFormData({ ...formData, pricingType: 'one-time' })}
                  className={`p-8 rounded-sm border-2 cursor-pointer transition-all group ${formData.pricingType === 'one-time' ? 'border-yetomart-teal bg-yetomart-teal/10' : 'border-white/5 bg-white/5'}`}
                >
                  <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center mb-6 border border-white/10 group-hover:bg-yetomart-teal transition-all text-xl">💳</div>
                  <h4 className="font-black text-white uppercase tracking-tighter italic text-lg mb-2 font-serif">Pagamento Único</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">O aluno paga uma vez e tem acesso conforme sua regra de negócio.</p>
                </div>
                <div 
                  onClick={() => setFormData({ ...formData, pricingType: 'subscription' })}
                  className={`p-8 rounded-sm border-2 cursor-pointer transition-all group ${formData.pricingType === 'subscription' ? 'border-yetomart-teal bg-yetomart-teal/10' : 'border-white/5 bg-white/5'}`}
                >
                  <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center mb-6 border border-white/10 group-hover:bg-yetomart-teal transition-all text-xl">🔄</div>
                  <h4 className="font-black text-white uppercase tracking-tighter italic text-lg mb-2 font-serif">Assinatura Recorrente</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Pagamentos mensais, trimestrais ou anuais com renovação automática.</p>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Valor de Venda (Kz)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-yetomart-orange font-black italic">Kz</span>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full bg-white/5 pl-14 p-4 rounded-sm border border-white/10 outline-none focus:border-yetomart-teal transition-all text-white font-black text-xl italic" 
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic border-l-4 border-yetomart-teal pl-4 font-serif">Conteúdo do {formData.category}</h2>
              
              {formData.category === Category.EBOOK && (
                <div className="border-2 border-dashed border-white/10 rounded-sm p-16 text-center bg-white/5">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                    <svg className="w-10 h-10 text-yetomart-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  </div>
                  <h4 className="font-black text-white uppercase tracking-widest text-sm mb-2">Upload do Ebook (PDF)</h4>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-8">Tamanho máximo de 50MB</p>
                  <input type="file" id="ebook" className="hidden" accept=".pdf" />
                  <label htmlFor="ebook" className="cursor-pointer bg-yetomart-teal text-white px-10 py-4 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-yetomart-teal/80 transition-all shadow-xl">Escolher arquivo</label>
                </div>
              )}

              {formData.category === Category.COURSE && (
                <CurriculumBuilder 
                  modules={formData.modules} 
                  onChange={(modules) => setFormData({ ...formData, modules })} 
                />
              )}

              {formData.category === Category.SUBSCRIPTION && (
                <div className="p-10 bg-yetomart-teal/10 border border-yetomart-teal/20 rounded-sm text-center">
                   <p className="text-yetomart-teal font-black uppercase tracking-widest text-xs leading-relaxed">Para assinaturas, o conteúdo é gerenciado através da área de membros exclusiva e mentorias agendadas.</p>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center justify-between border-l-4 border-yetomart-teal pl-4">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic font-serif">Quiz Final (Opcional)</h2>
                <button 
                  onClick={addQuestion}
                  className="bg-yetomart-teal text-white px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-yetomart-teal/80 transition-all"
                >
                  + Adicionar Questão
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Título do Quiz</label>
                  <input 
                    type="text" 
                    value={formData.quiz.title}
                    onChange={e => setFormData({ ...formData, quiz: { ...formData.quiz, title: e.target.value } })}
                    className="w-full bg-white/5 p-4 rounded-sm border border-white/10 outline-none focus:border-yetomart-teal transition-all text-white font-medium" 
                    placeholder="Ex: Avaliação Final de React"
                  />
                </div>

                <div className="space-y-6">
                  {formData.quiz.questions.map((q, qIndex) => (
                    <div key={q.id} className="p-6 bg-white/5 border border-white/10 rounded-sm space-y-6 relative group">
                      <button 
                        onClick={() => removeQuestion(qIndex)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-yetomart-orange transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>

                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Pergunta {qIndex + 1}</label>
                        <input 
                          type="text" 
                          value={q.text}
                          onChange={e => updateQuestion(qIndex, 'text', e.target.value)}
                          className="w-full bg-white/5 p-4 rounded-sm border border-white/10 outline-none focus:border-yetomart-teal transition-all text-white font-medium" 
                          placeholder="Digite a pergunta..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options.map((opt: string, oIndex: number) => (
                          <div key={oIndex} className="flex items-center space-x-3">
                            <input 
                              type="radio" 
                              name={`correct-${q.id}`}
                              checked={q.correctOptionIndex === oIndex}
                              onChange={() => updateQuestion(qIndex, 'correctOptionIndex', oIndex)}
                              className="w-4 h-4 accent-yetomart-teal"
                            />
                            <input 
                              type="text" 
                              value={opt}
                              onChange={e => updateOption(qIndex, oIndex, e.target.value)}
                              className="flex-1 bg-white/5 p-3 rounded-sm border border-white/10 outline-none focus:border-yetomart-teal transition-all text-white text-sm" 
                              placeholder={`Opção ${oIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {formData.quiz.questions.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-sm">
                      <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Nenhuma questão adicionada ainda.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-16 pt-10 border-t border-white/5">
            <button 
              onClick={step === 1 ? () => navigate('/producer') : handleBack}
              className="text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors"
            >
              {step === 1 ? 'Cancelar' : 'Voltar'}
            </button>
            
            {step < 4 ? (
              <button 
                onClick={handleNext}
                className="bg-white text-black px-12 py-4 rounded-sm font-black uppercase tracking-widest hover:bg-yetomart-teal hover:text-white transition-all shadow-xl"
              >
                Continuar
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-yetomart-teal text-white px-12 py-4 rounded-sm font-black uppercase tracking-widest hover:bg-yetomart-teal/80 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-serif italic"
              >
                {loading ? 'Finalizando...' : 'Publicar Produto'}
              </button>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default CreateProduct;
