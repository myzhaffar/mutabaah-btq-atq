
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentFilterPanel from "@/components/students/StudentFilterPanel";
import StudentList from "@/components/students/StudentList";
import { useStudentFilters } from "@/hooks/useStudentFilters";
import { useStudentData } from "@/hooks/useStudentData";

const ParentDashboard = () => {
  // Use the student filters hook
  const {
    filters,
    setSearchTerm,
    toggleGrade,
    toggleGroup,
    resetFilters,
    setShowFilters
  } = useStudentFilters();

  // Use the student data hook
  const {
    filteredStudents,
    uniqueGrades,
    uniqueGroups,
    isLoading
  } = useStudentData(filters);

  return (
    <DashboardLayout userType="parent">
      <StudentFilterPanel
        filters={filters}
        uniqueGrades={uniqueGrades}
        uniqueGroups={uniqueGroups}
        setSearchTerm={setSearchTerm}
        toggleGrade={toggleGrade}
        toggleGroup={toggleGroup}
        resetFilters={resetFilters}
        setShowFilters={setShowFilters}
      />

      <StudentList 
        students={filteredStudents} 
        isLoading={isLoading} 
      />
    </DashboardLayout>
  );
};

export default ParentDashboard;
