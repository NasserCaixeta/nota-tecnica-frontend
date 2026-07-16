import { StatusPill } from "../../../components/ui/StatusPill";
import { Panel } from "../../../components/ui/Panel";
import { garageStatusLabels } from "../../../content/status-labels";
import type { GarageVehicleItem } from "../../../lib/api/types";

export function GarageVehicleCard({ vehicle }: { vehicle: GarageVehicleItem }) {
  return (
    <Panel>
      <h3>{vehicle.plate}</h3>
      <p>
        {vehicle.brand} {vehicle.model} {vehicle.model_year}
      </p>
      <StatusPill tone={vehicle.garage_status === "active" ? "success" : "warning"}>
        {garageStatusLabels[vehicle.garage_status]}
      </StatusPill>
      <p>{vehicle.documents.missing.length} documento(s) pendente(s)</p>
      <a href={`/app/garagem/${vehicle.vehicle_id}`}>Ver dashboard</a>
    </Panel>
  );
}
