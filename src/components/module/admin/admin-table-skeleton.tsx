import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "cn";

export default function AdminTableSkeleton({
  columns,
  rows = 6,
}: {
  columns: number;
  rows?: number;
}) {
  return (
    <Table className="border border-border">
      <TableHeader>
        <TableRow>
          {Array.from({ length: columns }, (_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-4 w-16" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }, (_, row) => (
          <TableRow key={row}>
            {Array.from({ length: columns }, (_, i) => (
              <TableCell key={i}>
                {i === 1 ? (
                  <>
                    <Skeleton className="mb-1.5 h-4 w-36" />
                    <Skeleton className="h-3 w-48" />
                  </>
                ) : (
                  <Skeleton className={cn("h-4", i === 0 ? "w-5" : "w-20")} />
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
