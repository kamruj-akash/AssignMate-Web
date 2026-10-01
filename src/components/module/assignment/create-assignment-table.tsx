import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/tablePagination";
import { toast } from "@/components/ui/toast";
import {
  useAssignmentAction,
  useDeleteAssignment,
  useSuspendedGetMyAssignments,
} from "@/hooks";
import {
  AssignmentStatus,
  IAssignment,
  IAssignmentQueryParams,
  TStudentAssignmentStatus,
} from "@/type";
import { cn } from "cn";
import { format } from "date-fns";
import { Paperclip } from "lucide-react";
import Link from "next/link";

const statusStyles: Record<TStudentAssignmentStatus, string> = {
  OPEN: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  ASSIGNED: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  AWAITING_PAYMENT: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  IN_PROGRESS: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  SUBMITTED: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  UNDER_REVIEW: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  COMPLETED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  CANCELLED: "bg-muted text-muted-foreground",
  DISPUTED: "bg-destructive/10 text-destructive",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function CreateAssignmentTable({
  setPage,
  queryParams,
}: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  queryParams: IAssignmentQueryParams;
}) {
  const { data } = useSuspendedGetMyAssignments(queryParams);
  const assignments = data?.data ?? [];
  const totalPage = data?.meta?.totalPages || 1;
  const currentPage = data?.meta?.page ?? queryParams.page ?? 1;
  const limit = data?.meta?.limit ?? queryParams.limit ?? 10;

  return (
    <>
      <Table className="border border-border">
        <TableHeader>
          <TableRow>
            <TableHead>SL</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Expert</TableHead>
            <TableHead className="text-right">Budget</TableHead>
            <TableHead className="text-right">Bids</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Attachments</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                No assignments found.
              </TableCell>
            </TableRow>
          )}
          {assignments.map((assignment, index) => (
            <TableRow key={assignment.id}>
              <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
              <TableCell className="max-w-xs">
                <p className="truncate font-medium" title={assignment.title}>
                  {assignment.title}
                </p>
                <p
                  className="truncate text-xs text-muted-foreground"
                  title={assignment.description}
                >
                  {assignment.description}
                </p>
              </TableCell>
              <TableCell>
                {format(new Date(assignment.deadline), "dd MMM yyyy")}
              </TableCell>
              <TableCell>
                {assignment.assignedExpert ? (
                  <>
                    <p>{assignment.assignedExpert.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {assignment.assignedExpert.university}
                    </p>
                  </>
                ) : (
                  <span className="text-muted-foreground">Not assigned</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                {currencyFormatter.format(Number(assignment.budget))}
              </TableCell>
              <TableCell className="text-right">
                {assignment._count.bids}
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                    statusStyles[assignment.status],
                  )}
                >
                  {assignment.status.replaceAll("_", " ")}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {assignment.attachmentUrl ? (
                  <a
                    href={assignment.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Paperclip className="h-4 w-4" />
                    <span>View</span>
                  </a>
                ) : (
                  <span className="text-muted-foreground">No file</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <AssignmentActions assignment={assignment} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPage > 1 && (
        <TablePagination setPage={setPage} totalPages={totalPage} />
      )}
    </>
  );
}

function AssignmentActions({ assignment }: { assignment: IAssignment }) {
  const { mutate: changeAction, isPending } = useAssignmentAction();
  const { mutate: deleteAssignment, isPending: isDeleting } =
    useDeleteAssignment();
  //
  const handleAction = (status: AssignmentStatus) => {
    changeAction(
      { assignmentId: assignment.id, status },
      {
        onSuccess: (res) => {
          toast.add({ title: res.message, type: "success" });
        },
        onError: (err) => {
          toast.add({
            title: err.message || "Something went wrong",
            type: "error",
          });
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteAssignment(id, {
      onSuccess: (res) => {
        toast.add({
          title: res.message || "Assignment deleted",
          type: "success",
        });
      },
      onError: (err) => {
        toast.add({
          title: err.message || "Something went wrong",
          type: "error",
        });
      },
    });
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {assignment.submissionUrl && (
        <Button
          variant="default"
          title="View submission"
          render={
            <Link
              href={assignment.submissionUrl.url}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
          nativeButton={false}
        >
          View Submission
        </Button>
      )}
      {assignment.status === "SUBMITTED" && (
        <Button
          size="sm"
          disabled={isPending}
          onClick={() => handleAction("COMPLETED")}
        >
          {isPending ? "Approving..." : "Approve"}
        </Button>
      )}
      {assignment.status === "OPEN" && (
        <>
          <Button size="sm">View Bids</Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={isDeleting}
            onClick={() => handleDelete(assignment.id)}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </>
      )}
    </div>
  );
}
