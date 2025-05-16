
import { z } from "zod";

export const progressFormSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  type: z.enum(["hafalan", "tilawah"], {
    required_error: "Type is required",
  }),
  surahOrJilid: z.string().min(1, {
    message: "Please enter surah or jilid",
  }),
  ayatOrPage: z.string().min(1, {
    message: "Please enter ayat or page",
  }),
  notes: z.string().optional(),
});

export type ProgressFormValues = z.infer<typeof progressFormSchema>;
