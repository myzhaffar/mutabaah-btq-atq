
import { useState, useEffect } from "react";

export interface StudentFilters {
  searchTerm: string;
  selectedGrades: string[];
  selectedGroups: string[];
  showFilters: boolean;
}

export const useStudentFilters = (initialFilters?: Partial<StudentFilters>) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters?.searchTerm || "");
  const [selectedGrades, setSelectedGrades] = useState<string[]>(initialFilters?.selectedGrades || []);
  const [selectedGroups, setSelectedGroups] = useState<string[]>(initialFilters?.selectedGroups || []);
  const [showFilters, setShowFilters] = useState(initialFilters?.showFilters || false);

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

  // Reset all filters
  const resetFilters = () => {
    setSelectedGrades([]);
    setSelectedGroups([]);
    setSearchTerm("");
  };

  return {
    filters: {
      searchTerm,
      selectedGrades,
      selectedGroups,
      showFilters
    },
    setSearchTerm,
    toggleGrade,
    toggleGroup,
    resetFilters,
    setShowFilters
  };
};
