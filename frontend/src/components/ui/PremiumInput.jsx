import { forwardRef } from 'react';

const PremiumInput = forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  className = '',
  containerClassName = '',
  variant = 'glass',
  ...props 
}, ref) => {
  const variants = {
    glass: 'backdrop-blur-lg bg-white/10 border border-white/20 text-white placeholder-blue-200/50',
    solid: 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400',
  };

  const focusStyles = variant === 'glass' 
    ? 'focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50' 
    : 'focus:ring-2 focus:ring-primary-500 focus:border-primary-500';

  return (
    <div className={containerClassName}>
      {label && (
        <label className={`block text-sm font-medium mb-2 ${variant === 'glass' ? 'text-blue-100' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 ${variant === 'glass' ? 'text-blue-200' : 'text-gray-400'}`} />
          </div>
        )}
        <input
          ref={ref}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl ${variants[variant]} ${focusStyles} transition-all duration-200 ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

PremiumInput.displayName = 'PremiumInput';

export default PremiumInput;
