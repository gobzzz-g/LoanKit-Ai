import { useState } from 'react';
import { LogIn, Mail, Lock, ArrowRight, Sparkles, Shield } from 'lucide-react';
import { authAPI } from '../services/api';
import GradientBackground from './ui/GradientBackground';
import PremiumCard from './ui/PremiumCard';
import PremiumButton from './ui/PremiumButton';
import PremiumInput from './ui/PremiumInput';

const Login = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authAPI.login(formData);

      if (data.success) {
        localStorage.setItem('sessionToken', data.sessionToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.sessionToken);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to server. Backend may be starting up...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full animate-scale-in">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/50 animate-glow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-blue-200 text-lg">Sign in to continue your loan journey</p>
          </div>

          {/* Login Form */}
          <PremiumCard variant="glass" className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <PremiumInput
                label="Email or Mobile Number"
                name="emailOrMobile"
                type="text"
                value={formData.emailOrMobile}
                onChange={handleChange}
                required
                icon={Mail}
                variant="glass"
                placeholder="Enter email or mobile number"
              />

              <PremiumInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                icon={Lock}
                variant="glass"
                placeholder="Enter your password"
              />

              {/* Error Message */}
              {error && (
                <div className="backdrop-blur-lg bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <PremiumButton
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={loading}
                className="w-full"
                icon={ArrowRight}
                iconPosition="right"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </PremiumButton>
            </form>

            {/* Divider */}
            <div className="mt-6 flex items-center">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="px-4 text-sm text-blue-200">or</span>
              <div className="flex-1 border-t border-white/20"></div>
            </div>

            {/* Switch to Signup */}
            <div className="mt-6 text-center">
              <p className="text-blue-200 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToSignup}
                  className="text-white font-semibold hover:text-blue-300 transition-colors"
                >
                  Create Account
                </button>
              </p>
            </div>
          </PremiumCard>

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-blue-200 text-sm">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Your data is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default Login;

