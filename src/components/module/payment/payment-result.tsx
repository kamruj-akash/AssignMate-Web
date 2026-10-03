import { Button } from "@/components/ui/button";
import { TAssignmentDetails, TPaymentResultStatus } from "@/type";
import { cn } from "cn";
import { format } from "date-fns";
import { CircleCheck, CircleX, LucideIcon, Undo2 } from "lucide-react";
import Link from "next/link";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const content: Record<
  TPaymentResultStatus,
  {
    icon: LucideIcon;
    iconClass: string;
    title: string;
    description: string;
    action: string;
  }
> = {
  success: {
    icon: CircleCheck,
    iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    title: "Payment successful",
    description:
      "Your payment is held safely in escrow. Your expert has been notified and can start working now. A receipt has been sent to your email.",
    action: "Go to my assignments",
  },
  failure: {
    icon: CircleX,
    iconClass: "bg-destructive/10 text-destructive",
    title: "Payment failed",
    description:
      "We couldn't complete your payment and you haven't been charged. You can try again from your assignments.",
    action: "Back to assignments",
  },
  cancel: {
    icon: Undo2,
    iconClass: "bg-muted text-muted-foreground",
    title: "Payment cancelled",
    description:
      "You cancelled the payment, so nothing was charged. The assignment stays reserved for your expert until you pay.",
    action: "Back to assignments",
  },
};

export default function PaymentResult({
  status,
  assignment,
}: {
  status: TPaymentResultStatus;
  assignment: TAssignmentDetails | null;
}) {
  const { icon: Icon, iconClass, title, description, action } =
    content[status];

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
      <div
        className={cn(
          "mx-auto mb-5 flex size-14 items-center justify-center rounded-full",
          iconClass,
        )}
      >
        <Icon className="size-7" />
      </div>

      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-balance text-muted-foreground">
        {description}
      </p>

      {assignment && (
        <dl className="mt-6 divide-y divide-border rounded-xl border border-border text-left text-sm">
          <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-muted-foreground">Assignment</dt>
            <dd className="truncate font-medium" title={assignment.title}>
              {assignment.title}
            </dd>
          </div>
          <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-muted-foreground">
              {status === "success" ? "Amount paid" : "Amount due"}
            </dt>
            <dd className="font-medium tabular-nums">
              {currencyFormatter.format(Number(assignment.budget))}
            </dd>
          </div>
          <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-muted-foreground">Deadline</dt>
            <dd className="font-medium">
              {format(new Date(assignment.deadline), "MMM d, yyyy")}
            </dd>
          </div>
        </dl>
      )}

      <Button
        className="mt-6 w-full"
        nativeButton={false}
        render={<Link href="/student/assignments" />}
      >
        {action}
      </Button>
    </div>
  );
}
