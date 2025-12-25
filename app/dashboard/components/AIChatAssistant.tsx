'use client';

import { useState, useRef, useEffect } from 'react';
import { azureAIService } from '@/services/AzureAIService'; // Keep for type if needed? Or remove. We use actions now.
import { chatWithDataAction } from '@/app/actions/ai';
import { azureService } from '@/lib/azureDefaults';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I am your StockHealth AI assistant. Ask me anything about your inventory.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Server generates context automatically now
      const response = await chatWithDataAction(userMsg.content);
      
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
        console.error("Chat Error", e);
        setMessages(prev => [...prev, { id: 'error', role: 'assistant', content: "Sorry, I encountered an error." }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Identify critical stock",
    "What expires soon?",
    "Summarize inventory",
    "Suggest reorders"
  ];

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 ${isOpen ? 'w-full max-w-sm' : 'w-auto'}`}>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300" style={{ height: '500px' }}>
          {/* Header */}
          <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-400">smart_toy</span>
              <h3 className="font-bold text-sm">StockHealth AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-neutral-50 dark:bg-neutral-950/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-neutral-900 rounded-br-none font-medium' 
                    : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-bl-none shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-white dark:bg-neutral-800 p-3 rounded-2xl rounded-bl-none border border-neutral-200 dark:border-neutral-700 shadow-sm flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-150"></div>
                    <span className="text-xs text-neutral-400 ml-1">Thinking...</span>
                 </div>
              </div>
            )}
            
            {/* Suggestions (Show only when not loading) */}
            {!loading && messages.length < 3 && (
                <div className="flex flex-wrap gap-2 mt-4 justify-end">
                    {suggestions.map((s) => (
                        <button 
                            key={s} 
                            onClick={() => handleSend(s)}
                            className="text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:border-primary/50 transition-colors text-neutral-600 dark:text-neutral-300"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
            
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
             <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-3 py-2 rounded-full border border-transparent focus-within:border-primary transition-all">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about inventory..."
                  className="flex-1 bg-transparent outline-none text-sm text-neutral-800 dark:text-white placeholder:text-neutral-500"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-neutral-900 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-14 h-14 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">chat_spark</span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-neutral-900 animate-pulse"></span>
      </button>
      )}
    </div>
  );
}
