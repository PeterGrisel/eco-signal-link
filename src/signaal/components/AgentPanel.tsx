import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AgentPanelProps {
  messages: AgentMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const AgentPanel = ({ messages, isLoading, onSendMessage }: AgentPanelProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="w-full lg:w-[300px] shrink-0 lg:border-l border-[#1E1E22] h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#1E1E22] flex items-center gap-2">
        <h3 className="font-['DM_Serif_Display'] text-sm text-[#F0F0EE]">Systeem Agent</h3>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8FF47] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E8FF47]" />
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#E8FF47]/10 text-[#E8FF47] border border-[#E8FF47]/20'
                  : 'bg-[#111113] text-[#F0F0EE] border border-[#1E1E22]'
              }`}>
                {msg.role === 'assistant' && (
                  <span className="text-[10px] font-mono text-[#6B6B72] block mb-1">SA</span>
                )}
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#111113] border border-[#1E1E22] px-3 py-2 rounded-lg">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#6B6B72] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#6B6B72] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#6B6B72] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[#1E1E22]">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Stel een vraag..."
            className="flex-1 bg-[#111113] border border-[#1E1E22] rounded-lg px-3 py-2 text-xs text-[#F0F0EE] placeholder:text-[#6B6B72] focus:outline-none focus:border-[#E8FF47]/40 font-['DM_Sans']"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-3 py-2 bg-[#E8FF47] text-[#0A0A0B] rounded-lg text-xs font-medium disabled:opacity-30 hover:bg-[#E8FF47]/90 transition-colors font-['DM_Sans']"
          >
            →
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentPanel;
