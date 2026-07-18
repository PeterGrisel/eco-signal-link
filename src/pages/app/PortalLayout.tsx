import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { PortalProvider, usePortal, useRequireAuth } from "./PortalContext";
import {
  LayoutDashboard, ListChecks, Radio, Target, Megaphone, BarChart3, HeadphonesIcon, Settings, LogOut, Building2,
  ClipboardCheck, Workflow,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarProvider, SidebarTrigger, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const nav = [
  { to: "/app", label: "Mijn Groeimachine", icon: LayoutDashboard, end: true },
  { to: "/app/onboarding", label: "Onboarding", icon: ListChecks },
  { to: "/app/signalen", label: "Signalen", icon: Radio },
  { to: "/app/sales-acties", label: "Sales acties", icon: Target },
  { to: "/app/goedkeuringen", label: "Goedkeuringen", icon: ClipboardCheck },
  { to: "/app/runs", label: "Workflow runs", icon: Workflow },
  { to: "/app/campagnes", label: "Campagnes", icon: Megaphone },
  { to: "/app/resultaten", label: "Resultaten", icon: BarChart3 },
  { to: "/app/service", label: "Service", icon: HeadphonesIcon },
  { to: "/app/instellingen", label: "Instellingen", icon: Settings },
];

function Shell() {
  const { session, loading } = useRequireAuth();
  const { memberships, currentOrgId, setCurrentOrgId, signOut } = usePortal();
  const navigate = useNavigate();

  if (loading || !session) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Laden…</div>;
  }

  if (!currentOrgId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Geen organisatie gekoppeld</h2>
          <p className="text-sm text-muted-foreground mb-4">Uw account is nog niet aan een organisatie gekoppeld.<br />Neem contact op met Rebel Force.</p>
          <button onClick={() => { signOut(); navigate("/app/login"); }} className="text-primary underline text-sm">Uitloggen</button>
        </div>
      </div>
    );
  }

  const currentOrg = memberships.find((m) => m.organization_id === currentOrgId)?.organization;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">Portal</p>
                <p className="text-sm font-display font-bold text-foreground truncate">B2BGroeimachine</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {nav.map((n) => (
                    <SidebarMenuItem key={n.to}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={n.to}
                          end={n.end}
                          className={({ isActive }) =>
                            `flex items-center gap-2 ${isActive ? "bg-primary/10 text-primary font-semibold" : ""}`
                          }
                        >
                          <n.icon className="h-4 w-4" />
                          <span>{n.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-border p-3">
            <button
              onClick={async () => { await signOut(); navigate("/app/login"); }}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Uitloggen
            </button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border flex items-center justify-between px-4 gap-3 bg-background/80 backdrop-blur sticky top-0 z-30">
            <div className="flex items-center gap-3 min-w-0">
              <SidebarTrigger />
              <div className="min-w-0 hidden sm:block">
                <p className="text-xs text-muted-foreground">Organisatie</p>
                <p className="text-sm font-display font-semibold text-foreground truncate">{currentOrg?.name}</p>
              </div>
            </div>
            {memberships.length > 1 && (
              <Select value={currentOrgId} onValueChange={setCurrentOrgId}>
                <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {memberships.map((m) => (
                    <SelectItem key={m.organization_id} value={m.organization_id}>{m.organization.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </header>
          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function PortalLayout() {
  return (
    <PortalProvider>
      <Shell />
    </PortalProvider>
  );
}