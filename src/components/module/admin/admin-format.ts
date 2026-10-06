import {
  TEscrowStatus,
  TExpertVerificationStatus,
  TPaymentStatus,
  TStudentAssignmentStatus,
} from "@/type";
import { format, isValid } from "date-fns";

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const formatCurrency = (value: number | string) =>
  currencyFormatter.format(Number(value));

export const numberFormatter = new Intl.NumberFormat("en-US");

export const formatStatus = (status: string) => status.replaceAll("_", " ");

export const formatDate = (value: string | null | undefined, pattern = "dd MMM yyyy") => {
  if (!value) return "—";
  const date = new Date(value);
  return isValid(date) ? format(date, pattern) : "—";
};

export const assignmentStatusStyles: Record<TStudentAssignmentStatus, string> = {
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

export const paymentStatusStyles: Record<TPaymentStatus, string> = {
  INITIATED: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  PAID: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  FAILED: "bg-destructive/10 text-destructive",
  REFUNDED: "bg-muted text-muted-foreground",
};

export const escrowStatusStyles: Record<TEscrowStatus, string> = {
  HELD: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  RELEASED_TO_EXPERT: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  REFUNDED_TO_STUDENT: "bg-muted text-muted-foreground",
};

export const expertStatusStyles: Record<TExpertVerificationStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  APPROVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  REJECT: "bg-destructive/10 text-destructive",
};
