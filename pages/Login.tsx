
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
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

      <div className="relative z-10 mt-4 sm:mx-auto sm:w-full sm:max-w-[450px]">
        <div className="bg-white/5 py-16 px-4 sm:rounded-md sm:px-16 border border-white/5 backdrop-blur-md shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-8 font-serif italic">Entrar</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail ou número de telefone"
                  className="appearance-none block w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-yetomart-teal sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="appearance-none block w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-yetomart-teal sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-sm shadow-lg text-base font-black text-white bg-yetomart-teal hover:bg-yetomart-teal/80 focus:outline-none transition-all mt-4 font-serif italic"
              >
                Entrar
              </button>
            </div>

            <div className="flex items-center justify-between text-slate-400 text-xs">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-[#333] border-none rounded-sm text-slate-600 focus:ring-0"
                />
                <label htmlFor="remember-me" className="ml-2 block">
                  Lembre-se de mim
                </label>
              </div>
              <a href="#" className="hover:underline">Precisa de ajuda?</a>
            </div>
          </form>

          <div className="mt-16">
            <p className="text-slate-500 text-base">
              Novo por aqui?{' '}
              <Link to="/signup" className="text-white hover:underline font-bold">
                Assine agora.
              </Link>
            </p>
            <p className="mt-4 text-[13px] text-slate-500 leading-tight">
              Esta página é protegida pelo Google reCAPTCHA para garantir que você não é um robô. <span className="text-blue-600 hover:underline cursor-pointer">Saiba mais.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
