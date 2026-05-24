"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";

export function useClinics() {
  return useQuery({
    queryKey: queryKeys.clinics,
    queryFn: async () => {
      const res = await fetch("/api/clinics");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load clinics");
      return data.clinics as Array<{ id: string; slug: string; clinicName: string }>;
    },
  });
}

export function useInvites() {
  return useQuery({
    queryKey: queryKeys.invites,
    queryFn: async () => {
      const res = await fetch("/api/invites");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load invites");
      return data.invites as Array<{
        id: string;
        email: string;
        role: string;
        expires_at: string;
        accepted_at: string | null;
      }>;
    },
  });
}

export function useSendInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { email: string; role: string }) => {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send invite");
      return data as { emailSent?: boolean };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invites });
    },
  });
}

export function useSessionRole() {
  return useQuery({
    queryKey: queryKeys.sessionRole,
    queryFn: async () => {
      const res = await fetch("/api/auth/session-role");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Not authenticated");
      return data as {
        path: string;
        persona: string;
        role: string | null;
        roleLabel: string;
        isPlatformAdmin: boolean;
        isPlatformSupport: boolean;
      };
    },
    staleTime: 60_000,
  });
}
