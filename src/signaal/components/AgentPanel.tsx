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
    <div className="w-full lg:w-[300px] shrink-0 lg:border-l border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-2">
        <h3 className="font-display text-sm text-foreground">Systeem Agent</h3>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
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
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'bg-card text-foreground border border-border'
              }`}>
                {msg.role === 'assistant' && (
                  <span className="text-[10px] font-mono text-muted-foreground block mb-1">SA</span>
                )}
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border px-3 py-2 rounded-lg">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[hsl(30, 10%, 55%)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[hsl(30, 10%, 55%)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[hsl(30, 10%, 55%)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Stel een vraag..."
            className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 font-body"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-3 py-2 bg-primary text-[hsl(0, 0%, 7%)] rounded-lg text-xs font-medium disabled:opacity-30 hover:bg-primary/90 transition-colors font-body"
          >
            →
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentPanel;
