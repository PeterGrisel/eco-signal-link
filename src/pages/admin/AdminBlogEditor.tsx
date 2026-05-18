import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, Link2Off, ShieldCheck, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const AdminBlogEditor = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [linkCheck, setLinkCheck] = useState<{
    running: boolean;
    broken: Array<{ url: string; status: number; reason?: string }> | null;
    checked: number;
  }>({ running: false, broken: null, checked: 0 });
  const [bypassLinkCheck, setBypassLinkCheck] = useState(false);

  useEffect(() => {
    supabase.from("blog_categories").select("*").order("name").then(({ data }) => {
      if (data) setCategories(data);
    });

    if (isEdit) {
      supabase.from("blog_posts").select("*").eq("id", id).single().then(({ data }) => {
        if (data) {
          setTitle(data.title);
          setSlug(data.slug);
          setContent(data.content);
          setExcerpt(data.excerpt || "");
          setMetaDescription(data.meta_description || "");
          setFeaturedImage(data.featured_image || "");
          setCategoryId(data.category_id);
          setStatus(data.status as "draft" | "published");
        }
      });
    }
  }, [id, isEdit]);

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) setSlug(generateSlug(val));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) {
      toast({ title: "Upload fout", description: error.message, variant: "destructive" });
    } else {
      const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
      setFeaturedImage(data.publicUrl);
    }
    setUploading(false);
  };

  /**
   * Calls the validate-external-links edge function.
   * Returns the broken list (empty array = all good).
   */
  const runLinkCheck = async (): Promise<Array<{ url: string; status: number; reason?: string }>> => {
    setLinkCheck({ running: true, broken: null, checked: 0 });
    try {
      const { data, error } = await supabase.functions.invoke("validate-external-links", {
        body: { content },
      });
      if (error) throw error;
      const broken = (data?.broken ?? []) as Array<{ url: string; status: number; reason?: string }>;
      setLinkCheck({ running: false, broken, checked: data?.checked ?? 0 });
      return broken;
    } catch (e: any) {
      setLinkCheck({ running: false, broken: [], checked: 0 });
      toast({
        title: "Link-check mislukt",
        description: e?.message ?? "Onbekende fout",
        variant: "destructive",
      });
      return [];
    }
  };

  const autoSubmitIndexing = async (postSlug: string) => {
    try {
      const blogUrl = `https://b2bgroeimachine.io/blog/${postSlug}`;
      await supabase.functions.invoke("request-indexing", {
        body: { url: blogUrl },
      });
      toast({ title: "🚀 Indexing aangevraagd", description: blogUrl });
    } catch {
      // Silent fail - indexing is best-effort
    }
  };

  const handleSave = async () => {
    if (!title || !slug) {
      toast({ title: "Vul titel en slug in", variant: "destructive" });
      return;
    }

    // Gate publishing on external link validation.
    // Drafts kunnen altijd worden opgeslagen; gepubliceerd alleen als links live zijn.
    if (status === "published" && !bypassLinkCheck) {
      const broken = await runLinkCheck();
      if (broken.length > 0) {
        toast({
          title: `${broken.length} dode link${broken.length > 1 ? "s" : ""} gevonden`,
          description: "Repareer ze of klik nogmaals op Opslaan om toch te publiceren.",
          variant: "destructive",
        });
        setBypassLinkCheck(true); // next click bypasses the check
        return;
      }
    }

    setSaving(true);

    const postData = {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      meta_description: metaDescription || null,
      featured_image: featuredImage || null,
      category_id: categoryId,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    };

    if (isEdit) {
      const { error } = await supabase.from("blog_posts").update(postData).eq("id", id);
      if (error) toast({ title: "Fout", description: error.message, variant: "destructive" });
      else {
        toast({ title: "Opgeslagen!" });
        if (status === "published") {
          autoSubmitIndexing(slug);
        }
      }
    } else {
      const { error } = await supabase.from("blog_posts").insert(postData);
      if (error) toast({ title: "Fout", description: error.message, variant: "destructive" });
      else {
        toast({ title: "Artikel aangemaakt!" });
        if (status === "published") {
          autoSubmitIndexing(slug);
        }
        navigate("/admin/content");
      }
    }
    setSaving(false);
    setBypassLinkCheck(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/admin/content" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {isEdit ? "Bewerk Artikel" : "Nieuw Artikel"}
            </h1>
          </div>
          <div className="flex gap-2">
            {isEdit && slug && (
              <Button variant="ghost" size="sm" asChild>
                <a href={`/blog/${slug}`} target="_blank" rel="noopener noreferrer">
                  <Eye className="w-4 h-4 mr-1" /> Preview
                </a>
              </Button>
            )}
            <Button variant="hero" size="sm" onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4" /> {saving ? "Opslaan..." : "Opslaan"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Titel</Label>
              <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Artikel titel..." />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="artikel-slug" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Categorie</Label>
              <Select value={categoryId || ""} onValueChange={(v) => setCategoryId(v || null)}>
                <SelectTrigger><SelectValue placeholder="Kies categorie" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as "draft" | "published")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Featured Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              {featuredImage && (
                <img src={featuredImage} alt="Preview" className="h-20 rounded object-cover mt-1" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} placeholder="Korte samenvatting..." />
          </div>

          <div className="space-y-2">
            <Label>Meta Description (SEO)</Label>
            <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} placeholder="Max 160 tekens..." />
            <p className="text-xs text-muted-foreground">{metaDescription.length}/160 tekens</p>
          </div>

          <div className="space-y-2">
            <Label>Content (Markdown)</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="font-mono text-sm"
              placeholder="Schrijf je artikel in Markdown..."
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogEditor;
