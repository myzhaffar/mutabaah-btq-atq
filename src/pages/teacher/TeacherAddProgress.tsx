
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProgressForm from "@/components/progress/ProgressForm";
import { Button } from "@/components/ui/button";
import { getStudentById } from "@/services/studentService";
import { StudentWithProgress } from "@/types/database";
import { Skeleton } from "@/components/ui/skeleton";

const TeacherAddProgress = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentWithProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const fetchedStudent = await getStudentById(id);
        setStudent(fetchedStudent);
        setLoading(false);
        if (!fetchedStudent) setError(true);
      } catch (err) {
        console.error("Error fetching student:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout userType="teacher">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          ← Back
        </Button>
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-md">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error || !student) {
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
      <ProgressForm studentId={student.id} studentName={student.name} />
    </DashboardLayout>
  );
};

export default TeacherAddProgress;
