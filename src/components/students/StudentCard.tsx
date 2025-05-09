
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  };
  tilawahProgress?: {
    jilid: string;
    page: number;
    lastDate?: string;
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

  return (
    <Card className="kid-card h-full flex flex-col">
      <CardContent className="pt-6 pb-4 flex-1">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            {student.photo ? (
              <AvatarImage src={student.photo} alt={student.name} />
            ) : (
              <AvatarFallback className="bg-kid-yellow text-gray-700 text-2xl font-bold">
                {student.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <h3 className="font-bold text-xl text-center mb-1">{student.name}</h3>
          <div className="text-sm text-gray-500 mb-4 text-center">
            <p>Group: {student.group}</p>
            <p>Teacher: {student.teacher}</p>
          </div>

          {/* Progress Summary */}
          <div className="w-full grid grid-cols-2 gap-3 mt-2">
            <div className="rounded-lg bg-kid-yellow/20 p-3 text-center">
              <p className="text-xs text-gray-600 mb-1">Hafalan</p>
              <p className="font-semibold">
                {student.hafalanProgress?.total || 0} Surahs
              </p>
              {student.hafalanProgress?.lastSurah && (
                <p className="text-xs mt-1">
                  Last: {student.hafalanProgress.lastSurah}
                </p>
              )}
            </div>
            <div className="rounded-lg bg-kid-blue/20 p-3 text-center">
              <p className="text-xs text-gray-600 mb-1">Tilawah</p>
              <p className="font-semibold">
                Jilid {student.tilawahProgress?.jilid || "-"}
              </p>
              {student.tilawahProgress?.page && (
                <p className="text-xs mt-1">
                  Page {student.tilawahProgress.page}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2 pt-0 pb-4">
        <Button
          onClick={handleViewDetails}
          className="rounded-full bg-kid-blue text-white hover:bg-kid-blue/90"
        >
          View Report
        </Button>
        {viewType === "teacher" && (
          <Button onClick={handleAddProgress} className="btn-kid-primary">
            Add Progress
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StudentCard;
