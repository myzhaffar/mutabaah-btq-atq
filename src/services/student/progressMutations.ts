
import { supabase } from "@/integrations/supabase/client";
import { ProgressEntry } from "@/types/database";
import { toast } from "@/components/ui/use-toast";

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
async function updateHafalanProgress(studentId: string, surah: string): Promise<void> {
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
async function updateTilawahProgress(studentId: string, jilid: string, page: number): Promise<void> {
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
