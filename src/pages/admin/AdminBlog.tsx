import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const AdminBlog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*, category:blog_categories(name)")
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je dit artikel wilt verwijderen?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast({ title: "Verwijderd" });
    fetchPosts();
  };

  const statusColor = (s: string) => {
    if (s === "published") return "bg-green-500/10 text-green-400 border-green-500/20";
    if (s === "draft") return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    return "bg-muted text-muted-foreground";
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Blog CMS</h1>
          <p className="text-sm text-muted-foreground mt-1">{posts.length} artikelen</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="heroOutline" size="sm">
            <Link to="/admin/blog/generate"><Sparkles className="w-4 h-4" /> AI Genereer</Link>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/admin/blog/new"><Plus className="w-4 h-4" /> Nieuw Artikel</Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-card rounded-lg animate-pulse" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>Nog geen artikelen. Maak je eerste artikel aan!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-medium text-foreground truncate">{post.title}</h3>
                  <Badge variant="outline" className={statusColor(post.status)}>{post.status}</Badge>
                  {post.category && (
                    <span className="text-xs text-muted-foreground">{post.category.name}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(post.created_at), "dd/MM/yyyy HH:mm")}
                  {post.slug && ` · /blog/${post.slug}`}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/admin/blog/edit/${post.id}`}><Pencil className="w-4 h-4" /></Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBlog;
