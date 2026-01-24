import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, TrendingUp, Shield, Zap, LogOut, User, LayoutDashboard, Loader2 } from 'lucide-react';
import { chatAPI, agentAPI } from '../services/api';

const LandingPage = ({ onStartSession, user, onLogout, onGoToDashboard }) => {
  const [demoCustomers, setDemoCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDemoCustomers();
  }, []);

  const loadDemoCustomers = async () => {
    try {
      const response = await agentAPI.getDemoCustomers();
      if (response.success) {
        setDemoCustomers(response.customers);
      }
    } catch (error) {
      console.error('Failed to load demo customers:', error);
    }
  };

  const handleStartChat = async (customerId) => {
    setLoading(true);
    try {
      const response = await chatAPI.startSession(customerId);
      if (response.success) {
        onStartSession(response);
      }
    } catch (error) {
      console.error('Failed to start session:', error);
      alert('Failed to start chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top Bar with User Info */}
      {user && (
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              <span className="text-gray-700 font-medium">{user.name}</span>
              <span className="text-gray-400 text-sm">({user.customerId})</span>
            </div>
            <div className="flex items-center gap-4">
              
              <button
                onClick={onGoToDashboard}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors px-4 py-2 rounded-lg hover:bg-primary-50"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-sm font-medium">My Dashboard</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-primary-900">
              LoanKit AI
            </h1>
          </div>
          <p className="text-lg text-gray-500 mb-2">AI-Powered Personal Loans</p>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant loan approval through intelligent AI agents. 
            No paperwork, no waiting. Just conversations.
          </p>
        </header>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-5xl mx-auto">
          <div className="card text-center animate-slide-up hover:shadow-lg transition-shadow duration-300 p-8">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-3">Instant Decisions</h3>
            <p className="text-gray-600 text-sm">
              Get loan approval in minutes, not days. AI agents work 24/7.
            </p>
          </div>
          
          <div className="card text-center animate-slide-up hover:shadow-lg transition-shadow duration-300 p-8" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-success-600" />
            </div>
            <h3 className="text-lg font-semibold mb-3">Secure & Compliant</h3>
            <p className="text-gray-600 text-sm">
              Bank-grade security with automated KYC and credit verification.
            </p>
          </div>
          
          <div className="card text-center animate-slide-up hover:shadow-lg transition-shadow duration-300 p-8" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-warning-600" />
            </div>
            <h3 className="text-lg font-semibold mb-3">Best Rates</h3>
            <p className="text-gray-600 text-sm">
              Competitive interest rates starting from 10.5% per annum.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white border-0">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Your Loan?</h2>
            <p className="text-primary-100 mb-6 text-lg">
              Talk to our AI advisor and get instant approval in minutes
            </p>
            <button
              onClick={() => handleStartChat(user?.customerId || user?.phone)}
              disabled={loading}
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-50 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Start Loan Application
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Demo Showcases */}
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <h2 className="text-2xl font-bold text-primary-900 mb-4 text-center">
              Meet Our client profiles
            </h2>
            <p className="text-gray-600 text-center mb-8">
              See how our AI handles different customer scenarios for personal loans.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              {demoCustomers.map((customer, index) => (
                <div
                  key={customer.customerId}
                  className="p-6 border-2 border-gray-200 rounded-xl bg-gray-50 text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {customer.name}
                      </h3>
                      <p className="text-sm text-gray-500">{customer.customerId}</p>
                    </div>
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credit Score:</span>
                      <span className={`font-medium ${
                        customer.creditScore >= 750 ? 'text-success-600' : 
                        customer.creditScore >= 700 ? 'text-warning-600' : 'text-red-600'
                      }`}>
                        {customer.creditScore}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pre-approved:</span>
                      <span className="font-medium text-gray-900">
                        ₹{(customer.preApprovedLimit / 100000).toFixed(1)}L
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        customer.scenario === 'Instant Approval' ? 'bg-success-100 text-success-700' :
                        customer.scenario === 'Conditional Approval' ? 'bg-warning-100 text-warning-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {customer.scenario}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>💡 These are demo profiles for showcase purposes. Your actual application will be personalized based on your profile.</p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-16 text-sm text-gray-500 space-y-2">
          <p>🏆 Built for LoanKitTechathon 2025 - BFSI Track</p>
          <p className="font-medium text-gray-600">Powered by LoanKit AI | Agentic AI & Google Gemini</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

