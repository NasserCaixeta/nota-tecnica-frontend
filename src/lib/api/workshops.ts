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
  specialties: string[];
  source: "user_submitted" | "owner_claimed";
  verification_status: "pending" | "verified" | "rejected";
};

export type WorkshopPayload = {
  legal_name: string;
  trade_name: string;
  cnpj: string;
  phone: string;
  email: string;
  city: string;
  state: string;
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
