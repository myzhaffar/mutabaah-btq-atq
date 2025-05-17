
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProgressList from "@/components/progress/ProgressList";
import { getStudentById, getProgressEntries } from "@/services/student";
import { StudentWithProgress, ProgressEntry } from "@/types/database";
import { toast } from "@/components/ui/use-toast";

const ParentStudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentWithProgress | null>(null);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const studentData = await getStudentById(id);
        setStudent(studentData);
        
        const entries = await getProgressEntries(id);
        setProgressEntries(entries);
      } catch (error) {
        console.error("Error fetching student data:", error);
        toast({
          title: "Error",
          description: "Failed to load student details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudentData();
  }, [id]);
  
  if (isLoading) {
    return (
      <DashboardLayout userType="parent">
        <div className="text-center py-10">
          <div className="w-16 h-16 border-4 border-kid-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading student details...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!student) {
    return (
      <DashboardLayout userType="parent">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
          <p className="text-gray-600 mb-6">
            The student you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/parent/dashboard")}
            className="btn-kid-primary"
          >
            Return to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Convert the progress entries to the format expected by ProgressList
  const formattedProgressEntries = progressEntries.map(entry => ({
    id: entry.id,
    date: entry.date,
    type: entry.type,
    surahOrJilid: entry.surah_or_jilid || "",
    ayatOrPage: entry.ayat_or_page || "",
    notes: entry.notes || "",
  }));

  return (
    <DashboardLayout userType="parent">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/parent/dashboard")}
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24">
              {student.photo ? (
                <AvatarImage src={student.photo} alt={student.name} />
              ) : (
                <AvatarFallback className="bg-kid-yellow text-gray-700 text-2xl font-bold">
                  {student.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold mb-2">{student.name}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p className="text-gray-600">
                  <span className="font-medium">Group:</span> {student.group}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Teacher:</span> {student.teacher}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Progress History</h2>
          <ProgressList progressEntries={formattedProgressEntries} viewType="parent" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentStudentDetail;
