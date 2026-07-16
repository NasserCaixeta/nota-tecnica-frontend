import { apiRequest } from "./client";

export type MaintenanceRecord = {
  id: string;
  vehicle_id: string;
  title: string;
  description?: string | null;
  performed_at: string;
  odometer?: number | null;
  labor_cost?: number | null;
  parts_cost?: number | null;
  created_at?: string;
};

export type MaintenanceCreatePayload = {
  title: string;
  description?: string;
  performed_at: string;
  odometer?: number;
  labor_cost?: number;
  parts_cost?: number;
};

export function listVehicleMaintenance(vehicleId: string) {
  return apiRequest<MaintenanceRecord[]>(`/vehicles/${vehicleId}/maintenance`);
}

export function createVehicleMaintenance(vehicleId: string, payload: MaintenanceCreatePayload) {
  return apiRequest<MaintenanceRecord>(`/vehicles/${vehicleId}/maintenance`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
