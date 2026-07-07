import { usePortal } from "./PortalContext";
import { PageHeader } from "./PageHeader";

export default function Settings() {
  const { session, memberships, currentOrgId, isRebelForce } = usePortal();
  const org = memberships.find((m) => m.organization_id === currentOrgId)?.organization;
  const role = memberships.find((m) => m.organization_id === currentOrgId)?.role;

  return (
    <div>
      <PageHeader eyebrow="Instellingen" title="Uw account" subtitle="Beheer uw profiel en zie welke rol u heeft in deze omgeving." />
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display font-bold text-foreground mb-4">Profiel</h3>
          <dl className="space-y-3 text-sm">
            <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</dt><dd className="text-foreground">{session?.user.email}</dd></div>
            <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Rol</dt><dd className="text-foreground">{role}</dd></div>
          </dl>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display font-bold text-foreground mb-4">Organisatie</h3>
          <dl className="space-y-3 text-sm">
            <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Naam</dt><dd className="text-foreground">{org?.name}</dd></div>
            <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Pakket</dt><dd className="text-foreground">{org?.package ?? "—"}</dd></div>
            <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Toegang</dt><dd className="text-foreground">{isRebelForce ? "Rebel Force operations" : "Klant"}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}