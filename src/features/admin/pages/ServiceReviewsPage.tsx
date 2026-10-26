import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../../lib/api/client";
import { serviceError } from "../../../lib/api/maintenance";
type Review = { id: number; record_id: number; stars: number; comment: string; comment_hidden: boolean; review_version: number };
export function ServiceReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]); const [reasons, setReasons] = useState<Record<number,string>>({}); const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { setLoading(true); setError(null); try { setReviews(await apiRequest<Review[]>("/admin/service-reviews")); } catch(e) { setError(serviceError(e)); } finally { setLoading(false); } }, []);
  useEffect(() => { void load(); }, [load]);
  async function moderate(review: Review) {
    setBusy(true); setError(null);
    try { await apiRequest(`/admin/service-reviews/${review.id}`, { method: "PATCH", body: JSON.stringify({ expected_version: review.review_version, comment_hidden: !review.comment_hidden, reason: reasons[review.id] }) }); await load(); }
    catch(e) { setError(serviceError(e)); } finally { setBusy(false); }
  }
  return <section className="page-section"><h1>Comentários de avaliações</h1><p>A moderação altera a exibição do comentário, preservando as estrelas escolhidas pelo cliente.</p>{error && <p role="alert">{error} <button onClick={() => void load()}>Atualizar</button></p>}{loading ? <p role="status">Carregando...</p> : !reviews.length ? <p>Nenhum comentário para análise.</p> : reviews.map(r => <article className="panel" key={r.id}><Link to={`/admin/servicos/${r.record_id}`}>Abrir atendimento</Link><p>{r.stars} estrelas · {r.comment_hidden ? "Comentário oculto" : "Comentário visível"}</p><p>{r.comment}</p><label>Justificativa para o comentário {r.id}<textarea value={reasons[r.id] ?? ""} onChange={e => setReasons(c => ({ ...c, [r.id]: e.target.value }))} /></label><button disabled={busy || !reasons[r.id]?.trim()} onClick={() => void moderate(r)}>{r.comment_hidden ? "Liberar comentário" : "Ocultar comentário"}</button></article>)}</section>;
}
