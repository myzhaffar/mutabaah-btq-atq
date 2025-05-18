
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { createStudent, updateStudent } from "@/services/student";
import StudentPhotoUploader from "./StudentPhotoUploader";
import StudentFormFields, { formSchema, StudentFormValues } from "./StudentFormFields";

interface StudentFormProps {
  initialData?: StudentFormValues;
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
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.photo || null
  );

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      group: "",
      teacher: "",
      photo: "",
    },
  });

  const handleImageUpload = (base64String: string) => {
    setImagePreview(base64String);
    form.setValue("photo", base64String);
  };

  const onSubmit = async (values: StudentFormValues) => {
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
      
      <StudentPhotoUploader 
        imagePreview={imagePreview} 
        onImageUpload={handleImageUpload}
        nameInitial={initialData?.name?.charAt(0) || "S"}
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <StudentFormFields form={form} />

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
