
// i18n.ts - Simple internationalization utility
import { create } from 'zustand';

// Define language types
export type Language = 'en' | 'id';

// Translation interface
export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Translation content
export const translations: Translations = {
  // English translations
  en: {
    // Common
    appName: "QuranTracker",
    getStarted: "Get Started",
    login: "Login",
    
    // Landing page
    trackProgress: "Track Quran Learning Progress",
    appDescription: "An easy-to-use platform for teachers and parents to monitor children's Quran memorization and recitation progress.",
    keyFeatures: "Key Features",
    trackProgressFeature: "Track Progress",
    trackProgressDesc: "Record and monitor daily hafalan and tilawah achievements for each student.",
    studentManagement: "Student Management",
    studentManagementDesc: "Easily add, edit, and organize student profiles with comprehensive information.",
    reportsInsights: "Reports & Insights",
    reportsInsightsDesc: "View detailed reports and analytics to track improvements over time.",
    readyToStart: "Ready to get started?",
    joinNow: "Join teachers and parents who are already using QuranTracker to monitor students' Quran learning journey.",
    signUpNow: "Sign up now",
    allRightsReserved: "All rights reserved.",
    
    // Theme switcher
    darkMode: "Dark Mode",
    lightMode: "Light Mode",

    // Language switcher
    language: "Language",
    english: "English",
    indonesian: "Indonesian",
  },
  
  // Indonesian translations
  id: {
    // Common
    appName: "QuranTracker",
    getStarted: "Mulai",
    login: "Masuk",
    
    // Landing page
    trackProgress: "Pantau Progres Belajar Quran",
    appDescription: "Platform yang mudah digunakan untuk guru dan orang tua untuk memantau kemajuan hafalan dan bacaan Quran anak-anak.",
    keyFeatures: "Fitur Utama",
    trackProgressFeature: "Pantau Progres",
    trackProgressDesc: "Catat dan pantau pencapaian hafalan dan tilawah harian untuk setiap siswa.",
    studentManagement: "Manajemen Siswa",
    studentManagementDesc: "Dengan mudah menambahkan, mengedit, dan mengatur profil siswa dengan informasi lengkap.",
    reportsInsights: "Laporan & Wawasan",
    reportsInsightsDesc: "Lihat laporan terperinci dan analitik untuk melacak peningkatan dari waktu ke waktu.",
    readyToStart: "Siap untuk memulai?",
    joinNow: "Bergabunglah dengan guru dan orang tua yang sudah menggunakan QuranTracker untuk memantau perjalanan belajar Quran siswa.",
    signUpNow: "Daftar sekarang",
    allRightsReserved: "Semua hak dilindungi undang-undang.",
    
    // Theme switcher
    darkMode: "Mode Gelap",
    lightMode: "Mode Terang",

    // Language switcher
    language: "Bahasa",
    english: "Bahasa Inggris",
    indonesian: "Bahasa Indonesia",
  },
};

// Create a store for language state
interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const useLanguage = create<LanguageState>((set, get) => ({
  language: (localStorage.getItem('language') as Language) || 'en',
  setLanguage: (language: Language) => {
    localStorage.setItem('language', language);
    set({ language });
  },
  t: (key: string) => {
    const { language } = get();
    return translations[language]?.[key] || translations['en'][key] || key;
  }
}));
