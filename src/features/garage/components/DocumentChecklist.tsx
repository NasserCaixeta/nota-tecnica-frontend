import type { GarageVehicleItem } from "../../../lib/api/types";
import { validationDocumentLabels } from "../../../content/documents";
export function DocumentChecklist({ vehicle }: { vehicle: GarageVehicleItem }) {
  return <section><h2>Documentos</h2><ul>{vehicle.documents.required.map(kind => {
    const docs = vehicle.documents;
    const status = docs.approved.includes(kind) ? "aprovado" : docs.rejected.includes(kind) ? "recusado — envie uma correção" : docs.awaiting_review.includes(kind) ? "enviado — aguardando análise" : "pendente";
    return <li key={kind}>{validationDocumentLabels[kind]}: {status}</li>;
  })}</ul></section>;
}
