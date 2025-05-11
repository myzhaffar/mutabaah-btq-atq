
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
const PROGRESS_SUMMARY = [
  {
    id: "1",
    name: "Ahmad Farhan",
    hafalanProgress: 75,
    tilawahProgress: 60,
  },
  {
    id: "2",
    name: "Fatima Zahra",
    hafalanProgress: 45,
    tilawahProgress: 30,
  },
  {
    id: "3",
    name: "Omar Ibrahim",
    hafalanProgress: 90,
    tilawahProgress: 85,
  },
  {
    id: "4",
    name: "Aisyah Nur",
    hafalanProgress: 40,
    tilawahProgress: 25,
  },
];

const TeacherProgress = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<string>("hafalan");

  return (
    <DashboardLayout userType="teacher" currentTab="progress" onTabChange={(tab) => navigate(`/teacher/${tab}`)}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Students Progress Overview</h1>
        <p className="text-gray-500">Track and monitor all students' Quran memorization and recitation progress</p>
      </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROGRESS_SUMMARY.map((student) => (
              <Card key={student.id} className="overflow-hidden border-none shadow-md rounded-2xl">
                <CardHeader className="bg-gradient-to-r from-kid-green/10 to-kid-teal/10 pb-2">
                  <CardTitle className="text-lg">{student.name}</CardTitle>
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
        </TabsContent>

        <TabsContent value="tilawah" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROGRESS_SUMMARY.map((student) => (
              <Card key={student.id} className="overflow-hidden border-none shadow-md rounded-2xl">
                <CardHeader className="bg-gradient-to-r from-kid-purple/10 to-kid-blue/10 pb-2">
                  <CardTitle className="text-lg">{student.name}</CardTitle>
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
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default TeacherProgress;
