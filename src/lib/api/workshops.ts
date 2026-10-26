import { apiRequest } from "./client";

export type WorkshopRead = {
  id: number;
  legal_name: string;
  trade_name: string;
  cnpj: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  zip_code: string;
  street: string;
  number: string;
  neighborhood: string;
  complement?: string | null;
  specialties: string[];
  source: "user_submitted" | "owner_claimed";
  verification_status: "pending" | "verified" | "rejected";
};

export type WorkshopPayload = {
  source: "user_submitted" | "owner_claimed";
  legal_name: string;
  trade_name: string;
  cnpj: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  zip_code: string;
  street: string;
  number: string;
  neighborhood: string;
  complement?: string | null;
  specialties: string[];
};

export function createWorkshop(payload: WorkshopPayload) {
  return apiRequest<WorkshopRead>("/workshops", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listWorkshops() {
  return apiRequest<WorkshopRead[]>("/workshops", { auth: false });
}

export function listManagedWorkshops() {
  return apiRequest<WorkshopRead[]>("/workshops/me");
}

export function getWorkshop(workshopId: number) {
  return apiRequest<WorkshopRead>(`/workshops/${workshopId}`, { auth: false });
}

export type WorkshopClaimRead = {
  id: number; workshop_id: number; user_id: number; user_full_name: string;
  trade_name: string; cnpj: string; status: "pending" | "verified" | "rejected";
  review_version: number; reason: string | null;
  documents: import("./documents").DocumentRead[];
};
export function listWorkshopClaims() { return apiRequest<WorkshopClaimRead[]>("/workshops/claims/me"); }
export function lookupWorkshop(cnpj: string) {
  return apiRequest<Pick<WorkshopRead, "id" | "cnpj" | "trade_name">>(`/workshops/lookup?cnpj=${encodeURIComponent(cnpj)}`);
}
export function requestWorkshopClaim(workshopId: number) {
  return apiRequest<WorkshopClaimRead>(`/workshops/${workshopId}/claims`, { method: "POST" });
}
export function listPendingWorkshopClaims() { return apiRequest<WorkshopClaimRead[]>("/admin/workshop-claims"); }
export function reviewWorkshopClaim(claim: WorkshopClaimRead, decision: "verified" | "rejected", reason: string) {
  return apiRequest<WorkshopClaimRead>(`/admin/workshop-claims/${claim.id}/review`, {
    method: "PATCH", body: JSON.stringify({ decision, expected_version: claim.review_version, reason }),
  });
}
