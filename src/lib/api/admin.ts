import type { DocumentRead } from "./documents";
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
  review_version: number;
  approved_documents: ValidationDocumentType[];
  awaiting_review_documents: ValidationDocumentType[];
  rejected_documents: ValidationDocumentType[];
  documents: DocumentRead[];
  admin_review_note: string | null;
  user_full_name: string;
  submitted_for_review_at: string | null;
  reviewed_at: string | null;
};

export function listPendingGarageValidations() {
  return apiRequest<AdminGarageVehicleLinkRead[]>("/admin/garage/vehicle-links/pending");
}

export function reviewGarageVehicleLink(
  vehicleLinkId: number,
  payload: { expected_version: number; verification_status: "verified" | "rejected"; verification_rejection_reason?: string },
) {
  return apiRequest<AdminGarageVehicleLinkRead>(`/admin/garage/vehicle-links/${vehicleLinkId}/review`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function requestAdditionalDocuments(
  vehicleLinkId: number,
  payload: { expected_version: number; requested_document_types: ValidationDocumentType[]; note?: string | null },
) {
  return apiRequest<AdminGarageVehicleLinkRead>(
    `/admin/garage/vehicle-links/${vehicleLinkId}/requested-documents`,
    { method: "POST", body: JSON.stringify(payload) },
  );
}

export function getGarageValidation(vehicleLinkId: number) {
  return apiRequest<AdminGarageVehicleLinkRead>(`/admin/garage/vehicle-links/${vehicleLinkId}`);
}
export function reviewDocument(documentId: number, payload: { review_status: "approved" | "rejected"; expected_version: number; rejection_reason?: string }) {
  return apiRequest<DocumentRead>(`/admin/documents/${documentId}/review`, { method: "PATCH", body: JSON.stringify(payload) });
}
