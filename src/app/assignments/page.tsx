import { Footer } from "@/components/home/footer";
import { Navbar } from "@/components/home/navbar";
import OpenAssignments from "@/components/module/assignment/open-assignments";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Posted Assignments - AssignMate",
  description:
    "Browse assignments students have posted on AssignMate and place a bid as a verified expert.",
};

export default function AssignmentsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-12 pb-20 sm:pt-16">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="text-sm font-medium text-primary">Open for bids</p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Posted assignments
          </h1>
          <p className="text-muted-foreground">
            Every assignment here is waiting for an expert. Payment is held in
            escrow and released only when the student approves the work.
          </p>
        </div>
        <OpenAssignments />
      </main>
      <Footer />
    </>
  );
}
