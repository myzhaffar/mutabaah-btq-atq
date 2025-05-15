
import { supabase } from "@/integrations/supabase/client";
import { Student, HafalanProgress, TilawahProgress, ProgressEntry, StudentWithProgress } from "@/types/database";
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
      const hafalanData = hafalanProgress.find((h: HafalanProgress) => h.student_id === student.id);
      
      // Find the tilawah progress for this student
      const tilawahData = tilawahProgress.find((t: TilawahProgress) => t.student_id === student.id);
      
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

export async function getProgressEntries(studentId: string): Promise<ProgressEntry[]> {
  try {
    const { data, error } = await supabase
      .from("progress_entries")
      .select("*")
      .eq("student_id", studentId)
      .order("date", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching progress entries:", error);
    toast({
      title: "Error",
      description: "Failed to fetch progress entries. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
}

export async function deleteStudent(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    toast({
      title: "Success",
      description: "Student has been successfully deleted",
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting student:", error);
    toast({
      title: "Error",
      description: "Failed to delete student. Please try again later.",
      variant: "destructive",
    });
    return false;
  }
}

export async function createStudent(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("students")
      .insert([{
        name: student.name,
        photo: student.photo || '',
        group_name: student.group_name,
        grade: student.grade || null,
        teacher: student.teacher
      }])
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    // Create default progress entries
    await supabase.from("hafalan_progress").insert([{
      student_id: data.id,
      total_surah: 0,
      percentage: 0
    }]);

    await supabase.from("tilawah_progress").insert([{
      student_id: data.id,
      percentage: 0
    }]);

    toast({
      title: "Success",
      description: "Student has been successfully added",
    });
    
    return true;
  } catch (error) {
    console.error("Error creating student:", error);
    toast({
      title: "Error",
      description: "Failed to add student. Please try again later.",
      variant: "destructive",
    });
    return false;
  }
}

export async function updateStudent(id: string, student: Partial<Student>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("students")
      .update({
        name: student.name,
        photo: student.photo,
        group_name: student.group_name,
        grade: student.grade,
        teacher: student.teacher,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      throw error;
    }

    toast({
      title: "Success",
      description: "Student has been successfully updated",
    });
    
    return true;
  } catch (error) {
    console.error("Error updating student:", error);
    toast({
      title: "Error",
      description: "Failed to update student. Please try again later.",
      variant: "destructive",
    });
    return false;
  }
}
