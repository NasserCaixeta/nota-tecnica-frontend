import { Link } from "react-router-dom";
import { Badge } from "../../../components/ui/Badge";
import { Panel } from "../../../components/ui/Panel";
import type { WorkshopRankingItem } from "../../../lib/api/ranking";
const sampleLabels: Record<string,string> = { no_data: "Sem dados publicados", small_sample: "Amostra pequena", insufficient_quality_data: "Dados insuficientes para nota", sufficient: "Amostra suficiente" };
export function WorkshopRankingCard({ workshop }: { workshop: WorkshopRankingItem }) {
  return <Panel><h3><Link to={`/oficinas/${workshop.workshop_id}`}>{workshop.trade_name}</Link></h3><p>{workshop.city}, {workshop.state}</p>
    <strong>{workshop.score === null ? "Sem nota disponível" : `${workshop.score.toFixed(1).replace(".", ",")} / 10`}</strong><p>{sampleLabels[workshop.sample_label] ?? "Amostra em análise"}</p>
    <p>{workshop.completed_services_count} serviços publicados · {workshop.review_count} avaliações · {workshop.measured_deadline_count} prazos medidos</p>
    <p>Prazo: {workshop.on_time_rate === null ? "Não mensurado" : `${Math.round(workshop.on_time_rate * 100)}% no prazo`}</p>
    {workshop.average_stars !== null && <p>Avaliações: {workshop.average_stars.toFixed(1).replace(".", ",")} / 5</p>}
    <div>{workshop.specialties.map(s => <Badge key={s}>{s}</Badge>)}</div>
  </Panel>;
}
