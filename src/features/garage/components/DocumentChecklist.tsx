import type { GarageVehicleItem } from "../../../lib/api/types";

export function DocumentChecklist({ vehicle }: { vehicle: GarageVehicleItem }) {
  return (
    <section>
      <h2>Documentos</h2>
      <ul>
        {vehicle.documents.required.map((documentType) => (
          <li key={documentType}>
            {documentType} {vehicle.documents.uploaded.includes(documentType) ? "enviado" : "pendente"}
          </li>
        ))}
      </ul>
    </section>
  );
}
