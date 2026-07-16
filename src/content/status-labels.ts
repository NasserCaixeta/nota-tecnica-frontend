import type { GarageValidationStatus } from "../lib/api/types";

export const garageStatusLabels: Record<GarageValidationStatus, string> = {
  pending_documents: "Documentos pendentes",
  under_review: "Em análise",
  active: "Validado",
  rejected: "Rejeitado",
  payment_required: "Expansão necessária",
};
