"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useInitiateCheckout } from "@/hooks";
import { CreditCard, Loader2 } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function PayNowButton({
  assignmentId,
  amount,
}: {
  assignmentId: string;
  amount: string;
}) {
  const { mutate: initiateCheckout, isPending, data } = useInitiateCheckout();
  // Stay in the loading state once we have the URL: the browser is leaving for bKash.
  const isRedirecting = isPending || !!data?.data;

  const handlePay = () => {
    initiateCheckout(assignmentId, {
      onSuccess: (res) => {
        if (!res?.data) {
          toast.add({
            title: "Couldn't open the payment page. Please try again.",
            type: "error",
          });
          return;
        }
        window.location.assign(res.data);
      },
      onError: (err) => {
        toast.add({
          title: err.message || "Failed to start payment",
          type: "error",
        });
      },
    });
  };

  return (
    <Button size="sm" disabled={isRedirecting} onClick={handlePay}>
      {isRedirecting ? (
        <>
          <Loader2 className="animate-spin" /> Redirecting...
        </>
      ) : (
        <>
          <CreditCard />
          Pay {currencyFormatter.format(Number(amount))}
        </>
      )}
    </Button>
  );
}
