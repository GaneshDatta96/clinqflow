"use client";

import { useState, useTransition } from "react";
import { CheckCircle } from "lucide-react";
import { AnimatedModal, StatefulButton } from "@/components/ui/aceternity";
import { readApiError } from "@/lib/api/client";

export function SoapApproveButton(props: {
  encounterId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(props.currentStatus);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function approve() {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        setError(null);
        try {
          const res = await fetch(`/api/encounters/${props.encounterId}/soap/approve`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ review_status: "approved" }),
          });
          if (!res.ok) throw await readApiError(res);
          setStatus("approved");
          setModalOpen(false);
          resolve();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Approval failed.");
          reject(err);
        }
      });
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
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
      >
        Approve SOAP
      </button>

      <AnimatedModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Approve SOAP draft?"
      >
        <p className="font-serif text-sm leading-relaxed text-[color:var(--muted-strong)]">
          Confirm that you have reviewed this draft documentation. Approval marks it ready
          for your workflow—it does not replace your clinical judgment or charting process.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold"
          >
            Cancel
          </button>
          <StatefulButton
            className="!px-4 !py-2 !text-xs"
            loadingLabel="Approving…"
            successLabel="Approved"
            onClick={approve}
          >
            Confirm approval
          </StatefulButton>
        </div>
      </AnimatedModal>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
