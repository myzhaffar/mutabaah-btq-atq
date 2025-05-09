
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-kid-blue/20 via-kid-green/10 to-kid-yellow/20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
        </div>
        <Card className="kid-card animate-scale-in">
          <CardContent className="pt-6">{children}</CardContent>
        </Card>
        <div className="text-center mt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Quran Progress Monitor
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
