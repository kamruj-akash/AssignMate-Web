import { getAssignmentById } from "@/api";
import PaymentResult from "@/components/module/payment/payment-result";
import { toast } from "@/components/ui/toast";
import { TAssignmentDetails, TPaymentResultStatus } from "@/type";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment status - AssignMate",
  robots: { index: false },
};

const resultStatuses: TPaymentResultStatus[] = ["success", "failure", "cancel"];

export default async function PaymentResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ assignmentId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { assignmentId } = await params;
  const { paymentStatus } = await searchParams;

  const status = resultStatuses.find((s) => s === paymentStatus) ?? "failure";

  let assignment: TAssignmentDetails | null = null;

  try {
    assignment = (await getAssignmentById(assignmentId)).data;
  } catch {
    toast.add({
      title: "Error",
      description: "Failed to fetch assignment details.",
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 items-center px-4 py-16 sm:py-24">
      <PaymentResult status={status} assignment={assignment} />
    </main>
  );
}
