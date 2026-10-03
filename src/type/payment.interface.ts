import { TStudentAssignmentStatus } from "./assignment.interface";

export type TPaymentStatus = "INITIATED" | "PAID" | "FAILED" | "REFUNDED";

// What the backend appends to /assignment/:id/result after the bKash callback.
export type TPaymentResultStatus = "success" | "failure" | "cancel";

export interface IInitiateCheckoutResponse {
  success: boolean;
  message: string;
  // bKash hosted checkout page to redirect the student to
  data: string;
}

export interface IPaymentHistoryQueryParams {
  searchTerm?: string;
  status?: TPaymentStatus;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "amount" | "status" | "paidAt";
  sortOrder?: "asc" | "desc";
}

export interface IPayment {
  id: string;
  assignmentId: string;
  transactionId: string | null;
  amount: string;
  status: TPaymentStatus;
  paymentGateway: "BKASH";
  merchantInvoiceNumber: string | null;
  bkashPaymentId: string | null;
  bkashTrxId: string | null;
  payerReference: string | null;
  paidAt: string | null;
  gatewayResponse: unknown;
  createdAt: string;
  updatedAt: string;
  assignment: {
    id: string;
    title: string;
    status: TStudentAssignmentStatus;
    budget: string;
    deadline: string;
    student: {
      id: string;
      institution: string | null;
      user: { id: string; name: string; email: string };
    };
  };
}
