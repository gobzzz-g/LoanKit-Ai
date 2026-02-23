import { forwardRef } from 'react';

const PremiumCard = forwardRef(({ children, className = '', variant = 'glass', hover = false, ...props }, ref) => {
  const baseStyles = 'rounded-2xl transition-all duration-300';
  
  const variants = {
    glass: 'backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl',
    glassDark: 'backdrop-blur-xl bg-black/20 border border-white/10 shadow-2xl',
    solid: 'bg-white border border-gray-200 shadow-lg',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/30 backdrop-blur-lg',
  };

  const hoverStyles = hover ? 'hover:scale-105 hover:shadow-2xl cursor-pointer' : '';

  return (
    <div
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

PremiumCard.displayName = 'PremiumCard';

export default PremiumCard;
