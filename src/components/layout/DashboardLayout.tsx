
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
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-kid-green flex items-center justify-center">
              <span className="text-white font-bold">Q</span>
            </div>
            <h1 className="ml-2 text-xl font-bold text-gray-800">QuranTracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">
              {userType === "teacher" ? "Teacher" : "Parent"} Dashboard
            </span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6 flex-1">
        {userType === "teacher" && (
          <Tabs
            value={currentTab}
            onValueChange={onTabChange}
            className="w-full mb-6"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="students" className="text-base">
                Students
              </TabsTrigger>
              <TabsTrigger value="progress" className="text-base">
                Progress
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        {children}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Quran Progress Monitor. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
