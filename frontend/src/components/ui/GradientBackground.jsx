const GradientBackground = ({ children, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900',
    light: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
    dark: 'bg-gradient-to-br from-gray-900 via-slate-900 to-black',
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${variants[variant]}`}>
      {/* Animated floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GradientBackground;
