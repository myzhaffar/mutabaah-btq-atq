
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProgressList, { ProgressEntry } from "@/components/progress/ProgressList";
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

// Mock data (In real app this would come from Supabase)
const MOCK_STUDENTS = [
  {
    id: "1",
    name: "Ahmad Farhan",
    photo: "",
    group: "Class 3A",
    teacher: "Ustadz Hasan",
  },
  {
    id: "2",
    name: "Fatima Zahra",
    photo: "",
    group: "Class 3B",
    teacher: "Ustadzah Aisha",
  },
  {
    id: "3",
    name: "Omar Ibrahim",
    photo: "",
    group: "Class 4A",
    teacher: "Ustadz Hasan",
  },
];

const MOCK_PROGRESS: ProgressEntry[] = [
  {
    id: "p1",
    date: "2025-05-01",
    type: "hafalan",
    surahOrJilid: "Al-Fatiha",
    ayatOrPage: "1-7",
    notes: "Excellent memorization, perfect tajweed",
  },
  {
    id: "p2",
    date: "2025-05-02",
    type: "tilawah",
    surahOrJilid: "2",
    ayatOrPage: "15",
    notes: "Completed pages 15-17 with good fluency",
  },
  {
    id: "p3",
    date: "2025-05-05",
    type: "hafalan",
    surahOrJilid: "Al-Ikhlas",
    ayatOrPage: "1-4",
    notes: "Needs more practice on pronunciation",
  },
  {
    id: "p4",
    date: "2025-05-07",
    type: "tilawah",
    surahOrJilid: "2",
    ayatOrPage: "18",
    notes: "",
  },
  {
    id: "p5",
    date: "2025-05-09",
    type: "hafalan",
    surahOrJilid: "Al-Falaq",
    ayatOrPage: "1-3",
    notes: "Good effort, review needed tomorrow",
  },
];

const TeacherStudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
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

  const handleAddProgress = () => {
    navigate(`/teacher/student/${id}/add-progress`);
  };

  const handleEditStudent = () => {
    navigate(`/teacher/student/${id}/edit`);
  };

  const confirmDelete = () => {
    // In a real app, this would be an API call to delete the student
    toast({
      title: "Student deleted",
      description: "Student has been successfully removed",
    });
    
    navigate("/teacher/students");
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

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
          <ProgressList progressEntries={MOCK_PROGRESS} viewType="teacher" />
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
