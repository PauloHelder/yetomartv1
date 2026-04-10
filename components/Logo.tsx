
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
  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`flex items-center space-x-3 group select-none ${className}`}>
      {/* Icon (Favicon style) */}
      <div className="relative flex-shrink-0">
        <div className="absolute inset-0 bg-[#e76f51]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img 
          src="/logo_icon.png" 
          alt="Icon" 
          className={`${iconSizes[size]} object-contain relative z-10 transition-transform duration-500 group-hover:scale-110`}
        />
      </div>

      {/* Brand Name as Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${textSizes[size]} font-serif font-black tracking-tight ${textColor} group-hover:text-yetomart-coral transition-colors duration-300`}>
            Yetomart
          </span>
          <span className="text-[0.25em] font-sans font-extrabold uppercase tracking-[0.35em] text-slate-400 mt-1 lg:mt-2" style={{ fontSize: `calc(${textSizes[size].split('-')[1]} * 0.25)` }}>
            TECNOLOGIAS EM POTENCIAL
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
