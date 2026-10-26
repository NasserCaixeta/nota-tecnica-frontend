import type { ValidationDocumentType } from "../lib/api/types";
export const validationDocumentLabels: Record<ValidationDocumentType, string> = {
  crlv: "CRLV", owner_authorization: "Autorização do proprietário", relationship_proof: "Comprovação de parentesco",
  company_contract_or_power_of_attorney: "Contrato social ou procuração", representative_identity: "Identidade do representante",
  fleet_authorization: "Autorização da frota", purchase_receipt_or_atpv: "Recibo de compra ou ATPV",
  driver_identity: "Identidade do condutor",
};
