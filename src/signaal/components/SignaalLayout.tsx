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
    <div className={`signaal-theme h-screen flex flex-col bg-background text-foreground ${className}`}>
      {!hideNav && !isStart && (
        <nav className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-border bg-background/90 backdrop-blur-sm">
          <button
            onClick={() => navigate(isJourney ? "/signaal" : -1 as any)}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            {isJourney ? "Signaal" : "Terug"}
          </button>
          <span className="font-mono text-[10px] tracking-widest text-primary/60 uppercase">
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
