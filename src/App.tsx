import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { trackPageView, trackScrollDepth, startTimeOnPage, stopScrollDepth } from "@/lib/tracking";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index.tsx";
import OverOns from "./pages/OverOns.tsx";
import OnsTeam from "./pages/OnsTeam.tsx";
import SectorPage from "./pages/SectorPage.tsx";
import HoeHetWerktV2 from "./pages/HoeHetWerktV2.tsx";
import Groeistack from "./pages/Groeistack.tsx";
import AdminGroeistack from "./pages/admin/AdminGroeistack.tsx";
import AdminGroeistackLeads from "./pages/admin/AdminGroeistackLeads.tsx";
import AdminLeads from "./pages/admin/AdminLeads.tsx";
import AdminGroeiplannen from "./pages/admin/AdminGroeiplannen.tsx";
import Playbooks from "./pages/Playbooks.tsx";
import PlaybookPost from "./pages/PlaybookPost.tsx";
import AdminPlaybooks from "./pages/admin/AdminPlaybooks.tsx";
import AdminGlossary from "./pages/admin/AdminGlossary.tsx";
import Woordenboek from "./pages/Woordenboek.tsx";
import WoordenboekPost from "./pages/WoordenboekPost.tsx";
import SeoLandingPage from "./pages/SeoLandingPage.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import Brandstory from "./pages/Brandstory.tsx";
import Brandbook from "./pages/Brandbook.tsx";
import PipelineEquation from "./pages/PipelineEquation.tsx";
import Tools from "./pages/Tools.tsx";
import FunnelCalculatorPage from "./pages/FunnelCalculatorPage.tsx";
import GroeiplanInvullen from "./pages/GroeiplanInvullen.tsx";
import PipelineValuePage from "./pages/PipelineValuePage.tsx";
import Contact from "./pages/Contact.tsx";
import Privacy from "./pages/Privacy.tsx";
import Terms from "./pages/Terms.tsx";
import Cookies from "./pages/Cookies.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminAnalyticsHub from "./pages/admin/AdminAnalyticsHub.tsx";
import AdminContentHub from "./pages/admin/AdminContentHub.tsx";
import AdminSeoHub from "./pages/admin/AdminSeoHub.tsx";
import AdminSystem from "./pages/admin/AdminSystem.tsx";
import AdminSystemMap from "./pages/admin/AdminSystemMap.tsx";
import AdminBlogEditor from "./pages/admin/AdminBlogEditor.tsx";
import AdminBlogGenerate from "./pages/admin/AdminBlogGenerate.tsx";
import AdminAbmPages from "./pages/admin/AdminAbmPages.tsx";
import ClientPage from "./pages/ClientPage.tsx";
import HegoPage from "./pages/HegoPage.tsx";
import SealEcoPage from "./pages/SealEcoPage.tsx";
import ShotsPage from "./pages/ShotsPage.tsx";
import SignalCheatsheet from "./pages/SignalCheatsheet.tsx";
import LinkedInOutreach from "./pages/LinkedInOutreach.tsx";
import HubSpotPipeline from "./pages/HubSpotPipeline.tsx";
import IcpAi from "./pages/IcpAi.tsx";
import MultichannelSequencing from "./pages/MultichannelSequencing.tsx";
import GammaCheatsheet from "./pages/GammaCheatsheet.tsx";
import Cheatsheets from "./pages/Cheatsheets.tsx";
import Partners from "./pages/Partners.tsx";
import Klanten from "./pages/Klanten.tsx";
import Demo from "./pages/Demo.tsx";
import IconsPreview from "./pages/IconsPreview.tsx";
import NotFound from "./pages/NotFound.tsx";
import TrackingScriptInjector from "./components/TrackingScriptInjector";
import CookieConsent from "./components/CookieConsent";
import { BookingModalHost } from "./components/booking/GlobalBookingModal";
import LeftDock from "./components/LeftDock";
import WeglotLoader from "./components/WeglotLoader";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
    startTimeOnPage(location.pathname);
    trackScrollDepth();
    return () => { stopScrollDepth(); };
  }, [location.pathname]);

  // Smooth scroll to hash after route transition animation completes
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;

    const timer = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 350); // slightly longer than AnimatePresence duration (300ms)

    return () => clearTimeout(timer);
  }, [location.hash, location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          {/* 301 redirects for removed routes (client-side fallback; worker handles server-side 301) */}
          <Route path="/datahub" element={<Navigate to="/pipeline-equation" replace />} />
          <Route path="/pricing" element={<Navigate to="/pipeline-equation" replace />} />
          <Route path="/over-ons" element={<OverOns />} />
          <Route path="/ons-team" element={<OnsTeam />} />
          <Route path="/sectoren/:slug" element={<SectorPage />} />
          <Route path="/hoe-het-werkt" element={<HoeHetWerktV2 />} />
          <Route path="/hoe-het-werkt-v2" element={<Navigate to="/hoe-het-werkt" replace />} />
          <Route path="/groeistack" element={<Groeistack />} />
          <Route path="/admin/groeistack" element={<AdminGroeistack />} />
          <Route path="/admin/groeistack/leads" element={<AdminGroeistackLeads />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          <Route path="/admin/groeiplannen" element={<AdminGroeiplannen />} />
          <Route path="/playbooks" element={<Playbooks />} />
          <Route path="/playbooks/:slug" element={<PlaybookPost />} />
          <Route path="/admin/playbooks" element={<AdminPlaybooks />} />
          <Route path="/woordenboek" element={<Woordenboek />} />
          <Route path="/woordenboek/:slug" element={<WoordenboekPost />} />
          <Route path="/admin/woordenboek" element={<AdminGlossary />} />
          <Route path="/b2b-leadgeneratie" element={<SeoLandingPage />} />
          <Route path="/leads-genereren-b2b" element={<SeoLandingPage />} />
          <Route path="/online-leadgeneratie" element={<SeoLandingPage />} />
          <Route path="/zakelijke-leads" element={<SeoLandingPage />} />
          <Route path="/koude-acquisitie" element={<SeoLandingPage />} />
          <Route path="/acquisitie-uitbesteden" element={<SeoLandingPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/brandstory" element={<Brandstory />} />
          <Route path="/brandbook" element={<Brandbook />} />
          <Route path="/pipeline-equation" element={<PipelineEquation />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/funnel-calculator" element={<FunnelCalculatorPage />} />
          <Route path="/tools/pipeline-value" element={<PipelineValuePage />} />
          <Route path="/groeiplan" element={<GroeiplanInvullen />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsHub />} />
          <Route path="/admin/content" element={<AdminContentHub />} />
          <Route path="/admin/seo" element={<AdminSeoHub />} />
          <Route path="/admin/system" element={<AdminSystem />} />
          <Route path="/admin/system-map" element={<AdminSystemMap />} />
          <Route path="/admin/abm" element={<AdminAbmPages />} />
          <Route path="/voor/hego" element={<HegoPage />} />
          <Route path="/voor/sealeco" element={<SealEcoPage />} />
          <Route path="/voor/shots" element={<ShotsPage />} />
          <Route path="/voor/:slug" element={<ClientPage />} />
          <Route path="/admin/blog/new" element={<AdminBlogEditor />} />
          <Route path="/admin/blog/edit/:id" element={<AdminBlogEditor />} />
          <Route path="/admin/blog/generate" element={<AdminBlogGenerate />} />
          <Route path="/cheatsheets" element={<Cheatsheets />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/klanten" element={<Klanten />} />
          <Route path="/icons-preview" element={<IconsPreview />} />
          <Route path="/cheatsheet/signal-prospecting" element={<SignalCheatsheet />} />
          <Route path="/cheatsheet/linkedin-outreach" element={<LinkedInOutreach />} />
          <Route path="/cheatsheet/hubspot-pipeline" element={<HubSpotPipeline />} />
          <Route path="/cheatsheet/icp-ai" element={<IcpAi />} />
          <Route path="/cheatsheet/multichannel-sequencing" element={<MultichannelSequencing />} />
          <Route path="/cheatsheet/gamma-presentaties" element={<GammaCheatsheet />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/video" element={<Navigate to="/demo" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <TooltipProvider>
        <BrowserRouter basename={typeof window !== "undefined" && /^\/en(\/|$)/.test(window.location.pathname) ? "/en" : undefined}>
          <WeglotLoader />
          <Toaster />
          <Sonner />
          <TrackingScriptInjector />
          <CookieConsent />
          <BookingModalHost />
          <LeftDock />
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;
