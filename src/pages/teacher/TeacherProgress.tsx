
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
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
import { useStudentFilters } from "@/hooks/useStudentFilters";
import { MOCK_STUDENTS, uniqueGrades, uniqueGroups } from "./TeacherStudentList";

// Mock data for progress summary
const PROGRESS_SUMMARY = MOCK_STUDENTS.map(student => ({
  id: student.id,
  name: student.name,
  grade: student.grade,
  group: student.group,
  hafalanProgress: student.hafalanProgress.percentage,
  tilawahProgress: student.tilawahProgress.percentage,
}));

const TeacherProgress = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<string>("hafalan");
  
  const {
    filters,
    setSearchTerm,
    toggleGrade,
    toggleGroup,
    resetFilters,
    setShowFilters
  } = useStudentFilters();

  // Filter the progress data based on the filters
  const filteredProgress = PROGRESS_SUMMARY.filter(student => {
    // Filter by search term
    if (filters.searchTerm && !student.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by grade
    if (filters.selectedGrades.length > 0 && !filters.selectedGrades.includes(student.grade)) {
      return false;
    }
    
    // Filter by group
    if (filters.selectedGroups.length > 0 && !filters.selectedGroups.includes(student.group)) {
      return false;
    }
    
    return true;
  });

  return (
    <DashboardLayout userType="teacher" currentTab="progress" onTabChange={(tab) => navigate(`/teacher/${tab}`)}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Students Progress Overview</h1>
        <p className="text-gray-500">Track and monitor all students' Quran memorization and recitation progress</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Input
            type="search"
            placeholder="Search students..."
            className="input-kid max-w-xs"
            value={filters.searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mb-6"
      >
        <TabsList className="w-full max-w-xs">
          <TabsTrigger value="hafalan" className="flex-1">Hafalan Progress</TabsTrigger>
          <TabsTrigger value="tilawah" className="flex-1">Tilawah Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="hafalan" className="mt-6">
          {filteredProgress.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProgress.map((student) => (
                <Card key={student.id} className="overflow-hidden border-none shadow-md rounded-2xl">
                  <CardHeader className="bg-gradient-to-r from-kid-green/10 to-kid-teal/10 pb-2">
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <p className="text-xs text-gray-500">{student.group}</p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Hafalan Progress</p>
                        <p className="text-sm font-semibold">{student.hafalanProgress}%</p>
                      </div>
                      <Progress value={student.hafalanProgress} className="h-3 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-bold">No students found</h3>
              <p className="text-gray-500 mt-2">
                No students match your search criteria.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tilawah" className="mt-6">
          {filteredProgress.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProgress.map((student) => (
                <Card key={student.id} className="overflow-hidden border-none shadow-md rounded-2xl">
                  <CardHeader className="bg-gradient-to-r from-kid-purple/10 to-kid-blue/10 pb-2">
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <p className="text-xs text-gray-500">{student.group}</p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Tilawah Progress</p>
                        <p className="text-sm font-semibold">{student.tilawahProgress}%</p>
                      </div>
                      <Progress value={student.tilawahProgress} className="h-3 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-bold">No students found</h3>
              <p className="text-gray-500 mt-2">
                No students match your search criteria.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default TeacherProgress;
