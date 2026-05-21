"use client";

import { useEffect, useRef } from "react";

export function useIntakeDraftAutosave(args: {
  patientId: string;
  clinicId?: string;
  answers: Record<string, unknown>;
  enabled?: boolean;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!args.enabled || !args.clinicId || !args.patientId) {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      fetch("/api/intake/drafts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: args.patientId,
          clinic_id: args.clinicId,
          step_index: 0,
          answers_json: args.answers,
        }),
      }).catch(() => {
        // Silent fail for autosave
      });
    }, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [args.answers, args.patientId, args.clinicId, args.enabled]);
}
