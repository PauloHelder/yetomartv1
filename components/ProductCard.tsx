
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Category } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { user, hasAccess } = useAuth();
  const navigate = useNavigate();
  const owned = hasAccess(product.id) || (user && user.id === product.producerId);

  return (
    <div className="bg-white/5 rounded-md overflow-hidden flex flex-col group yetomart-card transition-all duration-300 border border-white/5 hover:border-white/20">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-yetomart-coral px-2 py-0.5 rounded-sm text-[9px] font-black text-white shadow-lg uppercase tracking-tighter font-serif italic">
            {product.category}
          </span>
        </div>
        {!owned && (
          <div className="absolute inset-0 bg-gradient-to-t from-yetomart-coral/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
             <button 
              onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
              className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"
              title="Visualização Rápida"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center space-x-1 mb-2">
          {[1, 2, 3, 4, 5].map(i => (
            <svg key={i} className="w-2.5 h-2.5 text-yetomart-orange fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          ))}
          <span className="text-[9px] font-bold text-slate-500 ml-1">98% Relevante</span>
        </div>
        
        <h3 
          onClick={() => navigate(`/product/${product.id}`)}
          className="text-base font-bold text-white mb-1 leading-tight cursor-pointer hover:text-yetomart-orange transition-colors line-clamp-1 font-serif italic"
        >
          {product.title}
        </h3>
        
        <p className="text-slate-400 text-xs mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
        
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex flex-col">
             {!owned && (
               <span className="text-sm font-black text-white leading-none">Kz {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
             )}
          </div>
          
          <button 
            onClick={() => navigate(owned ? (product.category === Category.COURSE ? `/members/${product.id}` : '/dashboard') : `/product/${product.id}`)}
            className={`px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${
              owned 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 flex-1 text-center' 
                : 'btn-brand'
            }`}
          >
            {owned ? 'Acessar Curso' : 'Mais Info'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
