import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface Student {
  id: string;
  name: string;
  photo: string;
  group: string;
  grade?: string;  // Added grade property
  teacher: string;
  hafalanProgress: {
    total: number;
    lastSurah: string;
    percentage: number;
  };
  tilawahProgress: {
    jilid: string;
    page: number;
    percentage: number;
  };
}

interface StudentCardProps {
  student: Student;
  viewType: "teacher" | "parent";
}

const StudentCard: React.FC<StudentCardProps> = ({ student, viewType }) => {
  return (
    <Card className="bg-white shadow-sm rounded-lg">
      <CardHeader>
        <div className="flex items-center">
          <Avatar className="mr-4 h-10 w-10">
            <AvatarImage src={student.photo} alt={student.name} />
            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-semibold">{student.name}</CardTitle>
            <CardDescription className="text-gray-500">{student.group}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-700">Hafalan Progress</h3>
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span>Total Surah: {student.hafalanProgress.total}</span>
            <span>Last Surah: {student.hafalanProgress.lastSurah}</span>
          </div>
          <Progress value={student.hafalanProgress.percentage} className="mt-1" />
          <span className="block text-right text-xs text-gray-500">{student.hafalanProgress.percentage}%</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-700">Tilawah Progress</h3>
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span>Jilid: {student.tilawahProgress.jilid}</span>
            <span>Page: {student.tilawahProgress.page}</span>
          </div>
          <Progress value={student.tilawahProgress.percentage} className="mt-1" />
          <span className="block text-right text-xs text-gray-500">{student.tilawahProgress.percentage}%</span>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button asChild variant="secondary" size="sm" className="rounded-full">
          <Link to={`/${viewType}/student/${student.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudentCard;
