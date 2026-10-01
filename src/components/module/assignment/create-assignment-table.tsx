import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/tablePagination";
import { useSuspendedGetMyAssignments } from "@/hooks";
import { IAssignmentQueryParams } from "@/type";

export default function CreateAssignmentTable({
  setPage,
  queryParams,
}: {
  setPage: (page: number) => void;
  queryParams: IAssignmentQueryParams;
}) {
  const { data } = useSuspendedGetMyAssignments(queryParams);
  const assignments = data?.data;
  const totalPage = data?.meta?.totalPages || 1;
  return (
    <>
      <Table className="border border-border">
        <TableHeader>
          <TableRow>
            <TableHead>SL</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead className="text-right">Slots</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                No assignments found.
              </TableCell>
            </TableRow>
          )}
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell>{assignment.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination setPage={setPage} totalPages={totalPage} />
    </>
  );
}

/** {
  "id": "d9b01f03-139a-4d09-af4b-12c085e21997",
  "studentId": "74775980-86f1-4c69-9bd3-c3439f5988e0",
  "title": "Data Structures assignment - AVL trees",
  "description": "Implement an AVL tree with insert, delete and in-order traversal, plus a short write-up on rotation cases.",
  "attachmentUrl": null,
  "budget": "2200",
  "deadline": "2026-09-21T17:14:38.829Z",
  "status": "COMPLETED",
  "assignedExpertId": "96b502fe-e2df-40d0-bc4a-2732bca2958b",
  "submissionUrl": {
    "url": "https://res.cloudinary.com/zz7b42os/image/upload/v1788803001/assignment-submissions/ycd6ucfbpr04y5xefmey.pdf",
    "publicId": "assignment-submissions/ycd6ucfbpr04y5xefmey"
  },
  "disputedReason": null,
  "acceptedBidId": "29e72291-dca2-4402-b079-fdc6a6113529",
  "createdAt": "2026-09-07T17:14:41.412Z",
  "updatedAt": "2026-09-07T17:44:13.074Z",
  "assignedExpert": {
    "id": "96b502fe-e2df-40d0-bc4a-2732bca2958b",
    "university": "University of Example",
    "department": "Computer Science",
    "user": {
      "name": "Expert User",
      "email": "expert@assignmate.com"
    }
  },
  "_count": {
    "bids": 1
  }
} */
