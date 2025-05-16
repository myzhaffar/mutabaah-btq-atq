
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { addProgressEntry } from "@/services/student";
import { format } from "date-fns";
import { progressFormSchema, ProgressFormValues } from "./schema/progressFormSchema";
import ProgressDateField from "./ProgressDateField";
import ProgressTypeField from "./ProgressTypeField";
import ProgressDetailFields from "./ProgressDetailFields";

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

  const form = useForm<ProgressFormValues>({
    resolver: zodResolver(progressFormSchema),
    defaultValues: {
      date: new Date(),
      type: "hafalan",
      surahOrJilid: "",
      ayatOrPage: "",
      notes: "",
    },
  });

  const onSubmit = async (values: ProgressFormValues) => {
    setIsSubmitting(true);
    
    const success = await addProgressEntry({
      student_id: studentId,
      date: format(values.date, 'yyyy-MM-dd'),
      type: values.type,
      surah_or_jilid: values.surahOrJilid,
      ayat_or_page: values.ayatOrPage,
      notes: values.notes || null
    });
    
    setIsSubmitting(false);
    
    if (success) {
      navigate(`/teacher/student/${studentId}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add Daily Progress</h2>
        <p className="text-gray-600">Student: {studentName}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ProgressDateField />
          <ProgressTypeField />
          <ProgressDetailFields />

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
