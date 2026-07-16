import { apiRequest } from "./client";

export type VehicleHistoryPreview = {
  plate: string;
  vehicle_found: boolean;
  maintenance_count: number;
  first_maintenance_date: string | null;
  last_maintenance_date: string | null;
  categories: string[];
  distinct_workshop_count: number;
  completeness_score: "none" | "low" | "medium" | "high";
};

export function getVehicleHistoryPreview(plate: string) {
  return apiRequest<VehicleHistoryPreview>(`/public/vehicles/${plate}/history-preview`, {
    auth: false,
  });
}
