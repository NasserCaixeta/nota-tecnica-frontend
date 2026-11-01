import type { GarageValidationStatus } from "../lib/api/types";

export const garageStatusLabels: Record<GarageValidationStatus, string> = {
  pending_documents: "Documentos pendentes",
  under_review: "Em análise",
  active: "Validado",
  rejected: "Rejeitado",
  payment_required: "Expansão necessária",
};

export const participationStatusLabels={pending:"Aguardando análise",approved:"Aprovado",rejected:"Recusado",suspended:"Suspenso"};
export const documentReviewLabels={pending:"Aguardando análise",approved:"Aprovado",rejected:"Recusado"};
export const relationshipLabels={owner:"Proprietário",spouse:"Cônjuge",family:"Familiar",company_representative:"Representante da empresa",fleet_responsible:"Responsável pela frota",recent_buyer:"Comprador recente",authorized_driver:"Condutor autorizado",other:"Outro vínculo"};
