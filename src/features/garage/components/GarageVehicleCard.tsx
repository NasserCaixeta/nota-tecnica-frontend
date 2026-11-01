import { StatusPill } from "../../../components/ui/StatusPill";
import { Panel } from "../../../components/ui/Panel";
import { garageStatusLabels } from "../../../content/status-labels";
import type { GarageVehicleItem } from "../../../lib/api/types";
export function GarageVehicleCard({ vehicle }: {
    vehicle: GarageVehicleItem;
}) {
    return (<Panel>
      <h2>{vehicle.plate}</h2>
      <p>
        {vehicle.brand} {vehicle.model} {vehicle.model_year}
      </p>
      <StatusPill tone={vehicle.garage_status === "active" ? "success" : "warning"}>
        {garageStatusLabels[vehicle.garage_status]}
      </StatusPill>
      <p>{vehicle.documents.missing.length} documento(s) pendente(s)</p>
      <a className="text-link" href={`/app/garagem/${vehicle.vehicle_id}`}>Abrir veículo</a>
    </Panel>);
}
