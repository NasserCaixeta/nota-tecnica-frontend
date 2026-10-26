import { createContext, useContext } from "react";
import type { UserRead } from "../api/types";

export type SessionValue = {
  user: UserRead | null;
  status: "loading" | "anonymous" | "authenticated";
  error: string | null;
  refresh: () => Promise<UserRead | null>;
  logout: () => void;
};
export const SessionContext = createContext<SessionValue | null>(null);
export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("SessionProvider is required");
  return value;
}
