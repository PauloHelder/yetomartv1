
import React from 'react';
import { Link } from 'react-router-dom';

interface PaywallProps {
  hasAccess: boolean;
  productId: string;
  children: React.ReactNode;
}

const Paywall: React.FC<PaywallProps> = ({ hasAccess, productId, children }) => {
  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative group overflow-hidden rounded-sm">
      {/* Blurred overlay */}
      <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center border border-white/10 shadow-2xl">
        <div className="bg-yetomart-teal/20 p-6 rounded-full mb-6 border border-yetomart-teal/30 animate-pulse">
          <svg className="w-14 h-14 text-yetomart-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter italic font-serif">Conteúdo Premium</h3>
        <p className="text-white/60 max-w-sm mb-8 font-medium leading-relaxed">
          Esta aula é exclusiva para membros. Adquira o acesso vitalício para desbloquear este e todos os outros módulos agora mesmo.
        </p>
        <Link 
          to={`/checkout/${productId}`}
          className="bg-yetomart-teal text-white px-12 py-4 rounded-sm font-black uppercase tracking-[0.2em] hover:bg-yetomart-teal/80 transition-all duration-300 shadow-xl active:scale-95"
        >
          Desbloquear Agora
        </Link>
      </div>
      
      {/* Visual content placeholder to show what's behind */}
      <div className="opacity-10 pointer-events-none select-none filter grayscale">
        {children}
      </div>
    </div>
  );
};

export default Paywall;
