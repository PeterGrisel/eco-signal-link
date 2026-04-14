import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

const WhatsAppButton = () => {
  const location = useLocation();
  const phone = "31852502925";
  const url = `https://wa.me/${phone}`;

  if (location.pathname.startsWith("/signaal")) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
};

export default WhatsAppButton;
