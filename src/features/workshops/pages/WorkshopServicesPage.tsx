import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createWorkshopService, listWorkshopServices, serviceError, type MaintenanceRecord } from "../../../lib/api/maintenance";
import { MaintenanceForm } from "../../maintenance/components/MaintenanceForm";
import { MaintenanceTimeline } from "../../maintenance/components/MaintenanceTimeline";
export function WorkshopServicesPage() {
  const { workshopId = "" } = useParams(); const navigate = useNavigate();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false); const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => { setLoading(true); try { setRecords(await listWorkshopServices(workshopId)); setError(null); } catch (e) { setError(serviceError(e)); } finally { setLoading(false); } }, [workshopId]);
  useEffect(() => { void load(); }, [load]);
  return <section className="page-section"><h1>Atendimentos da oficina</h1><p>Somente os atendimentos registrados por esta oficina. O cliente pode cadastrar-se depois e validar seu vínculo.</p>
    {error && <p role="alert">{error} <button onClick={() => void load()}>Atualizar</button></p>}
    {loading ? <p role="status">Carregando...</p> : <MaintenanceTimeline records={records} />}
    <MaintenanceForm workshop isSubmitting={busy} onSubmit={async payload => { setBusy(true); try { const record = await createWorkshopService(workshopId, payload); navigate(`/app/manutencoes/${record.id}`); } catch (e) { setError(serviceError(e)); } finally { setBusy(false); } }} />
  </section>;
}
