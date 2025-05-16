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

    // Type assertion to ensure 'type' is properly typed as 'hafalan' | 'tilawah'
    return data.map(entry => ({
      ...entry,
      type: entry.type as 'hafalan' | 'tilawah'
    })) as ProgressEntry[];
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

export async function addProgressEntry(entry: Omit<ProgressEntry, 'id' | 'created_at'>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("progress_entries")
      .insert([{
        student_id: entry.student_id,
        date: entry.date,
        type: entry.type,
        surah_or_jilid: entry.surah_or_jilid,
        ayat_or_page: entry.ayat_or_page,
        notes: entry.notes
      }]);

    if (error) {
      throw error;
    }

    // Update the relevant progress table based on the entry type
    if (entry.type === 'hafalan') {
      // Update hafalan progress
      await updateHafalanProgress(entry.student_id, entry.surah_or_jilid || '');
    } else if (entry.type === 'tilawah') {
      // Update tilawah progress
      await updateTilawahProgress(entry.student_id, entry.surah_or_jilid || '', parseInt(entry.ayat_or_page || '0'));
    }

    toast({
      title: "Success",
      description: "Progress has been successfully recorded",
    });
    
    return true;
  } catch (error) {
    console.error("Error adding progress entry:", error);
    toast({
      title: "Error",
      description: "Failed to record progress. Please try again later.",
      variant: "destructive",
    });
    return false;
  }
}

// Helper function to update hafalan progress
async function updateHafalanProgress(studentId: string, surah: string) {
  try {
    // Get current hafalan progress
    const { data: currentProgress } = await supabase
      .from("hafalan_progress")
      .select("*")
      .eq("student_id", studentId)
      .single();
    
    // Increment total surah count if this is a new surah
    let totalSurah = currentProgress?.total_surah || 0;
    if (currentProgress?.last_surah !== surah) {
      totalSurah += 1;
    }
    
    // Calculate approximate percentage (simple implementation)
    // Assuming there are 114 surahs in the Quran
    const percentage = Math.min(Math.round((totalSurah / 114) * 100), 100);

    // Update the hafalan progress
    await supabase
      .from("hafalan_progress")
      .upsert({
        student_id: studentId,
        total_surah: totalSurah,
        last_surah: surah,
        percentage: percentage,
        updated_at: new Date().toISOString()
      });
  } catch (error) {
    console.error("Error updating hafalan progress:", error);
  }
}

// Helper function to update tilawah progress
async function updateTilawahProgress(studentId: string, jilid: string, page: number) {
  try {
    // Get current tilawah progress
    const { data: currentProgress } = await supabase
      .from("tilawah_progress")
      .select("*")
      .eq("student_id", studentId)
      .single();
    
    // Calculate approximate percentage (simple implementation)
    // Assuming each jilid has 100 pages
    const percentage = Math.min(Math.round((page / 100) * 100), 100);

    // Update the tilawah progress
    await supabase
      .from("tilawah_progress")
      .upsert({
        student_id: studentId,
        jilid: jilid,
        page: page,
        percentage: percentage,
        updated_at: new Date().toISOString()
      });
  } catch (error) {
    console.error("Error updating tilawah progress:", error);
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
