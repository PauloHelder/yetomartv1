import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Signup: React.FC = () => {
  const { register, authError, clearError } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<'user' | 'producer'>('user');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (isLoggedIn && user) {
      navigate(user.role === 'producer' ? '/producer' : '/dashboard');
    }
  }, [isLoggedIn, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await register(fullName, email, password, role);
    } catch (err) {
      console.error(err);
    } finally {
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

      <div className="relative z-10 mt-4 sm:mx-auto sm:w-full sm:max-w-[550px]">
        <div className="bg-white/5 py-16 px-4 sm:rounded-md sm:px-16 border border-white/5 backdrop-blur-md shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-8 font-serif italic">Criar Conta</h2>
          
          {authError && (
             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-sm text-red-500 text-sm font-medium flex justify-between">
                <span>{authError}</span>
                <button onClick={clearError} className="opacity-80 hover:opacity-100">✕</button>
             </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button onClick={() => setRole('user')} className={`p-4 rounded-sm border-2 text-left ${role === 'user' ? 'border-yetomart-coral bg-yetomart-coral/10 shell-[0_0_20px_-4px_rgba(231,111,81,0.5)]' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
              <span className="block text-base font-black text-white font-serif italic">Sou Aluno</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Quero aprender</span>
            </button>
            <button onClick={() => setRole('producer')} className={`p-4 rounded-sm border-2 text-left ${role === 'producer' ? 'border-yetomart-orange bg-yetomart-orange/10 shell-[0_0_20px_-4px_rgba(244,162,97,0.5)]' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
              <span className="block text-base font-black text-white font-serif italic">Sou Produtor</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Quero vender</span>
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm text-white focus:border-yetomart-coral" placeholder="Nome" />
              <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm text-white focus:border-yetomart-coral" placeholder="Sobrenome" />
            </div>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm text-white focus:border-yetomart-coral" placeholder="E-mail" />
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm text-white focus:border-yetomart-coral" placeholder="Senha (mín. 6 caracteres)" />
            
            <button type="submit" disabled={loading} className="btn-brand btn-brand-lg btn-brand-full uppercase tracking-tighter disabled:opacity-50">
              {loading ? 'A registar...' : 'Criar minha conta agora'}
            </button>
          </form>

          <div className="mt-12 text-center">
             <p className="text-slate-500 text-base">Já tem uma conta? <Link to="/login" className="text-white hover:underline font-bold">Faça login.</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
