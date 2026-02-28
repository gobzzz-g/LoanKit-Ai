import { useState, useEffect, useRef } from 'react';
import {
  Send, ArrowLeft, Download, CheckCircle, Clock,
  AlertCircle, Bot, User, Loader2, Upload
} from 'lucide-react';
import { chatAPI, pdfAPI } from '../services/api';
import ProgressTracker from './ProgressTracker';
import MessageBubble from './MessageBubble';
import DocumentUpload from './DocumentUpload';

const ChatInterface = ({ sessionData, onBack, user, sessionToken, onLoanDecision }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [session, setSession] = useState(sessionData.session);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Add initial message
    if (sessionData.message) {
      setMessages([{
        id: Date.now(),
        sender: 'agent',
        text: sessionData.message,
        timestamp: new Date()
      }]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setTyping(true);

    try {
      const response = await chatAPI.sendMessage(
        sessionData.sessionId,
        inputMessage
      );

      if (response.success) {
        setTyping(false);
        setTimeout(() => {
          const agentMessage = {
            id: Date.now() + 1,
            sender: 'agent',
            text: response.message,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, agentMessage]);
          setSession(response.session);

          // Notify parent if loan decision was made
          if (response.session.stage === 'DECISION' && response.session.underwritingResult && onLoanDecision) {
            console.log('🎯 Loan decision made, notifying parent:', response.session.underwritingResult);
            onLoanDecision(response.session.underwritingResult);
          }

          // Auto-proceed for VERIFICATION and UNDERWRITING stages
          if (response.session.stage === 'VERIFICATION' || response.session.stage === 'UNDERWRITING') {
            setTimeout(async () => {
              setTyping(true);
              try {
                const followUpResponse = await chatAPI.sendMessage(
                  sessionData.sessionId,
                  'proceed'
                );

                if (followUpResponse.success) {
                  setTyping(false);
                  setTimeout(() => {
                    const followUpMessage = {
                      id: Date.now() + 2,
                      sender: 'agent',
                      text: followUpResponse.message,
                      timestamp: new Date()
                    };
                    setMessages(prev => [...prev, followUpMessage]);
                    setSession(followUpResponse.session);

                    // Notify parent if loan decision was made
                    if (followUpResponse.session.stage === 'DECISION' && followUpResponse.session.underwritingResult && onLoanDecision) {
                      onLoanDecision(followUpResponse.session.underwritingResult);
                    }

                    // Check if we need to auto-proceed again (for UNDERWRITING after VERIFICATION)
                    if (followUpResponse.session.stage === 'UNDERWRITING') {
                      setTimeout(async () => {
                        setTyping(true);
                        try {
                          const finalResponse = await chatAPI.sendMessage(
                            sessionData.sessionId,
                            'proceed'
                          );

                          if (finalResponse.success) {
                            setTyping(false);
                            setTimeout(() => {
                              const finalMessage = {
                                id: Date.now() + 3,
                                sender: 'agent',
                                text: finalResponse.message,
                                timestamp: new Date()
                              };
                              setMessages(prev => [...prev, finalMessage]);
                              setSession(finalResponse.session);

                              // Notify parent if loan decision was made
                              if (finalResponse.session.stage === 'DECISION' && finalResponse.session.underwritingResult && onLoanDecision) {
                                onLoanDecision(finalResponse.session.underwritingResult);
                              }
                            }, 500);
                          }
                        } catch (err2) {
                          console.error('Final auto-proceed error:', err2);
                          setTyping(false);
                        }
                      }, 2000);
                    }
                  }, 500);
                }
              } catch (err) {
                console.error('Auto-proceed error:', err);
                setTyping(false);
              }
            }, 2000);
          }
        }, 500);
      }
    } catch (error) {
      setTyping(false);
      console.error('Send message error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'agent',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSanctionLetter = async () => {
    if (!session.underwritingResult || session.underwritingResult.decision !== 'APPROVED') {
      return;
    }

    try {
      setLoading(true);

      // Ensure we have customer data with name
      const customerData = {
        ...session.customer,
        name: session.customer?.name || user?.name || 'Customer'
      };

      console.log('📄 Downloading sanction letter for:', customerData.name);

      const blob = await pdfAPI.generateSanctionLetter(
        customerData,
        session.loanRequest,
        session.underwritingResult
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Create filename with customer name and ID
      const customerName = customerData.name.replace(/\s+/g, '_');
      const loanId = `LOAN${Date.now()}`;
      a.download = `sanction-letter-${customerName}-${loanId}.pdf`;
      console.log('📥 Filename:', a.download);
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Add confirmation message
      const confirmMessage = {
        id: Date.now(),
        sender: 'agent',
        text: '✅ Your sanction letter has been downloaded successfully! Keep it safe for your records.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, confirmMessage]);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download sanction letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = async (reply) => {
    // Special handling for sanction letter generation
    if (reply === 'Yes, generate sanction letter') {
      // Add user message
      const userMsg = {
        id: Date.now(),
        sender: 'user',
        text: reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMsg]);
      setLoading(true);
      setTyping(true);

      try {
        // Send message to backend
        const response = await chatAPI.sendMessage(sessionData.sessionId, reply);

        if (response.success) {
          setTyping(false);
          setTimeout(() => {
            const agentMessage = {
              id: Date.now() + 1,
              sender: 'agent',
              text: response.message,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, agentMessage]);
            setSession(response.session);

            // Notify parent if loan decision was made
            if (response.session.stage === 'DECISION' && response.session.underwritingResult && onLoanDecision) {
              onLoanDecision(response.session.underwritingResult);
            }

            // Trigger download after response is shown
            setTimeout(() => {
              handleDownloadSanctionLetter();
            }, 1000);
          }, 500);
        }
      } catch (error) {
        console.error('Quick reply error:', error);
        setTyping(false);
      } finally {
        setLoading(false);
      }
      return;
    }

    // For other quick replies, use the normal flow
    setInputMessage(reply);
    setTimeout(() => {
      const event = { preventDefault: () => { } };
      handleSendMessage(event);
    }, 100);
  };

  const handleDocumentUpload = async (documentData) => {
    console.log('Document uploaded:', documentData);
    setShowDocumentUpload(false);

    // Add confirmation message
    const confirmMessage = {
      id: Date.now(),
      sender: 'agent',
      text: `✅ ${documentData.documentType} uploaded successfully! Verifying now...`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMessage]);

    // Send "documents uploaded" message to backend
    try {
      setLoading(true);
      const response = await chatAPI.sendMessage(
        sessionData.sessionId,
        'documents uploaded'
      );

      if (response.success) {
        setTimeout(() => {
          const agentMessage = {
            id: Date.now() + 1,
            sender: 'agent',
            text: response.message,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, agentMessage]);
          setSession(response.session);
        }, 1000);
      }
    } catch (error) {
      console.error('Document upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuickReplies = () => {
    if (session.stage === 'SALES' && !session.loanRequest.amount) {
      return ['3 lakhs', '5 lakhs', '7 lakhs'];
    }
    if (session.stage === 'SALES' && !session.loanRequest.tenure) {
      return ['12 months', '24 months', '36 months'];
    }
    if (session.stage === 'DECISION' && session.underwritingResult?.decision === 'APPROVED') {
      return ['Yes, generate sanction letter', 'Tell me more about EMI'];
    }
    return [];
  };

  // Check if document upload is needed
  const needsDocumentUpload = session.stage === 'DOCUMENT_UPLOAD';

  const quickReplies = getQuickReplies();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-lg bg-white/10 border-b border-white/20 shadow-xl sticky top-0">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-semibold text-white truncate">
                    LoanKit AI Assistant
                  </h1>
                  <p className="text-xs sm:text-sm text-blue-200 truncate">
                    {user ? `Helping ${user.name}` : 'Personal Loan Assistant'}
                  </p>
                </div>
              </div>
            </div>

            {session.underwritingResult?.decision === 'APPROVED' && (
              <button
                onClick={handleDownloadSanctionLetter}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold shadow-lg shadow-green-500/50 hover:shadow-green-500/70 hover:scale-105 transition-all disabled:opacity-50 text-sm w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download Letter</span>
                <span className="sm:hidden">Download</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Progress Tracker */}
      <div className="relative z-10">
        <ProgressTracker currentStage={session.stage} session={session} />
      </div>

      {/* Chat Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
          <div className="space-y-4 sm:space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {typing && (
              <div className="flex items-start gap-3 animate-slide-up">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl px-4 py-3 shadow-xl">
                  <div className="typing-indicator flex gap-1">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {/* Document Upload Section */}
            {needsDocumentUpload && (
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 animate-slide-up shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="w-5 h-5 text-blue-300" />
                  <h3 className="font-semibold text-white">Document Verification Required</h3>
                </div>
                <p className="text-sm text-blue-200 mb-4">
                  Since your loan amount of ₹{session.loanRequest?.amount?.toLocaleString('en-IN')} exceeds your pre-approved limit of ₹{session.customer?.preApprovedLimit?.toLocaleString('en-IN')}, please upload the required documents for verification.
                </p>
                <DocumentUpload
                  documentType="Salary Slip / Bank Statement"
                  onUploadComplete={handleDocumentUpload}
                  required={true}
                />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Quick Replies */}
      {quickReplies.length > 0 && !typing && (
        <div className="relative z-10 backdrop-blur-lg bg-white/5 border-t border-white/20 py-3">
          <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
            <p className="text-xs sm:text-sm text-blue-200 mb-2">Quick replies:</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  disabled={loading}
                  className="px-3 sm:px-4 py-2 backdrop-blur-lg bg-white/10 border border-white/20 text-white rounded-full text-xs sm:text-sm font-medium hover:bg-white/20 transition-all disabled:opacity-50 hover:scale-105"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="relative z-10 backdrop-blur-lg bg-white/10 border-t border-white/20 shadow-2xl">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 max-w-4xl">
          <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-lg bg-white/10 border border-white/20 text-white placeholder-blue-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 disabled:opacity-50 transition-all text-sm sm:text-base"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
