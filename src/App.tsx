import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
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
import ServiceLinePage from "./pages/ServiceLinePage.tsx";
import HoeHetWerkt from "./pages/HoeHetWerkt.tsx";
import SeoLandingPage from "./pages/SeoLandingPage.tsx";
import FullSalesManagement from "./pages/FullSalesManagement.tsx";
import FullServiceRecruitment from "./pages/FullServiceRecruitment.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import Brandstory from "./pages/Brandstory.tsx";
import Brandbook from "./pages/Brandbook.tsx";
import PipelineEquation from "./pages/PipelineEquation.tsx";
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
import AdminBlogEditor from "./pages/admin/AdminBlogEditor.tsx";
import AdminBlogGenerate from "./pages/admin/AdminBlogGenerate.tsx";
import AdminSignaal from "./pages/admin/AdminSignaal.tsx";
import SignalCheatsheet from "./pages/SignalCheatsheet.tsx";
import LinkedInOutreach from "./pages/LinkedInOutreach.tsx";
import HubSpotPipeline from "./pages/HubSpotPipeline.tsx";
import IcpAi from "./pages/IcpAi.tsx";
import MultichannelSequencing from "./pages/MultichannelSequencing.tsx";
import GammaCheatsheet from "./pages/GammaCheatsheet.tsx";
import Cheatsheets from "./pages/Cheatsheets.tsx";
import Trainingen from "./pages/Trainingen.tsx";
import Partners from "./pages/Partners.tsx";
import IconsPreview from "./pages/IconsPreview.tsx";
import NotFound from "./pages/NotFound.tsx";
import SignaalLanding from "./signaal/pages/SignaalLanding.tsx";
import SignaalStart from "./signaal/pages/SignaalStart.tsx";
import SignaalJourney from "./signaal/pages/SignaalJourney.tsx";
import SignaalBlueprint from "./signaal/pages/SignaalBlueprint.tsx";
import SignaalDashboard from "./signaal/pages/SignaalDashboard.tsx";
import TrackingScriptInjector from "./components/TrackingScriptInjector";
import CookieConsent from "./components/CookieConsent";
import { BookingModalHost } from "./components/booking/GlobalBookingModal";
import LeftDock from "./components/LeftDock";

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
          {/* 301 redirects for removed routes (client-side fallback; worker handles server-side 301) */}
          <Route path="/datahub" element={<Navigate to="/pipeline-equation" replace />} />
          <Route path="/pricing" element={<Navigate to="/pipeline-equation" replace />} />
          <Route path="/over-ons" element={<OverOns />} />
          <Route path="/ons-team" element={<OnsTeam />} />
          <Route path="/sectoren/:slug" element={<SectorPage />} />
          <Route path="/solutions/:slug" element={<SolutionPage />} />
          <Route path="/diensten/:slug" element={<ServiceLinePage />} />
          <Route path="/hoe-het-werkt" element={<HoeHetWerkt />} />
          <Route path="/b2b-leadgeneratie" element={<SeoLandingPage />} />
          <Route path="/leads-genereren-b2b" element={<SeoLandingPage />} />
          <Route path="/online-leadgeneratie" element={<SeoLandingPage />} />
          <Route path="/zakelijke-leads" element={<SeoLandingPage />} />
          <Route path="/full-service-recruitment" element={<FullServiceRecruitment />} />
          <Route path="/full-sales-management" element={<FullSalesManagement />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/brandstory" element={<Brandstory />} />
          <Route path="/brandbook" element={<Brandbook />} />
          <Route path="/pipeline-equation" element={<PipelineEquation />} />
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
          <Route path="/admin/signaal" element={<AdminSignaal />} />
          <Route path="/admin/blog/new" element={<AdminBlogEditor />} />
          <Route path="/admin/blog/edit/:id" element={<AdminBlogEditor />} />
          <Route path="/admin/blog/generate" element={<AdminBlogGenerate />} />
          <Route path="/cheatsheets" element={<Cheatsheets />} />
          <Route path="/trainingen" element={<Trainingen />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/icons-preview" element={<IconsPreview />} />
          <Route path="/cheatsheet/signal-prospecting" element={<SignalCheatsheet />} />
          <Route path="/cheatsheet/linkedin-outreach" element={<LinkedInOutreach />} />
          <Route path="/cheatsheet/hubspot-pipeline" element={<HubSpotPipeline />} />
          <Route path="/cheatsheet/icp-ai" element={<IcpAi />} />
          <Route path="/cheatsheet/multichannel-sequencing" element={<MultichannelSequencing />} />
          <Route path="/cheatsheet/gamma-presentaties" element={<GammaCheatsheet />} />
          <Route path="/signaal" element={<SignaalLanding />} />
          <Route path="/signaal/start" element={<SignaalStart />} />
          <Route path="/signaal/dashboard" element={<SignaalDashboard />} />
          <Route path="/signaal/journey" element={<SignaalJourney />} />
          <Route path="/signaal/journey/:journeyId" element={<SignaalJourney />} />
          <Route path="/signaal/blueprint" element={<SignaalBlueprint />} />
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
        <CookieConsent />
        <BookingModalHost />
        <LeftDock />
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
