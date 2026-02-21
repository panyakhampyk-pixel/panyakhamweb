import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminSlider from "./pages/AdminSlider";
import AdminNews from "./pages/AdminNews";
import AdminScholarships from "./pages/AdminScholarships";
import AdminDonations from "./pages/AdminDonations";
import AdminStaff from "./pages/AdminStaff";
import AdminContacts from "./pages/AdminContacts";
import AdminSettings from "./pages/AdminSettings";
import AdminPride from "./pages/AdminPride";
import AdminPrograms from "./pages/AdminPrograms";
import Staff from "./pages/Staff";
import AdminSidebarConfig from "./pages/AdminSidebarConfig";
import NewsDetail from "./pages/NewsDetail";
import ScholarshipApply from "./pages/ScholarshipApply";
import Donate from "./pages/Donate";
import About from "./pages/About";
import Programs from "./pages/Programs";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Scholarship from "./pages/Scholarship";
import Logo from "@/components/Logo";
import { Link } from "react-router-dom";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/scholarship-apply" element={<ScholarshipApply />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/news" element={<News />} />
            <Route path="/scholarship" element={<Scholarship />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/slider"
              element={
                <ProtectedRoute>
                  <AdminSlider />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/news"
              element={
                <ProtectedRoute>
                  <AdminNews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/scholarships"
              element={
                <ProtectedRoute>
                  <AdminScholarships />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/donations"
              element={
                <ProtectedRoute>
                  <AdminDonations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sidebar-config"
              element={
                <ProtectedRoute>
                  <AdminSidebarConfig />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/staff"
              element={
                <ProtectedRoute>
                  <AdminStaff />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/messages"
              element={
                <ProtectedRoute>
                  <AdminContacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pride"
              element={
                <ProtectedRoute>
                  <AdminPride />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/programs"
              element={
                <ProtectedRoute>
                  <AdminPrograms />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
