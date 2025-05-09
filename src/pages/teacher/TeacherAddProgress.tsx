
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProgressForm from "@/components/progress/ProgressForm";
import { Button } from "@/components/ui/button";

// Mock data (In real app this would come from Supabase)
const MOCK_STUDENTS = [
  {
    id: "1",
    name: "Ahmad Farhan",
  },
  {
    id: "2",
    name: "Fatima Zahra",
  },
  {
    id: "3",
    name: "Omar Ibrahim",
  },
];

const TeacherAddProgress = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find student by ID
  const student = MOCK_STUDENTS.find((s) => s.id === id);
  
  if (!student) {
    return (
      <DashboardLayout userType="teacher">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
          <p className="text-gray-600 mb-6">
            The student you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/teacher/students")}
            className="btn-kid-primary"
          >
            Return to Student List
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="teacher">
      <Button
        variant="outline"
        onClick={() => navigate(`/teacher/student/${id}`)}
        className="mb-4"
      >
        ← Back to Student Details
      </Button>
      <ProgressForm studentId={id} studentName={student.name} />
    </DashboardLayout>
  );
};

export default TeacherAddProgress;
