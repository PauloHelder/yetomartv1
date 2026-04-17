
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useSales } from '../hooks/useSales';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface PurchaseModalProps {
  product: Product;
  onClose: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ product, onClose }) => {
  const { user, isLoggedIn, register, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [whatsapp, setWhatsapp] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { createOrder } = useSales();
  const [emailExists, setEmailExists] = useState<boolean | null>(null);

  // Check email exists only for guest users
  useEffect(() => {
    if (isLoggedIn) return;
    const timer = setTimeout(async () => {
      if (formData.email && formData.email.includes('@')) {
        const { data } = await supabase
          .from('profiles').select('id')
          .eq('email', formData.email.trim().toLowerCase())
          .maybeSingle();
        setEmailExists(!!data);
      } else {
        setEmailExists(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.email, isLoggedIn]);

  const buildWhatsAppMessage = (name: string, email: string, wa: string) => {
    const productType = product.category === 'Ebook' ? 'e-book' : 'curso';
    return `Olá! Acabei de solicitar acesso ao ${productType} *${product.title}*.\n\n*Dados do Aluno:*\nNome: ${name}\nEmail: ${email}\nWhatsApp: ${wa}\n\nAguardo a liberação do acesso. Obrigado!`;
  };

  const openWhatsApp = (name: string, email: string, wa: string) => {
    const msg = encodeURIComponent(buildWhatsAppMessage(name, email, wa));
    const waLink = product.whatsappLink || 'https://wa.me/244923000000';
    const finalUrl = waLink.includes('?') ? `${waLink}&text=${msg}` : `${waLink}?text=${msg}`;
    window.open(finalUrl, '_blank');
  };

  // ---------- LOGGED IN: one-click confirm ----------
  const handleLoggedInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('🛒 A criar pedido para produto:', product.id, 'utilizador:', user?.id);
      const ok = await createOrder(product.id, product.price);
      console.log('📋 Resultado createOrder:', ok);
      
      if (ok) {
        openWhatsApp(user!.name, user!.email, whatsapp);
        console.log('🔄 A atualizar perfil...');
        await refreshProfile();
        console.log('✅ Perfil atualizado, a navegar para dashboard');
        onClose();
        navigate('/dashboard');
      } else {
        alert('Erro ao registar pedido. Verifique a consola do browser para detalhes.');
      }
    } catch (err) {
      console.error('❌ Erro inesperado em handleLoggedInSubmit:', err);
      alert('Ocorreu um erro inesperado. Verifique a consola do browser.');
    } finally {
      setLoading(false);
    }
  };


  // ---------- GUEST: full registration ----------
  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (emailExists) {
        alert('Este e-mail já está cadastrado! Faça login para comprar.');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        alert('A senha precisa ter pelo menos 6 caracteres.');
        setLoading(false);
        return;
      }
      const registered = await register(formData.name, formData.email, formData.password, 'user');
      if (!registered) {
        alert('Erro ao criar conta. O e-mail já pode estar em uso.');
        setLoading(false);
        return;
      }
      const ok = await createOrder(product.id, product.price);
      if (ok) {
        openWhatsApp(formData.name, formData.email, formData.whatsapp);
        await refreshProfile();
        onClose();
        navigate('/dashboard');
      } else {
        alert('Erro ao registar pedido. Tente novamente.');
      }
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const productLabel = product.category === 'Ebook' ? 'E-book' : 'Curso';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] w-full max-w-md rounded-sm border border-white/10 shadow-2xl overflow-hidden overflow-y-auto max-h-[95vh]">

        {/* Product summary header */}
        <div className="flex items-center space-x-4 p-6 border-b border-white/10 bg-white/5">
          <img src={product.imageUrl} className="w-16 h-12 object-cover rounded-sm border border-white/10 shadow-lg" alt="" />
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-black text-yetomart-orange uppercase tracking-[0.3em]">{productLabel}</span>
            <h3 className="text-sm font-black text-white truncate uppercase tracking-tighter italic font-serif">{product.title}</h3>
            <p className="text-yetomart-orange font-black text-base">Kz {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8">
          {/* ============ LOGGED IN FLOW ============ */}
          {isLoggedIn ? (
            <form onSubmit={handleLoggedInSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter italic font-serif mb-1">Confirmar Pedido</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">O pedido será enviado ao produtor para aprovação</p>
              </div>

              {/* User info (read-only) */}
              <div className="bg-white/5 p-5 rounded-sm border border-white/10 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-yetomart-teal/20 flex items-center justify-center text-yetomart-teal font-black text-sm border border-yetomart-teal/30">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-black text-sm">{user?.name}</p>
                    <p className="text-slate-500 text-xs">{user?.email}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-green-500/10 text-green-400 text-[9px] font-black border border-green-500/20 px-2 py-1 rounded-sm uppercase tracking-widest">Logado</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp field */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">WhatsApp (para o produtor contactar)</label>
                <input
                  required
                  type="tel"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  className="w-full bg-white/5 p-4 rounded-sm border border-white/10 outline-none focus:border-yetomart-teal transition-all text-white text-sm"
                  placeholder="+244 9XX XXX XXX"
                />
              </div>

              {/* What happens next */}
              <div className="bg-yetomart-teal/10 p-4 rounded-sm border border-yetomart-teal/20 space-y-2">
                <p className="text-yetomart-teal text-[10px] font-black uppercase tracking-widest mb-3">O que acontece a seguir:</p>
                {['O pedido é registado na lista do produtor', 'O WhatsApp do produtor abre automaticamente', 'Assim que for aprovado, terá acesso imediato'].map((step, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <span className="w-4 h-4 rounded-full bg-yetomart-teal text-white text-[9px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-slate-300 text-xs font-medium">{step}</span>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yetomart-teal text-white py-5 rounded-sm font-black uppercase tracking-widest hover:bg-yetomart-teal/80 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processando...</>
                ) : (
                  <><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> Confirmar e Enviar WhatsApp</>
                )}
              </button>
              <p className="text-center text-[9px] text-slate-600 uppercase tracking-[0.2em] font-bold">O produto ficará visível na sua lista enquanto aguarda aprovação.</p>
            </form>

          ) : (
          /* ============ GUEST FLOW ============ */
            <form onSubmit={handleGuestSubmit} className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter italic font-serif mb-1">Criar conta e adquirir</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Preencha os dados para solicitar acesso via WhatsApp</p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nome Completo</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 p-4 rounded-sm border border-white/10 outline-none focus:border-yetomart-teal transition-all text-white text-sm" placeholder="Seu nome" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">E-mail</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 p-4 rounded-sm border border-white/10 outline-none focus:border-yetomart-teal transition-all text-white text-sm" placeholder="exemplo@email.com" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">WhatsApp</label>
                <input required type="tel" value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full bg-white/5 p-4 rounded-sm border border-white/10 outline-none focus:border-yetomart-teal transition-all text-white text-sm" placeholder="+244 9XX XXX XXX" />
              </div>

              {!emailExists && (
                <div className="bg-yetomart-teal/10 p-5 rounded-sm border border-yetomart-teal/20">
                  <h4 className="text-yetomart-teal text-xs font-black uppercase tracking-widest mb-3">Criar conta de acesso</h4>
                  <input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-white/5 p-4 rounded-sm border border-white/10 outline-none focus:border-yetomart-teal transition-all text-white text-sm mb-2"
                    placeholder="Senha (mín. 6 caracteres)" minLength={6} />
                  <p className="text-[10px] text-slate-500 font-medium">Usará este e-mail e senha para aceder ao conteúdo depois.</p>
                </div>
              )}

              {emailExists && (
                <div className="bg-yetomart-orange/10 p-5 rounded-sm border border-yetomart-orange/20">
                  <h4 className="text-yetomart-orange text-xs font-black uppercase tracking-widest mb-2">E-mail já cadastrado</h4>
                  <p className="text-[10px] text-white/70 font-medium mb-4">Faça login para comprar com segurança.</p>
                  <button type="button" onClick={() => navigate('/login')}
                    className="w-full py-3 bg-white/5 border border-white/10 hover:border-yetomart-orange text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-sm">
                    Fazer Login
                  </button>
                </div>
              )}

              <button type="submit" disabled={loading || (!!emailExists)}
                className="w-full bg-yetomart-teal text-white py-5 rounded-sm font-black uppercase tracking-widest hover:bg-yetomart-teal/80 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? 'Processando...' : (product.ctaText || 'Adquirir e Enviar WhatsApp')}
              </button>
              <p className="text-center text-[9px] text-slate-600 uppercase tracking-[0.2em] font-bold">Ao clicar, o WhatsApp do instrutor será aberto.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
