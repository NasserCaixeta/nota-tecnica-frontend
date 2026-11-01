import { StateBlock } from "../../../components/data-display/StateBlock";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listManagedWorkshops, listWorkshopClaims, type WorkshopRead, type WorkshopClaimRead } from "../../../lib/api/workshops";
export function ManagedWorkshopsPage() {
    const [offices, setOffices] = useState<WorkshopRead[]>([]);
    const [claims, setClaims] = useState<WorkshopClaimRead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const load = useCallback(async () => {
        setError(null);
        setLoading(true);
        try {
            const [managed, requested] = await Promise.all([listManagedWorkshops(), listWorkshopClaims()]);
            setOffices(managed);
            setClaims(requested);
        }
        catch {
            setError("Não foi possível carregar as oficinas.");
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => { void load(); }, [load]);
    return <section className="page-section"><PageHeader title="Minhas oficinas" description="Gerencie representações e acompanhe suas solicitações."/>
    <p><Link to="/app/oficinas/nova">Cadastrar minha oficina</Link></p><p><Link to="/app/oficinas/reivindicar">Reivindicar uma oficina existente</Link></p>
    {error && <p className="message" role="alert">{error} <Button onClick={() => void load()} variant="secondary">Tentar novamente</Button></p>}
    {loading ? <StateBlock kind="loading" title="Carregando oficinas..."/> : error ? null : <>
      <h2>Representações aprovadas</h2>{offices.length === 0 ? <StateBlock title="Nenhuma representação aprovada." description="Cadastre sua oficina ou solicite a representação de uma oficina existente."/> : offices.map(office => <article className="panel" key={office.id}><h3>{office.trade_name}</h3><p>{office.city}/{office.state}</p><Link to={`/app/oficinas/${office.id}/servicos`}>Gerenciar atendimentos</Link> <Link to={`/oficinas/${office.id}`}>Ver perfil público</Link></article>)}
      <h2>Solicitações</h2>{claims.map(claim => <article className="panel" key={claim.id}><strong>{claim.trade_name}</strong><p>{claim.status === "verified" ? "Aprovada" : claim.status === "rejected" ? "Recusada" : "Pendente"}</p>{claim.reason && <p>{claim.reason}</p>}<Link to="/app/oficinas/reivindicar">Acompanhar documentação</Link></article>)}
    </>}
  </section>;
}
