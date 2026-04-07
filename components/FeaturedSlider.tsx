
import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { useNavigate } from 'react-router-dom';

const FeaturedSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const featured = MOCK_PRODUCTS.slice(0, 3);

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((current + 1) % featured.length);
  };

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((current - 1 + featured.length) % featured.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 800);
    return () => clearTimeout(timer);
  }, [current]);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(next, 8000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="relative w-full h-[500px] md:h-[700px] bg-black overflow-hidden group shadow-2xl">
      {featured.map((item, index) => (
        <div 
          key={item.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center ${
            index === current ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Main Image Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src={item.imageUrl} 
              className={`w-full h-full object-cover scale-105 transition-transform duration-[10s] ease-linear ${index === current ? 'scale-100' : 'scale-105'}`} 
              alt="" 
            />
            {/* Netflix-style gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16">
            {/* Content */}
            <div className={`transition-all duration-700 delay-300 max-w-2xl ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center bg-yetomart-teal px-2 py-1 rounded-sm shadow-lg">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest font-serif italic">Original Yetomart</span>
                </div>
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest font-serif italic">Série de Sucesso</span>
              </div>

              <h2 className="text-5xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tighter uppercase italic font-serif">
                {item.title}
              </h2>
              
              <p className="text-slate-200 text-base md:text-lg mb-10 line-clamp-3 max-w-xl leading-relaxed font-medium drop-shadow-lg">
                {item.description} Domine as estratégias que os 1% usam para obter resultados fora da curva e transforme sua realidade hoje mesmo.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="bg-yetomart-teal text-white px-10 py-3 rounded-sm font-black text-lg hover:bg-yetomart-teal/90 transition-all flex items-center space-x-2 shadow-xl"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  <span>Assistir Agora</span>
                </button>
                <button 
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="bg-white/10 backdrop-blur-md text-white px-10 py-3 rounded-sm font-black text-lg hover:bg-white/20 transition-all flex items-center space-x-2 border border-white/10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Mais Informações</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Modern Controls */}
      <div className="absolute bottom-10 right-8 md:right-16 z-20 flex items-center space-x-4">
        <div className="flex space-x-2">
          {featured.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-500 ${i === current ? 'w-10 bg-yetomart-orange' : 'w-4 bg-white/20 hover:bg-white/40'}`}
            ></button>
          ))}
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 h-32 bg-gradient-to-t from-[#0f172a] to-transparent z-10"></div>
    </div>
  );
};

export default FeaturedSlider;
