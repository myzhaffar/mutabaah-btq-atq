
import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  group: z.string().min(1, {
    message: "Please enter a grade/class.",
  }),
  teacher: z.string().min(1, {
    message: "Please enter a teacher name.",
  }),
  photo: z.string().optional(),
});

export type StudentFormValues = z.infer<typeof formSchema>;

export { formSchema };

interface StudentFormFieldsProps {
  form: UseFormReturn<StudentFormValues>;
}

const StudentFormFields: React.FC<StudentFormFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Student Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter student's name"
                className="input-kid"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Full name of the student as in school records.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="group"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grade/Class</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter grade or class"
                className="input-kid"
                {...field}
              />
            </FormControl>
            <FormDescription>
              The grade or class the student belongs to.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="teacher"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teacher/Muhafidz</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter teacher's name"
                className="input-kid"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Name of the teacher or muhafidz responsible for the student.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default StudentFormFields;
