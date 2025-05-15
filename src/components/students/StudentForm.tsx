
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { createStudent, updateStudent } from "@/services/studentService";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  group: z.string().min(1, {
    message: "Please select a group.",
  }),
  teacher: z.string().min(1, {
    message: "Please enter a teacher name.",
  }),
  photo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface StudentFormProps {
  initialData?: FormValues;
  isEditing?: boolean;
  studentId?: string;
}

const StudentForm: React.FC<StudentFormProps> = ({ 
  initialData, 
  isEditing = false,
  studentId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      group: "",
      teacher: "",
      photo: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      let success = false;
      
      if (isEditing && studentId) {
        // Update existing student
        success = await updateStudent(studentId, {
          name: values.name,
          group_name: values.group,
          teacher: values.teacher,
          photo: values.photo
        });
      } else {
        // Create new student
        success = await createStudent({
          name: values.name,
          group_name: values.group,
          teacher: values.teacher,
          photo: values.photo,
          grade: null
        });
      }
      
      if (success) {
        if (isEditing && studentId) {
          navigate(`/teacher/student/${studentId}`);
        } else {
          navigate("/teacher/students");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditing ? "Edit Student" : "Add New Student"}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <FormLabel>Learning Group</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter group name"
                    className="input-kid"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The learning group or class the student belongs to.
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

          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo URL (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter photo URL"
                    className="input-kid"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Link to student's profile photo (optional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => isEditing && studentId ? navigate(`/teacher/student/${studentId}`) : navigate("/teacher/students")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-kid-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Student"
                : "Add Student"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StudentForm;
