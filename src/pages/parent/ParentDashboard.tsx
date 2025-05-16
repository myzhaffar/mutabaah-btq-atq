
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentCard from "@/components/students/StudentCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { getStudents } from "@/services/student";
import { StudentWithProgress } from "@/types/database";

const ParentDashboard = () => {
  const [students, setStudents] = useState<StudentWithProgress[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filteredStudents, setFilteredStudents] = useState<StudentWithProgress[]>([]);
  const [uniqueGrades, setUniqueGrades] = useState<string[]>([]);
  const [uniqueGroups, setUniqueGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real student data from database
  useEffect(() => {
    const fetchStudentsData = async () => {
      setIsLoading(true);
      try {
        const studentsData = await getStudents();
        setStudents(studentsData);
        
        // Extract unique grades and teachers for filters
        const grades = Array.from(new Set(studentsData.map(s => s.group)));
        const teachers = Array.from(new Set(studentsData.map(s => s.teacher)));
        
        setUniqueGrades(grades as string[]);
        setUniqueGroups(teachers as string[]);
        setFilteredStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudentsData();
  }, []);

  // Toggle grade selection
  const toggleGrade = (grade: string) => {
    setSelectedGrades(current => 
      current.includes(grade)
        ? current.filter(g => g !== grade)
        : [...current, grade]
    );
  };

  // Toggle group (teacher) selection
  const toggleGroup = (group: string) => {
    setSelectedGroups(current => 
      current.includes(group)
        ? current.filter(g => g !== group)
        : [...current, group]
    );
  };

  // Apply filters when selections change
  useEffect(() => {
    let result = students;
    
    if (selectedGrades.length > 0) {
      result = result.filter(child => selectedGrades.includes(child.group));
    }
    
    if (selectedGroups.length > 0) {
      result = result.filter(child => selectedGroups.includes(child.teacher));
    }
    
    setFilteredStudents(result);
  }, [selectedGrades, selectedGroups, students]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedGrades([]);
    setSelectedGroups([]);
  };

  return (
    <DashboardLayout userType="parent">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Children's Progress</h1>
        
        <div className="mt-4 md:mt-0 flex items-center gap-2">
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
              Reset
            </Button>
          )}
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade/Class</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                  >
                    {selectedGrades.length > 0 
                      ? `${selectedGrades.length} selected` 
                      : "Choose grade/class"}
                    <span className="ml-2 opacity-70">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white">
                  <DropdownMenuLabel>Select Grades/Classes</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {uniqueGrades.map((grade) => (
                    <DropdownMenuCheckboxItem
                      key={grade}
                      checked={selectedGrades.includes(grade)}
                      onCheckedChange={() => toggleGrade(grade)}
                    >
                      {grade}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                  >
                    {selectedGroups.length > 0 
                      ? `${selectedGroups.length} selected` 
                      : "Choose teacher"}
                    <span className="ml-2 opacity-70">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white">
                  <DropdownMenuLabel>Select Teachers</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {uniqueGroups.map((teacher) => (
                    <DropdownMenuCheckboxItem
                      key={teacher}
                      checked={selectedGroups.includes(teacher)}
                      onCheckedChange={() => toggleGroup(teacher)}
                    >
                      {teacher}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-kid-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading students...</p>
        </div>
      ) : filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} viewType="parent" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-kid-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-xl font-bold">No students found</h3>
          <p className="text-gray-500 mt-2">
            No students match the current filters. Try different filter options or reset filters.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ParentDashboard;
