import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import MyComplaints from "./pages/MyComplaints";
import Profile from "./pages/Profile";
import NeedHelp from "./pages/NeedHelp";
import GuardDashboard from "./pages/GuardDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ComplaintDetail from "./pages/ComplaintDetail";
import AdminEscalations from "./pages/AdminEscalations";
import AdminReports from "./pages/AdminReports";
import ManageComplaintsWarder from "./pages/ManageComplaintsWarder";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminAllComplaints from "./pages/AdminAllComplaints";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/submit-complaint" element={<SubmitComplaint />} />
                <Route path="/student/my-complaints" element={<MyComplaints />} />
                <Route path="/student/need-help" element={<NeedHelp />} />
                <Route path="/complaint/:id" element={<ComplaintDetail />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['guard']} />}>
                <Route path="/guard/dashboard" element={<GuardDashboard />} />
                <Route path="/guard/complaints" element={<ManageComplaintsWarder />} />
                <Route path="/guard/complaint/:id" element={<ComplaintDetail />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/all-complaints" element={<AdminAllComplaints />} />
                <Route path="/admin/users" element={<AdminUserManagement />} />
                <Route path="/admin/escalations" element={<AdminEscalations />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/complaint/:id" element={<ComplaintDetail />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
