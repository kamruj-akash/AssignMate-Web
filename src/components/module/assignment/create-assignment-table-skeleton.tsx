import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const columns = [
  "SL",
  "Title",
  "Deadline",
  "Expert",
  "Budget",
  "Bids",
  "Status",
  "Actions",
];

export default function CreateAssignmentTableSkeleton({
  rows = 10,
}: {
  rows?: number;
}) {
  return (
    <Table className="border border-border">
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={column} className={index > 3 ? "text-right" : ""}>
              {column}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }, (_, row) => (
          <TableRow key={row}>
            <TableCell>
              <Skeleton className="h-4 w-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="mb-1.5 h-4 w-48" />
              <Skeleton className="h-3 w-64" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="mb-1.5 h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto h-4 w-14" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto h-4 w-6" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto h-5 w-20 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto h-8 w-20" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
