import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminSlider from "./pages/AdminSlider";
import AdminNews from "./pages/AdminNews";
import AdminScholarships from "./pages/AdminScholarships";
import AdminDonations from "./pages/AdminDonations";
import AdminStaff from "./pages/AdminStaff";
import AdminTeachers from "./pages/AdminTeachers";
import AdminContacts from "./pages/AdminContacts";
import AdminSettings from "./pages/AdminSettings";
import AdminPride from "./pages/AdminPride";
import AdminPrograms from "./pages/AdminPrograms";
import AdminPartners from "./pages/AdminPartners";
import Staff from "./pages/Staff";
import Teachers from "./pages/Teachers";
import AdminSidebarConfig from "./pages/AdminSidebarConfig";
import NewsDetail from "./pages/NewsDetail";
import ScholarshipApply from "./pages/ScholarshipApply";
import Donate from "./pages/Donate";
import About from "./pages/About";
import Programs from "./pages/Programs";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Scholarship from "./pages/Scholarship";
import AdminStudents from "./pages/AdminStudents";
import StudentRegistration from "./pages/StudentRegistration";
import StudentIndex from "./pages/StudentIndex";
import TeacherDashboard from "./pages/TeacherDashboard";
import CheckApplicationStatus from "./pages/CheckApplicationStatus";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/scholarship-apply" element={<ScholarshipApply />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/news" element={<News />} />
            <Route path="/scholarship" element={<Scholarship />} />
            <Route path="/students" element={<StudentIndex />} />
            <Route path="/register" element={<StudentRegistration />} />
            <Route path="/check-application" element={<CheckApplicationStatus />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
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
              path="/admin/teachers"
              element={
                <ProtectedRoute>
                  <AdminTeachers />
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
            <Route
              path="/admin/partners"
              element={
                <ProtectedRoute>
                  <AdminPartners />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute>
                  <AdminStudents />
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
