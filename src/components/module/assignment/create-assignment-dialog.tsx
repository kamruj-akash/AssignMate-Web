import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateAssignmentForm from "./create-assignment-form";

export default function CreateAssignmentDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus />
        Create Assignment
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create Assignment
          </DialogTitle>
          <DialogDescription>
            Post a new assignment for experts to bid on.
          </DialogDescription>
        </DialogHeader>

        <CreateAssignmentForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
