
import React, { useState } from 'react';
import { Product } from '../types';
import { useSales } from '../hooks/useSales';

interface PurchaseModalProps {
  product: Product;
  onClose: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });
  const [loading, setLoading] = useState(false);
  const { createOrder } = useSales();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Salva venda como pendente
      const ok = await createOrder(product.id, product.price);
      
      if (ok) {
        // 2. Constrói mensagem para o WhatsApp
        const message = `Olá! Tenho interesse no curso *${product.title}*.\n\n*Dados do Aluno:*\nNome: ${formData.name}\nEmail: ${formData.email}\nWhatsApp: ${formData.whatsapp}`;
        const encodedMsg = encodeURIComponent(message);
        
        // 3. Redireciona para o link configurado ou padrão
        const waLink = product.whatsappLink || 'https://wa.me/244923000000'; // Fallback
        const finalUrl = waLink.includes('?') ? `${waLink}&text=${encodedMsg}` : `${waLink}?text=${encodedMsg}`;
        
        window.open(finalUrl, '_blank');
        onClose();
      } else {
        alert("Erro ao processar pedido. Tente novamente.");
      }
    } catch (e) {
      console.error(e);
      alert("Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1a1a1a] w-full max-w-md rounded-sm border border-white/10 shadow-3xl overflow-hidden overflow-y-auto max-h-screen">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic font-serif">Aderir ao Curso</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Preencha seus dados para finalizar via WhatsApp</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nome Completo</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 p-4 rounded-sm border border-white/10 outline-none focus:border-yetomart-teal transition-all text-white text-sm" 
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">E-mail</label>
                <input 
                   required
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 p-4 rounded-sm border border-white/10 outline-none focus:border-yetomart-teal transition-all text-white text-sm" 
                  placeholder="exemplo@email.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">WhatsApp</label>
                <input 
                  required
                  type="tel" 
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full bg-white/5 p-4 rounded-sm border border-white/10 outline-none focus:border-yetomart-teal transition-all text-white text-sm" 
                  placeholder="+244 ..."
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-yetomart-teal text-white py-5 rounded-sm font-black uppercase tracking-widest hover:bg-yetomart-teal/80 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center italic font-serif"
              >
                {loading ? 'Processando...' : (product.ctaText || 'Comprar Agora')}
              </button>
              <p className="text-center text-[9px] text-slate-600 mt-4 uppercase tracking-[0.2em] font-bold">Ao clicar, você será redirecionado para o WhatsApp do instrutor.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
