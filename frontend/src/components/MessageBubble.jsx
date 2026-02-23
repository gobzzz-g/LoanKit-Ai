import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex items-start gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
        isUser 
          ? 'bg-gradient-to-r from-purple-500 to-pink-600' 
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      
      {/* Message */}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-xl ${
        isUser 
          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white ml-auto' 
          : 'backdrop-blur-lg bg-white/10 border border-white/20 text-white'
      } ${message.error ? 'border-red-400/50 bg-red-500/20' : ''}`}>
        <div className={`text-sm whitespace-pre-wrap ${isUser ? 'text-white' : 'text-white'}`}>
          {isUser ? (
            message.text
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-blue-100">{children}</strong>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
              }}
            >
              {message.text}
            </ReactMarkdown>
          )}
        </div>
        <div className={`text-xs mt-1 ${isUser ? 'text-purple-100' : 'text-blue-200'}`}>
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
