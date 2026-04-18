import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bot, Sparkles, Loader2, Send } from 'lucide-react';
import API from '../api/api';

const ScanovaAI = () => {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const savedHistory = localStorage.getItem('SCANOVA_chat_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      setHistory([{
        role: 'model',
        parts: [{ text: `Hello ${user?.name?.split(' ')[0] || 'there'}! ✨ I'm SCANOVA AI, your personal attendance assistant.\n\nYou can ask me:\n• Your current attendance percentage\n• How many classes you can skip safely\n• Study tips or university queries\n\nHow can I help you today?` }]
      }]);
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('SCANOVA_chat_history', JSON.stringify(history));
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const clearChat = () => {
    const initialMessage = {
      role: 'model',
      parts: [{ text: `History cleared. How else can I help you, ${user?.name?.split(' ')[0] || 'there'}?` }]
    };
    setHistory([initialMessage]);
    localStorage.setItem('SCANOVA_chat_history', JSON.stringify([initialMessage]));
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setPrompt('');
    const updatedHistory = [...history, { role: 'user', parts: [{ text: userMessage }] }];
    setHistory(updatedHistory);
    setIsLoading(true);

    const contextData = `
      The user is ${user?.name || 'a student'}.
      Email: ${user?.email}.
      Role: ${user?.role}.
      Student ID: ${user?.student_id || 'Unknown'}.
      Overall Attendance: 82%. Attended 34 of 42 classes so far.
      If asked about attendance, state these numbers directly without asking for their ID.
    `;

    try {
      const response = await API.post('/chat/ask', {
        prompt: userMessage,
        history: history.map(h => ({ role: h.role, parts: h.parts })),
        contextData
      });

      if (response.data?.history) {
        setHistory(response.data.history);
      } else {
        const errorMsg = { role: 'model', parts: [{ text: "I'm having trouble connecting right now. Please try again shortly." }] };
        setHistory([...updatedHistory, errorMsg]);
      }
    } catch (err) {
      const errorMsg = { role: 'model', parts: [{ text: "My systems are currently offline. Please check your connection." }] };
      setHistory([...updatedHistory, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "What is my attendance percentage?",
    "How many classes can I still miss?",
    "Give me tips to improve my attendance",
  ];

  return (
    <div className="flex flex-col h-[calc(100dvh-7rem)] md:h-[calc(100vh-8rem)] max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Bot size={28} className="text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-400 rounded-full border-2 border-[#050504] animate-pulse" />
        </div>
        <div>
          <div className="flex items-center justify-between group/header">
            <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-white bg-clip-text text-transparent italic tracking-tighter uppercase">
              SCANOVA AI
            </h1>
            <button 
              onClick={clearChat}
              className="text-[10px] font-bold text-gray-500 hover:text-red-400 transition-colors uppercase tracking-widest opacity-0 group-hover/header:opacity-100"
            >
              Clear History
            </button>
          </div>
          <p className="text-gray-500 text-sm font-medium italic">Your personal academic intelligence assistant</p>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 glass-card flex flex-col overflow-hidden border-t-4 border-t-emerald-500/70 relative">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {history.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && (
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                  <Sparkles size={12} className="text-white" />
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                  ? 'bg-emerald-600/40 text-emerald-100 rounded-br-sm'
                  : 'bg-white/8 text-gray-200 rounded-bl-sm border border-white/5'
                }`}>
                {msg.role === 'model' && (
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">SCANOVA AI</span>
                )}
                <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <Sparkles size={12} className="text-white animate-spin" />
              </div>
              <div className="bg-white/8 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-3">
                <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">SCANOVA AI</span>
                <Loader2 size={14} className="animate-spin text-teal-400" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts */}
        {history.length <= 1 && (
          <div className="px-6 pb-3 flex flex-wrap gap-2">
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                onClick={() => setPrompt(q)}
                className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 hover:bg-teal-500/20 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleAskAI} className="p-4 border-t border-white/8 bg-black/20 flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask SCANOVA anything..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 text-sm transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-30 disabled:cursor-not-allowed p-3 rounded-xl text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScanovaAI;

