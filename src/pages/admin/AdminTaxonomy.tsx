import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  FolderTree,
  GripVertical,
} from "lucide-react";

interface Topic {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  children?: Topic[];
}

interface TopicFormData {
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
}

const defaultForm: TopicFormData = {
  name: "",
  slug: "",
  description: "",
  parent_id: null,
};

function buildTree(topics: Topic[]): Topic[] {
  const map = new Map<string, Topic>();
  const roots: Topic[] = [];

  topics.forEach((t) => map.set(t.id, { ...t, children: [] }));
  topics.forEach((t) => {
    const node = map.get(t.id)!;
    if (t.parent_id && map.has(t.parent_id)) {
      map.get(t.parent_id)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortNodes = (nodes: Topic[]) => {
    nodes.sort((a, b) => a.sort_order - b.sort_order);
    nodes.forEach((n) => n.children && sortNodes(n.children));
  };
  sortNodes(roots);
  return roots;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function countDescendants(topic: Topic): number {
  if (!topic.children?.length) return 0;
  return topic.children.reduce(
    (acc, c) => acc + 1 + countDescendants(c),
    0
  );
}

const TopicNode = ({
  topic,
  depth,
  onEdit,
  onDelete,
  onAddChild,
}: {
  topic: Topic;
  depth: number;
  onEdit: (t: Topic) => void;
  onDelete: (t: Topic) => void;
  onAddChild: (parentId: string) => void;
}) => {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = topic.children && topic.children.length > 0;
  const descendantCount = countDescendants(topic);

  return (
    <div className="group">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div
          className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary/50 transition-colors"
          style={{ paddingLeft: `${depth * 24 + 12}px` }}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />

          {hasChildren ? (
            <CollapsibleTrigger asChild>
              <button className="p-0.5 rounded hover:bg-secondary">
                {open ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </CollapsibleTrigger>
          ) : (
            <span className="w-5" />
          )}

          <span className="font-medium text-sm flex-1">{topic.name}</span>

          {topic.description && (
            <span className="text-xs text-muted-foreground max-w-[200px] truncate hidden md:inline">
              {topic.description}
            </span>
          )}

          {descendantCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {descendantCount} sub
            </Badge>
          )}

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onAddChild(topic.id)}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit(topic)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => onDelete(topic)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {hasChildren && (
          <CollapsibleContent>
            {topic.children!.map((child) => (
              <TopicNode
                key={child.id}
                topic={child}
                depth={depth + 1}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddChild={onAddChild}
              />
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};

const AdminTaxonomy = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [form, setForm] = useState<TopicFormData>(defaultForm);
  const [deleteTarget, setDeleteTarget] = useState<Topic | null>(null);

  const { data: topics = [], isLoading } = useQuery({
    queryKey: ["content_topics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_topics")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Topic[];
    },
  });

  const tree = buildTree(topics);

  const saveMutation = useMutation({
    mutationFn: async (payload: TopicFormData & { id?: string }) => {
      const record = {
        name: payload.name,
        slug: payload.slug,
        description: payload.description || null,
        parent_id: payload.parent_id || null,
      };

      if (payload.id) {
        const { error } = await supabase
          .from("content_topics")
          .update(record)
          .eq("id", payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("content_topics")
          .insert(record);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content_topics"] });
      setDialogOpen(false);
      setEditingTopic(null);
      setForm(defaultForm);
      toast.success("Topic opgeslagen");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("content_topics")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content_topics"] });
      setDeleteTarget(null);
      toast.success("Topic verwijderd");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const openCreate = (parentId: string | null = null) => {
    setEditingTopic(null);
    setForm({ ...defaultForm, parent_id: parentId });
    setDialogOpen(true);
  };

  const openEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setForm({
      name: topic.name,
      slug: topic.slug,
      description: topic.description || "",
      parent_id: topic.parent_id,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return toast.error("Naam is verplicht");
    const slug = form.slug.trim() || slugify(form.name);
    saveMutation.mutate({
      ...form,
      slug,
      id: editingTopic?.id,
    });
  };

  const parentName = form.parent_id
    ? topics.find((t) => t.id === form.parent_id)?.name
    : null;

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold flex items-center gap-2">
              <FolderTree className="w-6 h-6 text-primary" />
              Taxonomy
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Organiseer content in thema's en subtopics
            </p>
          </div>
          <Button onClick={() => openCreate(null)}>
            <Plus className="w-4 h-4 mr-1" /> Nieuw topic
          </Button>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground text-sm py-12 text-center">
            Laden...
          </div>
        ) : tree.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-12 text-center">
            <FolderTree className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground text-sm mb-4">
              Nog geen topics. Maak je eerste topic aan om je content te organiseren.
            </p>
            <Button variant="outline" onClick={() => openCreate(null)}>
              <Plus className="w-4 h-4 mr-1" /> Eerste topic aanmaken
            </Button>
          </div>
        ) : (
          <div className="border border-border rounded-xl bg-card">
            {tree.map((topic) => (
              <TopicNode
                key={topic.id}
                topic={topic}
                depth={0}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
                onAddChild={(pid) => openCreate(pid)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTopic ? "Topic bewerken" : "Nieuw topic"}
            </DialogTitle>
          </DialogHeader>

          {parentName && (
            <p className="text-xs text-muted-foreground">
              Parent: <span className="font-medium text-foreground">{parentName}</span>
            </p>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Naam</label>
              <Input
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({
                    ...f,
                    name,
                    slug: editingTopic ? f.slug : slugify(name),
                  }));
                }}
                placeholder="Bijv. Lead Generatie"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Slug</label>
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="lead-generatie"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Beschrijving{" "}
                <span className="text-muted-foreground font-normal">(optioneel)</span>
              </label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Korte omschrijving van dit topic..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuleren
            </Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Opslaan..." : "Opslaan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Topic verwijderen?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{deleteTarget?.name}</strong> en
            alle subtopics worden permanent verwijderd.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Annuleren
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Verwijderen..." : "Verwijderen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminTaxonomy;
