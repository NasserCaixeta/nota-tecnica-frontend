import { ApiError, apiRequest } from "./client";
import type { ValidationDocumentType } from "./types";
export type DocumentRead = {
  id: number; owner_user_id: number; vehicle_id: number | null; vehicle_link_id: number | null;
  maintenance_record_id?: number | null; maintenance_revision_id?: number | null; service_dispute_id?: number | null;
  document_type: string; validation_document_type: ValidationDocumentType | null;
  file_name: string; content_type: string; review_status: "pending" | "approved" | "rejected";
  review_version: number; upload_status: "pending" | "uploaded" | "failed";
  storage_verified: boolean; rejection_reason: string | null; file_size_bytes: number | null;
};
export type DocumentUploadIntentRead = {
  document: DocumentRead; upload_url: string; storage_key: string; required_headers: Record<string, string>;
};
export async function uploadValidationDocument(params: {
  vehicleLinkId: number; documentType: string; validationDocumentType: ValidationDocumentType; file: File;
}) {
  const intent = await apiRequest<DocumentUploadIntentRead>(`/garage/vehicle-links/${params.vehicleLinkId}/documents/upload-intents`, {
    method: "POST", body: JSON.stringify({ document_type: params.documentType, validation_document_type: params.validationDocumentType,
      file_name: params.file.name, content_type: params.file.type, file_size_bytes: params.file.size }),
  });
  const uploaded = await fetch(intent.upload_url, { method: "PUT", headers: intent.required_headers, body: params.file });
  if (!uploaded.ok) throw new ApiError("Não foi possível enviar o arquivo. Tente novamente.", uploaded.status, null);
  return apiRequest<DocumentRead>(`/documents/${intent.document.id}/confirm-upload`, {
    method: "POST", body: JSON.stringify({ file_size_bytes: params.file.size }),
  });
}
export function getDocumentDownload(documentId: number) {
  return apiRequest<{ url: string; expires_at: string }>(`/documents/${documentId}/download`);
}

export async function uploadWorkshopClaimDocument(claimId: number, kind: ValidationDocumentType, file: File) {
  const intent = await apiRequest<DocumentUploadIntentRead>(`/workshop-claims/${claimId}/documents/upload-intents`, {
    method: "POST", body: JSON.stringify({ document_type: "other", validation_document_type: kind,
      file_name: file.name, content_type: file.type, file_size_bytes: file.size }),
  });
  const uploaded = await fetch(intent.upload_url, { method: "PUT", headers: intent.required_headers, body: file });
  if (!uploaded.ok) throw new ApiError("Não foi possível enviar o arquivo. Tente novamente.", uploaded.status, null);
  return apiRequest<DocumentRead>(`/documents/${intent.document.id}/confirm-upload`, { method: "POST", body: JSON.stringify({ file_size_bytes: file.size }) });
}

export async function uploadServiceEvidence(vehicleId: number, recordId: number, kind: string, file: File) {
  return uploadEvidence(`/vehicles/${vehicleId}/documents/upload-intents`, { maintenance_record_id: recordId, document_type: kind }, file);
}
export async function uploadDisputeEvidence(disputeId: number, file: File) {
  return uploadEvidence(`/service-disputes/${disputeId}/documents/upload-intents`, { document_type: "other" }, file);
}
async function uploadEvidence(path: string, payload: object, file: File) {
  const intent = await apiRequest<DocumentUploadIntentRead>(path, { method: "POST", body: JSON.stringify({ ...payload, file_name: file.name, content_type: file.type, file_size_bytes: file.size }) });
  const response = await fetch(intent.upload_url, { method: "PUT", headers: intent.required_headers, body: file });
  if (!response.ok) throw new ApiError("Falha ao enviar arquivo. Tente novamente.", response.status, null);
  return apiRequest<DocumentRead>(`/documents/${intent.document.id}/confirm-upload`, { method: "POST", body: JSON.stringify({ file_size_bytes: file.size }) });
}
