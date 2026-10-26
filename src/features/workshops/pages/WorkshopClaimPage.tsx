import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listWorkshopClaims, lookupWorkshop, requestWorkshopClaim, type WorkshopClaimRead, type WorkshopRead } from "../../../lib/api/workshops";
import { uploadWorkshopClaimDocument } from "../../../lib/api/documents";
import { validationDocumentLabels } from "../../../content/documents";
import type { ValidationDocumentType } from "../../../lib/api/types";
const required: ValidationDocumentType[] = ["company_contract_or_power_of_attorney", "representative_identity"];
export function WorkshopClaimPage() {
  const [params] = useSearchParams();
  const [cnpj, setCnpj] = useState(params.get("cnpj") ?? "");
  const [office, setOffice] = useState<Pick<WorkshopRead, "id" | "trade_name" | "cnpj"> | null>(null);
  const [claims, setClaims] = useState<WorkshopClaimRead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    try { setClaims(await listWorkshopClaims()); }
    catch { setError("Não foi possível carregar suas solicitações."); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  async function search(event: FormEvent) {
    event.preventDefault(); setError(null); setBusy(true);
    try { setOffice(await lookupWorkshop(cnpj)); }
    catch { setOffice(null); setError("Oficina não encontrada. Confira o CNPJ ou cadastre os dados da oficina."); }
    finally { setBusy(false); }
  }
  async function request(id: number) {
    setError(null); setBusy(true);
    try { await requestWorkshopClaim(id); await load(); setMessage("Solicitação registrada. Envie os documentos de representação."); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível registrar a solicitação."); }
    finally { setBusy(false); }
  }
  async function upload(claim: WorkshopClaimRead, kind: ValidationDocumentType, file: File) {
    setError(null); setMessage(null);
    if (!file.size || file.size > 10 * 1024 * 1024 || !["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Envie PDF, JPEG, PNG ou WebP de até 10 MiB."); return; }
    setBusy(true);
    try { await uploadWorkshopClaimDocument(claim.id, kind, file); await load(); setMessage("Documento enviado para análise administrativa."); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível enviar o documento."); }
    finally { setBusy(false); }
  }
  return <section className="page-section"><h1>Representar uma oficina</h1>
    <p>Sua conta continua com acesso de cliente. A representação da oficina passa por uma análise própria.</p>
    {error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    <form onSubmit={search}><label>CNPJ da oficina<input value={cnpj} onChange={event => setCnpj(event.target.value)} required /></label><button disabled={busy}>Buscar oficina</button></form>
    {office && <article><h2>{office.trade_name}</h2><p>{office.cnpj}</p><button disabled={busy} onClick={() => void request(office.id)}>Solicitar representação</button></article>}
    <Link to="/app/oficinas/nova">Cadastrar uma oficina que ainda não está na base</Link>
    <h2>Suas solicitações</h2>
    {claims.map(claim => <article className="panel" key={claim.id}>
      <h3>{claim.trade_name}</h3><p>{claim.status === "verified" ? "Representação aprovada" : claim.status === "rejected" ? "Solicitação recusada" : "Documentação em análise"}</p>
      {claim.reason && <p>{claim.reason}</p>}
      {required.map(kind => {
        const document = claim.documents.find(entry => entry.validation_document_type === kind);
        return <div key={kind}><p>{validationDocumentLabels[kind]}: {document?.review_status === "approved" ? "aprovado" : document?.review_status === "rejected" ? "recusado" : document?.storage_verified ? "aguardando análise" : "pendente"}</p>
          {claim.status !== "verified" && <label>Arquivo para {validationDocumentLabels[kind]}<input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" disabled={busy} onChange={event => { const file = event.target.files?.[0]; if (file) void upload(claim, kind, file); event.target.value = ""; }} /></label>}
        </div>;
      })}
      {claim.status === "rejected" && <button disabled={busy} onClick={() => void request(claim.workshop_id)}>Reenviar solicitação</button>}
    </article>)}
    <p><Link to="/app/oficinas">Voltar às minhas oficinas</Link></p>
  </section>;
}
