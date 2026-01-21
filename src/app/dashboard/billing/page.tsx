import { Suspense } from "react";
import { BillingContent } from "@/components/pages/dashboard";

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading billing...</div>}>
      <BillingContent />
    </Suspense>
  );
}
