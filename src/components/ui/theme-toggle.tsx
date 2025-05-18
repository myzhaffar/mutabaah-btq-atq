
import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { useLanguage } from "@/lib/i18n";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="rounded-full w-10 h-10 p-0"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">
        {theme === "light" ? t("darkMode") : t("lightMode")}
      </span>
    </Button>
  );
};
