
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Star } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/lib/i18n";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 dark:text-white transition-colors duration-200">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-kid-green to-kid-teal flex items-center justify-center">
            <span className="text-white font-bold text-lg">Q</span>
          </div>
          <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-kid-green to-kid-teal bg-clip-text text-transparent">
            {t("appName")}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
          <Button
            onClick={() => navigate("/login")}
            className="rounded-full bg-gradient-to-r from-kid-green to-kid-teal hover:opacity-90"
          >
            {t("getStarted")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-kid-green to-kid-teal bg-clip-text text-transparent mb-6">
            {t("trackProgress")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            {t("appDescription")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              className="rounded-full bg-gradient-to-r from-kid-green to-kid-teal hover:opacity-90"
            >
              {t("getStarted")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-12">{t("keyFeatures")}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="h-12 w-12 rounded-full bg-kid-green/10 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-kid-green" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t("trackProgressFeature")}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t("trackProgressDesc")}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="h-12 w-12 rounded-full bg-kid-teal/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-kid-teal" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t("studentManagement")}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t("studentManagementDesc")}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="h-12 w-12 rounded-full bg-kid-yellow/10 flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-kid-yellow" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t("reportsInsights")}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t("reportsInsightsDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="bg-gradient-to-r from-kid-green/10 to-kid-teal/10 dark:from-kid-green/5 dark:to-kid-teal/5 rounded-3xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">{t("readyToStart")}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {t("joinNow")}
            </p>
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              className="rounded-full bg-gradient-to-r from-kid-green to-kid-teal hover:opacity-90"
            >
              {t("signUpNow")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-kid-green to-kid-teal flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <h2 className="ml-2 text-lg font-bold bg-gradient-to-r from-kid-green to-kid-teal bg-clip-text text-transparent">
              {t("appName")}
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} {t("appName")}. {t("allRightsReserved")}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
