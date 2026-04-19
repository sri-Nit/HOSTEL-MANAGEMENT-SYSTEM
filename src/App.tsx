import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import MyComplaints from "./pages/MyComplaints";
import Profile from "./pages/Profile";
import WardenDashboard from "./pages/WardenDashboard";
import ServicePersonnelDashboard from "./pages/ServicePersonnelDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ComplaintDetail from "./pages/ComplaintDetail";
import AdminEscalations from "./pages/AdminEscalations";
import AdminReports from "./pages/AdminReports";
import ManageComplaintsWarden from "./pages/ManageComplaintsWarden";
import AssignedComplaintsServicePersonnel from "./pages/AssignedComplaintsServicePersonnel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />

            {/* Shared Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/submit-complaint" element={<SubmitComplaint />} />
              <Route path="/student/my-complaints" element={<MyComplaints />} />
              <Route path="/complaint/:id" element={<ComplaintDetail />} />
            </Route>

            {/* Warden Routes */}
            <Route element={<ProtectedRoute allowedRoles={['warden']} />}>
              <Route path="/warden/dashboard" element={<WardenDashboard />} />
              <Route path="/warden/complaints" element={<ManageComplaintsWarden />} />
              <Route path="/warden/complaint/:id" element={<ComplaintDetail />} />
            </Route>

            {/* Service Personnel Routes */}
            <Route element={<ProtectedRoute allowedRoles={['service_personnel']} />}>
              <Route path="/service-personnel/dashboard" element={<ServicePersonnelDashboard />} />
              <Route path="/service-personnel/assigned-complaints" element={<AssignedComplaintsServicePersonnel />} />
              <Route path="/service-personnel/complaint/:id" element={<ComplaintDetail />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/escalations" element={<AdminEscalations />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/complaint/:id" element={<ComplaintDetail />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;