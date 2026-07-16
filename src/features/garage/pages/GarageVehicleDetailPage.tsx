import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { StateBlock } from "../../../components/data-display/StateBlock";
import { Button } from "../../../components/ui/Button";
import { getGarageVehicle } from "../../../lib/api/garage";
import type { GarageVehicleItem } from "../../../lib/api/types";
import { DocumentChecklist } from "../components/DocumentChecklist";

export function GarageVehicleDetailPage() {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState<GarageVehicleItem | null>(null);

  useEffect(() => {
    if (vehicleId) {
      getGarageVehicle(Number(vehicleId)).then(setVehicle);
    }
  }, [vehicleId]);

  if (!vehicle) {
    return <p>Carregando veículo...</p>;
  }

  return (
    <main>
      <h1>{vehicle.plate}</h1>
      <p>
        {vehicle.brand} {vehicle.model} {vehicle.model_year}
      </p>
      <DocumentChecklist vehicle={vehicle} />
      <Link to={`/app/garagem/${vehicle.vehicle_id}/documentos`}>
        <Button disabled={!vehicle.permissions.can_upload_documents}>Enviar documentos</Button>
      </Link>
      <StateBlock
        title="Relatório para venda"
        message="Este recurso ainda não está disponível nesta versão."
      />
    </main>
  );
}
