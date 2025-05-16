
import { supabase } from "@/integrations/supabase/client";
import { ProgressEntry } from "@/types/database";
import { toast } from "@/components/ui/use-toast";

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
