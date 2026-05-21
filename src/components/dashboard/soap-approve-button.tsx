"use client";

import { useState, useTransition } from "react";
import { CheckCircle, LoaderCircle } from "lucide-react";

export function SoapApproveButton(props: {
  encounterId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(props.currentStatus);
  const [isPending, startTransition] = useTransition();

  function approve() {
    startTransition(async () => {
      const res = await fetch(`/api/encounters/${props.encounterId}/soap/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_status: "approved" }),
      });
      if (res.ok) {
        setStatus("approved");
      }
    });
  }

  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 text-sm text-green-700">
        <CheckCircle className="h-4 w-4" />
        Approved
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={approve}
      className="inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-4 py-2 text-xs font-semibold text-white"
    >
      {isPending && <LoaderCircle className="h-3 w-3 animate-spin" />}
      Approve SOAP
    </button>
  );
}
