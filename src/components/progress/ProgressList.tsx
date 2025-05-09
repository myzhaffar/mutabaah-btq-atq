
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

export interface ProgressEntry {
  id: string;
  date: string;
  type: "hafalan" | "tilawah";
  surahOrJilid: string;
  ayatOrPage: string;
  notes?: string;
}

interface ProgressListProps {
  progressEntries: ProgressEntry[];
  viewType: "teacher" | "parent";
}

const ProgressList: React.FC<ProgressListProps> = ({
  progressEntries,
  viewType,
}) => {
  const [activeTab, setActiveTab] = useState<string>("hafalan");
  const [dateFilter, setDateFilter] = useState<string>("");

  const filteredEntries = progressEntries.filter(
    (entry) =>
      entry.type === activeTab &&
      (dateFilter === "" ||
        entry.date.includes(dateFilter))
  );

  return (
    <div className="w-full">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList className="grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="hafalan" className="text-base">
              Hafalan
            </TabsTrigger>
            <TabsTrigger value="tilawah" className="text-base">
              Tilawah
            </TabsTrigger>
          </TabsList>

          <div className="w-full max-w-xs">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input-kid"
              placeholder="Filter by date"
            />
          </div>
        </div>

        {["hafalan", "tilawah"].map((tabValue) => (
          <TabsContent
            key={tabValue}
            value={tabValue}
            className="rounded-xl border bg-white p-4"
          >
            {filteredEntries.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Date</TableHead>
                    <TableHead>
                      {tabValue === "hafalan" ? "Surah" : "Jilid"}
                    </TableHead>
                    <TableHead>
                      {tabValue === "hafalan" ? "Ayat" : "Page"}
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {format(new Date(entry.date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{entry.surahOrJilid}</TableCell>
                      <TableCell>{entry.ayatOrPage}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {entry.notes || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  {dateFilter
                    ? "No progress entries found for the selected date."
                    : `No ${tabValue} progress entries available.`}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProgressList;
