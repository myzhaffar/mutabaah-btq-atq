
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

const MOCK_STUDENTS: Student[] = [
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
const uniqueGrades = [...new Set(MOCK_STUDENTS.map(student => student.grade))];
const uniqueGroups = [...new Set(MOCK_STUDENTS.map(student => student.group))];

const TeacherStudentList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [students] = useState<Student[]>(MOCK_STUDENTS);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(MOCK_STUDENTS);
  
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Toggle grade selection
  const toggleGrade = (grade: string) => {
    setSelectedGrades(current => 
      current.includes(grade)
        ? current.filter(g => g !== grade)
        : [...current, grade]
    );
  };

  // Toggle group selection
  const toggleGroup = (group: string) => {
    setSelectedGroups(current => 
      current.includes(group)
        ? current.filter(g => g !== group)
        : [...current, group]
    );
  };

  useEffect(() => {
    // Filter students based on search term, selected grades and groups
    let filtered = students;
    
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.group.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedGrades.length > 0) {
      filtered = filtered.filter(student => 
        student.grade && selectedGrades.includes(student.grade)
      );
    }
    
    if (selectedGroups.length > 0) {
      filtered = filtered.filter(student => 
        selectedGroups.includes(student.group)
      );
    }
    
    setFilteredStudents(filtered);
  }, [searchTerm, students, selectedGrades, selectedGroups]);

  const handleAddStudent = () => {
    navigate("/teacher/student/new");
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedGrades([]);
    setSelectedGroups([]);
    setSearchTerm("");
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

      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 rounded-full"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        
        {showFilters && (
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
      
      {showFilters && (
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
                    {selectedGrades.length > 0 
                      ? `${selectedGrades.length} selected` 
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
                      checked={selectedGrades.includes(grade)}
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
                    {selectedGroups.length > 0 
                      ? `${selectedGroups.length} selected` 
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
                      checked={selectedGroups.includes(group)}
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
            {searchTerm || selectedGrades.length > 0 || selectedGroups.length > 0
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
