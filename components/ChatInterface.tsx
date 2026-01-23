
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatInterfaceProps {
  onCommand?: (command: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onCommand }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      content: 'System ready. I am your Phase IV Deployment Assistant. You can use **Gordon** for Docker, **kubectl-ai** for K8s deployments, or **Kagent** for cluster analysis.', 
      type: 'status' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: input, type: 'text' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const prompt = `You are a Phase IV DevOps Assistant. Use Gordon/kubectl-ai/Kagent knowledge. Context: Local K8s deployment on Minikube with Helm. Respond briefly and act as an AI agent. If the user gives a command like "deploy", acknowledge it as kubectl-ai. User said: ${input}`;
      const response = await sendMessageToGemini(input, prompt);
      
      const modelMessage: ChatMessage = { 
        role: 'model', 
        content: response || 'Operation acknowledged.', 
        type: input.toLowerCase().includes('kubectl') || input.toLowerCase().includes('docker') ? 'command' : 'text' 
      };
      setMessages(prev => [...prev, modelMessage]);

      if (onCommand && (input.toLowerCase().startsWith('kubectl') || input.toLowerCase().startsWith('docker') || input.toLowerCase().startsWith('kagent'))) {
        onCommand(input);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: 'Error connecting to the AI grid.', type: 'status' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-sm font-semibold text-slate-200">AI DevOps Terminal</span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : msg.type === 'command'
                  ? 'bg-slate-800 border border-blue-500/50 text-blue-300'
                  : 'bg-slate-800 text-slate-300'
            }`}>
              {msg.type === 'command' && <span className="block text-[10px] uppercase font-bold text-blue-500 mb-1">Execution Pipeline</span>}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-lg p-3 text-slate-500 animate-pulse">
              Agent thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-slate-800/80 border-t border-slate-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="kubectl-ai 'scale deployment'..."
            className="w-full bg-slate-950 border border-slate-600 rounded-lg py-2 pl-4 pr-12 focus:outline-none focus:border-blue-500 text-slate-200 font-mono transition-colors"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400 disabled:text-slate-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
