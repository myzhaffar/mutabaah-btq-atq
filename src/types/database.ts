
export interface Student {
  id: string;
  name: string;
  photo: string;
  group_name: string;
  grade: string | null;
  teacher: string;
  created_at: string;
  updated_at: string;
}

export interface HafalanProgress {
  id: string;
  student_id: string;
  total_surah: number;
  last_surah: string | null;
  percentage: number;
  created_at: string;
  updated_at: string;
}

export interface TilawahProgress {
  id: string;
  student_id: string;
  jilid: string | null;
  page: number | null;
  percentage: number;
  created_at: string;
  updated_at: string;
}

export interface ProgressEntry {
  id: string;
  student_id: string;
  date: string;
  type: 'hafalan' | 'tilawah';
  surah_or_jilid: string | null;
  ayat_or_page: string | null;
  notes: string | null;
  created_at: string;
}

export interface StudentWithProgress {
  id: string;
  name: string;
  photo: string;
  group: string;
  grade?: string;
  teacher: string;
  hafalanProgress: {
    total: number;
    lastSurah: string;
    percentage: number;
  };
  tilawahProgress: {
    jilid: string;
    page: number;
    percentage: number;
  };
}
