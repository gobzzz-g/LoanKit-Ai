import { useState } from 'react';
import { TrendingUp, XCircle, Clock, CheckCircle, FileText, Calendar, DollarSign, ArrowLeft, Sparkles, Download } from 'lucide-react';
import { pdfAPI } from '../services/api';
import GradientBackground from './ui/GradientBackground';
import PremiumCard from './ui/PremiumCard';
import PremiumButton from './ui/PremiumButton';

const Dashboard = ({ user, onStartNewApplication, onViewLoan, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [downloadingLoan, setDownloadingLoan] = useState(null);

  const loanApplications = user?.loanHistory || [];

  const stats = {
    totalApplications: loanApplications.length,
    approved: loanApplications.filter(l => l.status === 'APPROVED').length,
    pending: loanApplications.filter(l => l.status === 'PENDING').length,
    rejected: loanApplications.filter(l => l.status === 'REJECTED').length
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <FileText className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-500/20 text-green-300 border-green-400/50';
      case 'REJECTED':
        return 'bg-red-500/20 text-red-300 border-red-400/50';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-400/50';
    }
  };

  const handleDownloadSanctionLetter = async (loan) => {
    setDownloadingLoan(loan.loanId);
    try {
      const blob = await pdfAPI.generateSanctionLetter(
        user,
        {
          amount: loan.amount,
          tenure: loan.tenure,
          purpose: 'Personal Loan'
        },
        {
          decision: 'APPROVED',
          loanAmount: loan.amount,
          tenure: loan.tenure,
          interestRate: loan.interestRate,
          proposedEMI: loan.emi,
          creditScore: loan.creditScore || user.creditScore || 750,
          riskCategory: loan.riskCategory || 'LOW'
        }
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sanction-letter-${loan.loanId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download sanction letter. Please try again.');
    } finally {
      setDownloadingLoan(null);
    }
  };

  return (
    <GradientBackground>
      <div className="min-h-screen p-4 md:p-8 animate-fade-in">
        <div className="container mx-auto max-w-7xl">
          
          {/* Header */}
          <div className="mb-8">
            <PremiumButton
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="mb-4"
              icon={ArrowLeft}
              iconPosition="left"
            >
              Back to Home
            </PremiumButton>

            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/50">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">LoanKit AI Dashboard</h1>
                <p className="text-blue-200">Track and manage your loan applications</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-10">
            {[
              { label: 'Total Applications', value: stats.totalApplications, icon: FileText, gradient: 'from-blue-400 to-blue-600' },
              { label: 'Approved', value: stats.approved, icon: CheckCircle, gradient: 'from-green-400 to-green-600' },
              { label: 'Pending', value: stats.pending, icon: Clock, gradient: 'from-yellow-400 to-yellow-600' },
              { label: 'Rejected', value: stats.rejected, icon: XCircle, gradient: 'from-red-400 to-red-600' }
            ].map((stat, index) => (
              <PremiumCard key={index} variant="glass" className="p-6 hover:scale-105" hover>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-200 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>

          {/* Action Button */}
          <div className="mb-8">
            <PremiumButton
              onClick={onStartNewApplication}
              variant="primary"
              size="lg"
              icon={TrendingUp}
              iconPosition="left"
              className="text-lg"
            >
              Start New Loan Application
            </PremiumButton>
          </div>

          {/* Tabs */}
          <PremiumCard variant="glass" className="p-6">
            <div className="border-b border-white/20 mb-6">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-4 px-2 font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'text-white border-b-2 border-blue-400'
                      : 'text-blue-200 hover:text-white'
                  }`}
                >
                  Loan Applications
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`pb-4 px-2 font-medium transition-colors ${
                    activeTab === 'history'
                      ? 'text-white border-b-2 border-blue-400'
                      : 'text-blue-200 hover:text-white'
                  }`}
                >
                  Payment History
                </button>
              </div>
            </div>

            {/* Content */}
            {activeTab === 'overview' && (
              <div>
                {loanApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No Loan Applications Yet</h3>
                    <p className="text-blue-200 mb-6">Start your first loan application to see it here</p>
                    <PremiumButton onClick={onStartNewApplication} variant="secondary">
                      Apply for Loan
                    </PremiumButton>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {loanApplications.map((loan, index) => (
                      <PremiumCard
                        key={index}
                        variant="glassDark"
                        className="p-6 hover:bg-white/15"
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(loan.status)}
                            <div>
                              <h3 className="font-semibold text-white">
                                Loan Application #{loan.loanId || `LOAN${Date.now().toString().slice(-12)}`}
                              </h3>
                              <p className="text-sm text-blue-200 mt-1">
                                {new Date(loan.appliedAt || Date.now()).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })} at {new Date(loan.appliedAt || Date.now()).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(loan.status)}`}>
                            {loan.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div>
                            <p className="text-xs text-blue-200/70 mb-1">Loan Amount</p>
                            <p className="font-semibold text-white">
                              ₹{loan.amount?.toLocaleString('en-IN') || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-blue-200/70 mb-1">Tenure</p>
                            <p className="font-semibold text-white">
                              {loan.tenure} months
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-blue-200/70 mb-1">Interest Rate</p>
                            <p className="font-semibold text-white">
                              {loan.interestRate}% p.a.
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-blue-200/70 mb-1">Monthly EMI</p>
                            <p className="font-semibold text-white">
                              ₹{loan.emi?.toLocaleString('en-IN') || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {loan.status === 'APPROVED' && (
                          <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                            <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-3">
                              <p className="text-xs text-green-200">
                                <span className="font-semibold">💡 Decision Transparency:</span> Approved based on credit score ({loan.creditScore || user?.creditScore}), income verification, and repayment capacity assessment.
                              </p>
                            </div>
                            <PremiumButton
                              onClick={() => handleDownloadSanctionLetter(loan)}
                              disabled={downloadingLoan === loan.loanId}
                              variant="secondary"
                              size="sm"
                              loading={downloadingLoan === loan.loanId}
                              icon={Download}
                              iconPosition="left"
                            >
                              {downloadingLoan === loan.loanId ? 'Downloading...' : 'Download Sanction Letter'}
                            </PremiumButton>
                          </div>
                        )}

                        {loan.status === 'REJECTED' && (
                          <div className="mt-6 pt-4 border-t border-white/10">
                            <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3">
                              <p className="text-xs text-red-200">
                                <span className="font-semibold">💡 Decision Transparency:</span> Decision based on credit assessment, current debt obligations, and lending policy compliance.
                              </p>
                            </div>
                          </div>
                        )}
                      </PremiumCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Payment History</h3>
                <p className="text-blue-200">Your payment history will appear here once you have active loans</p>
              </div>
            )}
          </PremiumCard>
        </div>
      </div>
    </GradientBackground>
  );
};

export default Dashboard;

