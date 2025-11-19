import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StarCursor } from "@/components/StarCursor";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import AdultWomanDashboard from "./pages/dashboard/AdultWomanDashboard";
import ChildGirlDashboard from "./pages/dashboard/ChildGirlDashboard";
import TeenDashboard from "./pages/dashboard/TeenDashboard";
import SeniorDashboard from "./pages/dashboard/SeniorDashboard";
import MessageScanner from "./pages/MessageScanner";
import URLScanner from "./pages/URLScanner";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <StarCursor />
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard/adult-woman" element={<AdultWomanDashboard />} />
          <Route path="/dashboard/child-girl" element={<ChildGirlDashboard />} />
          <Route path="/dashboard/child-boy" element={<ChildGirlDashboard />} />
          <Route path="/dashboard/teen" element={<TeenDashboard />} />
          <Route path="/dashboard/adult-man" element={<AdultWomanDashboard />} />
          <Route path="/dashboard/senior" element={<SeniorDashboard />} />
          <Route path="/dashboard/nonbinary" element={<AdultWomanDashboard />} />
          <Route path="/scanner/message" element={<MessageScanner />} />
          <Route path="/scanner/url" element={<URLScanner />} />
          <Route path="/community" element={<Community />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
