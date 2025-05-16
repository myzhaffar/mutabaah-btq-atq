import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getStudents, getProgressEntries } from '@/services/student';
import { StudentWithProgress } from '@/types/database';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const TeacherProgress = () => {
  const [students, setStudents] = useState<StudentWithProgress[]>([]);
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const studentsData = await getStudents();
        setStudents(studentsData);
        
        // Extract unique group names and teacher names
        const groupNames = Array.from(new Set(studentsData.map(s => s.group)));
        const teacherNames = Array.from(new Set(studentsData.map(s => s.teacher)));
        
        // Update the state with string arrays, ensuring type safety
        setGroups(groupNames as string[]);
        setTeachers(teacherNames as string[]);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudentsData();
  }, []);

  const filteredStudents = students.filter((student) => {
    const searchLower = search.toLowerCase();
    const nameMatch = student.name.toLowerCase().includes(searchLower);
    const groupMatch = selectedGroup ? student.group === selectedGroup : true;
    const teacherMatch = selectedTeacher ? student.teacher === selectedTeacher : true;

    return nameMatch && groupMatch && teacherMatch;
  });

  return (
    <DashboardLayout userType="teacher">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Student Progress</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            type="search"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Groups</SelectItem>
              {groups.map(group => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedTeacher}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Teachers</SelectItem>
              {teachers.map(teacher => (
                <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center">Loading students...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold">{student.name}</h2>
                <p>Group: {student.group}</p>
                <p>Teacher: {student.teacher}</p>
                <p>Hafalan Progress: {student.hafalanProgress.percentage}%</p>
                <p>Tilawah Progress: {student.tilawahProgress.percentage}%</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherProgress;
