"use client";

import {
  formatCurrency,
  formatDate,
  numberFormatter,
} from "@/components/module/admin/admin-format";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyStudentProfile } from "@/hooks";
import EditStudentProfileSheet from "./edit-student-profile-sheet";

export default function StudentProfile() {
  const { data, isLoading, isError, error } = useGetMyStudentProfile();
  const profile = data?.data;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Experts see your name and institution when they bid.
          </p>
        </div>
        {profile && <EditStudentProfileSheet profile={profile} />}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-32" />
        </div>
      ) : isError || !profile ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error?.message || "Failed to load your profile."}
        </p>
      ) : (
        <>
          <section className="rounded-lg border border-border">
            <h2 className="border-b border-border p-4 text-sm font-medium">
              Account
            </h2>
            <dl className="grid gap-4 p-4 text-sm sm:grid-cols-2">
              <Detail label="Name" value={profile.user.name} />
              <Detail
                label="Email"
                value={
                  profile.user.emailVerified
                    ? profile.user.email
                    : `${profile.user.email} (not verified)`
                }
              />
              <Detail label="Phone" value={profile.user.phoneNo} />
              <Detail
                label="Member since"
                value={formatDate(profile.createdAt)}
              />
            </dl>
          </section>

          <section className="rounded-lg border border-border">
            <h2 className="border-b border-border p-4 text-sm font-medium">
              Academic details
            </h2>
            <dl className="grid gap-4 p-4 text-sm sm:grid-cols-2">
              <Detail label="Institution" value={profile.institution} />
              <Detail label="Academic level" value={profile.academicLevel} />
            </dl>
            {!profile.institution && !profile.academicLevel && (
              <p className="px-4 pb-4 text-xs text-muted-foreground">
                Add your institution and level so experts know the standard
                you need.
              </p>
            )}
          </section>

          <section className="rounded-lg border border-border">
            <h2 className="border-b border-border p-4 text-sm font-medium">
              Activity
            </h2>
            <dl className="grid gap-4 p-4 text-sm sm:grid-cols-4">
              <Detail
                label="Assignments"
                value={numberFormatter.format(
                  profile.stats.assignments.total,
                )}
              />
              <Detail
                label="Completed"
                value={numberFormatter.format(
                  profile.stats.assignments.byStatus.COMPLETED,
                )}
              />
              <Detail
                label="Total paid"
                value={formatCurrency(profile.stats.spending.totalPaid)}
              />
              <Detail
                label="Reviews written"
                value={numberFormatter.format(profile.stats.reviewsWritten)}
              />
            </dl>
          </section>
        </>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium break-words">{value || "—"}</dd>
    </div>
  );
}
