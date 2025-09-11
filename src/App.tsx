import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationLayout from "./components/NavigationLayout";
import Index from "./pages/Index";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ModuleQuiz from "./pages/ModuleQuiz";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import EmergencyAlert from "./pages/EmergencyAlert";
import MockDrillSchedule from "./pages/MockDrillSchedule";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavigationLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/module-quiz" element={<ModuleQuiz />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/alerts" element={<EmergencyAlert />} />
            <Route path="/drills/schedule" element={<MockDrillSchedule />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NavigationLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
