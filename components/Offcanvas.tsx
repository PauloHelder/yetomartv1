
import React, { useState } from 'react';
import { Product, Category } from '../types';
import { useNavigate } from 'react-router-dom';
import PurchaseModal from './PurchaseModal';

interface OffcanvasProps {
  product: Product | null;
  onClose: () => void;
}

const Offcanvas: React.FC<OffcanvasProps> = ({ product, onClose }) => {
  const navigate = useNavigate();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  if (!product) return null;

  return (
    <>
      {showPurchaseModal && (
        <PurchaseModal product={product} onClose={() => setShowPurchaseModal(false)} />
      )}
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-opacity" onClick={onClose}></div>
      
      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0f172a] z-[60] shadow-[0_0_50px_rgba(0,0,0,0.9)] transform transition-transform duration-500 ease-in-out p-8 flex flex-col border-l border-white/10 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-8">
          <span className="text-xs font-black text-yetomart-orange uppercase tracking-[0.3em] italic font-serif">{product.category}</span>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
          <div className="relative group mb-8">
            <img src={product.imageUrl} className="w-full h-56 object-cover rounded-sm shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60"></div>
          </div>
          
          <h3 className="text-4xl font-black text-white mb-4 leading-tight tracking-tighter uppercase italic font-serif">{product.title}</h3>
          <p className="text-white/70 mb-8 leading-relaxed text-lg font-medium">{product.description}</p>
          
          <div className="space-y-6 mb-12">
            <h4 className="font-black text-xs text-yetomart-teal uppercase tracking-widest border-b border-white/10 pb-3">Destaques do Conteúdo</h4>
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start space-x-4 text-white/80 group/item">
                <div className="mt-1 w-5 h-5 rounded-full bg-yetomart-teal/20 flex items-center justify-center group-hover/item:bg-yetomart-teal transition-colors duration-300">
                  <svg className="w-3 h-3 text-yetomart-teal group-hover/item:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-bold tracking-wide">Competência estratégica número {i} para dominar este assunto com maestria.</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 bg-gradient-to-t from-black/40 to-transparent">
          <div className="flex items-end justify-between mb-8">
            <div className="flex flex-col">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Investimento Único</span>
              <span className="text-4xl font-black text-white italic tracking-tighter font-serif">Kz {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="text-yetomart-orange text-xs font-black uppercase tracking-tighter">Acesso Vitalício</div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => setShowPurchaseModal(true)}
              className="w-full bg-yetomart-teal text-white py-5 rounded-sm font-black uppercase tracking-[0.2em] hover:bg-yetomart-teal/80 transition-all duration-300 shadow-xl active:scale-95"
            >
              Começar Agora
            </button>
            <button 
              onClick={() => navigate(`/product/${product.id}`)}
              className="w-full border border-white/20 text-white py-4 rounded-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 text-xs"
            >
              Detalhes Completos
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Offcanvas;
