import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getGarageVehicle } from "../../../lib/api/garage";
import type { GarageVehicleItem } from "../../../lib/api/types";
import { DocumentChecklist } from "../components/DocumentChecklist";
import { garageStatusLabels } from "../../../content/status-labels";
import { listVehicleMaintenance, type MaintenanceRecord } from "../../../lib/api/maintenance";
import { MaintenanceTimeline } from "../../maintenance/components/MaintenanceTimeline";
export function GarageVehicleDetailPage() {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState<GarageVehicleItem | null>(null);
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    setError(null);
    try { setVehicle(await getGarageVehicle(Number(vehicleId))); setRecords(await listVehicleMaintenance(vehicleId ?? "")); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível carregar o veículo."); }
  }, [vehicleId]);
  useEffect(() => { void load(); }, [load]);
  if (error) return <section role="alert"><p>{error}</p><button onClick={() => void load()}>Tentar novamente</button></section>;
  if (!vehicle) return <p role="status">Carregando veículo...</p>;
  return <section className="page-section"><h1>{vehicle.plate}</h1>
    <p>{vehicle.brand} {vehicle.model} {vehicle.model_year}</p><p>{garageStatusLabels[vehicle.garage_status]}</p>
    {vehicle.commercial_access === "read_only" && <p>Este veículo está disponível para leitura. Uma assinatura libera novos lançamentos nos veículos adicionais.</p>}
    {vehicle.admin_review_note && <p>{vehicle.admin_review_note}</p>}
    <DocumentChecklist vehicle={vehicle} />
    <MaintenanceTimeline records={records} />
    <Link to={`/app/garagem/${vehicle.vehicle_id}/documentos`}>Acompanhar documentos e análise</Link>
    {vehicle.permissions.can_add_maintenance && <p><Link to={`/app/garagem/${vehicle.vehicle_id}/manutencoes/nova`}>Registrar manutenção</Link></p>}
  </section>;
}
