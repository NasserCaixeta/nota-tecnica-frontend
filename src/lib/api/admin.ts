import { apiRequest } from "./client";
import type { GarageValidationStatus, ValidationDocumentType, VehicleRelationshipType } from "./types";

export type AdminGarageVehicleLinkRead = {
  vehicle_link_id: number;
  vehicle_id: number;
  user_id: number;
  plate: string;
  relationship_type: VehicleRelationshipType;
  garage_status: GarageValidationStatus;
  required_documents: ValidationDocumentType[];
  uploaded_documents: ValidationDocumentType[];
  missing_documents: ValidationDocumentType[];
  verification_rejection_reason: string | null;
  review_attempts: number;
  submitted_for_review_at: string | null;
  reviewed_at: string | null;
};

export function listPendingGarageValidations() {
  return apiRequest<AdminGarageVehicleLinkRead[]>("/admin/garage/vehicle-links/pending");
}

export function reviewGarageVehicleLink(
  vehicleLinkId: number,
  payload: { verification_status: "verified" | "rejected"; verification_rejection_reason?: string },
) {
  return apiRequest<AdminGarageVehicleLinkRead>(`/admin/garage/vehicle-links/${vehicleLinkId}/review`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function requestAdditionalDocuments(
  vehicleLinkId: number,
  payload: { requested_document_types: ValidationDocumentType[]; note?: string | null },
) {
  return apiRequest<AdminGarageVehicleLinkRead>(
    `/admin/garage/vehicle-links/${vehicleLinkId}/requested-documents`,
    { method: "POST", body: JSON.stringify(payload) },
  );
}
