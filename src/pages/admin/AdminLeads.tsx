import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Mail, Phone, Building2, Clock, Loader2, Inbox } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  selected_package: Record<string, unknown> | null;
  created_at: string;
}

export const LeadsTabContent = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Fout", description: error.message, variant: "destructive" });
    } else {
      setLeads((data as Lead[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) {
      toast({ title: "Fout", description: error.message, variant: "destructive" });
    } else {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast({ title: "Lead verwijderd" });
    }
    setDeleting(null);
  };

  const formatPackage = (pkg: Record<string, unknown> | null) => {
    if (!pkg || Object.keys(pkg).length === 0) return null;
    const parts: string[] = [];
    if (pkg.engagement) parts.push(`${pkg.engagement}u engagement`);
    if (pkg.period) parts.push(`${pkg.period} mnd`);
    if (pkg.datahub) parts.push("DataHub");
    if (pkg.recruitment) parts.push("Recruitment");
    if (pkg.salesMgmt) parts.push("Sales Mgmt");
    if (pkg.monthlyTotal) parts.push(`€${pkg.monthlyTotal}/mo`);
    return parts.length > 0 ? parts.join(" · ") : null;
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl">Leads</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Contactformulier inzendingen · {leads.length} totaal
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchLeads} disabled={loading}>
            Vernieuwen
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20">
            <Inbox className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Nog geen leads ontvangen</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => {
              const pkgStr = formatPackage(lead.selected_package);
              return (
                <div
                  key={lead.id}
                  className="bg-card border border-border rounded-lg p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-base">{lead.name}</h3>
                        {pkgStr && (
                          <Badge variant="secondary" className="text-[10px]">
                            {pkgStr}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <a href={`mailto:${lead.email}`} className="hover:text-foreground transition-colors">
                            {lead.email}
                          </a>
                        </span>
                        {lead.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <a href={`tel:${lead.phone}`} className="hover:text-foreground transition-colors">
                              {lead.phone}
                            </a>
                          </span>
                        )}
                        {lead.company && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {lead.company}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(lead.created_at), "d MMM yyyy · HH:mm", { locale: nl })}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => handleDelete(lead.id)}
                      disabled={deleting === lead.id}
                    >
                      {deleting === lead.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {lead.message}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

const AdminLeads = () => (
  <AdminLayout><LeadsTabContent /></AdminLayout>
);

export default AdminLeads;
