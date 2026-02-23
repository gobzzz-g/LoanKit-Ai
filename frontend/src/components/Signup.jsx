import { useState } from 'react';
import { UserPlus, User, Mail, Phone, Lock, ArrowRight, CheckCircle, Sparkles, Shield } from 'lucide-react';
import { authAPI } from '../services/api';
import GradientBackground from './ui/GradientBackground';
import PremiumCard from './ui/PremiumCard';
import PremiumButton from './ui/PremiumButton';
import PremiumInput from './ui/PremiumInput';

const Signup = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength('');
    } else if (password.length < 6) {
      setPasswordStrength('weak');
    } else if (password.length < 10) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
      setError('All fields are required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile.replace(/[\s\-\+]/g, ''))) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await authAPI.register({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile.replace(/[\s\-\+]/g, ''),
        password: formData.password
      });

      if (data.success) {
        onSignupSuccess(data.user);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to connect to server. Backend may be starting up...');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-400';
      case 'medium': return 'bg-yellow-400';
      case 'strong': return 'bg-green-400';
      default: return 'bg-gray-600';
    }
  };

  return (
    <GradientBackground>
      <div className="min-h-screen flex items-center justify-center p-4 py-12">
        <div className="max-w-md w-full animate-scale-in">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/50 animate-glow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-blue-200 text-lg">Start your loan journey in minutes</p>
          </div>

          {/* Signup Form */}
          <PremiumCard variant="glass" className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <PremiumInput
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                icon={User}
                variant="glass"
                placeholder="Enter your full name"
              />

              <PremiumInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                icon={Mail}
                variant="glass"
                placeholder="your.email@example.com"
              />

              <PremiumInput
                label="Mobile Number"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                required
                icon={Phone}
                variant="glass"
                placeholder="10-digit mobile number"
                maxLength="10"
              />

              {/* Password Field with Strength Indicator */}
              <div>
                <PremiumInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  icon={Lock}
                  variant="glass"
                  placeholder="Create a strong password"
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      <div className={`h-1 flex-1 rounded ${passwordStrength === 'weak' || passwordStrength === 'medium' || passwordStrength === 'strong' ? getPasswordStrengthColor() : 'bg-gray-600'}`}></div>
                      <div className={`h-1 flex-1 rounded ${passwordStrength === 'medium' || passwordStrength === 'strong' ? getPasswordStrengthColor() : 'bg-gray-600'}`}></div>
                      <div className={`h-1 flex-1 rounded ${passwordStrength === 'strong' ? getPasswordStrengthColor() : 'bg-gray-600'}`}></div>
                    </div>
                    <p className="text-xs text-blue-200">
                      Password strength: <span className="font-medium capitalize text-white">{passwordStrength || 'Not set'}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password with Check Icon */}
              <div className="relative">
                <PremiumInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  icon={Lock}
                  variant="glass"
                  placeholder="Re-enter your password"
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="absolute right-3 top-11">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="backdrop-blur-lg bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Terms & Conditions */}
              <div className="text-xs text-blue-200">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-white hover:underline font-semibold">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-white hover:underline font-semibold">Privacy Policy</a>
              </div>

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
                {loading ? 'Creating Account...' : 'Create Account'}
              </PremiumButton>
            </form>

            {/* Divider */}
            <div className="mt-6 flex items-center">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="px-4 text-sm text-blue-200">or</span>
              <div className="flex-1 border-t border-white/20"></div>
            </div>

            {/* Switch to Login */}
            <div className="mt-6 text-center">
              <p className="text-blue-200 text-sm">
                Already have an account?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-white font-semibold hover:text-blue-300 transition-colors"
                >
                  Sign In
                </button>
              </p>
            </div>
          </PremiumCard>

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-blue-200 text-sm">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Bank-grade security • 256-bit encryption</span>
            </div>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default Signup;

