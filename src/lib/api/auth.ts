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
