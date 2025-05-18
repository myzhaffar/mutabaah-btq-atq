
import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentForm from "@/components/students/StudentForm";
import { Button } from "@/components/ui/button";

const TeacherStudentNew = () => {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout userType="teacher">
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="outline"
          onClick={() => navigate("/teacher/students")}
          className="mb-4"
        >
          ← Back to Students
        </Button>
        <StudentForm />
      </div>
    </DashboardLayout>
  );
};

export default TeacherStudentNew;
