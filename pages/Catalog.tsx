
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FeaturedSlider from '../components/FeaturedSlider';
import Offcanvas from '../components/Offcanvas';
import { useProducts } from '../hooks/useProducts';
import { Product, Category } from '../types';

const Catalog: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<Category | 'Todos'>('Todos');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || '';

  const { fetchPublished } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublished().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, [fetchPublished]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = filter === 'Todos' || p.category === filter;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, filter, searchQuery]);

  return (
    <div className="w-full pb-20">
      {/* Hero Section - 100% Width */}
      {!searchQuery && (
        <section className="w-full">
          <FeaturedSlider />
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            {searchQuery ? (
              <h2 className="text-2xl font-bold text-white mb-2 font-serif italic">
                Resultados para "<span className="text-yetomart-orange">{searchQuery}</span>"
              </h2>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-1 font-serif italic">Populares na Yetomart</h2>
                <p className="text-slate-400 text-sm">Os conteúdos mais assistidos da semana.</p>
              </>
            )}
          </div>
          
          <div className="flex overflow-x-auto pb-2 md:pb-0 space-x-3 custom-scrollbar">
            {['Todos', Category.COURSE, Category.EBOOK, Category.SUBSCRIPTION].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={`px-5 py-1.5 rounded-sm text-xs font-black uppercase tracking-tighter transition-all ${
                  filter === cat 
                    ? 'bg-yetomart-coral text-white' 
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {filtered.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <h3 className="text-lg font-bold text-white">Nenhum título encontrado</h3>
             <p className="text-slate-500 text-sm mt-2">Tente buscar por outros termos ou categorias.</p>
             <button 
                onClick={() => window.location.href = '/'}
                className="mt-6 text-yetomart-orange font-bold hover:underline text-sm"
              >
               Voltar ao início
             </button>
          </div>
        )}
      </section>

      {!searchQuery && (
        <section className="relative w-full overflow-hidden rounded-lg mx-0 mt-4" style={{ height: '420px' }}>
          {/* Hero Image */}
          <img
            src="/hero_banner.png"
            alt="Yetomart — Tecnologias em Potencial"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Multi-directional overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-[#0f172a]/30" />
          {/* Subtle coral glow accent */}
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-yetomart-coral/20 rounded-full blur-[100px] -mb-40 -ml-20" />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center px-10 md:px-16">
            <div className="max-w-xl">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-yetomart-orange mb-4 border-l-2 border-yetomart-orange pl-3">
                A maior plataforma de Angola
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-5 leading-[0.92] tracking-tighter uppercase italic font-serif">
                Aprenda com quem<br />realmente faz
              </h2>
              <p className="text-slate-300 mb-8 text-base leading-relaxed max-w-md font-medium">
                Acesso ilimitado a cursos, ebooks e mentorias com os melhores profissionais de Angola e do mundo.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="btn-brand btn-brand-lg">Cadastrar</button>
                <button className="btn-ghost">Explorar Cursos</button>
              </div>
            </div>
          </div>
        </section>
      )}

      <Offcanvas product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      </div>
    </div>
  );
};

export default Catalog;
