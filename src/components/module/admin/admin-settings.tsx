"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks";
import { IMe } from "@/type";
import { formatDate } from "./admin-format";

export default function AdminSettings() {
  const { data, isLoading, isError, error } = useGetMe();
  const me = (data as { data?: IMe } | undefined)?.data;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Your admin account details.
        </p>
      </div>

      <section className="rounded-lg border border-border">
        <h2 className="border-b border-border p-4 text-sm font-medium">
          Account
        </h2>
        {isLoading ? (
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : isError || !me ? (
          <p className="p-4 text-sm text-destructive">
            {error?.message || "Failed to load your account."}
          </p>
        ) : (
          <dl className="grid gap-4 p-4 text-sm sm:grid-cols-2">
            <Detail label="Name" value={me.name} />
            <Detail label="Email" value={me.email} />
            <Detail label="Role" value={me.role} />
            <Detail label="Phone" value={me.phoneNo} />
            <Detail
              label="Sign-in method"
              value={me.authProvider === "GOOGLE" ? "Google" : "Email & password"}
            />
            <Detail label="Member since" value={formatDate(me.createdAt)} />
          </dl>
        )}
      </section>
    </div>
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
