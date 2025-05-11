
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentCard, { Student } from "@/components/students/StudentCard";

// Mock data for parent's children (In real app this would come from Supabase)
const MOCK_CHILDREN: Student[] = [
  {
    id: "1",
    name: "Ahmad Farhan",
    photo: "",
    group: "Class 3A",
    teacher: "Ustadz Hasan",
    hafalanProgress: {
      total: 5,
      lastSurah: "Al-Fatiha",
      percentage: 75, // 75% complete of current surah
    },
    tilawahProgress: {
      jilid: "2",
      page: 15,
      percentage: 60, // 60% complete of current jilid
    },
  },
  {
    id: "2",
    name: "Aisyah Nur",
    photo: "",
    group: "Class 2B",
    teacher: "Ustadzah Fatimah",
    hafalanProgress: {
      total: 3,
      lastSurah: "An-Nas",
      percentage: 40, // 40% complete of current surah
    },
    tilawahProgress: {
      jilid: "1",
      page: 8,
      percentage: 25, // 25% complete of current jilid
    },
  },
];

const ParentDashboard = () => {
  return (
    <DashboardLayout userType="parent">
      <h1 className="text-2xl font-bold mb-6">Your Children's Progress</h1>

      {MOCK_CHILDREN.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_CHILDREN.map((child) => (
            <StudentCard key={child.id} student={child} viewType="parent" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-kid-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-bold">No children registered</h3>
          <p className="text-gray-500 mt-2">
            Please contact the school administrator to associate your account with your children.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ParentDashboard;
