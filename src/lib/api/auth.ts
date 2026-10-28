import { apiRequest } from "./client";
import type { UserRead } from "./types";

export type LoginResponse = {
  access_token: string;
  token_type: "bearer";
};

export function login(payload: { email: string; password: string }) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });
}

export function registerUser(payload: Record<string, unknown>) {
  return apiRequest<UserRead>("/auth/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser() {
  return apiRequest<UserRead>("/users/me");
}

export const forgotPassword = (email: string) => apiRequest<{ message: string }>("/auth/forgot-password", { method: "POST", auth: false, body: JSON.stringify({ email }) });
export const resetPassword = (token: string, new_password: string) => apiRequest<{ message: string }>("/auth/reset-password", { method: "POST", auth: false, body: JSON.stringify({ token, new_password }) });
export const updateProfile = (profile: { full_name: string; phone: string; city: string; state: string }) => apiRequest<UserRead>("/users/me", { method: "PATCH", body: JSON.stringify(profile) });
export type AccountRequest = { id: number; user_id: number; kind: "closure" | "identity_correction"; reason: string; status: string; created_at: string };
export const listAccountRequests = (kind: "closure" | "identity") => apiRequest<AccountRequest[]>(`/users/me/${kind}-requests`);
export const createAccountRequest = (kind: "closure" | "identity", reason: string) => apiRequest<AccountRequest>(`/users/me/${kind}-requests`, { method: "POST", body: JSON.stringify({ reason }) });
export const listAdministrativeAccountRequests = () => apiRequest<AccountRequest[]>("/admin/account-requests");
