import { apiRequest } from "./client";
import type { ParticipationStatus, UserRead } from "./types";
export function listParticipants(status: ParticipationStatus) {
  return apiRequest<UserRead[]>(`/admin/participants?status=${status}`);
}
export function reviewParticipant(id: number, decision: ParticipationStatus, expected_version: number, reason: string) {
  return apiRequest<UserRead>(`/admin/participants/${id}/review`, {
    method: "PATCH", body: JSON.stringify({ decision, expected_version, reason }),
  });
}
export function setAdminAccess(id: number, enabled: boolean, reason: string) {
  return apiRequest<UserRead>(`/admin/users/${id}/admin-access`, {
    method: "PATCH", body: JSON.stringify({ enabled, reason }),
  });
}
