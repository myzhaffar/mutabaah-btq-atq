
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Teacher routes
import TeacherStudentList from "./pages/teacher/TeacherStudentList";
import TeacherStudentNew from "./pages/teacher/TeacherStudentNew";
import TeacherStudentDetail from "./pages/teacher/TeacherStudentDetail";
import TeacherStudentEdit from "./pages/teacher/TeacherStudentEdit";
import TeacherAddProgress from "./pages/teacher/TeacherAddProgress";

// Parent routes
import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentStudentDetail from "./pages/parent/ParentStudentDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Teacher Routes */}
          <Route path="/teacher/students" element={<TeacherStudentList />} />
          <Route path="/teacher/student/new" element={<TeacherStudentNew />} />
          <Route path="/teacher/student/:id" element={<TeacherStudentDetail />} />
          <Route path="/teacher/student/:id/edit" element={<TeacherStudentEdit />} />
          <Route path="/teacher/student/:id/add-progress" element={<TeacherAddProgress />} />
          
          {/* Parent Routes */}
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
          <Route path="/parent/student/:id" element={<ParentStudentDetail />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
