
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import Paywall from '../components/Paywall';
import QuizPlayer from '../components/QuizPlayer';

const MembersArea: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasAccess, isLoggedIn } = useAuth();
  const { fetchById } = useProducts();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchById(id).then(data => {
        setProduct(data);
        if (data?.modules) {
          const lesions = data.modules.flatMap(m => m.lessons);
          if (lesions[0]) setCurrentLesson(lesions[0]);
        }
        setLoading(false);
      });
    }
  }, [id, fetchById]);

  // Get all lessons from product modules
  const allLessons = product?.modules?.flatMap(m => m.lessons) || [];
  
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'materials' | 'comments'>('info');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) return <div className="bg-[#0f172a] min-h-screen text-white p-20 text-center">Carregando área de membros...</div>;
  if (!product) return null;
  const access = hasAccess(product.id);

  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLesson.id);
  const nextLesson = allLessons[currentLessonIndex + 1];
  const prevLesson = allLessons[currentLessonIndex - 1];

  const handleNext = () => {
    if (nextLesson && (!nextLesson.locked || access)) {
      setCurrentLesson(nextLesson);
      setIsQuizActive(false);
    } else if (!nextLesson && product.quiz && !isQuizActive) {
      setIsQuizActive(true);
    }
  };

  const handlePrev = () => {
    if (isQuizActive) {
      setIsQuizActive(false);
      setCurrentLesson(allLessons[allLessons.length - 1]);
    } else if (prevLesson && (!prevLesson.locked || access)) {
      setCurrentLesson(prevLesson);
    }
  };

  return (
    <div className="bg-[#0f172a] min-h-screen flex flex-col h-screen overflow-hidden text-white">
      {/* Header Superior Profissional */}
      <header className="bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between z-50 sticky top-0">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors"
            title="Voltar ao Dashboard"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] sm:text-[10px] font-black text-yetomart-orange uppercase tracking-[0.2em] truncate">{product.title}</span>
            <h1 className="text-xs sm:text-sm font-black text-white line-clamp-1 uppercase tracking-tighter italic font-serif">{currentLesson?.title || 'Sem Aulas'}</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-6">
           <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Seu Progresso</span>
              <div className="flex items-center space-x-3">
                 <div className="w-24 sm:w-32 bg-white/10 h-1 rounded-full">
                    <div className="bg-yetomart-orange h-full w-[45%] rounded-full shadow-[0_0_10px_rgba(244,162,97,0.5)]"></div>
                 </div>
                 <span className="text-[10px] font-black text-white">45%</span>
              </div>
           </div>
           <button className="btn-brand">
             Concluir Aula
           </button>
           <button 
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="lg:hidden p-2 text-white hover:bg-white/10 rounded-sm transition-colors"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Lado Esquerdo: Player e Detalhes */}
        <main className={`flex-1 overflow-y-auto custom-scrollbar bg-[#0f172a] transition-all duration-300 ${sidebarOpen ? 'lg:mr-0' : ''}`}>
          <div className="p-0 md:p-8 max-w-5xl mx-auto">
            {isQuizActive && product.quiz ? (
              <QuizPlayer quiz={product.quiz} onComplete={(score) => console.log('Quiz complete:', score)} />
            ) : (
              <>
                <div className="group relative">
                  <div className="aspect-video bg-black rounded-none md:rounded-sm overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative mb-10 border border-white/5">
                    <Paywall hasAccess={!currentLesson?.locked || access} productId={product.id}>
                      <video 
                        key={currentLesson?.id}
                        className="w-full h-full" 
                        controls 
                        autoPlay
                        src={currentLesson?.videoUrl}
                      />
                    </Paywall>
                  </div>

                  {/* Controles de Navegação Flutuantes */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={handlePrev}
                      disabled={!prevLesson && !isQuizActive}
                      className={`p-4 rounded-full bg-black/60 text-white backdrop-blur-md pointer-events-auto transition-all hover:bg-yetomart-coral disabled:opacity-0 disabled:pointer-events-none shadow-2xl border border-white/10`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button 
                      onClick={handleNext}
                      disabled={!nextLesson && !product.quiz && !isQuizActive}
                      className={`p-4 rounded-full bg-black/60 text-white backdrop-blur-md pointer-events-auto transition-all hover:bg-yetomart-coral disabled:opacity-0 disabled:pointer-events-none shadow-2xl border border-white/10`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>

                <div className="px-6 md:px-0">
                  <div className="flex items-center justify-between mb-10 border-b border-white/10">
                    <div className="flex space-x-10">
                      <button 
                        onClick={() => setActiveTab('info')}
                        className={`py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'info' ? 'border-yetomart-orange text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                      >
                        Sobre a aula
                      </button>
                      <button 
                        onClick={() => setActiveTab('materials')}
                        className={`py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'materials' ? 'border-yetomart-orange text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                      >
                        Materiais
                      </button>
                      <button 
                        onClick={() => setActiveTab('comments')}
                        className={`py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'comments' ? 'border-yetomart-orange text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                      >
                        Comentários
                      </button>
                    </div>
                  </div>

                  <div className="pb-24">
                    {activeTab === 'info' && (
                      <div className="animate-fadeIn">
                        <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter italic font-serif">{currentLesson?.title}</h2>
                        {currentLesson?.description ? (
                          <p className="text-slate-400 leading-relaxed text-lg mb-10 font-medium whitespace-pre-wrap">
                            {currentLesson.description}
                          </p>
                        ) : (
                          <p className="text-slate-400 leading-relaxed text-lg mb-10 font-medium">
                            Nesta aula do curso <strong className="text-white">{product.title}</strong>, acompanhe o conteúdo focado.
                            Prepare seu ambiente e acompanhe o passo a passo demonstrado no vídeo.
                          </p>
                        )}
                        <div className="bg-white/5 border border-white/10 p-8 rounded-sm flex items-center space-x-6 backdrop-blur-sm">
                          <div className="w-14 h-14 bg-yetomart-coral/10 rounded-full flex items-center justify-center text-yetomart-coral shadow-inner">
                             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          <p className="text-sm text-slate-300 font-bold uppercase tracking-wide">Lembre-se de baixar os arquivos de apoio na aba "Materiais" para executar o projeto localmente.</p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'materials' && (
                      <div className="animate-fadeIn space-y-4">
                        {currentLesson?.attachments && currentLesson.attachments.length > 0 ? (
                          currentLesson.attachments.map((att: any) => (
                            <div key={att.id} className="p-5 bg-white/5 border border-white/10 rounded-sm flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer group">
                               <div className="flex items-center space-x-4">
                                 <div className="p-3 bg-yetomart-coral/20 rounded-sm text-yetomart-coral">
                                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V8l-6-6H7zm6 7V3.5L18.5 9H13z"/></svg>
                                 </div>
                                 <div className="flex flex-col">
                                   <span className="font-black text-white uppercase tracking-tighter italic font-serif">{att.name}</span>
                                   <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{att.size}</span>
                                 </div>
                               </div>
                               <a 
                                 href={att.url} 
                                 download 
                                 className="text-yetomart-orange font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                               >
                                 Baixar Agora
                               </a>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-sm">
                            <p className="text-slate-500 font-black uppercase tracking-widest text-xs italic">Nenhum material disponível para esta aula.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'comments' && (
                      <div className="animate-fadeIn text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-sm">
                         <p className="text-slate-500 font-black uppercase tracking-widest text-xs italic">Seja o primeiro a comentar nesta aula!</p>
                         <button className="btn-brand mt-6">Escrever Dúvida</button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        {/* Lado Direito: Lista de Aulas */}
        <aside className={`fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] bg-[#0f172a] border-l border-white/10 flex flex-col transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 border-b border-white/10 bg-[#0f172a] flex items-center justify-between">
            <h3 className="font-black text-white flex items-center uppercase tracking-[0.1em] text-[10px] italic">
              <svg className="w-5 h-5 mr-3 text-yetomart-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
              Conteúdo do Curso
            </h3>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/50 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
            {product.modules?.map((module, mIdx) => (
              <div key={module.id} className="space-y-2">
                <div className="px-5 py-4 text-[9px] font-black text-white/30 uppercase tracking-[0.3em] bg-white/5 rounded-sm mb-3 italic">
                  {module.title}
                </div>
                {module.lessons.map((lesson, lIdx) => {
                  const isLocked = lesson.locked && !access;
                  const isActive = currentLesson?.id === lesson.id;
                  
                  return (
                    <button 
                      key={lesson.id}
                      disabled={isLocked}
                      onClick={() => {
                        setCurrentLesson(lesson);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                      className={`w-full p-5 rounded-sm flex items-start space-x-4 transition-all text-left group relative overflow-hidden ${
                        isActive ? 'bg-yetomart-coral/10 border border-yetomart-coral/30' : 'hover:bg-white/5 border border-transparent'
                      } ${isLocked ? 'opacity-40 grayscale' : ''}`}
                    >
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yetomart-coral shadow-[0_0_10px_rgba(231,111,81,0.8)]"></div>}
                      
                      <div className={`mt-1 flex-shrink-0 w-7 h-7 rounded-sm border flex items-center justify-center transition-all duration-300 ${
                        isActive ? 'bg-yetomart-coral border-yetomart-coral text-white shadow-[0_0_15px_rgba(231,111,81,0.4)]' : 'border-white/10 text-white/30 group-hover:border-white/30 group-hover:text-white'
                      }`}>
                        {isActive ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        ) : (
                          <span className="text-[10px] font-black italic">{lIdx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between">
                           <h4 className={`text-xs font-black truncate uppercase tracking-tight italic transition-colors font-serif ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white'}`}>{lesson.title}</h4>
                           {isLocked && <svg className="w-3 h-3 text-white/20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>}
                         </div>
                         <div className="flex items-center space-x-3 mt-2">
                            <div className="flex items-center text-[9px] font-black text-white/30 uppercase tracking-widest">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              {lesson.duration}
                            </div>
                            <span className="text-[9px] font-black text-white/10">•</span>
                            <span className="text-[9px] font-black text-yetomart-orange/60 uppercase tracking-[0.2em]">Vídeo Aula</span>
                         </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
            
            {(!product.modules || product.modules.length === 0) && (
              <div className="text-center py-20">
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest italic">Nenhuma aula disponível</p>
              </div>
            )}
            {product.quiz && (
              <div className="mt-8 mb-4">
                <div className="px-5 py-4 text-[9px] font-black text-white/30 uppercase tracking-[0.3em] bg-white/5 rounded-sm mb-3 italic">
                  Avaliação Final
                </div>
                <button 
                  onClick={() => {
                    setIsQuizActive(true);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`w-full p-5 rounded-sm flex items-start space-x-4 transition-all text-left group relative overflow-hidden ${
                    isQuizActive ? 'bg-yetomart-teal/10 border border-yetomart-teal/30' : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {isQuizActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yetomart-teal shadow-[0_0_10px_rgba(34,87,122,0.8)]"></div>}
                  
                  <div className={`mt-1 flex-shrink-0 w-7 h-7 rounded-sm border flex items-center justify-center transition-all duration-300 ${
                    isQuizActive ? 'bg-yetomart-teal border-yetomart-teal text-white shadow-[0_0_15px_rgba(34,87,122,0.4)]' : 'border-white/10 text-white/30 group-hover:border-white/30 group-hover:text-white'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center justify-between">
                       <h4 className={`text-xs font-black truncate uppercase tracking-tight italic transition-colors font-serif ${isQuizActive ? 'text-white' : 'text-white/50 group-hover:text-white'}`}>{product.quiz.title}</h4>
                     </div>
                     <div className="flex items-center space-x-3 mt-2">
                        <span className="text-[9px] font-black text-yetomart-orange/60 uppercase tracking-[0.2em]">Quiz de Certificação</span>
                     </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </aside>
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

export default MembersArea;
