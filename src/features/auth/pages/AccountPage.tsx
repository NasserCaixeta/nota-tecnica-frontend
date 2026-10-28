import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { createAccountRequest, getCurrentUser, listAccountRequests, updateProfile, type AccountRequest } from "../../../lib/api/auth";
import type { UserRead } from "../../../lib/api/types";

export function AccountPage() {
  const [user, setUser] = useState<UserRead | null>(null);
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [closure, setClosure] = useState("");
  const [identity, setIdentity] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    void Promise.all([getCurrentUser(), listAccountRequests("closure"), listAccountRequests("identity")]).then(([profile, closures, identities]) => {
      if (active) { setUser(profile); setRequests([...closures, ...identities]); }
    }).catch((caught: unknown) => { if (active) setError(caught instanceof Error ? caught.message : "Não foi possível consultar sua conta."); });
    return () => { active = false; };
  }, []);
  async function save(event: FormEvent) {
    event.preventDefault(); if (!user) return;
    setBusy(true); setError(null); setMessage(null);
    try { setUser(await updateProfile({ full_name: user.full_name, phone: user.phone ?? "", city: user.city, state: user.state })); setMessage("Perfil atualizado."); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível atualizar o perfil."); }
    finally { setBusy(false); }
  }
  async function request(kind: "closure" | "identity", event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(null); setMessage(null);
    try {
      const result = await createAccountRequest(kind, kind === "closure" ? closure : identity);
      setRequests((items) => [...items.filter((item) => item.id !== result.id), result]);
      setMessage("Solicitação registrada para análise administrativa. Sua conta e seu histórico permanecem preservados durante o acompanhamento.");
      if (kind === "closure") setClosure(""); else setIdentity("");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível registrar a solicitação."); }
    finally { setBusy(false); }
  }
  return <section className="page-section">
    <h1>Minha conta</h1>{error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    {!user && !error && <p>Consultando conta...</p>}
    {user && <>
      <form className="stack" onSubmit={(event) => void save(event)}>
        <label>E-mail<input readOnly value={user.email} /></label><label>CPF<input readOnly value={user.cpf} /></label>
        <label>Nome completo<input required value={user.full_name} onChange={(event) => setUser({ ...user, full_name: event.target.value })} /></label>
        <label>Telefone<input required value={user.phone ?? ""} onChange={(event) => setUser({ ...user, phone: event.target.value })} /></label>
        <label>Cidade<input required value={user.city} onChange={(event) => setUser({ ...user, city: event.target.value })} /></label>
        <label>UF<input required minLength={2} maxLength={2} value={user.state} onChange={(event) => setUser({ ...user, state: event.target.value.toUpperCase() })} /></label>
        <button disabled={busy}>Salvar perfil</button>
      </form>
      <p><Link to="/app/participacao">Ver situação da participação</Link> · <Link to="/app/notificacoes">Ver pendências</Link></p>
      <p><Link to="/esqueci-senha">Recuperar ou trocar a senha</Link></p>
      <h2>Correção de identidade</h2><p>CPF e dados usados em vínculos ou representações exigem análise administrativa. A administração orientará os comprovantes necessários.</p>
      <form className="stack" onSubmit={(event) => void request("identity", event)}>
        <label>O que precisa ser corrigido<textarea minLength={10} maxLength={1000} required value={identity} onChange={(event) => setIdentity(event.target.value)} /></label>
        <button disabled={busy}>Solicitar correção de identidade</button>
      </form>
      <h2>Solicitar encerramento</h2><p>O pedido será analisado por um administrador. O envio não apaga seu histórico nem encerra a conta imediatamente.</p>
      <form className="stack" onSubmit={(event) => void request("closure", event)}>
        <label>Motivo do encerramento<textarea minLength={10} maxLength={1000} required value={closure} onChange={(event) => setClosure(event.target.value)} /></label>
        <button disabled={busy}>Solicitar encerramento</button>
      </form>
      <h2>Minhas solicitações</h2>{requests.length === 0 ? <p>Nenhuma solicitação administrativa.</p> : requests.map((item) => <article key={item.id}><h3>{item.kind === "closure" ? "Encerramento" : "Correção de identidade"}</h3><p>{item.reason}</p><p>{item.status === "pending" ? "Aguardando análise" : item.status}</p></article>)}
    </>}
  </section>;
}
