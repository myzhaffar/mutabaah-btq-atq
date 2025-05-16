
import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { ProgressFormValues } from "./schema/progressFormSchema";

const ProgressTypeField = () => {
  const form = useFormContext<ProgressFormValues>();
  
  return (
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
  );
};

export default ProgressTypeField;
