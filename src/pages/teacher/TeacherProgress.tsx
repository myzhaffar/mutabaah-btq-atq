
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getStudents } from '@/services/student';
import { StudentWithProgress } from '@/types/database';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define Quran surah order
const surahOrder: Record<string, number> = {
  "An-Nas": 114,
  "Al-Falaq": 113,
  "Al-Ikhlas": 112,
  // ... (shortened for brevity)
  "An-Naba": 78,
  // ... (shortened for brevity)
  "Al-Fatihah": 1,
};

// Get surah rank for sorting (higher is better)
const getSurahRank = (surahName: string): number => {
  return surahOrder[surahName] || 0;
};

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
        
        // Sort students by hafalan progress and surah rank
        const sortedStudents = [...studentsData].sort((a, b) => {
          // First sort by percentage (higher first)
          if (b.hafalanProgress.percentage !== a.hafalanProgress.percentage) {
            return b.hafalanProgress.percentage - a.hafalanProgress.percentage;
          }
          
          // If percentages are the same, sort by surah rank (higher surah number is better)
          const surahRankA = getSurahRank(a.hafalanProgress.lastSurah || '');
          const surahRankB = getSurahRank(b.hafalanProgress.lastSurah || '');
          return surahRankB - surahRankA;
        });
        
        setStudents(sortedStudents);
        
        // Extract unique group names (class/grade) and teacher names
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

          <Select onValueChange={setSelectedGroup} value={selectedGroup}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Grade/Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Classes</SelectItem>
              {groups.map(group => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedTeacher} value={selectedTeacher}>
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
                <p>Grade/Class: {student.group}</p>
                <p>Teacher: {student.teacher}</p>
                <div className="mt-2">
                  <p className="mb-1">Hafalan Progress: {student.hafalanProgress.percentage || 0}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                    <div 
                      className="bg-kid-blue h-2.5 rounded-full" 
                      style={{ width: `${student.hafalanProgress.percentage || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="mb-1">Tilawah Progress: {student.tilawahProgress.percentage || 0}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-kid-purple h-2.5 rounded-full" 
                      style={{ width: `${student.tilawahProgress.percentage || 0}%` }}
                    ></div>
                  </div>
                </div>
                {student.hafalanProgress.lastSurah && (
                  <p className="mt-2 text-sm">Last surah: {student.hafalanProgress.lastSurah}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherProgress;
