import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sectors } from "@/data/sectors";
import { supabase } from "@/integrations/supabase/client";

interface RecentPost {
  slug: string;
  title: string;
}

const pageLinks = [
  { href: "/full-sales-management", label: "Full Sales Management" },
  { href: "/full-service-recruitment", label: "Full Service Recruitment" },
  { href: "/pricing", label: "Pricing" },
  { href: "/over-ons", label: "Over Ons" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const Footer = () => {
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);

  useEffect(() => {
    const fetchRecent = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("slug, title")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(4);
      if (data) setRecentPosts(data);
    };
    fetchRecent();
  }, []);

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* 3-column grid */}
        <div className="py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Sectoren */}
          <div>
            <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Sectoren
            </p>
            <div className="grid grid-cols-1 gap-2">
              {sectors.map((s) => (
                <Link
                  key={s.slug}
                  to={`/sectoren/${s.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Pagina's */}
          <div>
            <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Pagina's
            </p>
            <div className="grid grid-cols-1 gap-2">
              {pageLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Recente Blog Posts */}
          <div>
            <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Recente Artikelen
            </p>
            <div className="grid grid-cols-1 gap-2">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {post.title}
                  </Link>
                ))
              ) : (
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Bekijk alle artikelen →
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-shrink-0">
            <Link to="/" className="font-display font-bold text-lg inline-block">
              <span className="text-foreground">B2B</span>
              <span className="text-primary">GroeiMachine</span>
            </Link>
            <p className="text-muted-foreground/60 text-xs mt-0.5">Signal-Based Prospecting Systems</p>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <a href="https://rebelforce.nl" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              rebelforce.nl
            </a>
            <span className="w-px h-3.5 bg-border" />
            <a href="https://ai-fctry.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              AI-FCTRY
            </a>
            <span className="w-px h-3.5 bg-border" />
            <a href="https://rebelforce-hubs.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              RebelHub
            </a>
          </nav>

          <p className="text-muted-foreground/50 text-xs flex-shrink-0">
            © {new Date().getFullYear()} B2BGroeiMachine · powered by Rebel Force™
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
