import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { getCurrentUser } from "../api/auth";
import { ApiError } from "../api/client";
import type { UserRead } from "../api/types";
import { clearStoredToken, getStoredToken } from "./token-storage";
import { SessionContext, type SessionValue } from "./SessionContext";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserRead | null>(null);
  const [status, setStatus] = useState<SessionValue["status"]>("loading");
  const [error, setError] = useState<string | null>(null);
  const generation = useRef(0);
  const refresh = useCallback(async () => {
    const id = ++generation.current;
    const token = getStoredToken();
    setError(null);
    if (!token) { setUser(null); setStatus("anonymous"); return null; }
    setStatus("loading");
    try {
      const current = await getCurrentUser();
      if (id !== generation.current || token !== getStoredToken()) return null;
      setUser(current);
      setStatus("authenticated");
      return current;
    } catch (caught) {
      if (id !== generation.current || token !== getStoredToken()) return null;
      setUser(null);
      setStatus("anonymous");
      if (caught instanceof ApiError && caught.status === 401) clearStoredToken();
      else setError("Não foi possível verificar sua sessão. Tente novamente.");
      return null;
    }
  }, []);
  const logout = useCallback(() => {
    ++generation.current;
    clearStoredToken();
    setUser(null); setStatus("anonymous"); setError(null);
  }, []);
  useEffect(() => {
    const update = () => { void refresh(); };
    update();
    window.addEventListener("nota-tecnica:session", update);
    window.addEventListener("storage", update);
    const cancelRequests = () => { ++generation.current; };
    return () => {
      cancelRequests();
      window.removeEventListener("nota-tecnica:session", update);
      window.removeEventListener("storage", update);
    };
  }, [refresh]);
  return <SessionContext.Provider value={{ user, status, error, refresh, logout }}>{children}</SessionContext.Provider>;
}
