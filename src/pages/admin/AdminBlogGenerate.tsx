import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ArrowLeft, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AdminBlogGenerate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [keyword, setKeyword] = useState("");
  const [audience, setAudience] = useState("B2B sales professionals");
  const [length, setLength] = useState<"kort" | "middel" | "lang">("middel");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{
    title: string;
    meta_description: string;
    excerpt: string;
    content: string;
    slug: string;
  } | null>(null);

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      toast({ title: "Vul een keyword in", variant: "destructive" });
      return;
    }
    setGenerating(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-article", {
        body: { keyword, audience, length },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
      toast({ title: "Artikel gegenereerd!" });
    } catch (e: any) {
      toast({ title: "Generatie mislukt", description: e.message, variant: "destructive" });
    }
    setGenerating(false);
  };

  const handleSaveAsDraft = async () => {
    if (!result) return;
    const { error } = await supabase.from("blog_posts").insert({
      title: result.title,
      slug: result.slug,
      content: result.content,
      excerpt: result.excerpt,
      meta_description: result.meta_description,
      status: "draft",
    });
    if (error) {
      toast({ title: "Fout", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Opgeslagen als draft!" });
      navigate("/admin/blog");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/admin/blog" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" /> AI Artikel Generator
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Genereer SEO-geoptimaliseerde artikelen met AI</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <Label>Keyword / Onderwerp</Label>
            <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="b2b lead generation" />
          </div>
          <div className="space-y-2">
            <Label>Doelgroep</Label>
            <Input value={audience} onChange={(e) => setAudience(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Lengte</Label>
            <Select value={length} onValueChange={(v) => setLength(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="kort">Kort (~800 woorden)</SelectItem>
                <SelectItem value="middel">Middel (~1500 woorden)</SelectItem>
                <SelectItem value="lang">Lang (~2500 woorden)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button variant="hero" onClick={handleGenerate} disabled={generating} className="mb-8">
          <Sparkles className="w-4 h-4" />
          {generating ? "Genereren..." : "Genereer Artikel"}
        </Button>

        {result && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Titel</Label>
                <h2 className="font-display text-xl font-bold text-foreground">{result.title}</h2>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Meta Description</Label>
                <p className="text-sm text-muted-foreground">{result.meta_description}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Slug</Label>
                <p className="text-sm font-mono text-muted-foreground">/blog/{result.slug}</p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-xs text-muted-foreground">Content Preview</Label>
                <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(result.content); toast({ title: "Gekopieerd!" }); }}>
                  <Copy className="w-4 h-4" /> Kopieer
                </Button>
              </div>
              <div className="prose prose-invert prose-sm max-w-none max-h-96 overflow-y-auto
                prose-headings:font-display prose-headings:text-foreground
                prose-p:text-muted-foreground prose-a:text-primary
                prose-strong:text-foreground prose-li:text-muted-foreground">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.content}</ReactMarkdown>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="hero" onClick={handleSaveAsDraft}>
                Opslaan als Draft
              </Button>
              <Button variant="heroOutline" onClick={() => {
                navigate("/admin/blog/new", {
                  state: { prefill: result }
                });
              }}>
                Bewerken & Publiceren
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlogGenerate;
