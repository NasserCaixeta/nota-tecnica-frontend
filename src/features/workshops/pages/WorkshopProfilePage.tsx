import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Panel } from "../../../components/ui/Panel";
import { getWorkshop, type WorkshopRead } from "../../../lib/api/workshops";
import { getWorkshopPerformance, type WorkshopPerformance } from "../../../lib/api/ranking";
import { WorkshopRankingCard } from "../components/WorkshopRankingCard";
export function WorkshopProfilePage() {
  const { workshopId = "" } = useParams(); const [workshop, setWorkshop] = useState<WorkshopRead | null>(null); const [performance, setPerformance] = useState<WorkshopPerformance | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => { setLoading(true); setError(null); try { const [w,p] = await Promise.all([getWorkshop(Number(workshopId)), getWorkshopPerformance(workshopId)]); setWorkshop(w); setPerformance(p); } catch { setError("Não foi possível carregar a oficina. Confira o endereço e tente novamente."); } finally { setLoading(false); } }, [workshopId]);
  useEffect(() => { void load(); }, [load]);
  if (loading) return <p role="status">Carregando oficina...</p>;
  if (error) return <section role="alert"><p>{error}</p><button onClick={() => void load()}>Tentar novamente</button></section>;
  return workshop && performance && <section className="page-section"><Panel title={workshop.trade_name} eyebrow={`${workshop.city}/${workshop.state}`}><p>Oficina verificada</p><p>{workshop.legal_name}</p><p>{workshop.specialties.join(", ") || "Especialidades não informadas"}</p><p>{workshop.phone} · {workshop.email}</p></Panel><WorkshopRankingCard workshop={performance.metrics} /><p>{performance.score_explanation} Versão {performance.score_version}.</p><h2>Avaliações de serviços publicados</h2>{performance.reviews.length === 0 ? <p>Nenhuma avaliação publicada.</p> : performance.reviews.map((r,i) => <article key={i}><p>{r.stars} / 5 estrelas</p>{r.comment && <p>{r.comment}</p>}</article>)}<Link to={`/app/oficinas/reivindicar?cnpj=${encodeURIComponent(workshop.cnpj)}`}>Sou responsável por esta oficina</Link></section>;
}
