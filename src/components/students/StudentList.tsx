
import React from "react";
import StudentCard from "@/components/students/StudentCard";
import { StudentWithProgress } from "@/types/database";

interface StudentListProps {
  students: StudentWithProgress[];
  isLoading: boolean;
}

const StudentList: React.FC<StudentListProps> = ({ students, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-kid-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading students...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <div className="w-16 h-16 bg-kid-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="text-xl font-bold">No students found</h3>
        <p className="text-gray-500 mt-2">
          No students match the current filters. Try different filter options or reset filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} viewType="parent" />
      ))}
    </div>
  );
};

export default StudentList;
