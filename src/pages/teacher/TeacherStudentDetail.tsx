import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProgressList from "@/components/progress/ProgressList";
import { Trash2 } from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { getStudentById, getProgressEntries, deleteStudent } from "@/services/student";
import { StudentWithProgress, ProgressEntry } from "@/types/database";

const TeacherStudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
      <DashboardLayout userType="teacher">
        <div className="text-center py-10">
          <div className="w-16 h-16 border-4 border-kid-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading student details...</p>
        </div>
      </DashboardLayout>
    );
  }
  
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

  const handleAddProgress = () => {
    navigate(`/teacher/student/${id}/add-progress`);
  };

  const handleEditStudent = () => {
    navigate(`/teacher/student/${id}/edit`);
  };

  const confirmDelete = async () => {
    const success = await deleteStudent(id);
    if (success) {
      navigate("/teacher/students");
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

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
    <DashboardLayout userType="teacher">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/teacher/students")}
          className="mb-4"
        >
          ← Back to Students
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Group:</span> {student.group}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Teacher:</span> {student.teacher}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground flex gap-1"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <Button onClick={handleEditStudent} variant="outline">
                Edit Profile
              </Button>
              <Button onClick={handleAddProgress} className="btn-kid-primary">
                Add Progress
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Progress History</h2>
          <ProgressList progressEntries={formattedProgressEntries} viewType="teacher" />
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {student.name}? This action cannot be undone and all associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default TeacherStudentDetail;
