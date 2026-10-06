"use client";

import {
  expertStatusStyles,
  formatCurrency,
  formatDate,
} from "@/components/module/admin/admin-format";
import StatusBadge from "@/components/module/admin/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetExpertReviews, useGetMe } from "@/hooks";
import { IExpertMe, TExpertVerificationStatus } from "@/type";
import { Star } from "lucide-react";
import EditExpertProfileSheet from "./edit-expert-profile-sheet";

const verificationLabels: Record<TExpertVerificationStatus, string> = {
  PENDING: "Pending review",
  APPROVE: "Verified",
  REJECT: "Rejected",
};

export default function ExpertProfile() {
  const { data, isLoading, isError, error } = useGetMe();
  const me = (data as { data?: IExpertMe } | undefined)?.data;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold">Profile</h1>
          <p className="text-sm text-muted-foreground">
            What students see when they review your bids.
          </p>
        </div>
        {me?.expert && <EditExpertProfileSheet me={me} />}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-48" />
        </div>
      ) : isError || !me?.expert ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error?.message || "Failed to load your profile."}
        </p>
      ) : (
        <>
          {me.expert.verificationStatus === "REJECT" &&
            me.expert.rejectionReason && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
                <p className="font-medium text-destructive">
                  Your application was rejected
                </p>
                <p className="mt-1">{me.expert.rejectionReason}</p>
              </div>
            )}

          <section className="rounded-lg border border-border">
            <h2 className="border-b border-border p-4 text-sm font-medium">
              Account
            </h2>
            <dl className="grid gap-4 p-4 text-sm sm:grid-cols-2">
              <Detail label="Name" value={me.name} />
              <Detail label="Email" value={me.email} />
              <Detail label="Phone" value={me.phoneNo} />
              <Detail
                label="Sign-in method"
                value={
                  me.authProvider === "GOOGLE" ? "Google" : "Email & password"
                }
              />
              <Detail label="Member since" value={formatDate(me.createdAt)} />
            </dl>
          </section>

          <section className="rounded-lg border border-border">
            <div className="flex items-center justify-between gap-2 border-b border-border p-4">
              <h2 className="text-sm font-medium">Expert details</h2>
              <StatusBadge
                status={me.expert.verificationStatus}
                label={verificationLabels[me.expert.verificationStatus]}
                className={expertStatusStyles[me.expert.verificationStatus]}
              />
            </div>
            <dl className="grid gap-4 p-4 text-sm sm:grid-cols-2">
              <Detail label="University" value={me.expert.university} />
              <Detail label="Department" value={me.expert.department} />
              <Detail
                label="Rate per assignment"
                value={formatCurrency(me.expert.ratePerAssignment)}
              />
              <Detail
                label="Wallet balance"
                value={formatCurrency(me.expert.walletBalance)}
              />
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Bio</dt>
                <dd className="whitespace-pre-wrap">
                  {me.expert.bio || (
                    <span className="text-muted-foreground">
                      No bio yet. A short bio helps students pick your bid.
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </section>

          <ReviewsSection expertId={me.expert.id} />
        </>
      )}
    </div>
  );
}

function ReviewsSection({ expertId }: { expertId: string }) {
  const { data, isLoading, isError, error } = useGetExpertReviews(expertId);
  const summary = data?.data?.summary;
  const reviews = data?.data?.reviews ?? [];

  return (
    <section className="rounded-lg border border-border">
      <div className="flex items-center justify-between gap-2 border-b border-border p-4">
        <h2 className="text-sm font-medium">Recent reviews</h2>
        {summary && summary.totalReviews > 0 && (
          <p className="flex items-center gap-1 text-sm">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="font-medium">
              {summary.averageRating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">
              ({summary.totalReviews})
            </span>
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3 p-4">
          {Array.from({ length: 2 }, (_, i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      ) : isError ? (
        <p className="p-4 text-sm text-destructive">
          {error.message || "Failed to load reviews."}
        </p>
      ) : reviews.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground">
          No reviews yet. Students can review you after approving your work.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {reviews.map((review) => (
            <li key={review.id} className="space-y-1 p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{review.student.name}</p>
                <div
                  className="flex"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={
                        i < review.rating
                          ? "size-3.5 fill-amber-400 text-amber-400"
                          : "size-3.5 text-muted-foreground/40"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {review.assignment.title} · {formatDate(review.createdAt)}
              </p>
              {review.comment && <p>{review.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value || "—"}</dd>
    </div>
  );
}
