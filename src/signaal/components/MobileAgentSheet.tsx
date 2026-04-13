import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import AgentPanel from "./AgentPanel";

interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface MobileAgentSheetProps {
  messages: AgentMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const MobileAgentSheet = ({ messages, isLoading, onSendMessage }: MobileAgentSheetProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 w-12 h-12 bg-[#E8FF47] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(232,255,71,0.3)]"
        >
          <MessageCircle className="w-5 h-5 text-[#0A0A0B]" />
          {messages.length > 1 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#0A0A0B] border border-[#E8FF47] rounded-full text-[10px] text-[#E8FF47] flex items-center justify-center font-mono">
              {messages.length}
            </span>
          )}
        </button>
      )}

      {/* Bottom sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0B] rounded-t-2xl border-t border-[#1E1E22] flex flex-col"
              style={{ height: "75vh" }}
            >
              {/* Handle + close */}
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <div className="w-10 h-1 bg-[#1E1E22] rounded-full mx-auto" />
                <button onClick={() => setOpen(false)} className="absolute right-4 top-3">
                  <X className="w-4 h-4 text-[#6B6B72]" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <AgentPanel messages={messages} isLoading={isLoading} onSendMessage={onSendMessage} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileAgentSheet;
