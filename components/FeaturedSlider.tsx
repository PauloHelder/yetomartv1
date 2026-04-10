
import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

const FeaturedSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const navigate = useNavigate();
  const { fetchPublished } = useProducts();
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    fetchPublished().then(data => setFeatured(data.slice(0, 3)));
  }, [fetchPublished]);

  const go = (idx: number, dir: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    setCurrent(idx);
  };

  const next = () => go((current + 1) % featured.length, 'next');
  const prev = () => go((current - 1 + featured.length) % featured.length, 'prev');

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 700);
    return () => clearTimeout(timer);
  }, [current]);

  useEffect(() => {
    const interval = setInterval(next, 7000);
    return () => clearInterval(interval);
  }, [current]);

  if (featured.length === 0) return null;

  const item = featured[current];

  return (
    <div className="relative w-full overflow-hidden bg-[#080f1f]" style={{ minHeight: '580px' }}>

      {/* ── Background glow blobs ── */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
        style={{ opacity: 0.55 }}
      >
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, #e76f51 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, #f4a261 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Slide content ── */}
      {featured.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 flex items-center"
          style={{
            opacity: index === current ? 1 : 0,
            transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: index === current ? 'auto' : 'none',
          }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-14 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

            {/* ── LEFT: Text ── */}
            <div
              style={{
                transform: index === current ? 'translateY(0)' : 'translateY(24px)',
                opacity: index === current ? 1 : 0,
                transition: 'transform 700ms cubic-bezier(0.34, 1.36, 0.64, 1) 120ms, opacity 600ms ease 120ms',
              }}
            >
              {/* Badge row */}
              <div className="flex items-center space-x-3 mb-5">
                <span
                  className="text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-sm"
                  style={{ background: 'rgba(231,111,81,0.18)', color: '#e76f51', border: '1px solid rgba(231,111,81,0.3)' }}
                >
                  Original Yetomart
                </span>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest font-serif italic">
                  {slide.category}
                </span>
              </div>

              {/* Course title — the star of the show */}
              <h2
                className="font-black text-white uppercase italic font-serif leading-[0.88] tracking-tighter mb-6"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}
              >
                {slide.title}
              </h2>

              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8 max-w-md font-medium">
                {slide.description} Domine as estratégias que os 1% usam e transforme sua realidade hoje mesmo.
              </p>

              {/* Stats row */}
              <div className="flex items-center space-x-6 mb-10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">Aulas</span>
                  <span className="text-xl font-black text-white">{slide.contentCount}</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">Preço</span>
                  <span className="text-xl font-black text-white">Kz {slide.price.toFixed(0)}</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex items-center space-x-1">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-4 h-4" fill="#f4a261" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate(`/product/${slide.id}`)}
                  className="btn-brand btn-brand-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  Assistir Agora
                </button>
                <button
                  onClick={() => navigate(`/product/${slide.id}`)}
                  className="btn-ghost flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Mais Detalhes
                </button>
              </div>
            </div>

            {/* ── RIGHT: Course image card ── */}
            <div
              className="hidden md:flex justify-center items-center"
              style={{
                transform: index === current ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.96)',
                opacity: index === current ? 1 : 0,
                transition: 'transform 800ms cubic-bezier(0.34, 1.3, 0.64, 1) 200ms, opacity 700ms ease 200ms',
              }}
            >
              <div className="relative">
                {/* Glow behind image */}
                <div
                  className="absolute inset-0 rounded-xl blur-2xl scale-90 translate-y-4"
                  style={{ background: 'linear-gradient(135deg, rgba(231,111,81,0.5), rgba(244,162,97,0.3))' }}
                />
                {/* Image */}
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="relative z-10 w-full max-w-[420px] rounded-xl object-cover shadow-2xl"
                  style={{
                    aspectRatio: '16/10',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 30px 80px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(231,111,81,0.2)',
                  }}
                />
                {/* Category pill on image */}
                <div
                  className="absolute top-4 left-4 z-20 px-3 py-1 rounded-sm font-black text-[10px] uppercase tracking-widest text-white font-serif italic"
                  style={{ background: 'rgba(231,111,81,0.9)', backdropFilter: 'blur(8px)' }}
                >
                  {slide.category}
                </div>
                {/* Price badge */}
                <div
                  className="absolute -bottom-4 -right-4 z-20 rounded-sm px-4 py-2 shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #e76f51, #f4a261)',
                    boxShadow: '0 8px 24px -4px rgba(231,111,81,0.6)',
                  }}
                >
                  <span className="text-white font-black text-lg tracking-tighter">Kz {slide.price.toFixed(0)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      ))}

      {/* ── Bottom gradient fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0f172a] to-transparent z-20 pointer-events-none" />

      {/* ── Controls bar ── */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-14">
        {/* Dot indicators */}
        <div className="flex items-center space-x-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > current ? 'next' : 'prev')}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: i === current ? '2.5rem' : '1rem',
                background: i === current ? '#f4a261' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>

        {/* Prev / Next arrows */}
        <div className="flex items-center space-x-2">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
};

export default FeaturedSlider;
