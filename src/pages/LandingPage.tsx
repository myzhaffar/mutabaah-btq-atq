
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Star } from "lucide-react";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-kid-green to-kid-teal flex items-center justify-center">
            <span className="text-white font-bold text-lg">Q</span>
          </div>
          <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-kid-green to-kid-teal bg-clip-text text-transparent">
            QuranTracker
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="rounded-full"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate("/login")}
            className="rounded-full bg-gradient-to-r from-kid-green to-kid-teal hover:opacity-90"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-kid-green to-kid-teal bg-clip-text text-transparent mb-6">
            Track Quran Learning Progress
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            An easy-to-use platform for teachers and parents to monitor children's
            Quran memorization and recitation progress.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => navigate("/teacher/students")}
              size="lg"
              className="rounded-full bg-gradient-to-r from-kid-green to-kid-teal hover:opacity-90"
            >
              Teacher Dashboard
            </Button>
            <Button
              onClick={() => navigate("/parent/dashboard")}
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              Parent Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="h-12 w-12 rounded-full bg-kid-green/10 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-kid-green" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
            <p className="text-gray-600">
              Record and monitor daily hafalan and tilawah achievements for each student.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="h-12 w-12 rounded-full bg-kid-teal/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-kid-teal" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Student Management</h3>
            <p className="text-gray-600">
              Easily add, edit, and organize student profiles with comprehensive information.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="h-12 w-12 rounded-full bg-kid-yellow/10 flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-kid-yellow" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Reports & Insights</h3>
            <p className="text-gray-600">
              View detailed reports and analytics to track improvements over time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="bg-gradient-to-r from-kid-green/10 to-kid-teal/10 rounded-3xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join teachers and parents who are already using QuranTracker to monitor
              students' Quran learning journey.
            </p>
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              className="rounded-full bg-gradient-to-r from-kid-green to-kid-teal hover:opacity-90"
            >
              Sign up now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-kid-green to-kid-teal flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <h2 className="ml-2 text-lg font-bold bg-gradient-to-r from-kid-green to-kid-teal bg-clip-text text-transparent">
              QuranTracker
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Quran Progress Monitor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
