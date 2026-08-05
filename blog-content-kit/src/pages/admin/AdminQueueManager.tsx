import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Search,
  ListChecks,
  Calendar,
} from "lucide-react";

type QueueStatus =
  | "pending"
  | "approved"
  | "declined"
  | "generating"
  | "published"
  | "failed";

interface QueueRow {
  id: string;
  headline: string;
  keyword: string | null;
  status: QueueStatus;
  scheduled_date: string | null;
  created_at: string;
  content_type: string;
}

type ManagedStatus = "pending" | "approved" | "declined";

const managedLabels: Record<ManagedStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    icon: <Clock className="w-3 h-3" />,
  },
  approved: {
    label: "Actief",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  declined: {
    label: "Skip",
    color: "bg-muted text-muted-foreground border-border",
    icon: <XCircle className="w-3 h-3" />,
  },
};

const readOnlyLabels: Partial<Record<QueueStatus, { label: string; color: string }>> = {
  generating: { label: "Genereren", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  published: { label: "Gepubliceerd", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  failed: { label: "Mislukt", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const isManaged = (s: QueueStatus): s is ManagedStatus =>
  s === "pending" || s === "approved" || s === "declined";

export const QueueManagerTabContent = () => {
  const [rows, setRows] = useState<QueueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | ManagedStatus>("all");
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_queue")
      .select("id, headline, keyword, status, scheduled_date, created_at, content_type")
      .order("scheduled_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Laden mislukt", description: error.message, variant: "destructive" });
    } else if (data) {
      setRows(data as QueueRow[]);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !r.headline.toLowerCase().includes(q) &&
          !(r.keyword || "").toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rows, filter, search]);

  const counts = useMemo(
    () => ({
      all: rows.length,
      pending: rows.filter((r) => r.status === "pending").length,
      approved: rows.filter((r) => r.status === "approved").length,
      declined: rows.filter((r) => r.status === "declined").length,
    }),
    [rows]
  );

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((r) => selected.has(r.id));

  const toggleAll = () => {
    const next = new Set(selected);
    if (allVisibleSelected) {
      filtered.forEach((r) => next.delete(r.id));
    } else {
      filtered.forEach((r) => next.add(r.id));
    }
    setSelected(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const updateStatus = async (ids: string[], status: ManagedStatus) => {
    if (ids.length === 0) return;
    setUpdating(true);
    const { error } = await supabase
      .from("content_queue")
      .update({ status })
      .in("id", ids);
    if (error) {
      toast({ title: "Bijwerken mislukt", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: `✓ ${ids.length} rij${ids.length === 1 ? "" : "en"} bijgewerkt`,
        description: `Status: ${managedLabels[status].label}`,
      });
      setSelected(new Set());
      fetchRows();
    }
    setUpdating(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-primary" /> Queue Manager
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Vink rijen aan om in bulk te activeren, te skippen of terug op pending te zetten.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { key: "all", label: "Totaal", value: counts.all },
          { key: "pending", label: "Pending", value: counts.pending },
          { key: "approved", label: "Actief", value: counts.approved },
          { key: "declined", label: "Skip", value: counts.declined },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key as "all" | ManagedStatus)}
            className={`p-3 rounded-lg border text-left transition-colors ${
              filter === s.key
                ? "bg-primary/10 border-primary/40"
                : "bg-card border-border hover:border-primary/30"
            }`}
          >
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek op headline of keyword..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {selected.size} geselecteerd
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={selected.size === 0 || updating}
            onClick={() => updateStatus([...selected], "approved")}
            className="gap-1"
          >
            <CheckCircle2 className="w-4 h-4 text-green-400" /> Activeren
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={selected.size === 0 || updating}
            onClick={() => updateStatus([...selected], "pending")}
            className="gap-1"
          >
            <Clock className="w-4 h-4 text-yellow-400" /> Pending
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={selected.size === 0 || updating}
            onClick={() => updateStatus([...selected], "declined")}
            className="gap-1"
          >
            <XCircle className="w-4 h-4 text-muted-foreground" /> Skip
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-card rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Geen rijen gevonden voor dit filter.
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10">
                  <Checkbox
                    checked={allVisibleSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Selecteer alles"
                  />
                </TableHead>
                <TableHead>Headline</TableHead>
                <TableHead className="hidden md:table-cell">Keyword</TableHead>
                <TableHead className="hidden lg:table-cell">Datum</TableHead>
                <TableHead className="w-40">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => {
                const managed = isManaged(row.status);
                const readOnly = readOnlyLabels[row.status];
                return (
                  <TableRow
                    key={row.id}
                    data-state={selected.has(row.id) ? "selected" : undefined}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selected.has(row.id)}
                        onCheckedChange={() => toggleOne(row.id)}
                        disabled={!managed}
                        aria-label={`Selecteer ${row.headline}`}
                      />
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="font-medium text-foreground text-sm truncate">
                        {row.headline}
                      </div>
                      <div className="md:hidden text-xs text-primary font-mono mt-0.5 truncate">
                        {row.keyword || ""}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-primary font-mono">
                      {row.keyword || "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {row.scheduled_date ? (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(row.scheduled_date).toLocaleDateString("nl-NL", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {managed ? (
                        <Select
                          value={row.status}
                          onValueChange={(v) => updateStatus([row.id], v as ManagedStatus)}
                          disabled={updating}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(managedLabels) as ManagedStatus[]).map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">
                                <span className="flex items-center gap-2">
                                  {managedLabels[s].icon}
                                  {managedLabels[s].label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="outline" className={`text-xs ${readOnly?.color}`}>
                          {readOnly?.label || row.status}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {updating && (
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin" /> Bezig met bijwerken...
        </div>
      )}
    </div>
  );
};