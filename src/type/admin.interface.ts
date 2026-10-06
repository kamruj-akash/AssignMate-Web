import { TStudentAssignmentStatus } from "./assignment.interface";
import { TBidStatus } from "./bid.interface";
import { TPaymentStatus } from "./payment.interface";

export type TExpertVerificationStatus = "PENDING" | "APPROVE" | "REJECT";
export type TEscrowStatus = "HELD" | "RELEASED_TO_EXPERT" | "REFUNDED_TO_STUDENT";
export type TUserStatus = "ACTIVE" | "BLOCK";

// Both admin analytics endpoints filter on createdAt; omit for all-time.
export interface IDateRangeParams {
  from?: string;
  to?: string;
}

type TStatusCount<K extends string> = Record<K, number>;
type TStatusAmount<K extends string> = Record<K, { count: number; amount: number }>;

export interface IAdminOverview {
  range: { from: string | null; to: string | null };
  users: {
    total: number;
    byRole: { STUDENT: number; EXPERT: number; ADMIN: number };
    blocked: number;
  };
  experts: { byVerificationStatus: TStatusCount<TExpertVerificationStatus> };
  assignments: {
    total: number;
    byStatus: TStatusCount<TStudentAssignmentStatus>;
    completionRate: number;
    disputeRate: number;
  };
  bids: {
    total: number;
    byStatus: TStatusCount<TBidStatus>;
    acceptanceRate: number;
  };
  payments: {
    total: number;
    byStatus: TStatusCount<TPaymentStatus>;
    paidVolume: number;
  };
  escrow: {
    byStatus: TStatusAmount<TEscrowStatus>;
    platformRevenue: number;
    pendingPlatformRevenue: number;
  };
  reviews: { total: number; averageRating: number };
}

export interface IRevenueMonth {
  // YYYY-MM, the month the escrow was funded
  month: string;
  escrowCount: number;
  grossVolume: number;
  platformRevenue: number;
  expertPayouts: number;
}

export interface IRevenueAnalytics {
  range: { from: string | null; to: string | null };
  totals: {
    escrowCount: number;
    grossVolume: number;
    platformRevenue: number;
    pendingPlatformRevenue: number;
    expertPayouts: number;
    refundedToStudents: number;
  };
  byStatus: TStatusAmount<TEscrowStatus>;
  monthly: IRevenueMonth[];
}

export interface IEscrowVault {
  id: string;
  assignmentId: string;
  status: TEscrowStatus;
  totalAmount: number;
  disbursedAt: string | null;
  createdAt: string;
  updatedAt: string;
  breakdown: {
    platformCommissionRate: number;
    expertEarningsRate: number;
    platformRevenue: number;
    expertPayout: number;
  };
  assignment: {
    id: string;
    title: string;
    status: TStudentAssignmentStatus;
    budget: string;
    deadline: string;
  };
  student: {
    id: string;
    institution: string | null;
    user: { id: string; name: string; email: string };
  };
  expert: {
    id: string;
    university: string;
    department: string;
    user: { id: string; name: string; email: string };
  } | null;
}

export interface IExpertQueryParams {
  searchTerm?: string;
  status?: TExpertVerificationStatus;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "ratePerAssignment" | "walletBalance";
  sortOrder?: "asc" | "desc";
}

export interface IAdminExpert {
  id: string;
  isVerified: boolean;
  ratePerAssignment: string;
  verificationStatus: TExpertVerificationStatus;
  user: { id: string; name: string; email: string };
}

// /expert/get-all nests the list and its meta inside `data`, unlike the other
// paginated endpoints.
export interface IExpertListResponse {
  success: boolean;
  message: string;
  data: {
    experts: IAdminExpert[];
    meta: {
      page: number;
      limit: number;
      totalExperts: number;
      totalPages: number;
    };
  };
}

export type TApproveExpertPayload =
  | { expertId: string; status: "APPROVE" }
  | { expertId: string; status: "REJECT"; reason: string };

export interface IStudentQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "institution" | "academicLevel";
  sortOrder?: "asc" | "desc";
}

export interface IAdminStudent {
  id: string;
  institution: string | null;
  academicLevel: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNo: string | null;
    status: TUserStatus;
    emailVerified: boolean;
  };
  _count: { assignmentTasks: number };
}

export interface IAdminStudentDetails extends IAdminStudent {
  stats: {
    assignments: {
      total: number;
      byStatus: TStatusCount<TStudentAssignmentStatus>;
    };
    bidsReceived: { pending: number };
    spending: {
      totalPaid: number;
      pendingPayments: number;
      inEscrow: number;
      refunded: number;
    };
    reviewsWritten: number;
  };
  recentAssignments: {
    id: string;
    title: string;
    status: TStudentAssignmentStatus;
    budget: string;
    deadline: string;
    createdAt: string;
  }[];
}

export interface IMe {
  id: string;
  name: string;
  email: string;
  phoneNo: string | null;
  role: "ADMIN" | "STUDENT" | "EXPERT";
  status: TUserStatus;
  emailVerified: boolean;
  authProvider: "CREDENTIAL" | "GOOGLE";
  createdAt: string;
}

export type TCancellationDecision = "APPROVE" | "REJECT";

export interface ICancellationQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
}

// Assignment the student cancelled whose escrow is still HELD.
export interface ICancellationRequest {
  id: string;
  title: string;
  budget: string;
  status: TStudentAssignmentStatus;
  submissionUrl: { url: string; publicId: string } | null;
  disputedReason: string | null;
  updatedAt: string;
  student: { id: string; user: { name: string; email: string } };
  assignedExpert: {
    id: string;
    university: string;
    user: { name: string; email: string };
  } | null;
  escrow: {
    id: string;
    totalAmount: string;
    expertEarnings: string;
    status: TEscrowStatus;
  } | null;
}

export type TResolveCancellationPayload = {
  assignmentId: string;
  decision: TCancellationDecision;
};
