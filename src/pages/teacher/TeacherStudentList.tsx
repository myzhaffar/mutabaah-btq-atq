
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentCard, { Student } from "@/components/students/StudentCard";
import { useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { useStudentFilters } from "@/hooks/useStudentFilters";

export const MOCK_STUDENTS: Student[] = [
  {
    id: "1",
    name: "Ahmad Farhan",
    photo: "",
    group: "Class 3A",
    grade: "3",
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
    grade: "3",
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
    grade: "4",
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

// Extract unique grades and groups for filter options
export const uniqueGrades = [...new Set(MOCK_STUDENTS.map(student => student.grade))];
export const uniqueGroups = [...new Set(MOCK_STUDENTS.map(student => student.group))];

const TeacherStudentList = () => {
  const navigate = useNavigate();
  const [students] = useState<Student[]>(MOCK_STUDENTS);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(MOCK_STUDENTS);
  
  const {
    filters,
    setSearchTerm,
    toggleGrade,
    toggleGroup,
    resetFilters,
    setShowFilters
  } = useStudentFilters();

  useEffect(() => {
    // Filter students based on search term, selected grades and groups
    let filtered = students;
    
    if (filters.searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          student.group.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    
    if (filters.selectedGrades.length > 0) {
      filtered = filtered.filter(student => 
        student.grade && filters.selectedGrades.includes(student.grade)
      );
    }
    
    if (filters.selectedGroups.length > 0) {
      filtered = filtered.filter(student => 
        filters.selectedGroups.includes(student.group)
      );
    }
    
    setFilteredStudents(filtered);
  }, [filters.searchTerm, students, filters.selectedGrades, filters.selectedGroups]);

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
            value={filters.searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleAddStudent} className="btn-kid-primary whitespace-nowrap">
            Add New Student
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 rounded-full"
          onClick={() => setShowFilters(!filters.showFilters)}
        >
          <Filter className="h-4 w-4" />
          {filters.showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        
        {filters.showFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="rounded-full text-sm"
          >
            Reset Filters
          </Button>
        )}
      </div>
      
      {filters.showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                  >
                    {filters.selectedGrades.length > 0 
                      ? `${filters.selectedGrades.length} selected` 
                      : "Choose grade"}
                    <span className="ml-2 opacity-70">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white">
                  <DropdownMenuLabel>Select Grades</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {uniqueGrades.map((grade) => (
                    <DropdownMenuCheckboxItem
                      key={grade}
                      checked={filters.selectedGrades.includes(grade)}
                      onCheckedChange={() => toggleGrade(grade)}
                    >
                      Grade {grade}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                  >
                    {filters.selectedGroups.length > 0 
                      ? `${filters.selectedGroups.length} selected` 
                      : "Choose group"}
                    <span className="ml-2 opacity-70">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white">
                  <DropdownMenuLabel>Select Groups</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {uniqueGroups.map((group) => (
                    <DropdownMenuCheckboxItem
                      key={group}
                      checked={filters.selectedGroups.includes(group)}
                      onCheckedChange={() => toggleGroup(group)}
                    >
                      {group}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

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
            {filters.searchTerm || filters.selectedGrades.length > 0 || filters.selectedGroups.length > 0
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
