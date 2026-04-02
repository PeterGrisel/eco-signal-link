import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { trackPageView, trackScrollDepth, startTimeOnPage, stopScrollDepth } from "@/lib/tracking";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index.tsx";
import OverOns from "./pages/OverOns.tsx";
import OnsTeam from "./pages/OnsTeam.tsx";
import SectorPage from "./pages/SectorPage.tsx";
import SolutionPage from "./pages/SolutionPage.tsx";
import FullSalesManagement from "./pages/FullSalesManagement.tsx";
import FullServiceRecruitment from "./pages/FullServiceRecruitment.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import Pricing from "./pages/Pricing.tsx";
import Datahub from "./pages/Datahub.tsx";
import Brandstory from "./pages/Brandstory.tsx";
import PipelineEquation from "./pages/PipelineEquation.tsx";
import Contact from "./pages/Contact.tsx";
import Privacy from "./pages/Privacy.tsx";
import Terms from "./pages/Terms.tsx";
import Cookies from "./pages/Cookies.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminBlog from "./pages/admin/AdminBlog.tsx";
import AdminBlogEditor from "./pages/admin/AdminBlogEditor.tsx";
import AdminBlogGenerate from "./pages/admin/AdminBlogGenerate.tsx";
import AdminListings from "./pages/admin/AdminListings.tsx";
import AdminIndexing from "./pages/admin/AdminIndexing.tsx";
import AdminAutopilot from "./pages/admin/AdminAutopilot.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import AdminTaxonomy from "./pages/admin/AdminTaxonomy.tsx";
import AdminKpi from "./pages/admin/AdminKpi.tsx";
import AdminCalendar from "./pages/admin/AdminCalendar.tsx";
import AdminLeads from "./pages/admin/AdminLeads.tsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.tsx";
import AdminScripts from "./pages/admin/AdminScripts.tsx";
import AdminOverview from "./pages/admin/AdminOverview.tsx";
import AdminCompetitors from "./pages/admin/AdminCompetitors.tsx";
import NotFound from "./pages/NotFound.tsx";
import TrackingScriptInjector from "./components/TrackingScriptInjector";
import WhatsAppButton from "./components/WhatsAppButton";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
    startTimeOnPage(location.pathname);
    trackScrollDepth();
    return () => { stopScrollDepth(); };
  }, [location.pathname]);

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
          <Route path="/over-ons" element={<OverOns />} />
          <Route path="/ons-team" element={<OnsTeam />} />
          <Route path="/sectoren/:slug" element={<SectorPage />} />
          <Route path="/solutions/:slug" element={<SolutionPage />} />
          <Route path="/full-service-recruitment" element={<FullServiceRecruitment />} />
          <Route path="/full-sales-management" element={<FullSalesManagement />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/datahub" element={<Datahub />} />
          <Route path="/brandstory" element={<Brandstory />} />
          <Route path="/pipeline-equation" element={<PipelineEquation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/overview" element={<AdminOverview />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/blog/new" element={<AdminBlogEditor />} />
          <Route path="/admin/blog/edit/:id" element={<AdminBlogEditor />} />
          <Route path="/admin/blog/generate" element={<AdminBlogGenerate />} />
          <Route path="/admin/listings" element={<AdminListings />} />
          <Route path="/admin/indexing" element={<AdminIndexing />} />
          <Route path="/admin/autopilot" element={<AdminAutopilot />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/taxonomy" element={<AdminTaxonomy />} />
          <Route path="/admin/kpi" element={<AdminKpi />} />
          <Route path="/admin/calendar" element={<AdminCalendar />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/scripts" element={<AdminScripts />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <TrackingScriptInjector />
        <WhatsAppButton />
        <CookieConsent />
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
