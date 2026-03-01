import { useState, useEffect } from 'react';
import { 
  Sparkles, ArrowRight, TrendingUp, Shield, Zap, LogOut, User, LayoutDashboard, 
  Loader2, CheckCircle2, Clock, FileCheck, Star, Award, Bot, Rocket 
} from 'lucide-react';
import { chatAPI, agentAPI } from '../services/api';
import ParticleBackground from './ParticleBackground';

const LandingPage = ({ onStartSession, user, onLogout, onGoToDashboard }) => {
  const [demoCustomers, setDemoCustomers] = useState([]);
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <ParticleBackground />
      
      <div className="relative z-10">
        {/* Top Navigation Bar */}
        {user && (
          <div className="backdrop-blur-lg bg-white/10 border-b border-white/10">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-white font-semibold block">{user.name}</span>
                  <span className="text-blue-200 text-xs">ID: {user.customerId}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onGoToDashboard}
                  className="flex items-center gap-2 text-white hover:text-blue-200 transition-all px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="text-sm font-medium hidden md:inline">Dashboard</span>
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-white/80 hover:text-red-300 transition-all px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm hidden md:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 md:py-24">
          <header className="text-center mb-20 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-slide-down">
                LoanKit AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-4 font-medium animate-slide-up">
              Smart Lending. Instant Approvals. Powered by AI.
            </p>
            
            <p className="text-base md:text-lg text-blue-200/80 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Experience the future of personal loans. Get approved in minutes with our intelligent AI agents. 
              No paperwork, no waiting, just seamless lending.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => handleStartChat(user?.customerId || user?.phone)}
              disabled={loading}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-scale-in overflow-hidden"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-3">
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Starting Your Journey...
                  </>
                ) : (
                  <>
                    <Rocket className="w-6 h-6" />
                    Start Loan Application
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 mt-12 flex-wrap animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <Shield className="w-5 h-5 text-green-400" />
                <span>Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <Award className="w-5 h-5 text-yellow-400" />
                <span>RBI Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <Bot className="w-5 h-5 text-purple-400" />
                <span>AI-Powered</span>
              </div>
            </div>
          </header>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-24 max-w-6xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Get loan approval in under 5 minutes. Our AI agents work 24/7 to process your application instantly.",
                gradient: "from-yellow-400 to-orange-500",
                delay: "0s"
              },
              {
                icon: Shield,
                title: "100% Secure",
                description: "Bank-grade encryption with automated KYC and credit verification. Your data is always protected.",
                gradient: "from-green-400 to-emerald-600",
                delay: "0.1s"
              },
              {
                icon: TrendingUp,
                title: "Best Rates",
                description: "Competitive interest rates starting from 10.5% per annum with flexible repayment options.",
                gradient: "from-blue-400 to-indigo-600",
                delay: "0.2s"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slide-up"
                style={{ animationDelay: feature.delay }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-blue-200/90 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* How It Works Section */}
          <div className="mb-24 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-blue-200 text-lg">Get your loan in 3 simple steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  icon: FileCheck,
                  title: "Apply Online",
                  description: "Chat with our AI agent and provide basic information. No physical documents needed."
                },
                {
                  step: "02",
                  icon: Clock,
                  title: "Instant Verification",
                  description: "Our AI verifies your credit score and eligibility in real-time using secure APIs."
                },
                {
                  step: "03",
                  icon: CheckCircle2,
                  title: "Get Approved",
                  description: "Receive instant approval and money directly in your bank account within hours."
                }
              ].map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-4 relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-blue-200/80 text-sm">{item.description}</p>
                  </div>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Demo Customer Profiles */}
          <div className="max-w-6xl mx-auto mb-24">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center">
                Meet Our Client Profiles
              </h2>
              <p className="text-blue-200 text-center mb-10 text-lg">
                See how our AI handles different customer scenarios for personal loans
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {demoCustomers.map((customer, index) => (
                  <div
                    key={customer.customerId}
                    className="group relative backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-white mb-1">
                          {customer.name}
                        </h3>
                        <p className="text-sm text-blue-200/70">{customer.customerId}</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200/80">Credit Score:</span>
                        <span className={`font-bold text-lg ${
                          customer.creditScore >= 750 ? 'text-green-400' :
                          customer.creditScore >= 700 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {customer.creditScore}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200/80">Pre-approved:</span>
                        <span className="font-bold text-lg text-white">
                          ₹{(customer.preApprovedLimit / 100000).toFixed(1)}L
                        </span>
                      </div>
                      
                      <div className="pt-3 mt-3 border-t border-white/10">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full block text-center shadow-lg ${
                          customer.scenario === 'Instant Approval' ? 'bg-green-500 text-white' :
                          customer.scenario === 'Conditional Approval' ? 'bg-yellow-500 text-gray-900' :
                            'bg-red-500 text-white'
                        }`}>
                          {customer.scenario}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-blue-200/60 text-sm flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Demo profiles for showcase. Your application is personalized based on your profile.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mb-24 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Loved by Customers</h2>
              <p className="text-blue-200 text-lg">See what our users say about us</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Priya Sharma",
                  role: "Software Engineer",
                  content: "Got my loan approved in 3 minutes! The AI agent was incredibly helpful and the process was seamless.",
                  rating: 5
                },
                {
                  name: "Rahul Verma",
                  role: "Business Owner",
                  content: "Best loan experience ever. No paperwork, instant approval, and competitive rates. Highly recommend!",
                  rating: 5
                },
                {
                  name: "Anita Desai",
                  role: "Teacher",
                  content: "The AI understood my needs perfectly. Got exactly the loan amount I needed with flexible EMI options.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-blue-100 mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-blue-200/70 text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-24 max-w-5xl mx-auto">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                {[
                  { value: "50K+", label: "Loans Disbursed" },
                  { value: "₹500Cr+", label: "Total Disbursed" },
                  { value: "4.9/5", label: "Customer Rating" },
                  { value: "< 5 min", label: "Avg. Approval Time" }
                ].map((stat, index) => (
                  <div key={index}>
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-blue-200/80 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-white/10 pt-12">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-lg">LoanKit AI</span>
                  </div>
                  <p className="text-blue-200/70 text-sm">
                    Smart lending powered by artificial intelligence. Making loans accessible to everyone.
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-blue-200/60 text-sm">
                  © 2024 LoanKit AI. All rights reserved.
                </p>
                <div className="flex items-center gap-2 text-blue-200/60 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Powered by Google Gemini AI</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
