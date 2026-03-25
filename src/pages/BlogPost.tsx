import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  meta_description: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  category: { name: string; slug: string } | null;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*, category:blog_categories(name, slug)")
        .eq("slug", slug!)
        .eq("status", "published")
        .maybeSingle();
      if (data) setPost(data as unknown as Post);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  usePageMeta({
    title: post ? `${post.title} | B2BGroeiMachine` : "Blog | B2BGroeiMachine",
    description: post?.meta_description || post?.excerpt || undefined,
    canonical: post ? `https://eco-signal-link.lovable.app/blog/${post.slug}` : undefined,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-6">
          <div className="max-w-3xl mx-auto animate-pulse space-y-4">
            <div className="h-8 bg-card rounded w-3/4" />
            <div className="h-64 bg-card rounded" />
            <div className="h-4 bg-card rounded w-full" />
            <div className="h-4 bg-card rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-6 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Artikel niet gevonden</h1>
          <Link to="/blog" className="text-primary hover:underline">← Terug naar blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const publishDate = post.published_at || post.created_at;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="pt-24">
        {post.featured_image && (
          <div className="w-full max-h-[480px] overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <article className="container mx-auto px-6 max-w-3xl py-12">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Terug naar blog
          </Link>

          {post.category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-3 block">
              {post.category.name}
            </span>
          )}

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-muted-foreground text-sm mb-10">
            {format(new Date(publishDate), "d MMMM yyyy", { locale: nl })}
          </p>

          {/* Markdown content */}
          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:font-display prose-headings:text-foreground
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-li:text-muted-foreground
            prose-blockquote:border-primary prose-blockquote:text-muted-foreground
            prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-img:rounded-xl"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </article>
      </div>

      <Footer />

      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.meta_description || post.excerpt || "",
            image: post.featured_image || undefined,
            datePublished: publishDate,
            url: `https://eco-signal-link.lovable.app/blog/${post.slug}`,
            publisher: {
              "@type": "Organization",
              name: "B2BGroeiMachine",
            },
          }),
        }}
      />
    </div>
  );
};

export default BlogPost;
