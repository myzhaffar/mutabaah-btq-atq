
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentCard, { Student } from "@/components/students/StudentCard";
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
import { Checkbox } from "@/components/ui/checkbox";

// Enhanced mock data with more details
const MOCK_CHILDREN: Student[] = [
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
      percentage: 75, // 75% complete of current surah
    },
    tilawahProgress: {
      jilid: "2",
      page: 15,
      percentage: 60, // 60% complete of current jilid
    },
  },
  {
    id: "2",
    name: "Aisyah Nur",
    photo: "",
    group: "Class 2B",
    grade: "2",
    teacher: "Ustadzah Fatimah",
    hafalanProgress: {
      total: 3,
      lastSurah: "An-Nas",
      percentage: 40, // 40% complete of current surah
    },
    tilawahProgress: {
      jilid: "1",
      page: 8,
      percentage: 25, // 25% complete of current jilid
    },
  },
  {
    id: "3",
    name: "Muhammad Haikal",
    photo: "",
    group: "Class 3B",
    grade: "3",
    teacher: "Ustadz Ahmed",
    hafalanProgress: {
      total: 4,
      lastSurah: "Al-Ikhlas",
      percentage: 60, // 60% complete of current surah
    },
    tilawahProgress: {
      jilid: "2",
      page: 12,
      percentage: 45, // 45% complete of current jilid
    },
  },
];

// Extract unique grades and groups for filter options
const uniqueGrades = [...new Set(MOCK_CHILDREN.map(child => child.grade))];
const uniqueGroups = [...new Set(MOCK_CHILDREN.map(child => child.group))];

const ParentDashboard = () => {
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filteredChildren, setFilteredChildren] = useState<Student[]>(MOCK_CHILDREN);

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

  // Apply filters when selections change
  useEffect(() => {
    let result = MOCK_CHILDREN;
    
    if (selectedGrades.length > 0) {
      result = result.filter(child => selectedGrades.includes(child.grade));
    }
    
    if (selectedGroups.length > 0) {
      result = result.filter(child => selectedGroups.includes(child.group));
    }
    
    setFilteredChildren(result);
  }, [selectedGrades, selectedGroups]);

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

      {filteredChildren.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChildren.map((child) => (
            <StudentCard key={child.id} student={child} viewType="parent" />
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
