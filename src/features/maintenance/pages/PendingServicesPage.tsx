import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listPendingServices, listPendingInvitations, serviceError, type MaintenanceRecord, type PendingInvitation } from "../../../lib/api/maintenance";
import { MaintenanceTimeline } from "../components/MaintenanceTimeline";
export function PendingServicesPage() {
    const [records, setRecords] = useState<MaintenanceRecord[]>([]);
    const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const load = useCallback(async () => { setLoading(true); try {
        const [r, i] = await Promise.all([listPendingServices(), listPendingInvitations()]);
        setRecords(r);
        setInvitations(i);
        setError(null);
    }
    catch (e) {
        setError(serviceError(e));
    }
    finally {
        setLoading(false);
    } }, []);
    useEffect(() => { void load(); }, [load]);
    return <section className="page-section"><PageHeader title="Serviços e convites pendentes" description="Atendimentos que precisam do seu reconhecimento ou da regularização de um vínculo."/>{error && <p className="message" role="alert">{error} <Button onClick={() => void load()} variant="secondary">Atualizar</Button></p>}{loading ? <p role="status">Carregando...</p> : !error && <><MaintenanceTimeline records={records}/><h2>Convites recebidos</h2>{invitations.length === 0 ? <p>Nenhum convite aguardando vínculo.</p> : invitations.map(i => <p key={i.id}><Link to={`/convite-servico?convite=${i.id}`}>Retomar convite recebido em {new Date(i.created_at).toLocaleDateString("pt-BR")}</Link></p>)}</>}</section>;
}
