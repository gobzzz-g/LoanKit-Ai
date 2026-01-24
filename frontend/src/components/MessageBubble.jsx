import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex items-start gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-primary-600' : 'bg-primary-100'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-primary-600" />
        )}
      </div>
      
      {/* Message */}
      <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-agent'} ${
        message.error ? 'border-red-300 bg-red-50' : ''
      }`}>
        <div className={`text-sm ${isUser ? 'text-white' : 'text-gray-800'} whitespace-pre-wrap`}>
          {isUser ? (
            message.text
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
              }}
            >
              {message.text}
            </ReactMarkdown>
          )}
        </div>
        <div className={`text-xs mt-1 ${isUser ? 'text-primary-100' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
