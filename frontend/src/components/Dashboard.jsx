import { useState } from 'react';
import { TrendingUp, XCircle, Clock, CheckCircle, FileText, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import { pdfAPI } from '../services/api';

const Dashboard = ({ user, onStartNewApplication, onViewLoan, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [downloadingLoan, setDownloadingLoan] = useState(null);

  // Mock loan data - in production, fetch from backend
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
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'REJECTED':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LoanKit AI Dashboard</h1>
          <p className="text-gray-600">Track and manage your loan applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="card bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={onStartNewApplication}
            className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
          >
            <TrendingUp className="w-5 h-5" />
            Start New Loan Application
          </button>
        </div>

        {/* Tabs */}
        <div className="card bg-white">
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Loan Applications
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
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
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Loan Applications Yet</h3>
                  <p className="text-gray-500 mb-6">Start your first loan application to see it here</p>
                  <button onClick={onStartNewApplication} className="btn-primary">
                    Apply for Loan
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {loanApplications.map((loan, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(loan.status)}
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Loan Application #{loan.loanId || `LOAN${Date.now().toString().slice(-12)}`}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
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
                          <p className="text-xs text-gray-500 mb-1">Loan Amount</p>
                          <p className="font-semibold text-gray-900">
                            ₹{loan.amount?.toLocaleString('en-IN') || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tenure</p>
                          <p className="font-semibold text-gray-900">
                            {loan.tenure} months
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                          <p className="font-semibold text-gray-900">
                            {loan.interestRate}% p.a.
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Monthly EMI</p>
                          <p className="font-semibold text-gray-900">
                            ₹{loan.emi?.toLocaleString('en-IN') || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {loan.status === 'APPROVED' && (
                        <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-xs text-green-800">
                              <span className="font-semibold">💡 Decision Transparency:</span> Approved based on credit score ({loan.creditScore || user?.creditScore}), income verification, and repayment capacity assessment.
                            </p>
                          </div>
                          <button 
                            onClick={() => handleDownloadSanctionLetter(loan)}
                            disabled={downloadingLoan === loan.loanId}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {downloadingLoan === loan.loanId ? 'Downloading...' : 'Download Sanction Letter →'}
                          </button>
                        </div>
                      )}
                      
                      {loan.status === 'REJECTED' && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-xs text-red-800">
                              <span className="font-semibold">💡 Decision Transparency:</span> Decision based on credit assessment, current debt obligations, and lending policy compliance.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment History</h3>
              <p className="text-gray-500">Your payment history will appear here once you have active loans</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

