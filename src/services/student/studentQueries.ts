
import { supabase } from "@/integrations/supabase/client";
import { Student, StudentWithProgress } from "@/types/database";
import { toast } from "@/components/ui/use-toast";

export async function getStudents(): Promise<StudentWithProgress[]> {
  try {
    // Fetch students data
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("*");

    if (studentsError) {
      throw studentsError;
    }

    // Fetch hafalan progress data
    const { data: hafalanProgress, error: hafalanError } = await supabase
      .from("hafalan_progress")
      .select("*");

    if (hafalanError) {
      throw hafalanError;
    }

    // Fetch tilawah progress data
    const { data: tilawahProgress, error: tilawahError } = await supabase
      .from("tilawah_progress")
      .select("*");

    if (tilawahError) {
      throw tilawahError;
    }

    // Create StudentWithProgress objects
    const studentsWithProgress = students.map((student: Student) => {
      // Find the hafalan progress for this student
      const hafalanData = hafalanProgress.find((h) => h.student_id === student.id);
      
      // Find the tilawah progress for this student
      const tilawahData = tilawahProgress.find((t) => t.student_id === student.id);
      
      return {
        id: student.id,
        name: student.name,
        photo: student.photo || "",
        group: student.group_name,
        grade: student.grade || undefined,
        teacher: student.teacher,
        hafalanProgress: {
          total: hafalanData?.total_surah || 0,
          lastSurah: hafalanData?.last_surah || "",
          percentage: hafalanData?.percentage || 0,
        },
        tilawahProgress: {
          jilid: tilawahData?.jilid || "",
          page: tilawahData?.page || 0,
          percentage: tilawahData?.percentage || 0,
        },
      } as StudentWithProgress;
    });

    return studentsWithProgress;
  } catch (error) {
    console.error("Error fetching students:", error);
    toast({
      title: "Error",
      description: "Failed to fetch students. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
}

export async function getStudentById(id: string): Promise<StudentWithProgress | null> {
  try {
    // Fetch student data
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("*")
      .eq("id", id)
      .single();

    if (studentError) {
      throw studentError;
    }

    // Fetch hafalan progress data
    const { data: hafalanData, error: hafalanError } = await supabase
      .from("hafalan_progress")
      .select("*")
      .eq("student_id", id)
      .single();

    if (hafalanError && hafalanError.code !== "PGRST116") {
      // PGRST116 means no rows returned
      throw hafalanError;
    }

    // Fetch tilawah progress data
    const { data: tilawahData, error: tilawahError } = await supabase
      .from("tilawah_progress")
      .select("*")
      .eq("student_id", id)
      .single();

    if (tilawahError && tilawahError.code !== "PGRST116") {
      throw tilawahError;
    }

    return {
      id: student.id,
      name: student.name,
      photo: student.photo || "",
      group: student.group_name,
      grade: student.grade || undefined,
      teacher: student.teacher,
      hafalanProgress: {
        total: hafalanData?.total_surah || 0,
        lastSurah: hafalanData?.last_surah || "",
        percentage: hafalanData?.percentage || 0,
      },
      tilawahProgress: {
        jilid: tilawahData?.jilid || "",
        page: tilawahData?.page || 0,
        percentage: tilawahData?.percentage || 0,
      },
    } as StudentWithProgress;
  } catch (error) {
    console.error("Error fetching student:", error);
    toast({
      title: "Error",
      description: "Failed to fetch student details. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
}
