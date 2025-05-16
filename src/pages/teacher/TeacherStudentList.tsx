
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentCard from "@/components/students/StudentCard";
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
import { getStudents, deleteStudent } from "@/services/student";
import { StudentWithProgress } from "@/types/database";

// Extract unique grades and groups for filter options
const extractUniqueValuesFromStudents = (students: StudentWithProgress[]) => {
  const uniqueGrades = [...new Set(students.map(student => student.group).filter(Boolean))];
  const uniqueTeachers = [...new Set(students.map(student => student.teacher))];
  
  return { uniqueGrades, uniqueTeachers };
};

const TeacherStudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentWithProgress[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentWithProgress[]>([]);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uniqueGrades, setUniqueGrades] = useState<string[]>([]);
  const [uniqueTeachers, setUniqueTeachers] = useState<string[]>([]);
  
  const {
    filters,
    setSearchTerm,
    toggleGrade,
    toggleGroup,
    resetFilters,
    setShowFilters
  } = useStudentFilters();

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const data = await getStudents();
        setStudents(data);
        
        // Extract unique grades and teachers
        const { uniqueGrades, uniqueTeachers } = extractUniqueValuesFromStudents(data);
        setUniqueGrades(uniqueGrades);
        setUniqueTeachers(uniqueTeachers);
        
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  useEffect(() => {
    // Filter students based on search term, selected grades and teachers
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
        filters.selectedGrades.includes(student.group)
      );
    }
    
    if (filters.selectedGroups.length > 0) {
      filtered = filtered.filter(student => 
        filters.selectedGroups.includes(student.teacher)
      );
    }
    
    setFilteredStudents(filtered);
  }, [filters.searchTerm, students, filters.selectedGrades, filters.selectedGroups]);

  const handleAddStudent = () => {
    navigate("/teacher/student/new");
  };

  const handleDeleteConfirm = (id: string) => {
    setStudentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    
    const success = await deleteStudent(studentToDelete);
    
    if (success) {
      // Update local state to remove the student
      const updatedStudents = students.filter(student => student.id !== studentToDelete);
      setStudents(updatedStudents);
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade/Class</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                  >
                    {filters.selectedGrades.length > 0 
                      ? `${filters.selectedGrades.length} selected` 
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
                      checked={filters.selectedGrades.includes(grade)}
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
                    {filters.selectedGroups.length > 0 
                      ? `${filters.selectedGroups.length} selected` 
                      : "Choose teacher"}
                    <span className="ml-2 opacity-70">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white">
                  <DropdownMenuLabel>Select Teachers</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {uniqueTeachers.map((teacher) => (
                    <DropdownMenuCheckboxItem
                      key={teacher}
                      checked={filters.selectedGroups.includes(teacher)}
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
            <StudentCard
              key={student.id}
              student={student}
              viewType="teacher"
              onDelete={handleDeleteConfirm}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this student? This action cannot be undone and all associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStudentToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default TeacherStudentList;
