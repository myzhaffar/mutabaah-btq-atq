
import React, { useState, useRef } from "react";
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
import { createStudent, updateStudent } from "@/services/student";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Image } from "lucide-react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.photo || null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      group: "",
      teacher: "",
      photo: "",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Convert image to base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        form.setValue("photo", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
      
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-gray-200">
            {imagePreview ? (
              <AvatarImage src={imagePreview} alt="Student photo" />
            ) : (
              <AvatarFallback className="bg-kid-yellow/20 text-3xl">
                {initialData?.name?.charAt(0) || "S"}
              </AvatarFallback>
            )}
          </Avatar>
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-white p-2 rounded-full border border-gray-200 shadow-sm hover:bg-gray-50"
            onClick={triggerFileInput}
          >
            <Camera size={16} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
      </div>
      
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
