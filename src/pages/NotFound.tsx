import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");
    return () => { meta?.remove(); };
  }, [location.pathname]);

  const links = [
    { to: "/", label: "Naar de homepage" },
    { to: "/hoe-het-werkt", label: "Hoe het werkt" },
    { to: "/pricing", label: "Prijzen" },
    { to: "/klanten", label: "Klanten" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <p className="text-sm uppercase tracking-widest text-primary">404</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-foreground">Deze pagina bestaat niet meer.</h1>
        <p className="mt-3 text-muted-foreground">Geen probleem. Kies hieronder waar u verder wilt.</p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:border-primary">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
