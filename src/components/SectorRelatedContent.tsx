import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, FileText, Library } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost { slug: string; title: string; excerpt: string | null; }
interface Playbook { slug: string; title: string; excerpt: string | null; }
interface GlossaryTerm { slug: string; term: string; short_def: string; }

interface Props {
  sectorTitle: string;
  keywords?: string[];
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const scoreItem = (text: string, needles: string[]) => {
  const t = text.toLowerCase();
  return needles.reduce((acc, n) => acc + (t.includes(n.toLowerCase()) ? 1 : 0), 0);
};

const SectorRelatedContent = ({ sectorTitle, keywords = [] }: Props) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);

  useEffect(() => {
    const needles = [sectorTitle, ...keywords].filter(Boolean);

    const run = async () => {
      const [postsRes, pbRes, termsRes] = await Promise.all([
        supabase
          .from("blog_posts")
          .select("slug, title, excerpt")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(30),
        supabase
          .from("playbooks")
          .select("slug, title, excerpt")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(30),
        supabase
          .from("glossary_terms")
          .select("slug, term, short_def")
          .eq("status", "published")
          .limit(60),
      ]);

      const rank = <T extends { title?: string; term?: string; excerpt?: string | null; short_def?: string }>(
        items: T[],
        max: number,
      ) =>
        items
          .map((it) => ({
            it,
            score: scoreItem(`${it.title ?? it.term ?? ""} ${it.excerpt ?? it.short_def ?? ""}`, needles),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, max)
          .map((x) => x.it);

      setPosts(rank(postsRes.data ?? [], 3) as BlogPost[]);
      setPlaybooks(rank(pbRes.data ?? [], 3) as Playbook[]);
      setTerms(rank(termsRes.data ?? [], 6) as GlossaryTerm[]);
    };
    run();
  }, [sectorTitle, keywords.join("|")]);

  const hasAny = posts.length || playbooks.length || terms.length;
  if (!hasAny) return null;

  return (
    <section className="py-24 border-t border-border">
      <div className="container mx-auto px-6">
        <motion.div {...fadeUp} className="max-w-2xl mb-12">
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Verdieping
          </p>
          <h2 className="font-display font-bold text-2xl md:text-4xl mb-4">
            Meer over <span className="text-gradient">{sectorTitle.toLowerCase()}</span> en B2B groei
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Lees onze inzichten, playbooks en begrippen die u helpen sneller te beslissen.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {posts.length > 0 && (
            <motion.div {...fadeUp} className="card-gradient border border-glow rounded-lg p-6">
              <div className="flex items-center gap-2 mb-5 text-sm uppercase tracking-wider text-muted-foreground">
                <BookOpen className="w-4 h-4 text-primary" /> Inzichten
              </div>
              <ul className="space-y-4">
                {posts.map((p) => (
                  <li key={p.slug}>
                    <Link to={`/blog/${p.slug}`} className="group block">
                      <p className="font-display font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                        {p.title}
                      </p>
                      {p.excerpt && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.excerpt}</p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-primary mt-5 hover:underline"
              >
                Alle artikelen <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          )}

          {playbooks.length > 0 && (
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="card-gradient border border-glow rounded-lg p-6">
              <div className="flex items-center gap-2 mb-5 text-sm uppercase tracking-wider text-muted-foreground">
                <FileText className="w-4 h-4 text-primary" /> Playbooks
              </div>
              <ul className="space-y-4">
                {playbooks.map((p) => (
                  <li key={p.slug}>
                    <Link to={`/playbooks/${p.slug}`} className="group block">
                      <p className="font-display font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                        {p.title}
                      </p>
                      {p.excerpt && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.excerpt}</p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/playbooks"
                className="inline-flex items-center gap-1.5 text-sm text-primary mt-5 hover:underline"
              >
                Alle playbooks <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          )}

          {terms.length > 0 && (
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="card-gradient border border-glow rounded-lg p-6">
              <div className="flex items-center gap-2 mb-5 text-sm uppercase tracking-wider text-muted-foreground">
                <Library className="w-4 h-4 text-primary" /> Woordenboek
              </div>
              <ul className="space-y-3">
                {terms.map((t) => (
                  <li key={t.slug}>
                    <Link to={`/woordenboek/${t.slug}`} className="group block">
                      <p className="font-display font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                        {t.term}
                      </p>
                      {t.short_def && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{t.short_def}</p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/woordenboek"
                className="inline-flex items-center gap-1.5 text-sm text-primary mt-5 hover:underline"
              >
                Heel het woordenboek <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SectorRelatedContent;