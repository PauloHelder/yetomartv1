
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { Category } from '../types';

import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import PurchaseModal from '../components/PurchaseModal';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasAccess, saveProduct, isLoggedIn } = useAuth();
  const { fetchById } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchById(id).then(data => {
        setProduct(data);
        setLoading(false);
      });
    }
  }, [id, fetchById]);

  const hasCompleted = product ? (hasAccess(product.id) || (user && user.id === product.producerId)) : false;
  const hasPending = product ? (user?.pendingIds?.includes(product.id) ?? false) : false;
  const owned = hasCompleted;
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (product) {
      saveProduct(product.id);
      setIsFavorited(true);
      setTimeout(() => {
        setIsFavorited(false);
        navigate('/dashboard');
      }, 1000);
    }
  };

  if (loading) return (
    <div className="py-20 text-center">
      <h2 className="text-2xl font-bold text-slate-400">Carregando produto...</h2>
    </div>
  );

  if (!product) return (
    <div className="py-20 text-center">
      <h2 className="text-2xl font-bold">Produto não encontrado.</h2>
      <button onClick={() => navigate('/')} className="mt-4 text-yetomart-orange font-bold underline">Voltar ao catálogo</button>
    </div>
  );

  // Calcula todas as lessons de todos os módulos
  const allLessons = product.modules?.flatMap(m => m.lessons) || [];


  return (
    <div className="pb-20 bg-[#0f172a] text-white min-h-screen">
      {/* Header Banner */}
      {/* Header Banner com Fundo Panorâmico e Imagem à Direita */}
      <div className="relative min-h-[75vh] w-full flex items-center pt-24 pb-16 overflow-hidden">
        {/* Background Panorâmico */}
        <div className="absolute inset-0 z-0">
          <img 
            src={product.imageUrl} 
            className="w-full h-full object-cover opacity-30 shadow-inner" 
            alt="" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/20 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Lado Esquerdo: Conteúdo */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
               <span className="text-yetomart-coral font-black uppercase tracking-[0.3em] text-[10px] border-l-4 border-yetomart-coral pl-3 py-1">Yetomart Original</span>
               <span className="text-slate-600 font-bold">•</span>
               <span className="text-yetomart-orange text-[10px] uppercase font-black tracking-widest">{product.category}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tighter uppercase italic font-serif">
              {product.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl font-medium">
              {product.description} Descubra o método definitivo testado pela Yetomart para dominar este mercado em tempo recorde.
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-12">
              <div className="flex items-center space-x-3">
                <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-widest border border-green-500/20">98% Relevante</span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">2024</span>
                <span className="text-slate-500 text-xs font-bold border border-white/10 px-2 rounded-sm uppercase">4K HD</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              {hasCompleted ? (
                <button 
                  onClick={() => navigate(`/members/${product.id}`)}
                  className="bg-white text-black px-12 py-5 rounded-sm font-black uppercase tracking-widest text-xs hover:bg-yetomart-coral hover:text-white transition-all transform hover:scale-105 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center group"
                >
                  <svg className="w-5 h-5 mr-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  {product.category === 'Ebook' ? 'Aceder ao E-book' : 'Aceder ao Curso'}
                </button>
              ) : hasPending ? (
                <div className="flex items-center space-x-4 px-8 py-4 bg-yellow-500/10 border border-yellow-500/30 rounded-sm">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-yellow-400 font-black text-xs uppercase tracking-widest">Aguardando Liberação do Produtor</span>
                </div>
              ) : (
                <button 
                  onClick={() => setShowPurchaseModal(true)}
                  className="bg-white text-black px-12 py-5 rounded-sm font-black uppercase tracking-widest text-xs hover:bg-yetomart-coral hover:text-white transition-all transform hover:scale-105 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center group"
                >
                  <svg className="w-5 h-5 mr-3 fill-current transition-transform group-hover:scale-125" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  {product.ctaText || 'Adquirir Agora'}
                </button>
              )}
              
              {!owned && (
                <button 
                  onClick={handleFavorite}
                  className={`px-8 py-5 rounded-sm font-black uppercase tracking-widest text-[10px] transition-all border-2 flex items-center gap-3 ${
                    isFavorited 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : 'bg-transparent border-white/10 text-white hover:border-white hover:bg-white/5'
                  }`}
                >
                  <svg className={`w-4 h-4 ${isFavorited ? 'fill-current' : 'fill-none'} stroke-current`} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  {isFavorited ? 'Na Lista' : 'Favoritar'}
                </button>
              )}
            </div>
          </div>

          {/* Lado Direito: Imagem de Capa em Destaque */}
          <div className="w-full max-w-[500px] lg:flex-1 flex justify-center lg:justify-end animate-fadeInRight">
             <div className="relative group">
                {/* Efeito Glow atrás da imagem */}
                <div className="absolute -inset-1 bg-gradient-to-r from-yetomart-coral to-yetomart-orange rounded-[10px] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                
                {/* Content Card com Bordas 10px Arredondadas */}
                <div className="relative aspect-[3/4] w-64 md:w-80 lg:w-[410px] bg-slate-900 rounded-[10px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/10 transform transition-all duration-700 hover:scale-[1.03]">
                   <img 
                      src={product.imageUrl} 
                      className="w-full h-full object-cover" 
                      alt={product.title} 
                   />
                </div>
                
                {/* Badge Flutuante Arredondado */}
                {!owned && (
                  <div className="absolute -bottom-6 -left-6 bg-[#0f172a] p-5 rounded-[10px] border border-white/10 shadow-3xl hidden md:block">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Valor Unitário</p>
                     <p className="text-2xl font-black text-yetomart-orange italic">Kz {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Main Details Section */}
      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <section className="mb-16">
            <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter border-b border-yetomart-coral inline-block pb-1 font-serif italic">O que você vai aprender</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-8 rounded-sm border border-white/10 backdrop-blur-sm">
              {(product.learningOutcomes && product.learningOutcomes.length > 0) ? product.learningOutcomes.map((outcome, i) => (
                <div key={i} className="flex items-start space-x-4 text-slate-300">
                  <svg className="w-5 h-5 text-yetomart-coral flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  <span className="text-base font-medium">{outcome}</span>
                </div>
              )) : (
                <div className="col-span-2 text-slate-500 text-sm font-medium italic">Nenhum detalhe especificado.</div>
              )}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter border-b border-yetomart-coral inline-block pb-1 font-serif italic">Episódios</h2>
            <div className="border border-white/10 rounded-sm overflow-hidden bg-white/5">
              <div className="bg-white/10 p-5 border-b border-white/10 flex justify-between items-center">
                 <span className="font-black text-white uppercase tracking-tighter font-serif italic">Grade de Aulas</span>
                 <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{allLessons.length} aulas</span>
              </div>
              <div className="divide-y divide-white/5">
                {allLessons.map((lesson, idx) => (
                  <div key={lesson.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-all cursor-pointer">
                    <div className="flex items-center space-x-6">
                       <div className="text-2xl font-black text-slate-600 group-hover:text-white transition-colors">
                         {idx + 1}
                       </div>
                       <div className="flex flex-col">
                         <span className="text-base font-bold text-white group-hover:text-yetomart-coral transition-colors font-serif italic">{lesson.title}</span>
                         <span className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">{lesson.duration}</span>
                       </div>
                    </div>
                    <div className="flex items-center">
                       {lesson.locked && !owned ? (
                          <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                       ) : (
                          <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-yetomart-coral group-hover:bg-yetomart-coral transition-all">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter border-b border-yetomart-coral inline-block pb-1 font-serif italic">Elenco & Instrutor</h2>
            <div className="flex items-start space-x-8 bg-white/5 p-8 rounded-sm border border-white/10">
               <div className="w-32 h-32 bg-slate-800 rounded-sm flex-shrink-0 border-2 border-white/10 shadow-2xl overflow-hidden">
                 <img src={product.instructor?.avatarUrl || "https://i.pravatar.cc/150?u=instructor"} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
               </div>
               <div>
                 <h4 className="text-2xl font-black mb-1 uppercase tracking-tighter italic font-serif">{product.instructor?.name || 'Instrutor Yetomart'}</h4>
                 <p className="text-yetomart-orange text-sm font-black mb-4 uppercase tracking-widest">Showrunner & Especialista</p>
                 <p className="text-slate-400 text-base leading-relaxed font-medium">
                   {product.instructor?.bio || "Este instrutor ainda não adicionou uma biografia. No entanto, é um especialista certificado pela Yetomart garantindo a melhor experiência de aprendizado."}
                 </p>
               </div>
            </div>
          </section>
        </div>

        <div className="hidden lg:block">
          <div className="bg-white/5 rounded-sm shadow-2xl p-8 text-white sticky top-24 border border-white/10 backdrop-blur-md">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tighter italic border-l-4 border-yetomart-coral pl-3 font-serif">Detalhes da Assinatura</h3>
            {!owned && (
              <div className="flex items-end space-x-2 mb-8">
                 <span className="text-4xl font-black">Kz {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                 <span className="text-slate-500 text-sm line-through mb-1 font-bold">Kz {(product.price * 1.5).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            )}
            <button 
              onClick={() => owned ? navigate(`/members/${product.id}`) : setShowPurchaseModal(true)}
              className="btn-brand btn-brand-lg btn-brand-full mb-4"
            >
              {owned ? 'Acessar Agora' : (product.ctaText || 'Comprar Agora')}
            </button>
            {!owned && (
              <button 
                onClick={handleFavorite}
                className={`w-full py-4 rounded-sm font-black uppercase tracking-widest text-[10px] transition-all border border-white/10 mb-6 ${
                  isFavorited 
                    ? 'bg-green-600 text-white border-green-600' 
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {isFavorited ? '✓ Adicionado' : 'Adicionar e pagar depois'}
              </button>
            )}
            <p className="text-center text-xs text-slate-500 font-bold uppercase tracking-widest">Cancelamento fácil a qualquer momento</p>
            
            <div className="mt-10 space-y-6">
               <h4 className="font-black text-sm uppercase tracking-widest text-slate-400">O que está incluído:</h4>
               <div className="flex items-center text-sm text-slate-300 font-bold">
                 <svg className="w-5 h-5 mr-4 text-yetomart-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                 <span className="uppercase tracking-tighter">{product.contentCount} Episódios em 4K Ultra HD</span>
               </div>
               <div className="flex items-center text-sm text-slate-300 font-bold">
                 <svg className="w-5 h-5 mr-4 text-yetomart-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 <span className="uppercase tracking-tighter">Roteiros & Materiais</span>
               </div>
               <div className="flex items-center text-sm text-slate-300 font-bold">
                 <svg className="w-5 h-5 mr-4 text-yetomart-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04" /></svg>
                 <span className="uppercase tracking-tighter">Certificado Original</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#0f172a] border-t border-white/10 p-5 flex items-center justify-between z-30 shadow-2xl">
        {!owned ? (
          <div>
            <span className="block text-[10px] text-slate-500 font-black uppercase tracking-widest">Assinatura</span>
            <span className="text-2xl font-black text-white leading-none tracking-tighter">Kz {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        ) : (
          <div>
            <span className="block text-[10px] text-emerald-500 font-black uppercase tracking-widest">Inscrito</span>
            <span className="text-xl font-black text-white leading-none tracking-tighter">Bem-vindo</span>
          </div>
        )}
        <div className="flex items-center space-x-3">
          {!owned && (
            <button 
              onClick={handleFavorite}
              className={`p-4 rounded-sm border border-white/10 transition-all ${
                isFavorited ? 'bg-green-600 border-green-600 text-white' : 'bg-white/5 text-slate-400'
              }`}
            >
              <svg className={`w-6 h-6 ${isFavorited ? 'fill-current' : 'fill-none'} stroke-current`} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
          )}
          <button 
            onClick={() => owned ? navigate(`/members/${product.id}`) : setShowPurchaseModal(true)}
            className={`px-8 py-4 rounded-sm text-xs font-black uppercase tracking-widest transition-all ${
              owned ? 'bg-emerald-500 text-white' : 'btn-brand'
            }`}
          >
            {owned ? 'Acessar' : (product.ctaText || 'Assinar')}
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}} />
       {showPurchaseModal && product && (
        <PurchaseModal 
          product={product} 
          onClose={() => setShowPurchaseModal(false)} 
        />
      )}
    </div>
  );
};

export default ProductDetails;
