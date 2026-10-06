"use client";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/tablePagination";
import { useGetAllStudents } from "@/hooks";
import { useDebounce } from "@/hooks/debounce.hook";
import { cn } from "cn";
import { Search } from "lucide-react";
import { useState } from "react";
import { formatDate } from "./admin-format";
import AdminTableSkeleton from "./admin-table-skeleton";
import StatusBadge from "./status-badge";
import StudentDetailsSheet from "./student-details-sheet";

const PAGE_LIMIT = 10;
const COLUMN_COUNT = 7;

export default function StudentManagement() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading, isError, error, isPlaceholderData } =
    useGetAllStudents({
      page,
      limit: PAGE_LIMIT,
      searchTerm: debouncedSearchTerm || undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  const students = data?.data ?? [];
  const currentPage = data?.meta?.page ?? page;
  const totalPages = data?.meta?.totalPages ?? 1;
  const limit = data?.meta?.limit ?? PAGE_LIMIT;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-xl font-semibold">
          Student management
        </h1>
        <p className="text-sm text-muted-foreground">
          {data?.meta
            ? `${data.meta.total} registered students.`
            : "Every registered student on the platform."}
        </p>
      </div>

      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search by name, email or institution..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <AdminTableSkeleton columns={COLUMN_COUNT} />
      ) : (
        <Table
          className={cn(
            "border border-border transition-opacity",
            isPlaceholderData && "opacity-60",
          )}
        >
          <TableHeader>
            <TableRow>
              <TableHead>SL</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead className="text-right">Assignments</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Account</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isError && (
              <TableRow>
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="py-10 text-center text-destructive"
                >
                  {error.message || "Failed to load students."}
                </TableCell>
              </TableRow>
            )}
            {!isError && students.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="py-10 text-center text-muted-foreground"
                >
                  {debouncedSearchTerm
                    ? "No students match your search."
                    : "No students have registered yet."}
                </TableCell>
              </TableRow>
            )}
            {students.map((student, index) => (
              <TableRow key={student.id}>
                <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                <TableCell>
                  <p className="font-medium">{student.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {student.user.email}
                  </p>
                </TableCell>
                <TableCell>
                  <p>{student.institution || "—"}</p>
                  {student.academicLevel && (
                    <p className="text-xs text-muted-foreground">
                      {student.academicLevel}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {student._count.assignmentTasks}
                </TableCell>
                <TableCell>{formatDate(student.createdAt)}</TableCell>
                <TableCell className="text-right">
                  {student.user.status === "BLOCK" ? (
                    <StatusBadge
                      status="BLOCK"
                      label="Blocked"
                      className="bg-destructive/10 text-destructive"
                    />
                  ) : (
                    <StatusBadge
                      status="ACTIVE"
                      label="Active"
                      className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <StudentDetailsSheet student={student} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
