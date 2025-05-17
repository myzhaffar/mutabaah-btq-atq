
import { useState, useEffect } from "react";
import { getStudents } from "@/services/student";
import { StudentWithProgress } from "@/types/database";
import { StudentFilters } from "@/hooks/useStudentFilters";

// Define Quran surah order - starting from An-Nas (114) down to Al-Fatihah (1)
// We use reverse order since in memorization we typically start from the end of the Quran
const surahOrder: Record<string, number> = {
  "An-Nas": 114,
  "Al-Falaq": 113,
  "Al-Ikhlas": 112,
  "Al-Masad": 111,
  "An-Nasr": 110,
  // ... (shortened for brevity)
  "An-Naba": 78,
  "Al-Mursalat": 77,
  // ... (shortened for brevity)
  "Al-Fatihah": 1,
};

// Get surah rank for sorting (higher is better)
const getSurahRank = (surahName: string): number => {
  return surahOrder[surahName] || 0;
};

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

  // Apply filters and sorting when selections or search term change
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
    
    // Sort by hafalan progress
    result = [...result].sort((a, b) => {
      // First sort by percentage (higher first)
      if (b.hafalanProgress.percentage !== a.hafalanProgress.percentage) {
        return b.hafalanProgress.percentage - a.hafalanProgress.percentage;
      }
      
      // If percentages are the same, sort by surah rank (higher surah number is better)
      const surahRankA = getSurahRank(a.hafalanProgress.lastSurah || '');
      const surahRankB = getSurahRank(b.hafalanProgress.lastSurah || '');
      return surahRankB - surahRankA;
    });
    
    setFilteredStudents(result);
  }, [filters.searchTerm, filters.selectedGrades, filters.selectedGroups, students]);

  return {
    filteredStudents,
    uniqueGrades,
    uniqueGroups,
    isLoading
  };
};
