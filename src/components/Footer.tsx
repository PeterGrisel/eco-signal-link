import { useEffect, useState } from "react";
import { Rss } from "lucide-react";
import { Link } from "react-router-dom";
import { sectors } from "@/data/sectors";
import { solutions } from "@/data/solutions";
import { supabase } from "@/integrations/supabase/client";

interface RecentPost {
  slug: string;
  title: string;
}

const diensten = [
  { href: "/hoe-het-werkt", label: "Hoe het werkt" },
  { href: "/groeistack", label: "De Groeistack" },
  { href: "/full-sales-management", label: "Full Sales Management" },
  { href: "/full-service-recruitment", label: "Full Service Recruitment" },
  { href: "/pipeline-equation", label: "Pipeline Equation™" },
  { href: "/signaal", label: "Signaal Detectiesysteem" },
];

const bedrijf = [
  { href: "/over-ons", label: "Over Ons" },
  { href: "/ons-team", label: "Ons Team" },
  { href: "/brandstory", label: "Brandstory" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const kennis = [
  { href: "/groeistack", label: "Groeistack" },
  { href: "/cheatsheets", label: "Cheatsheets" },
  { href: "/trainingen", label: "Trainingen" },
  { href: "/partners", label: "Signal Partners" },
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
        .limit(3);
      if (data) setRecentPosts(data);
    };
    fetchRecent();
  }, []);

  // Split solutions into two columns
  const solsLeft = solutions.slice(0, 5);
  const solsRight = solutions.slice(5);

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main grid */}
        <div className="py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Sectoren */}
          <div>
            <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-primary/70 mb-4">
              Sectoren
            </p>
            <div className="flex flex-col gap-2.5">
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

          {/* Solutions col 1 */}
          <div>
            <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-primary/70 mb-4">
              Solutions
            </p>
            <div className="flex flex-col gap-2.5">
              {solsLeft.map((s) => (
                <Link
                  key={s.slug}
                  to={`/solutions/${s.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {s.navLabel}
                </Link>
              ))}
            </div>
          </div>

          {/* Solutions col 2 */}
          <div>
            <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-primary/70 mb-4 invisible">
              Solutions
            </p>
            <div className="flex flex-col gap-2.5">
              {solsRight.map((s) => (
                <Link
                  key={s.slug}
                  to={`/solutions/${s.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {s.navLabel}
                </Link>
              ))}
            </div>
          </div>

          {/* Diensten */}
          <div>
            <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-primary/70 mb-4">
              Diensten
            </p>
            <div className="flex flex-col gap-2.5">
              {diensten.map((link) => (
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

          {/* Bedrijf */}
          <div>
            <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-primary/70 mb-4">
              Bedrijf
            </p>
            <div className="flex flex-col gap-2.5">
              {bedrijf.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-primary/70 mb-3 mt-6">
              Kennis
            </p>
            <div className="flex flex-col gap-2.5">
              {kennis.map((link) => (
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

          {/* Recente Artikelen */}
          <div>
            <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-primary/70 mb-4">
              Recente Artikelen
            </p>
            <div className="flex flex-col gap-2.5">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
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
        <div className="py-6 border-t border-border flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex-shrink-0">
              <Link to="/" className="font-display font-bold text-lg inline-block">
                <span className="text-foreground">B2B</span>
                <span className="text-primary">GroeiMachine</span>
              </Link>
              <p className="text-muted-foreground text-xs mt-0.5">Signal-Based Prospecting Systems</p>
            </div>

            <p className="text-muted-foreground text-xs md:text-right">
              © {new Date().getFullYear()} B2BGroeiMachine · powered by Rebel Force™ · KVK 94347778 · BTW NL866743856B01
            </p>
          </div>

          <nav className="flex items-center gap-x-4 gap-y-2 text-sm flex-wrap pt-4 border-t border-border/60">
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
            <span className="w-px h-3.5 bg-border" />
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <span className="w-px h-3.5 bg-border" />
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Voorwaarden</Link>
            <span className="w-px h-3.5 bg-border" />
            <Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">Cookies</Link>
            <span className="w-px h-3.5 bg-border" />
            <a href="https://b2bgroeimachine.io/rss.xml" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="RSS Feed" aria-label="RSS feed">
              <Rss className="w-4 h-4" />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
