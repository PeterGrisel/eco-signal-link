import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { FileText, Globe, Zap, LogOut, Sparkles, Settings, FolderTree, BarChart3, Circle, CalendarDays, Users, Activity, Code2, LayoutDashboard, Menu, X, Search, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { href: "/admin/overview", label: "Command Center", icon: LayoutDashboard },
  { href: "/admin/kpi", label: "KPI Dashboard", icon: BarChart3 },
  { href: "/admin/analytics", label: "Event Analytics", icon: Activity },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/blog", label: "Blog CMS", icon: FileText },
  { href: "/admin/autopilot", label: "Autopilot", icon: Sparkles, showPilotBadge: true },
  { href: "/admin/calendar", label: "Content Kalender", icon: CalendarDays },
  { href: "/admin/taxonomy", label: "Content Strategie", icon: FolderTree },
  { href: "/admin/competitors", label: "Concurrenten", icon: Search },
  { href: "/admin/listings", label: "Listings", icon: Globe },
  { href: "/admin/indexing", label: "Index Rusher", icon: Zap },
  { href: "/admin/scripts", label: "Tracking Scripts", icon: Code2 },
  { href: "/admin/signaal", label: "Signaal", icon: Radio },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { loading, isAdmin } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [autopilotActive, setAutopilotActive] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkAutopilot = async () => {
      const { count } = await supabase
        .from("content_queue")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved");
      setAutopilotActive((count || 0) > 0);
    };
    checkAutopilot();
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Laden...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const NavContent = () => (
    <>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
              {item.showPilotBadge && autopilotActive && (
                <span className="ml-auto flex items-center gap-1 text-[10px] text-green-400 font-semibold">
                  <Circle className="w-2 h-2 fill-green-400 text-green-400 animate-pulse" />
                  LIVE
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start gap-2 text-muted-foreground">
          <LogOut className="w-4 h-4" /> Uitloggen
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      {!isMobile && (
        <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-6 border-b border-border">
            <Link to="/" className="font-display font-bold text-lg">
              <span className="text-foreground">B2B</span>
              <span className="text-primary">Admin</span>
            </Link>
          </div>
          <NavContent />
        </aside>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        {isMobile && (
          <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-border bg-card">
            <Link to="/" className="font-display font-bold text-lg">
              <span className="text-foreground">B2B</span>
              <span className="text-primary">Admin</span>
            </Link>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 flex flex-col">
                <div className="p-6 border-b border-border">
                  <Link to="/" className="font-display font-bold text-lg">
                    <span className="text-foreground">B2B</span>
                    <span className="text-primary">Admin</span>
                  </Link>
                </div>
                <NavContent />
              </SheetContent>
            </Sheet>
          </header>
        )}

        <main className="flex-1 overflow-auto">
          <div className={isMobile ? "p-4" : "p-8"}>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
