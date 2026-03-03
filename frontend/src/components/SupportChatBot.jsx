import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Minimize2, Maximize2 } from 'lucide-react';

const SupportChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Hi! I'm your 24/7 LoanKit support assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatWidgetRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  // Quick response templates
  const quickResponses = [
    { text: "How do I apply for a loan?", category: "application" },
    { text: "Track my application", category: "tracking" },
    { text: "Required documents", category: "documents" },
    { text: "Contact support", category: "contact" }
  ];

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Application process
    if (message.includes('apply') || message.includes('application') || message.includes('how to')) {
      return "To apply for a loan:\n\n1. Click 'Start New Application' on the dashboard\n2. Chat with our AI agent to discuss your needs\n3. Upload required documents\n4. Receive instant pre-approval decision\n\nThe entire process takes just 5-10 minutes! 🚀";
    }
    
    // Tracking
    if (message.includes('track') || message.includes('status') || message.includes('check')) {
      return "You can track your application status in your Dashboard. Simply:\n\n1. Go to Dashboard from the main menu\n2. View all your applications and their current status\n3. Click on any application for detailed information\n\nApproved loans will show next steps! ✅";
    }
    
    // Documents
    if (message.includes('document') || message.includes('upload') || message.includes('required') || message.includes('need')) {
      return "Required documents for loan application:\n\n📄 Government-issued ID\n📄 Proof of income (pay stubs/tax returns)\n📄 Bank statements (last 3 months)\n📄 Employment verification\n\nYou can upload documents during the chat process or from your dashboard!";
    }
    
    // Contact
    if (message.includes('contact') || message.includes('email') || message.includes('phone') || message.includes('human')) {
      return "Need human assistance? We're here for you!\n\n📞 Phone: 1-800-LOANKIT\n📧 Email: support@loankit.ai\n💬 Live Chat: Available Mon-Fri, 9 AM - 6 PM EST\n\nFor immediate help, I'm available 24/7! Feel free to ask me anything. 😊";
    }
    
    // Interest rates
    if (message.includes('rate') || message.includes('interest') || message.includes('apr')) {
      return "Our interest rates are competitive and personalized:\n\n💰 Rates start from 4.99% APR\n📊 Final rate based on credit profile\n⚡ Instant pre-approval shows your rate\n🎯 No impact on credit score for checking\n\nStart an application to see your personalized rate!";
    }
    
    // Approval time
    if (message.includes('long') || message.includes('time') || message.includes('quick') || message.includes('fast')) {
      return "We pride ourselves on speed! ⚡\n\n⏱️ Pre-approval: Instant (during chat)\n📝 Document review: 1-2 hours\n✅ Final approval: Same business day\n💵 Fund disbursement: 1-3 business days\n\nMost customers complete the application in under 10 minutes!";
    }
    
    // Amount
    if (message.includes('much') || message.includes('amount') || message.includes('qualify')) {
      return "Loan amounts are flexible! 💵\n\n💰 Personal Loans: $1,000 - $50,000\n🏠 Home Loans: $50,000 - $500,000\n🚗 Auto Loans: $5,000 - $100,000\n💼 Business Loans: $10,000 - $250,000\n\nYour eligible amount depends on income, credit score, and loan type. Start an application to find out!";
    }
    
    // Eligibility
    if (message.includes('eligible') || message.includes('qualify') || message.includes('requirements')) {
      return "Basic eligibility requirements:\n\n✅ Age 18 or older\n✅ Valid government ID\n✅ Steady income source\n✅ Active bank account\n✅ U.S. resident or citizen\n\nEven with less-than-perfect credit, you may still qualify. Let's find out together!";
    }
    
    // Credit score
    if (message.includes('credit') || message.includes('score') || message.includes('poor credit') || message.includes('bad credit')) {
      return "We work with all credit profiles! 📊\n\n💚 Excellent (750+): Best rates\n💛 Good (700-749): Great rates\n🧡 Fair (650-699): Competitive rates\n❤️ Building (below 650): Still options available!\n\n✨ Checking eligibility won't hurt your credit score. Start your application today!";
    }
    
    // Help/General
    if (message.includes('help') || message.includes('hi') || message.includes('hello') || message.includes('hey')) {
      return "I'm here to help! 😊 I can assist you with:\n\n🎯 Loan application process\n📊 Tracking your application\n📄 Required documents\n💰 Rates and terms\n⚡ Approval timeline\n📞 Contact information\n\nWhat would you like to know?";
    }
    
    // Thanks
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! 😊 Is there anything else I can help you with today?";
    }
    
    // Default response
    return "I'd be happy to help with that! For specific questions, you can:\n\n💬 Ask about loan application process\n📊 Check application status\n📄 Learn about required documents\n💰 Get information on rates and terms\n📞 Contact our support team\n\nWhat information are you looking for?";
  };

  const handleSendMessage = (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Simulate bot typing
    setTyping(true);
    setTimeout(() => {
      const botResponse = getBotResponse(messageText);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
    }, 800);
  };

  const handleQuickResponse = (text) => {
    handleSendMessage(text);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = (e) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  const maximizeChat = (e) => {
    e.stopPropagation();
    setIsMinimized(false);
  };

  const closeChat = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group animate-bounce-slow"
          aria-label="Open support chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            !
          </span>
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            24/7 Support Available
          </div>
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div
          ref={chatWidgetRef}
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
          } flex flex-col overflow-hidden border border-gray-200`}
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="w-8 h-8" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">LoanKit Support</h3>
                <p className="text-xs text-blue-100">Online • 24/7 Available</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isMinimized && (
                <button
                  onClick={minimizeChat}
                  className="hover:bg-white/20 p-1 rounded transition"
                  aria-label="Minimize chat"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              )}
              {isMinimized && (
                <button
                  onClick={maximizeChat}
                  className="hover:bg-white/20 p-1 rounded transition"
                  aria-label="Maximize chat"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={closeChat}
                className="hover:bg-white/20 p-1 rounded transition"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm'
                          : 'bg-white text-gray-800 shadow-md rounded-bl-sm border border-gray-100'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <span className={`text-xs mt-1 block ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {typing && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 shadow-md rounded-2xl rounded-bl-sm p-3 border border-gray-100">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Responses */}
              {messages.length <= 1 && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickResponses.map((response, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickResponse(response.text)}
                        className="text-xs bg-white border border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 px-3 py-1.5 rounded-full transition-all duration-200"
                      >
                        {response.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
                <p className="text-xs text-gray-400 text-center mt-2">
                  We typically reply instantly
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SupportChatBot;
