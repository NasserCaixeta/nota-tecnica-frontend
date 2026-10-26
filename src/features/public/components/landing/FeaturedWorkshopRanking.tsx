import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWorkshopRanking, type WorkshopRankingItem } from "../../../../lib/api/ranking";
import { WorkshopRankingCard } from "../../../workshops/components/WorkshopRankingCard";
export function FeaturedWorkshopRanking() {
  const [items, setItems] = useState<WorkshopRankingItem[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  const load = useCallback(async () => { setLoading(true); setError(false); try { const data = await getWorkshopRanking(new URLSearchParams({ limit: "3" })); setItems(data.items); } catch { setError(true); } finally { setLoading(false); } }, []);
  useEffect(() => { void load(); }, [load]);
  return <section className="landing-section" id="ranking"><div className="landing-section__heading"><div><p className="landing-section__label">Oficinas em destaque</p><h2>Indicadores de serviços comprovados.</h2></div><Link to="/oficinas">Ver ranking completo</Link></div>{loading ? <p role="status">Carregando oficinas...</p> : error ? <p role="alert">Não foi possível carregar as oficinas. <button onClick={() => void load()}>Tentar novamente</button></p> : !items.length ? <p>Nenhuma oficina com amostra suficiente neste momento.</p> : <div className="workshop-ranking">{items.map(w => <WorkshopRankingCard key={w.workshop_id} workshop={w} />)}</div>}</section>;
}
