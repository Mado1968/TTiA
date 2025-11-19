import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage, ChatRole } from '../types';

export const Contact: React.FC = () => {
  // Contact Form State
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  
  // Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: ChatRole.MODEL, text: "Hello! I'm TTiA's AI Assistant. Ask me anything about our services or how we can help transform your business." }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatOpen) scrollToBottom();
  }, [messages, chatOpen]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isThinking) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: ChatRole.USER, text: userMsg }]);
    setIsThinking(true);

    const responseText = await sendChatMessage(userMsg);

    setMessages(prev => [...prev, { role: ChatRole.MODEL, text: responseText }]);
    setIsThinking(false);
  };

  return (
    <div className="relative bg-ttia-darker py-24">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16">
        
        {/* Traditional Contact Form */}
        <div>
          <h2 className="text-4xl font-display font-bold text-ttia-cream mb-4">Get in Touch</h2>
          <p className="text-ttia-cream/60 mb-8">
            Ready to start your digital transformation? Fill out the form or chat with our AI to learn more immediately.
          </p>

          {formStatus === 'success' ? (
            <div className="bg-ttia-green/10 border border-ttia-green text-ttia-green p-6 rounded-xl">
              <h3 className="font-bold text-xl mb-2">Message Sent!</h3>
              <p>Thank you for contacting TTiA. Our team will get back to you within 24 hours.</p>
              <button onClick={() => setFormStatus('idle')} className="mt-4 text-sm underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ttia-cream/70">Name</label>
                  <input required type="text" className="w-full bg-ttia-dark border border-ttia-cream/10 rounded-lg px-4 py-3 text-ttia-cream focus:border-ttia-orange focus:ring-1 focus:ring-ttia-orange outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ttia-cream/70">Email</label>
                  <input required type="email" className="w-full bg-ttia-dark border border-ttia-cream/10 rounded-lg px-4 py-3 text-ttia-cream focus:border-ttia-orange focus:ring-1 focus:ring-ttia-orange outline-none transition-all" placeholder="john@company.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-ttia-cream/70">Service Interest</label>
                <select className="w-full bg-ttia-dark border border-ttia-cream/10 rounded-lg px-4 py-3 text-ttia-cream focus:border-ttia-orange focus:ring-1 focus:ring-ttia-orange outline-none transition-all">
                  <option>MCP Server Development</option>
                  <option>Digital Transformation</option>
                  <option>Consulting</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-ttia-cream/70">Message</label>
                <textarea required rows={4} className="w-full bg-ttia-dark border border-ttia-cream/10 rounded-lg px-4 py-3 text-ttia-cream focus:border-ttia-orange focus:ring-1 focus:ring-ttia-orange outline-none transition-all" placeholder="Tell us about your project..."></textarea>
              </div>
              <button 
                disabled={formStatus === 'submitting'}
                type="submit" 
                className="w-full py-4 bg-ttia-green text-ttia-dark font-bold rounded-lg hover:bg-ttia-orange hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {formStatus === 'submitting' ? <Loader2 className="animate-spin" /> : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* AI Assistant Widget Area */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-ttia-orange to-ttia-green rounded-2xl opacity-20 blur-lg"></div>
          <div className="relative bg-ttia-dark rounded-2xl border border-ttia-cream/10 h-[600px] flex flex-col overflow-hidden">
            
            {/* Chat Header */}
            <div className="p-6 border-b border-ttia-cream/10 bg-ttia-dark flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-ttia-orange to-ttia-green flex items-center justify-center text-white">
                   <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-ttia-cream">TTiA AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-ttia-cream/60">Online • gemini-2.5-flash</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === ChatRole.USER ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === ChatRole.USER 
                        ? 'bg-ttia-orange text-white rounded-tr-none' 
                        : 'bg-ttia-darker border border-ttia-cream/10 text-ttia-cream rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isThinking && (
                 <div className="flex justify-start">
                   <div className="bg-ttia-darker border border-ttia-cream/10 p-4 rounded-2xl rounded-tl-none flex gap-2 items-center">
                     <span className="w-2 h-2 bg-ttia-cream/40 rounded-full animate-bounce"></span>
                     <span className="w-2 h-2 bg-ttia-cream/40 rounded-full animate-bounce delay-100"></span>
                     <span className="w-2 h-2 bg-ttia-cream/40 rounded-full animate-bounce delay-200"></span>
                   </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-ttia-darker border-t border-ttia-cream/10">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about our services..." 
                  className="flex-1 bg-ttia-dark border border-ttia-cream/10 rounded-xl px-4 py-3 text-ttia-cream focus:border-ttia-green outline-none transition-all"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isThinking || !input.trim()}
                  className="p-3 bg-ttia-cream text-ttia-dark rounded-xl hover:bg-ttia-green hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};