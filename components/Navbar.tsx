
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const { isLoggedIn, user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <nav className="bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center flex-1 space-x-8">
            <Link to="/" className="flex-shrink-0">
              <Logo size="md" />
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 group-focus-within:text-yetomart-orange transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </span>
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="O que você quer aprender hoje?"
                  className="w-full bg-white/5 border border-white/10 rounded-sm py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-yetomart-orange/50 focus:bg-white/10 transition-all"
                />
              </div>
            </form>

            <div className="hidden lg:flex space-x-4">
              <Link to="/" className="text-slate-200 hover:text-yetomart-orange px-3 py-2 text-sm font-bold transition-colors font-serif italic">Início</Link>
              {isLoggedIn && (
                <Link to="/dashboard" className="text-slate-200 hover:text-yetomart-orange px-3 py-2 text-sm font-bold transition-colors font-serif italic">Minha Lista</Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="text-white font-bold text-sm hover:text-yetomart-orange transition-colors font-serif italic">Entrar</Link>
                <Link to="/signup" className="btn-brand">Cadastrar</Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {user?.role === 'producer' && (
                  <Link to="/producer" className="text-white hover:text-yetomart-orange px-4 py-2 text-sm font-bold transition-all hidden sm:block font-serif italic">Estúdio</Link>
                )}
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                   <div className="w-8 h-8 bg-yetomart-orange rounded-sm flex items-center justify-center">
                     <span className="text-yetomart-gray font-bold text-xs">{user?.name.charAt(0)}</span>
                   </div>
                   <span className="text-sm font-bold text-white hidden sm:inline">{user?.name}</span>
                </div>
                <button onClick={() => { logout(); navigate('/'); }} className="text-slate-400 hover:text-yetomart-red transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
