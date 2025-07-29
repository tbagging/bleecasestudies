import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContentProvider } from "./contexts/ContentContext";
import Index from "./pages/Index";
import CaseStudy from "./pages/CaseStudy";
import TechCorpCaseStudy from "./pages/TechCorpCaseStudy";
import GrowthCoCaseStudy from "./pages/GrowthCoCaseStudy";
import ManufactureXCaseStudy from "./pages/ManufactureXCaseStudy";
import IchilovCaseStudy from "./pages/IchilovCaseStudy";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ContentProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/case-study/:id" element={<CaseStudy />} />
            <Route path="/techcorp-case-study" element={<TechCorpCaseStudy />} />
            <Route path="/growthco-case-study" element={<GrowthCoCaseStudy />} />
            <Route path="/manufacturex-case-study" element={<ManufactureXCaseStudy />} />
            <Route path="/ichilov-case-study" element={<IchilovCaseStudy />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ContentProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
