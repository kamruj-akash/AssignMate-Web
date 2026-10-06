import PaymentsTable from "./payments-table";

export default function AdminPayments() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-xl font-semibold">Payments</h1>
        <p className="text-sm text-muted-foreground">
          Every bKash checkout on the platform, including failed and pending
          attempts.
        </p>
      </div>
      <PaymentsTable />
    </div>
  );
}
