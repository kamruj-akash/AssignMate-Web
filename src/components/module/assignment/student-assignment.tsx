"use client";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/debounce.hook";
import { IAssignmentQueryParams, TStudentAssignmentStatus } from "@/type";
import { Suspense, useState } from "react";
import CreateAssignmentTable from "./create-assignment-table";
import CreateAssignmentTableSkeleton from "./create-assignment-table-skeleton";

const assignmentTabs: (TStudentAssignmentStatus | "ALL")[] = [
  "ALL",
  "OPEN",
  "AWAITING_PAYMENT",
  "ASSIGNED",
  "IN_PROGRESS",
  "SUBMITTED",
  "UNDER_REVIEW",
  "COMPLETED",
  "CANCELLED",
  "DISPUTED",
];

export default function StudentAssignmentTable() {
  const [tab, setTab] = useState<TStudentAssignmentStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const queryParams: IAssignmentQueryParams = {
    status: tab === "ALL" ? undefined : tab,
    page: page,
    searchTerm: debouncedSearchTerm,
  };

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        setTab(value as TStudentAssignmentStatus | "OPEN");
        setPage(1);
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <Input
          className="w-lg"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        {/* <CreateAssignmentDialog /> */}
      </div>
      <TabsList className="mb-4">
        {assignmentTabs.map((tab) => (
          <TabsTrigger className={"cursor-pointer"} key={tab} value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <Suspense fallback={<CreateAssignmentTableSkeleton />}>
        <CreateAssignmentTable setPage={setPage} queryParams={queryParams} />
      </Suspense>
    </Tabs>
  );
}
