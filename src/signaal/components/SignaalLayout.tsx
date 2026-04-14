import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Sun, Moon } from "lucide-react";

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

  const [light, setLight] = useState(() => localStorage.getItem("signaal_light") === "true");

  useEffect(() => {
    localStorage.setItem("signaal_light", String(light));
  }, [light]);

  return (
    <div className={`signaal-theme ${light ? "signaal-light" : ""} h-screen flex flex-col bg-background text-foreground ${className}`}>
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
          <button
            onClick={() => setLight(prev => !prev)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label={light ? "Donkere modus" : "Lichte modus"}
          >
            {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </nav>
      )}
      {children}
    </div>
  );
};

export default SignaalLayout;
