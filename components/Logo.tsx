
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  showText = true, 
  textColor = "text-white",
  size = 'md'
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizes[size]} relative flex items-center justify-center`}>
        {/* Africa Map with Circuit Pattern - High Fidelity SVG */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full drop-shadow-[0_0_15px_rgba(244,162,97,0.4)]"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f4a261" />
              <stop offset="50%" stopColor="#e76f51" />
              <stop offset="100%" stopColor="#a0443c" />
            </linearGradient>
          </defs>
          
          {/* Africa Shape Outline */}
          <path 
            d="M32,18 C38,12 48,10 58,12 C68,14 78,20 82,30 C86,40 84,50 78,60 C72,70 68,80 62,92 C58,88 48,82 42,78 C36,74 32,64 28,54 C24,44 26,34 28,24 L32,18 Z" 
            stroke="url(#logoGradient)" 
            strokeWidth="2"
            strokeLinejoin="round"
          />
          
          {/* Circuit Pattern - Recreating the maze look from the image */}
          <g stroke="url(#logoGradient)" strokeWidth="1.8" strokeLinecap="round" opacity="1">
            <path d="M38,25 H48 V35 H58 V25 H68 V35 H78 V45" />
            <path d="M43,30 H53 V40 H43 V50 H33 V40" />
            <path d="M33,48 H43 V58 H53 V48 H63 V58 H73 V48 H83 V58" />
            <path d="M38,53 V63 H48 V73 H58 V63 H68 V73" />
            <path d="M78,53 V63 H68" />
            <path d="M48,78 V88 H58 V78 H68 V88" />
            <path d="M43,68 H53 V78 H43" />
            <path d="M58,83 V93 H63" />
            
            {/* Connection Terminals */}
            <circle cx="38" cy="25" r="1.2" fill="url(#logoGradient)" />
            <circle cx="78" cy="45" r="1.2" fill="url(#logoGradient)" />
            <circle cx="33" cy="40" r="1.2" fill="url(#logoGradient)" />
            <circle cx="83" cy="58" r="1.2" fill="url(#logoGradient)" />
            <circle cx="63" cy="93" r="1.2" fill="url(#logoGradient)" />
            <circle cx="48" cy="73" r="1.2" fill="url(#logoGradient)" />
          </g>
          
          {/* Madagascar */}
          <path 
            d="M85,70 C87,72 88,78 87,82 C86,86 84,84 83,80 C82,76 83,72 85,70 Z" 
            fill="url(#logoGradient)" 
          />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${textSizes[size]} font-serif font-black tracking-tighter ${textColor} italic`}>
            Yetomart
          </span>
          <span className="text-[8px] font-sans font-bold uppercase tracking-[0.2em] text-slate-400 mt-0.5">
            Tecnologias em Potencial
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
