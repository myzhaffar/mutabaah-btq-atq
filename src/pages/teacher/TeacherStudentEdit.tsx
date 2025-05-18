
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentForm from "@/components/students/StudentForm";
import { Button } from "@/components/ui/button";
import { getStudentById } from "@/services/student";

const TeacherStudentEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const student = await getStudentById(id);
        
        if (student) {
          // Format the data for the form
          setStudentData({
            name: student.name,
            group: student.group,
            teacher: student.teacher,
            photo: student.photo || "",
          });
        }
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudent();
  }, [id]);
  
  if (isLoading) {
    return (
      <DashboardLayout userType="teacher">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-10">
            <div className="w-16 h-16 border-4 border-kid-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading student data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!studentData && !isLoading) {
    return (
      <DashboardLayout userType="teacher">
        <div className="container mx-auto px-4 py-6">
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
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="teacher">
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="outline"
          onClick={() => navigate(`/teacher/student/${id}`)}
          className="mb-4"
        >
          ← Back to Student Details
        </Button>
        <StudentForm
          initialData={studentData}
          isEditing={true}
          studentId={id}
        />
      </div>
    </DashboardLayout>
  );
};

export default TeacherStudentEdit;
