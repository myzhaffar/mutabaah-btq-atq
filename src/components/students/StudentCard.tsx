
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Student {
  id: string;
  name: string;
  photo?: string;
  group: string;
  teacher: string;
  hafalanProgress?: {
    total: number;
    lastDate?: string;
    lastSurah?: string;
    percentage?: number;
  };
  tilawahProgress?: {
    jilid: string;
    page: number;
    lastDate?: string;
    percentage?: number;
  };
}

interface StudentCardProps {
  student: Student;
  viewType: "teacher" | "parent";
}

const StudentCard: React.FC<StudentCardProps> = ({ student, viewType }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (viewType === "teacher") {
      navigate(`/teacher/student/${student.id}`);
    } else {
      navigate(`/parent/student/${student.id}`);
    }
  };

  const handleAddProgress = () => {
    navigate(`/teacher/student/${student.id}/add-progress`);
  };

  // Get the initials for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Default percentages if not provided
  const hafalanPercentage = student.hafalanProgress?.percentage || (student.hafalanProgress?.total ? student.hafalanProgress.total * 2.5 : 0);
  const tilawahPercentage = student.tilawahProgress?.percentage || (student.tilawahProgress?.jilid ? parseInt(student.tilawahProgress.jilid) * 16.6 : 0);

  return (
    <Card className="kid-card h-full flex flex-col overflow-visible">
      <CardContent className="pt-8 pb-4 flex-1 relative">
        {/* Avatar positioned half outside the card */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <Avatar className="h-16 w-16 ring-4 ring-white shadow-md">
            {student.photo ? (
              <AvatarImage src={student.photo} alt={student.name} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-kid-blue to-kid-purple text-white text-xl font-bold">
                {getInitials(student.name)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        
        <div className="flex flex-col items-center mt-8">
          <h3 className="font-bold text-lg text-center mb-1">{student.name}</h3>
          <div className="text-xs text-gray-500 mb-4 text-center">
            <p className="inline-block bg-gray-100 px-3 py-1 rounded-full">Group: {student.group}</p>
          </div>

          {/* Progress Summary */}
          <div className="w-full grid grid-cols-2 gap-3 mt-2">
            <div className="rounded-xl bg-gradient-to-br from-kid-yellow/30 to-kid-orange/20 p-3 text-center">
              <p className="text-xs text-gray-600 mb-1 font-medium">Hafalan</p>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-lg text-gray-800">
                  {student.hafalanProgress?.total || 0}
                  <span className="text-xs font-medium ml-1">Surahs</span>
                </p>
                <div className="bg-white rounded-full p-1 shadow-sm">
                  <ArrowUp className="h-3 w-3 text-kid-green" />
                </div>
              </div>
              
              <div className="mb-2">
                <Progress value={hafalanPercentage} className="h-2 bg-kid-yellow/30" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  {student.hafalanProgress?.lastSurah || '-'}
                </span>
                <span className="font-medium text-kid-green">
                  {Math.round(hafalanPercentage)}%
                </span>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-kid-blue/20 to-kid-teal/20 p-3 text-center">
              <p className="text-xs text-gray-600 mb-1 font-medium">Tilawah</p>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-lg text-gray-800">
                  {student.tilawahProgress?.jilid || "-"}
                  <span className="text-xs font-medium ml-1">Jilid</span>
                </p>
                <div className="bg-white rounded-full p-1 shadow-sm">
                  <ArrowUp className="h-3 w-3 text-kid-blue" />
                </div>
              </div>
              
              <div className="mb-2">
                <Progress value={tilawahPercentage} className="h-2 bg-kid-blue/30" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  {student.tilawahProgress?.page ? `Page ${student.tilawahProgress.page}` : '-'}
                </span>
                <span className="font-medium text-kid-blue">
                  {Math.round(tilawahPercentage)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2 pt-0 pb-4">
        <Button
          onClick={handleViewDetails}
          className="rounded-full bg-kid-blue text-white hover:bg-kid-blue/90 shadow-md"
          size="sm"
        >
          View Report
        </Button>
        {viewType === "teacher" && (
          <Button 
            onClick={handleAddProgress} 
            className="btn-kid-primary shadow-md"
            size="sm"
          >
            Add Progress
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StudentCard;
