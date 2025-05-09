
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

interface ProgressFormProps {
  studentId: string;
  studentName: string;
}

const ProgressForm: React.FC<ProgressFormProps> = ({
  studentId,
  studentName,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      type: "hafalan",
      surahOrJilid: "",
      ayatOrPage: "",
      notes: "",
    },
  });

  const progressType = form.watch("type");

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    console.log("Progress submitted:", values);

    // In a real app, you would save this to Supabase
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/teacher/student/${studentId}`);
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add Daily Progress</h2>
        <p className="text-gray-600">Student: {studentName}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Date Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal input-kid",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Date when the progress was made.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Progress Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Progress Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="input-kid">
                      <SelectValue placeholder="Select progress type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="hafalan">Quran Memorization (Hafalan)</SelectItem>
                    <SelectItem value="tilawah">Quran Recitation (Tilawah)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select whether this progress is for memorization or recitation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Surah or Jilid */}
          <FormField
            control={form.control}
            name="surahOrJilid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {progressType === "hafalan" ? "Surah" : "Jilid"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      progressType === "hafalan"
                        ? "Enter Surah name"
                        : "Enter Jilid number"
                    }
                    className="input-kid"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {progressType === "hafalan"
                    ? "The Surah that was memorized"
                    : "The Tilawati jilid that was studied"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ayat or Page */}
          <FormField
            control={form.control}
            name="ayatOrPage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {progressType === "hafalan" ? "Verses (Ayat)" : "Page"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      progressType === "hafalan"
                        ? "Enter verse numbers (e.g. 1-5)"
                        : "Enter page number"
                    }
                    className="input-kid"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {progressType === "hafalan"
                    ? "The verses that were memorized"
                    : "The page number that was covered"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any additional notes here"
                    className="input-kid resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Any additional comments or feedback about today's progress.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/teacher/student/${studentId}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-kid-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Progress"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProgressForm;
