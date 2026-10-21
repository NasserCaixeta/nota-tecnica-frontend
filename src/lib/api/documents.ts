import { ApiError, apiRequest } from "./client";
import type { ValidationDocumentType } from "./types";
export type DocumentRead = {
  id: number; owner_user_id: number; vehicle_id: number | null; vehicle_link_id: number | null;
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
