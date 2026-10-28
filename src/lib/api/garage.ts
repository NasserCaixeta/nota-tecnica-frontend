import { apiRequest } from "./client";
import type { GarageDashboard, GarageVehicleItem, VehicleRelationshipType } from "./types";

export function getGarageDashboard() {
  return apiRequest<GarageDashboard>("/garage");
}

export function getGarageVehicle(vehicleId: number) {
  return apiRequest<GarageVehicleItem>(`/garage/vehicles/${vehicleId}`);
}

export function createGarageVehicle(payload: Record<string, unknown>) {
  return apiRequest<GarageVehicleItem>("/garage/vehicles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateGarageRelationship(
  vehicleLinkId: number,
  payload: { relationship_type: VehicleRelationshipType; relationship_note?: string | null },
) {
  return apiRequest<GarageVehicleItem>(`/garage/vehicle-links/${vehicleLinkId}/relationship`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function submitGarageReview(vehicleLinkId: number, resubmit = false) {
  return apiRequest(`/garage/vehicle-links/${vehicleLinkId}/${resubmit ? "resubmit-review" : "submit-review"}`, { method: "POST" });
}

export function selectFreeGarageVehicle(vehicleId: number) {
  return apiRequest<GarageDashboard>("/garage/free-vehicle", { method: "PATCH", body: JSON.stringify({ vehicle_id: vehicleId }) });
}
