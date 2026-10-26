import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAdminServiceDisputes, reviewServiceDispute } from "../../../lib/api/admin";
import { serviceError, type DisputeRead } from "../../../lib/api/maintenance";
import { PrivateEvidence } from "../../maintenance/components/PrivateEvidence";
export function ServiceDisputesPage() {
  const [items, setItems] = useState<DisputeRead[]>([]); const [reasons, setReasons] = useState<Record<number, string>>({}); const [error, setError] = useState<string | null>(null); const [message, setMessage] = useState(""); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { setLoading(true); try { setItems(await listAdminServiceDisputes()); setError(null); } catch (e) { setError(serviceError(e)); } finally { setLoading(false); } }, []);
  useEffect(() => { void load(); }, [load]);
  async function decide(item: DisputeRead, resolution: "request_changes" | "reject" | "resolved") {
    setBusy(true); setError(null); try { await reviewServiceDispute(item, resolution, reasons[item.id]); await load(); setMessage("Decisão registrada; reconhecimento do cliente preservado."); } catch (e) { setError(serviceError(e)); } finally { setBusy(false); }
  }
  return <section className="page-section"><h1>Contestações de serviços</h1>{error && <p role="alert">{error} <button onClick={() => void load()}>Atualizar versão</button></p>}{message && <p role="status">{message}</p>}{loading ? <p role="status">Carregando...</p> : !items.length ? <p>Nenhuma contestação aberta.</p> : items.map(item => <article className="panel" key={item.id}><h2>Contestação do atendimento</h2><p>{item.reason}</p><Link to={`/admin/servicos/${item.record_id}`}>Conferir atendimento e versões</Link>{item.messages.map(m => <p key={m.id}>{m.body}</p>)}<PrivateEvidence documents={item.documents} /><label>Justificativa da decisão {item.id}<textarea value={reasons[item.id] ?? ""} onChange={e => setReasons(c => ({ ...c, [item.id]: e.target.value }))} /></label><div><button disabled={busy || !reasons[item.id]?.trim()} onClick={() => void decide(item, "request_changes")}>Solicitar correção</button><button disabled={busy || !reasons[item.id]?.trim()} onClick={() => void decide(item, "resolved")}>Encerrar análise</button><button disabled={busy || !reasons[item.id]?.trim()} onClick={() => void decide(item, "reject")}>Encerrar como recusado</button></div></article>)}
  </section>;
}
