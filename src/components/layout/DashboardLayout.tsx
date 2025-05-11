
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: "teacher" | "parent";
  currentTab?: string;
  onTabChange?: (value: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userType,
  currentTab,
  onTabChange,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app with Supabase, you would sign out the user
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm py-4 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-kid-green to-kid-teal flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-kid-green to-kid-teal bg-clip-text text-transparent">
              QuranTracker
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full text-gray-700">
              {userType === "teacher" ? "Teacher" : "Parent"}
            </span>
            <Button onClick={handleLogout} variant="outline" size="sm" className="rounded-full">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 flex-1">
        {userType === "teacher" && (
          <Tabs
            value={currentTab}
            onValueChange={onTabChange}
            className="w-full mb-8"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2 p-1 rounded-full bg-gray-100">
              <TabsTrigger 
                value="students" 
                className="text-base rounded-full data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm"
              >
                Students
              </TabsTrigger>
              <TabsTrigger 
                value="progress" 
                className="text-base rounded-full data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm"
              >
                Progress
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        {children}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-4 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Quran Progress Monitor. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
