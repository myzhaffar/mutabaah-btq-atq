
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types/database";
import { toast } from "@/components/ui/use-toast";

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
