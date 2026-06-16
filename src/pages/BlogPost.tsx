import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { splitContentWithInfographics, renderInfographic } from "@/components/blog/infographicParser";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RelatedSolutions from "@/components/blog/RelatedSolutions";
import MidContentCta from "@/components/blog/MidContentCta";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { trackCTA } from "@/lib/tracking";
import AnswerBlock from "@/components/blog/AnswerBlock";
import { parseAnswerBlock } from "@/lib/parseAnswerBlock";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  meta_description: string | null;
  featured_image: string | null;
  published_at: string | null;
  status: string;
  created_at: string;
  updated_at?: string | null;
  category: { name: string; slug: string } | null;
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*, category:blog_categories(name, slug)")
        .eq("slug", slug!)
        .maybeSingle();
      if (data) setPost(data as unknown as Post);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  usePageMeta({
    title: post ? `${post.title} | B2BGroeiMachine` : "Blog | B2BGroeiMachine",
    description: post?.meta_description || post?.excerpt || undefined,
    canonical: post ? `https://www.b2bgroeimachine.io/blog/${post.slug}` : undefined,
    ogType: post ? "article" : "website",
    ogImage: post?.featured_image || undefined,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 container mx-auto px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="h-6 w-24 bg-secondary rounded animate-pulse" />
            <div className="h-12 bg-secondary rounded-lg w-4/5 animate-pulse" />
            <div className="h-8 bg-secondary rounded w-2/5 animate-pulse" />
            <div className="h-80 bg-secondary rounded-xl animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-secondary rounded w-full animate-pulse" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 container mx-auto px-6 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Artikel niet gevonden</h1>
          <Link to="/blog" className="text-primary hover:underline">← Terug naar blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const publishDate = post.published_at || post.created_at;
  // Strip leading H1 from markdown to avoid duplicate title
  const rawCleanContent = post.content
    .replace(/^\s*#\s+.+\n*/m, "")
    .replace(/\\$/gm, "")
    .replace(/\\\n/g, "\n");
  const { block: answerBlock, contentWithoutAnswer, faqs } = parseAnswerBlock(rawCleanContent);
  const cleanContent = contentWithoutAnswer;
  const readTime = estimateReadTime(cleanContent);
  const isDraft = post.status === "draft";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Draft Banner */}
      {isDraft && (
        <div className="bg-primary/20 border-b border-primary/30 text-primary text-center py-2 text-sm font-medium mt-16">
          ⚠️ Dit artikel is een concept en nog niet gepubliceerd
        </div>
      )}

      {/* Hero Section */}
      <div className={isDraft ? "pt-8" : "pt-24"}>
        {post.featured_image && (
          <div className="w-full max-w-5xl mx-auto px-6 mb-10">
            <div className="relative rounded-2xl overflow-hidden aspect-[21/9] shadow-2xl">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            </div>
          </div>
        )}

        <article className="container mx-auto px-6 max-w-3xl pb-16">
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Terug naar blog
          </Link>

          {/* Category */}
          {post.category && (
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5 uppercase tracking-wider text-xs font-semibold">
              {post.category.name}
            </Badge>
          )}

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-12 pb-8 border-b border-border">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {format(new Date(publishDate), "d MMMM yyyy", { locale: nl })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readTime} min leestijd
            </span>
          </div>

          {/* Markdown content with premium prose styling */}
          <div className="
            prose prose-lg max-w-none
            prose-headings:font-display prose-headings:text-foreground prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border
            prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-8 prose-h3:mb-3
            prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-2
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-5
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
            prose-strong:text-foreground prose-strong:font-semibold
            prose-em:text-foreground/80
            prose-li:text-muted-foreground prose-li:leading-relaxed
            prose-ul:my-4 prose-ol:my-4
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-foreground/80 prose-blockquote:my-8
            prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
            prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-xl
            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
            prose-hr:border-border prose-hr:my-10
            prose-table:my-8 prose-table:w-full prose-table:block prose-table:overflow-x-auto prose-table:md:table
            prose-thead:border-b-2 prose-thead:border-primary/30
            prose-th:text-foreground prose-th:font-display prose-th:font-semibold prose-th:text-left prose-th:py-3 prose-th:px-4 prose-th:bg-secondary/50
            prose-td:text-muted-foreground prose-td:py-3 prose-td:px-4 prose-td:border-b prose-td:border-border
            prose-tr:transition-colors hover:prose-tr:bg-secondary/30
            prose-figure:my-8
          ">
            {answerBlock && <AnswerBlock block={answerBlock} />}
            {(() => {
              const parts = splitContentWithInfographics(cleanContent);
              const variant: "signaal" = "signaal";
              // Insert mid-content CTA after the text part closest to the middle
              const textIndices = parts
                .map((p, idx) => (p.type !== "infographic" ? idx : -1))
                .filter((idx) => idx !== -1);
              const midInjectAfter =
                textIndices.length > 1 ? textIndices[Math.floor(textIndices.length / 2)] : -1;

              return parts.map((part, i) => {
                const node =
                  part.type === "infographic" ? (
                    <div key={i} className="not-prose">{renderInfographic(part.block)}</div>
                  ) : (
                    <ReactMarkdown
                      key={i}
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ href, children, ...props }) => {
                          const isExternal = href?.startsWith("http");
                          return (
                            <a
                              href={href}
                              {...props}
                              className="text-primary font-medium underline underline-offset-2 hover:text-primary/80 transition-colors"
                              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            >
                              {children}
                            </a>
                          );
                        },
                      }}
                    >
                      {part.content}
                    </ReactMarkdown>
                  );

                if (i === midInjectAfter) {
                  return (
                    <div key={i}>
                      {node}
                      <MidContentCta variant={variant} slug={post.slug} />
                    </div>
                  );
                }
                return node;
              });
            })()}
          </div>

          {/* Related Solutions */}
          <RelatedSolutions content={cleanContent} title={post.title} />

          {/* Bottom CTA */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary to-secondary border border-primary/20">
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              Benieuwd hoe uw pipeline scoort?
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Doe de gratis Pipeline Score™: 14 factoren, 10 verdiepingsvragen, en een AI-rapport met concrete verbeterpunten per fase. In 5 minuten.
            </p>
            <Link
              to="/pipeline-equation#calculator"
              onClick={() => trackCTA("BlogPost — Pipeline Score", `/blog/${post.slug}`)}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-display font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Start de Pipeline Score →
            </Link>
          </div>
        </article>
      </div>

      <Footer />

      {/* BreadcrumbList JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.b2bgroeimachine.io/" },
          { name: "Blog", url: "https://www.b2bgroeimachine.io/blog" },
          { name: post.title, url: `https://www.b2bgroeimachine.io/blog/${post.slug}` },
        ]}
      />

      {/* BlogPosting JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title.slice(0, 110),
            description: post.meta_description || post.excerpt || "",
            image: post.featured_image ? [post.featured_image] : undefined,
            datePublished: publishDate,
            dateModified: post.updated_at || publishDate,
            url: `https://www.b2bgroeimachine.io/blog/${post.slug}`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.b2bgroeimachine.io/blog/${post.slug}`,
            },
            author: {
              "@type": "Organization",
              name: "B2BGroeiMachine",
              url: "https://www.b2bgroeimachine.io",
            },
            publisher: {
              "@type": "Organization",
              name: "B2BGroeiMachine",
              logo: {
                "@type": "ImageObject",
                url: "https://www.b2bgroeimachine.io/favicon.ico",
              },
            },
            articleSection: post.category?.name || undefined,
            wordCount: post.content.trim().split(/\s+/).length,
            inLanguage: "nl-NL",
          }),
        }}
      />

      {/* FAQPage JSON-LD (alleen als artikel FAQ-sectie heeft) */}
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            }),
          }}
        />
      )}
    </div>
  );
};

export default BlogPost;
