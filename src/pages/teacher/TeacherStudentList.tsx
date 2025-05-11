
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentCard, { Student } from "@/components/students/StudentCard";
import { useNavigate } from "react-router-dom";

const MOCK_STUDENTS: Student[] = [
  {
    id: "1",
    name: "Ahmad Farhan",
    photo: "",
    group: "Class 3A",
    teacher: "Ustadz Hasan",
    hafalanProgress: {
      total: 5,
      lastSurah: "Al-Fatiha",
      percentage: 60,
    },
    tilawahProgress: {
      jilid: "2",
      page: 15,
      percentage: 75,
    },
  },
  {
    id: "2",
    name: "Fatima Zahra",
    photo: "",
    group: "Class 3B",
    teacher: "Ustadzah Aisha",
    hafalanProgress: {
      total: 8,
      lastSurah: "Al-Falaq",
      percentage: 80,
    },
    tilawahProgress: {
      jilid: "3",
      page: 7,
      percentage: 40,
    },
  },
  {
    id: "3",
    name: "Omar Ibrahim",
    photo: "",
    group: "Class 4A",
    teacher: "Ustadz Hasan",
    hafalanProgress: {
      total: 3,
      lastSurah: "Al-Kafirun",
      percentage: 35,
    },
    tilawahProgress: {
      jilid: "1",
      page: 20,
      percentage: 90,
    },
  },
];

const TeacherStudentList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(MOCK_STUDENTS);

  useEffect(() => {
    // Filter students based on search term
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.group.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleAddStudent = () => {
    navigate("/teacher/student/new");
  };

  return (
    <DashboardLayout userType="teacher" currentTab="students" onTabChange={(tab) => {
      if (tab === "progress") {
        navigate("/teacher/progress");
      }
    }}>
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Student List</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            type="search"
            placeholder="Search students..."
            className="input-kid max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleAddStudent} className="btn-kid-primary whitespace-nowrap">
            Add New Student
          </Button>
        </div>
      </div>

      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              viewType="teacher"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-kid-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-bold">No students found</h3>
          <p className="text-gray-500 mt-2 mb-6">
            {searchTerm
              ? "No students match your search criteria."
              : "Start by adding your first student."}
          </p>
          <Button onClick={handleAddStudent} className="btn-kid-primary">
            Add New Student
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherStudentList;
