import { ExtendedSession } from "@/types/sessionTypes";
import { useSession } from "next-auth/react";

export const useAuthSession = () => {
  const { data, status, update } = useSession();
  const isAuthLoading = status === "loading";

  return {
    data: data as ExtendedSession | null,
    status,
    update,
    isAuthLoading,
  };
};
