
import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

interface StudentPhotoUploaderProps {
  imagePreview: string | null;
  onImageUpload: (base64: string) => void;
  nameInitial?: string;
}

const StudentPhotoUploader: React.FC<StudentPhotoUploaderProps> = ({
  imagePreview,
  onImageUpload,
  nameInitial = "S"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Convert image to base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-gray-200">
          {imagePreview ? (
            <AvatarImage src={imagePreview} alt="Student photo" />
          ) : (
            <AvatarFallback className="bg-kid-yellow/20 text-3xl">
              {nameInitial}
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
  );
};

export default StudentPhotoUploader;
