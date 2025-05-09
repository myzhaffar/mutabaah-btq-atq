
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentForm from "@/components/students/StudentForm";

const TeacherStudentNew = () => {
  return (
    <DashboardLayout userType="teacher">
      <StudentForm />
    </DashboardLayout>
  );
};

export default TeacherStudentNew;
