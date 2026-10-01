import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function CreateAssignmentDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus />
        Create Assignment
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-lg font-semibold">
          Create Assignment
        </DialogTitle>

        <DialogDescription className="mt-2 text-sm text-muted-foreground">
          Create a new assignment .
        </DialogDescription>

        {/* <CreateScheduleForm setOpen={setOpen} /> */}
      </DialogContent>
    </Dialog>
  );
}
