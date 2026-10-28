import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAdministrativeAccountRequests, type AccountRequest } from "../../../lib/api/auth";
export function AccountRequestsPage() {
  const [requests, setRequests] = useState<AccountRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let active = true; listAdministrativeAccountRequests().then((items) => { if (active) setRequests(items); }).catch((caught: unknown) => { if (active) setError(caught instanceof Error ? caught.message : "Não foi possível consultar solicitações."); }); return () => { active = false; }; }, []);
  return <section><h1>Solicitações de conta</h1><p>Solicitações aguardando tratamento administrativo. Encerramento e correção de identidade preservam o histórico e exigem análise dos vínculos afetados.</p>
    {error && <p role="alert">{error}</p>}{!requests && !error && <p>Consultando solicitações...</p>}
    {requests?.length === 0 && <p>Nenhuma solicitação no momento.</p>}
    {requests?.map((item) => <article key={item.id}><h2>{item.kind === "closure" ? "Encerramento" : "Correção de identidade"} · conta {item.user_id}</h2><p>{item.reason}</p><p>{item.status === "pending" ? "Aguardando análise" : item.status}</p><p>{new Date(item.created_at).toLocaleString("pt-BR")}</p></article>)}
    <Link to="/admin/participantes">Abrir gestão de participantes</Link>
  </section>;
}
