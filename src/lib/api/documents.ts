import { apiRequest } from "./client";
import type { ValidationDocumentType } from "./types";

export type DocumentUploadIntentRead = {
  document: {
    id: number;
    vehicle_id: number;
    vehicle_link_id: number | null;
    document_type: string;
    validation_document_type: ValidationDocumentType | null;
    upload_status: string;
  };
  upload_url: string;
  storage_key: string;
  required_headers: Record<string, string>;
};

export async function uploadValidationDocument(params: {
  vehicleLinkId: number;
  documentType: string;
  validationDocumentType: ValidationDocumentType;
  file: File;
}) {
  const intent = await apiRequest<DocumentUploadIntentRead>(
    `/garage/vehicle-links/${params.vehicleLinkId}/documents/upload-intents`,
    {
      method: "POST",
      body: JSON.stringify({
        document_type: params.documentType,
        validation_document_type: params.validationDocumentType,
        file_name: params.file.name,
        content_type: params.file.type,
        file_size_bytes: params.file.size,
      }),
    },
  );

  await fetch(intent.upload_url, {
    method: "PUT",
    headers: intent.required_headers,
    body: params.file,
  });

  return apiRequest(`/documents/${intent.document.id}/confirm-upload`, {
    method: "POST",
    body: JSON.stringify({ file_size_bytes: params.file.size }),
  });
}
