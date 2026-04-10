import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Login: React.FC = () => {
  const { login, authError, clearError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn) {
      // Redireciona para onde o utilizador estava a tentar ir, ou para o dashboard por padrão
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Safety timeout: if server doesn't respond in 12s, release the button
    const timeout = setTimeout(() => {
      setLoading(false);
      clearError();
      // Only set error if we are still loading
    }, 12000);

    try {
      console.log('🚀 Iniciando login para:', email);
      await login(email, password);
    } catch (err: any) {
      console.error('❌ Falha no submit:', err);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 grayscale" alt="" />
        <div className="absolute inset-0 bg-[#0f172a]/80"></div>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2 mb-8">
          <Logo size="lg" />
        </Link>
      </div>

      <div className="relative z-10 mt-4 sm:mx-auto sm:w-full sm:max-w-[450px]">
        <div className="bg-white/5 py-16 px-4 sm:rounded-md sm:px-16 border border-white/5 backdrop-blur-md shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-8 font-serif italic">Entrar</h2>
          
          {authError && (
             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-sm text-red-500 text-sm font-medium flex justify-between">
                <span>{authError}</span>
                <button onClick={clearError} className="opacity-80 hover:opacity-100">✕</button>
             </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail ou número de telefone" className="appearance-none block w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-400 focus:outline-none focus:border-yetomart-coral transition-all" />
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className="appearance-none block w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-400 focus:outline-none focus:border-yetomart-coral transition-all" />
            <button type="submit" disabled={loading} className="btn-brand btn-brand-lg btn-brand-full mt-4 disabled:opacity-50">
              {loading ? 'A entrar...' : 'Entrar'}
            </button>
            <div className="flex justify-between text-slate-400 text-xs">
              <label className="flex items-center"><input type="checkbox" className="mr-2" />Lembre-se de mim</label>
              <a href="#" className="hover:underline">Precisa de ajuda?</a>
            </div>
          </form>

          <div className="mt-16 text-center">
            <p className="text-slate-500 text-base">Novo por aqui? <Link to="/signup" className="text-white hover:underline font-bold">Cadastre-se.</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
