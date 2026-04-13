import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface SignaalLayoutProps {
  children: ReactNode;
  className?: string;
  hideNav?: boolean;
}

const SignaalLayout = ({ children, className = "", hideNav = false }: SignaalLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isJourney = location.pathname === "/signaal/journey";
  const isStart = location.pathname === "/signaal/start";

  return (
    <div className={`signaal-theme h-screen flex flex-col bg-[#0A0A0B] text-[#F0F0EE] ${className}`}>
      {!hideNav && !isStart && (
        <nav className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-[#1E1E22] bg-[#0A0A0B]/90 backdrop-blur-sm">
          <button
            onClick={() => navigate(isJourney ? "/signaal" : -1 as any)}
            className="flex items-center gap-2 text-xs text-[#6B6B72] hover:text-[#F0F0EE] transition-colors font-['DM_Sans']"
          >
            <ArrowLeft className="w-4 h-4" />
            {isJourney ? "Signaal" : "Terug"}
          </button>
          <span className="font-mono text-[10px] tracking-widest text-[#E8FF47]/60 uppercase">
            Signaal
          </span>
          <div className="w-16" /> {/* spacer */}
        </nav>
      )}
      {children}
    </div>
  );
};

export default SignaalLayout;
