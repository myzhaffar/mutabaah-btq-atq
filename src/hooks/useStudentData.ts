
import { useState, useEffect } from "react";
import { getStudents } from "@/services/student";
import { StudentWithProgress } from "@/types/database";
import { StudentFilters } from "@/hooks/useStudentFilters";

export const useStudentData = (filters: StudentFilters) => {
  const [students, setStudents] = useState<StudentWithProgress[]>([]);
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

  return {
    filteredStudents,
    uniqueGrades,
    uniqueGroups,
    isLoading
  };
};
