"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";

export function useClinics() {
  return useQuery({
    queryKey: queryKeys.clinics,
    queryFn: async () => {
      const data = await fetchApi<{ clinics: Array<{ id: string; slug: string; clinicName: string }> }>(
        "/api/clinics",
      );
      return data.clinics;
    },
  });
}

export function useInvites() {
  return useQuery({
    queryKey: queryKeys.invites,
    queryFn: async () => {
      const data = await fetchApi<{
        invites: Array<{
          id: string;
          email: string;
          role: string;
          expires_at: string;
          accepted_at: string | null;
        }>;
      }>("/api/invites");
      return data.invites;
    },
  });
}

export function useSendInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { email: string; role: string }) => {
      return fetchApi<{ emailSent?: boolean }>("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
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
      return fetchApi<{
        path: string;
        persona: string;
        role: string | null;
        roleLabel: string;
        isPlatformAdmin: boolean;
        isPlatformSupport: boolean;
        mfaRedirect?: string | null;
      }>("/api/auth/session-role");
    },
    staleTime: 60_000,
  });
}
