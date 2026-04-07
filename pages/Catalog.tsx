
import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';
import { Category, Product } from '../types';
import ProductCard from '../components/ProductCard';
import FeaturedSlider from '../components/FeaturedSlider';
import Offcanvas from '../components/Offcanvas';

const Catalog: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<Category | 'Todos'>('Todos');
  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search).get('q') || '';

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesCategory = filter === 'Todos' || p.category === filter;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [filter, searchQuery]);

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
                    ? 'bg-yetomart-teal text-white' 
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
                onClick={() => window.location.href = '#/'}
                className="mt-6 text-yetomart-orange font-bold hover:underline text-sm"
              >
               Voltar ao início
             </button>
          </div>
        )}
      </section>

      {!searchQuery && (
        <section className="bg-gradient-to-r from-yetomart-teal/40 to-black rounded-lg p-12 text-left text-white relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yetomart-orange rounded-full blur-[120px] opacity-10 -mr-48 -mt-48"></div>
          <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter font-serif italic">Assine o plano ilimitado</h2>
              <p className="text-slate-300 mb-8 text-base">Tenha acesso a todos os cursos, ebooks e mentorias por um valor único mensal. Cancele quando quiser.</p>
              <button className="bg-yetomart-teal text-white px-8 py-3 rounded-sm font-black uppercase tracking-tighter hover:bg-yetomart-teal/80 transition-all shadow-xl">
                Assinar Agora
              </button>
          </div>
        </section>
      )}

      <Offcanvas product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      </div>
    </div>
  );
};

export default Catalog;
