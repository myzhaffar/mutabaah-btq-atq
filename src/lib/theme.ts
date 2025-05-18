
import { create } from 'zustand';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useTheme = create<ThemeState>((set) => {
  // Check if user has previously set a theme preference
  const savedTheme = localStorage.getItem('theme') as Theme;
  // Check system preference if no saved preference
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Determine initial theme
  const initialTheme: Theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  // Apply theme to document
  document.documentElement.classList.toggle('dark', initialTheme === 'dark');

  return {
    theme: initialTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
      set({ theme });
    },
    toggleTheme: () => {
      set(state => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        return { theme: newTheme };
      });
    }
  };
});
