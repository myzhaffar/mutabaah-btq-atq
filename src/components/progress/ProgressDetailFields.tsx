
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext, useWatch } from "react-hook-form";
import { ProgressFormValues } from "./schema/progressFormSchema";

const ProgressDetailFields = () => {
  const form = useFormContext<ProgressFormValues>();
  const progressType = useWatch({
    control: form.control,
    name: "type",
  });
  
  return (
    <>
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
    </>
  );
};

export default ProgressDetailFields;
