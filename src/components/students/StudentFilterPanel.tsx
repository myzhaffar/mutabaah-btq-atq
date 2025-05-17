
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { StudentFilters } from "@/hooks/useStudentFilters";

interface StudentFilterPanelProps {
  filters: StudentFilters;
  uniqueGrades: string[];
  uniqueGroups: string[];
  setSearchTerm: (term: string) => void;
  toggleGrade: (grade: string) => void;
  toggleGroup: (group: string) => void;
  resetFilters: () => void;
  setShowFilters: (show: boolean) => void;
}

const StudentFilterPanel: React.FC<StudentFilterPanelProps> = ({
  filters,
  uniqueGrades,
  uniqueGroups,
  setSearchTerm,
  toggleGrade,
  toggleGroup,
  resetFilters,
  setShowFilters,
}) => {
  return (
    <>
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
    </>
  );
};

export default StudentFilterPanel;
