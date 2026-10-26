import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSession } from "../../../lib/auth/SessionContext";
import { acceptServiceInvitation, resumeServiceInvitation, requestInvitationRelationship, serviceError, type InvitationResult } from "../../../lib/api/maintenance";
import { apiRequest } from "../../../lib/api/client";
import { GarageAddVehicleForm } from "../../garage/components/GarageAddVehicleForm";
const storageKey = "nota-tecnica.invitation.pending";
function captureToken() {
  const fragment = window.location.hash.slice(1);
  if (fragment) {
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    try { window.sessionStorage.setItem(storageKey, fragment); } catch { /* Keep it in memory if storage is unavailable. */ }
    return fragment;
  }
  try { return window.sessionStorage.getItem(storageKey) ?? ""; } catch { return ""; }
}
export function ServiceInvitationPage() {
  const { user, status } = useSession(); const [params] = useSearchParams(); const invitationId = Number(params.get("convite"));
  const [token] = useState(captureToken); const [result, setResult] = useState<InvitationResult | null>(null); const [error, setError] = useState<string | null>(null); const [busy, setBusy] = useState(false); const [vehicleId, setVehicleId] = useState<number | null>(null);
  async function resume() {
    setBusy(true); setError(null);
    try { setResult(invitationId ? await resumeServiceInvitation(invitationId) : await acceptServiceInvitation(token)); try { window.sessionStorage.removeItem(storageKey); } catch { /* No persistence required after the authenticated intent. */ } }
    catch (e) { setError(serviceError(e)); } finally { setBusy(false); }
  }
  return <section className="page-section"><h1>Convite de atendimento</h1>
    <p>O convite não confirma o serviço. Você precisa ter sua participação aprovada, validar o vínculo com o veículo e conferir o atendimento.</p>
    {error && <p role="alert">{error}</p>}
    {status === "loading" ? <p role="status">Carregando sessão...</p> : !user ? <><p>Entre ou cadastre-se para continuar.</p><Link to="/entrar">Entrar</Link> <Link to="/cadastro">Criar conta</Link></> : <>
      <button disabled={busy || (!token && !invitationId)} onClick={() => void resume()}>Retomar convite</button>
      {result?.state === "participation_pending" && <p>Sua participação precisa de aprovação. <Link to="/app/participacao">Acompanhar aprovação</Link></p>}
      {result?.state === "relationship_required" && <><p>Você precisa validar seu vínculo com o veículo antes de visualizar e confirmar o atendimento.</p><p>Se o veículo já estiver cadastrado, acompanhe sua documentação na garagem. Para um vínculo sem vaga de garagem, informe os dados abaixo.</p>
        {vehicleId && <Link to={`/app/garagem/${vehicleId}/documentos`}>Enviar documentos do vínculo</Link>}
        <GarageAddVehicleForm isSubmitting={busy} onSubmit={async vehicle => { setBusy(true); setError(null); try { const created = invitationId ? await apiRequest<{ vehicle_id: number }>(`/service-invitations/${invitationId}/relationship`, { method: "POST", body: JSON.stringify(vehicle) }) : await requestInvitationRelationship(token, vehicle); setVehicleId(created.vehicle_id); } catch (e) { setError(serviceError(e)); } finally { setBusy(false); } }} />
      </>}
      {result?.state === "awaiting_confirmation" && <p>Vínculo validado. Confira os dados antes de confirmar. <Link to={`/app/manutencoes/${result.record_id}`}>Abrir atendimento</Link></p>}
      <Link to="/app/servicos-pendentes">Meus convites e serviços pendentes</Link>
    </>}
  </section>;
}
