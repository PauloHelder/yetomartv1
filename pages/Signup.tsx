
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Signup: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<'user' | 'producer'>('user');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(); // Simula criação e login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-40 grayscale"
          alt=""
        />
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
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => setRole('user')}
              className={`p-4 rounded-sm border transition-all text-left ${role === 'user' ? 'border-yetomart-teal bg-yetomart-teal/10' : 'border-white/10 bg-white/5'}`}
            >
              <span className="block text-base font-black text-white font-serif italic">Sou Aluno</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Quero aprender</span>
            </button>
            <button 
              onClick={() => setRole('producer')}
              className={`p-4 rounded-sm border transition-all text-left ${role === 'producer' ? 'border-yetomart-orange bg-yetomart-orange/10' : 'border-white/10 bg-white/5'}`}
            >
              <span className="block text-base font-black text-white font-serif italic">Sou Produtor</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Quero vender</span>
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" className="appearance-none block w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-yetomart-teal sm:text-sm" placeholder="Nome" />
              <input required type="text" className="appearance-none block w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-yetomart-teal sm:text-sm" placeholder="Sobrenome" />
            </div>

            <input required type="email" className="appearance-none block w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-yetomart-teal sm:text-sm" placeholder="E-mail" />

            <input required type="password" title="Mínimo 8 caracteres" className="appearance-none block w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-yetomart-teal sm:text-sm" placeholder="Senha (mín. 8 caracteres)" />

            <div className="flex items-start">
              <input required id="terms" type="checkbox" className="h-4 w-4 mt-1 bg-white/5 border border-white/10 rounded-sm text-yetomart-teal focus:ring-0" />
              <label htmlFor="terms" className="ml-3 block text-xs text-slate-400 leading-relaxed">
                Eu aceito os <a href="#" className="font-bold text-white underline">Termos de Uso</a> e a <a href="#" className="font-bold text-white underline">Política de Privacidade</a>.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-yetomart-teal text-white rounded-sm font-black uppercase tracking-tighter hover:bg-yetomart-teal/80 transition-all shadow-xl font-serif italic"
            >
              Criar minha conta agora
            </button>
          </form>

          <div className="mt-12 text-center">
             <p className="text-slate-500 text-base">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-white hover:underline font-bold">
                Faça login.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
