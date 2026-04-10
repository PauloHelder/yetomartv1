
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';

const Checkout: React.FC = () => {
  const { id } = useParams();
  const { purchaseProduct, saveProduct, user, isLoggedIn, login } = useAuth();
  const { fetchById } = useProducts();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [productLoading, setProductLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchById(id).then(data => {
        setProduct(data);
        setProductLoading(false);
        if (!data) navigate('/');
      });
    }
  }, [id, fetchById, navigate]);

  const handleSaveForLater = () => {
    if (!isLoggedIn) {
      login();
      return;
    }
    if (product) {
      saveProduct(product.id);
      navigate('/dashboard');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      login();
      return;
    }
    setLoading(true);
    
    // Processa compra real no supabase
    if (product) {
      const ok = await purchaseProduct(product.id, product.price);
      setLoading(false);
      if (ok) {
        setSuccess(true);
      } else {
        alert("Erro ao processar compra. Tente novamente.");
      }
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white/5 p-12 rounded-sm shadow-2xl border border-white/10 backdrop-blur-md">
          <div className="bg-yetomart-teal/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-yetomart-teal">
            <svg className="w-12 h-12 text-yetomart-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic font-serif">Assinatura Confirmada!</h2>
          <p className="text-slate-400 mb-10 font-medium text-lg">Seja bem-vindo à Yetomart. Prepare a pipoca, seu acesso já está liberado.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-brand btn-brand-lg btn-brand-full"
          >
            Começar a Assistir
          </button>
        </div>
      </div>
    );
  }

  if (productLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-400">Carregando formulário...</h2>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-[#0f172a] min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 lg:py-24">
        <div className="flex items-center space-x-3 mb-12">
          <Link to={`/product/${product.id}`} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest border-l border-slate-700 pl-3">Finalizar Assinatura</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Formulário Coluna 1 */}
          <div className="lg:col-span-7 space-y-10">
            <div className="bg-white/5 p-10 rounded-sm border border-white/10 shadow-2xl backdrop-blur-md">
              <h3 className="text-2xl font-black text-white mb-10 flex items-center uppercase tracking-tighter italic font-serif">
                <span className="w-10 h-10 rounded-full bg-yetomart-teal text-white flex items-center justify-center text-base mr-4 not-italic font-black">1</span>
                Método de Pagamento
              </h3>
              
              <form onSubmit={handlePayment} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Número do Cartão</label>
                  <div className="relative">
                    <input required type="text" className="w-full p-5 pl-14 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-yetomart-teal transition-all" placeholder="0000 0000 0000 0000" />
                    <svg className="w-6 h-6 text-slate-500 absolute left-5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Vencimento</label>
                    <input required type="text" className="w-full p-5 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-yetomart-teal transition-all" placeholder="MM/AA" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">CVV</label>
                    <input required type="text" className="w-full p-5 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-yetomart-teal transition-all" placeholder="123" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Nome no Cartão</label>
                  <input required type="text" className="w-full p-5 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-yetomart-teal transition-all" placeholder="JOÃO S SILVA" />
                </div>

                <div className="pt-8">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-brand btn-brand-xl btn-brand-full"
                  >
                    {loading ? (
                      <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : `Assinar por Kz ${product.price.toFixed(2)}`}
                  </button>
                  <button 
                    type="button"
                    onClick={handleSaveForLater}
                    className="btn-ghost btn-ghost-full mt-4"
                  >
                    Adicionar e pagar depois
                  </button>
                  <p className="text-center text-[9px] text-slate-500 mt-6 uppercase font-black tracking-[0.2em]">🔒 Transação Segura com Criptografia de Ponta</p>
                </div>
              </form>
            </div>
          </div>

          {/* Resumo Coluna 2 */}
          <div className="lg:col-span-5">
            <div className="bg-white/5 p-10 rounded-sm border border-white/10 shadow-2xl sticky top-24 backdrop-blur-md">
              <h3 className="text-lg font-black text-white mb-8 uppercase tracking-widest border-l-4 border-yetomart-teal pl-4 font-serif italic">Resumo da Assinatura</h3>
              
              <div className="flex items-center space-x-6 mb-10">
                <img src={product.imageUrl} className="w-24 h-16 rounded-sm object-cover shadow-xl border border-white/10" alt="" />
                <div className="flex-1">
                  <h4 className="font-black text-white text-base uppercase tracking-tighter italic line-clamp-1 font-serif">{product.title}</h4>
                  <span className="text-[10px] font-black text-yetomart-orange uppercase tracking-widest">{product.category}</span>
                </div>
                <span className="font-black text-white text-lg tracking-tighter">Kz {product.price.toFixed(2)}</span>
              </div>

              <div className="space-y-4 border-t border-white/5 pt-8 mb-10">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-500 uppercase tracking-widest">Subtotal</span>
                  <span className="text-white">Kz {product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-500 uppercase tracking-widest">Taxas</span>
                  <span className="text-green-500">Kz 0,00</span>
                </div>
                <div className="flex justify-between text-2xl font-black pt-6 border-t border-white/10">
                  <span className="text-white uppercase tracking-tighter italic font-serif">Total</span>
                  <span className="text-yetomart-orange tracking-tighter">Kz {product.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-sm space-y-4 border border-white/5">
                 <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <svg className="w-5 h-5 mr-3 text-yetomart-teal" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                   Acesso Imediato em 4K
                 </div>
                 <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <svg className="w-5 h-5 mr-3 text-yetomart-teal" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                   Garantia Incondicional
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
