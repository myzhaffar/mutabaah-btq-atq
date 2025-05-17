
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentCard from "@/components/students/StudentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search, X } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { getStudents } from "@/services/student";
import { StudentWithProgress } from "@/types/database";
import { useStudentFilters } from "@/hooks/useStudentFilters";

const ParentDashboard = () => {
  const [students, setStudents] = useState<StudentWithProgress[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentWithProgress[]>([]);
  const [uniqueGrades, setUniqueGrades] = useState<string[]>([]);
  const [uniqueGroups, setUniqueGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use the student filters hook
  const {
    filters,
    setSearchTerm,
    toggleGrade,
    toggleGroup,
    resetFilters,
    setShowFilters
  } = useStudentFilters();

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

  // Apply filters when selections or search term change
  useEffect(() => {
    let result = students;
    
    // Apply search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(student => 
        student.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply grade filters
    if (filters.selectedGrades.length > 0) {
      result = result.filter(student => filters.selectedGrades.includes(student.group));
    }
    
    // Apply teacher filters
    if (filters.selectedGroups.length > 0) {
      result = result.filter(student => filters.selectedGroups.includes(student.teacher));
    }
    
    setFilteredStudents(result);
  }, [filters.searchTerm, filters.selectedGrades, filters.selectedGroups, students]);

  return (
    <DashboardLayout userType="parent">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Children's Progress</h1>
        
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 rounded-full"
            onClick={() => setShowFilters(!filters.showFilters)}
          >
            <Filter className="h-4 w-4" />
            {filters.showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          
          {(filters.selectedGrades.length > 0 || filters.selectedGroups.length > 0 || filters.searchTerm) && (
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
      
      {filters.showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 animate-fade-in">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name"
                value={filters.searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-8"
              />
              {filters.searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Grade/Class</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {uniqueGrades.map(grade => (
                  <div key={grade} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`grade-${grade}`}
                      checked={filters.selectedGrades.includes(grade)}
                      onCheckedChange={() => toggleGrade(grade)}
                    />
                    <label 
                      htmlFor={`grade-${grade}`}
                      className="text-sm cursor-pointer"
                    >
                      {grade}
                    </label>
                  </div>
                ))}
                {uniqueGrades.length === 0 && (
                  <p className="text-sm text-gray-500">No grades available</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Teacher</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {uniqueGroups.map(teacher => (
                  <div key={teacher} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`teacher-${teacher}`}
                      checked={filters.selectedGroups.includes(teacher)}
                      onCheckedChange={() => toggleGroup(teacher)}
                    />
                    <label 
                      htmlFor={`teacher-${teacher}`}
                      className="text-sm cursor-pointer"
                    >
                      {teacher}
                    </label>
                  </div>
                ))}
                {uniqueGroups.length === 0 && (
                  <p className="text-sm text-gray-500">No teachers available</p>
                )}
              </div>
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
