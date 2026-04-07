
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS, MOCK_LESSONS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { Category } from '../types';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasAccess, saveProduct, isLoggedIn, login } = useAuth();
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  const owned = product ? hasAccess(product.id) : false;
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = () => {
    if (!isLoggedIn) {
      login();
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

  if (!product) return (
    <div className="py-20 text-center">
      <h2 className="text-2xl font-bold">Produto não encontrado.</h2>
      <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 font-bold underline">Voltar ao catálogo</button>
    </div>
  );

  return (
    <div className="pb-20 bg-[#0f172a] text-white min-h-screen">
      {/* Header Banner */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <img 
          src={product.imageUrl} 
          className="w-full h-full object-cover opacity-40" 
          alt={product.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
             <span className="text-yetomart-teal font-black uppercase tracking-widest text-xs border-l-4 border-yetomart-teal pl-2">Yetomart Original</span>
             <span className="text-slate-400">•</span>
             <span className="text-slate-400 text-xs uppercase font-bold tracking-tighter">{product.category}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter uppercase italic font-serif">{product.title}</h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl font-medium">
            {product.description} Este conteúdo exclusivo foi desenhado para te levar do absoluto zero ao nível de maestria em tempo recorde na Yetomart.
          </p>
          
          <div className="flex flex-wrap items-center gap-6 mb-10">
            <div className="flex items-center space-x-2">
              <span className="text-green-500 font-black text-lg">98% relevante</span>
              <span className="text-slate-400 text-sm font-bold border border-slate-700 px-2 rounded-sm">2024</span>
              <span className="text-slate-400 text-sm font-bold border border-slate-700 px-2 rounded-sm">HD</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <svg className="w-5 h-5 text-yetomart-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-sm font-bold uppercase tracking-tighter">Acesso Vitalício</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => owned ? navigate(`/members/${product.id}`) : navigate(`/checkout/${product.id}`)}
              className="flex items-center space-x-2 bg-white text-black px-10 py-4 rounded-sm font-black uppercase tracking-tighter hover:bg-white/90 transition-all transform hover:scale-105"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <span>{owned ? 'Assistir Agora' : 'Comprar Agora'}</span>
            </button>
            {!owned && (
              <button 
                onClick={handleFavorite}
                className={`flex items-center space-x-2 px-8 py-4 rounded-sm font-black uppercase tracking-tighter transition-all border-2 ${
                  isFavorited 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : 'bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white'
                }`}
              >
                <svg className={`w-5 h-5 ${isFavorited ? 'fill-current' : 'fill-none'} stroke-current`} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <span>{isFavorited ? 'Adicionado à Lista' : 'Adicionar e pagar depois'}</span>
              </button>
            )}
            {!owned && (
              <div className="flex flex-col justify-center">
                <span className="text-2xl font-black text-white leading-none">Kz {product.price.toFixed(2)}</span>
                <span className="text-slate-500 text-xs line-through">Kz {(product.price * 1.5).toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Details Section */}
      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <section className="mb-16">
            <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter border-b border-yetomart-teal inline-block pb-1 font-serif italic">O que você vai aprender</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-8 rounded-sm border border-white/10 backdrop-blur-sm">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex items-start space-x-4 text-slate-300">
                  <svg className="w-5 h-5 text-yetomart-teal flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  <span className="text-base font-medium">Desenvolver habilidades avançadas em {product.title} do zero absoluto.</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter border-b border-yetomart-teal inline-block pb-1 font-serif italic">Episódios</h2>
            <div className="border border-white/10 rounded-sm overflow-hidden bg-white/5">
              <div className="bg-white/10 p-5 border-b border-white/10 flex justify-between items-center">
                 <span className="font-black text-white uppercase tracking-tighter font-serif italic">Temporada 1: Primeiros Passos</span>
                 <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{MOCK_LESSONS.length} aulas</span>
              </div>
              <div className="divide-y divide-white/5">
                {MOCK_LESSONS.map((lesson, idx) => (
                  <div key={lesson.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-all cursor-pointer">
                    <div className="flex items-center space-x-6">
                       <div className="text-2xl font-black text-slate-600 group-hover:text-white transition-colors">
                         {idx + 1}
                       </div>
                       <div className="flex flex-col">
                         <span className="text-base font-bold text-white group-hover:text-yetomart-teal transition-colors font-serif italic">{lesson.title}</span>
                         <span className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">{lesson.duration}</span>
                       </div>
                    </div>
                    <div className="flex items-center">
                       {lesson.locked && !owned ? (
                          <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                       ) : (
                          <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-yetomart-teal group-hover:bg-yetomart-teal transition-all">
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
            <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter border-b border-yetomart-teal inline-block pb-1 font-serif italic">Elenco & Instrutor</h2>
            <div className="flex items-start space-x-8 bg-white/5 p-8 rounded-sm border border-white/10">
               <div className="w-32 h-32 bg-slate-800 rounded-sm flex-shrink-0 border-2 border-white/10 shadow-2xl overflow-hidden">
                 <img src="https://i.pravatar.cc/150?u=instructor" alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
               </div>
               <div>
                 <h4 className="text-2xl font-black mb-1 uppercase tracking-tighter italic font-serif">Dr. Alex Thompson</h4>
                 <p className="text-yetomart-orange text-sm font-black mb-4 uppercase tracking-widest">Showrunner & Especialista</p>
                 <p className="text-slate-400 text-base leading-relaxed font-medium">
                   Alex possui mais de 15 anos de experiência no mercado global, tendo passado por grandes Big Techs. 
                   Sua metodologia foca em resultados práticos e simplificação de conceitos complexos, transformando aprendizado em entretenimento na Yetomart.
                 </p>
               </div>
            </div>
          </section>
        </div>

        <div className="hidden lg:block">
          <div className="bg-white/5 rounded-sm shadow-2xl p-8 text-white sticky top-24 border border-white/10 backdrop-blur-md">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tighter italic border-l-4 border-yetomart-teal pl-3 font-serif">Detalhes da Assinatura</h3>
            <div className="flex items-end space-x-2 mb-8">
               <span className="text-4xl font-black">Kz {product.price.toFixed(2)}</span>
               <span className="text-slate-500 text-sm line-through mb-1 font-bold">Kz {(product.price * 1.5).toFixed(2)}</span>
            </div>
            <button 
              onClick={() => owned ? navigate(`/members/${product.id}`) : navigate(`/checkout/${product.id}`)}
              className="w-full bg-yetomart-teal text-white py-5 rounded-sm font-black uppercase tracking-tighter hover:bg-yetomart-teal/80 transition-all shadow-xl mb-4 transform hover:scale-[1.02]"
            >
              {owned ? 'Continuar Assistindo' : 'Assinar Agora'}
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
                 <svg className="w-5 h-5 mr-4 text-yetomart-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                 <span className="uppercase tracking-tighter">{product.contentCount} Episódios em 4K Ultra HD</span>
               </div>
               <div className="flex items-center text-sm text-slate-300 font-bold">
                 <svg className="w-5 h-5 mr-4 text-yetomart-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 <span className="uppercase tracking-tighter">Roteiros & Materiais</span>
               </div>
               <div className="flex items-center text-sm text-slate-300 font-bold">
                 <svg className="w-5 h-5 mr-4 text-yetomart-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04rem" /></svg>
                 <span className="uppercase tracking-tighter">Certificado Original</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#0f172a] border-t border-white/10 p-5 flex items-center justify-between z-30 shadow-2xl">
        <div>
          <span className="block text-[10px] text-slate-500 font-black uppercase tracking-widest">Assinatura</span>
          <span className="text-2xl font-black text-white leading-none tracking-tighter">Kz {product.price.toFixed(2)}</span>
        </div>
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
            onClick={() => owned ? navigate(`/members/${product.id}`) : navigate(`/checkout/${product.id}`)}
            className="bg-yetomart-teal text-white px-8 py-4 rounded-sm font-black text-sm uppercase tracking-tighter"
          >
            {owned ? 'Assistir' : 'Assinar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
