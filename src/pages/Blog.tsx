import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import GroeistackLeadCapture from "@/components/GroeistackLeadCapture";
import { trackCTA } from "@/lib/tracking";
import { BOOKING_URL } from "@/content/copy";
import { Radar, Send, Workflow, TrendingUp, Users } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  is_featured: boolean | null;
  category: { name: string; slug: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number | null;
}

const PILLAR_SLUGS = [
  "signal-based-prospecting",
  "outbound-engagement",
  "sales-operations",
  "growth-systems-mkb",
] as const;

const PILLAR_ICONS: Record<string, typeof Radar> = {
  "signal-based-prospecting": Radar,
  "outbound-engagement": Send,
  "sales-operations": Workflow,
  "growth-systems-mkb": TrendingUp,
  "recruitment-talent": Users,
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: "Van signaal naar gesprek — Signal-Based Prospecting Blog | B2BGroeiMachine",
    description:
      "Praktische playbooks voor B2B-teams die minder handmatig willen prospecten en meer relevante commerciële kansen willen activeren.",
    canonical: "https://www.b2bgroeimachine.io/blog",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [postsRes, catsRes] = await Promise.all([
        supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, featured_image, published_at, is_featured, category:blog_categories(name, slug)")
          .eq("status", "published")
          .order("published_at", { ascending: false }),
        supabase
          .from("blog_categories")
          .select("id, name, slug, description, sort_order")
          .order("sort_order", { ascending: true })
          .order("name"),
      ]);
      if (postsRes.data) setPosts(postsRes.data as unknown as BlogPost[]);
      if (catsRes.data) setCategories(catsRes.data as unknown as Category[]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = activeCategory
    ? posts.filter((p) => p.category?.slug === activeCategory)
    : posts;

  const pillarCategories = categories.filter((c) => PILLAR_SLUGS.includes(c.slug as any));
  const featuredPosts = posts.filter((p) => p.is_featured).slice(0, 3);
  const countPerCategory = (slug: string) =>
    posts.filter((p) => p.category?.slug === slug).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Hero */}
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-3 block">
              Signal-Based Prospecting
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-5 leading-[1.05] tracking-tight">
              Van signaal naar gesprek.
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-7 leading-relaxed">
              Praktische playbooks voor B2B-teams die minder handmatig willen prospecten en meer
              relevante commerciële kansen willen activeren.
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA("Blog hero — Groeiscan", "/blog")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-display font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Plan B2B Groeiscan →
            </a>
          </div>

          {/* Vier pijlerkaarten */}
          {pillarCategories.length === 4 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {pillarCategories.map((cat) => {
                const Icon = PILLAR_ICONS[cat.slug] || Radar;
                const count = countPerCategory(cat.slug);
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.slug);
                      document.getElementById("alle-artikelen")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-left p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors group"
                  >
                    <Icon className="w-6 h-6 text-primary mb-3" />
                    <h3 className="font-display text-base font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-muted-foreground text-xs leading-relaxed mb-3 line-clamp-3">
                        {cat.description}
                      </p>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {count} {count === 1 ? "artikel" : "artikelen"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Start hier */}
          {featuredPosts.length > 0 && (
            <div className="mb-16">
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Start hier
                </h2>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Meest gelezen
                </span>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group rounded-xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-colors"
                  >
                    {post.featured_image && (
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      {post.category && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 block">
                          {post.category.name}
                        </span>
                      )}
                      <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <GroeistackLeadCapture
            title="Wilt u op de hoogte blijven van alle GTM-ontwikkelingen?"
            description="Ontvang een melding zodra wij nieuwe blogartikelen, tools en playbooks delen."
            source="blog"
          />

          <div id="alle-artikelen" className="pt-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
              Alle artikelen
            </h2>
          </div>

          {/* Category filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  !activeCategory
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Alles
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl bg-card border border-border animate-pulse h-80" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground">Nog geen artikelen gepubliceerd.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group rounded-xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-colors"
                >
                  {post.featured_image && (
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 block">
                        {post.category.name}
                      </span>
                    )}
                    <h2 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                    )}
                    {post.published_at && (
                      <p className="text-xs text-muted-foreground mt-4">
                        {format(new Date(post.published_at), "d MMMM yyyy", { locale: nl })}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Van signaal naar gesprek — B2BGroeiMachine Blog",
            url: "https://www.b2bgroeimachine.io/blog",
            description:
              "Praktische playbooks voor B2B-teams die minder handmatig willen prospecten en meer relevante commerciële kansen willen activeren.",
          }),
        }}
      />
    </div>
  );
};

export default Blog;
