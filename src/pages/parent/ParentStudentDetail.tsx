
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProgressList, { ProgressEntry } from "@/components/progress/ProgressList";

// Mock data (In real app this would come from Supabase)
const MOCK_STUDENTS = [
  {
    id: "1",
    name: "Ahmad Farhan",
    photo: "",
    group: "Class 3A",
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

const ParentStudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find student by ID
  const student = MOCK_STUDENTS.find((s) => s.id === id);
  
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
          <ProgressList progressEntries={MOCK_PROGRESS} viewType="parent" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentStudentDetail;
