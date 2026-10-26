import type { VehicleHistoryPreview } from "../../../lib/api/public";
import { formatDate } from "../../../lib/format/date";

const completenessLabels: Record<VehicleHistoryPreview["completeness_score"], string> = {
  none: "Sem histórico",
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

export function HistoryPreviewPanel({ preview }: { preview: VehicleHistoryPreview | null }) {
  if (!preview) {
    return (
      <article className="history-preview">
        <div className="history-preview__header">
          <div>
            <p className="history-preview__label">Prévia gratuita</p>
            <h2>Consulte uma placa</h2>
          </div>
        </div>
        <p>A prévia mostra volume de registros, período coberto, oficinas envolvidas e completude do histórico.</p>
      </article>
    );
  }

  if (!preview.vehicle_found) {
    return (
      <article className="history-preview">
        <div className="history-preview__header">
          <div>
            <p className="history-preview__label">Resultado</p>
            <h2>Ainda não encontramos histórico</h2>
          </div>
          <span className="history-preview__plate">{preview.plate}</span>
        </div>
        <p>Não há registros publicados disponíveis para esta placa. Isso não informa se existem cadastros ou análises privadas.</p>
      </article>
    );
  }

  const firstDate = preview.first_maintenance_date ? formatDate(preview.first_maintenance_date) : "Não informado";
  const lastDate = preview.last_maintenance_date ? formatDate(preview.last_maintenance_date) : "Não informado";

  return (
    <article className="history-preview">
      <div className="history-preview__header">
        <div>
          <p className="history-preview__label">Histórico encontrado</p>
          <h2>Prévia técnica disponível</h2>
        </div>
        <span className="history-preview__plate">{preview.plate}</span>
      </div>

      <div className="history-preview__metrics">
        <div className="history-preview__metric">
          <strong>{preview.maintenance_count}</strong>
          <span>Registros de manutenção</span>
        </div>
        <div className="history-preview__metric">
          <strong>{preview.distinct_workshop_count}</strong>
          <span>Oficinas envolvidas</span>
        </div>
      </div>

      <p>Esta é uma prévia, sem detalhes dos serviços ou documentos pessoais. O histórico completo de terceiros exige acesso por 30 dias; no piloto, o pagamento será somente de testes.</p>
      <dl className="history-preview__detail-grid">
        <div className="history-preview__detail">
          <dt>Primeiro registro</dt>
          <dd>{firstDate}</dd>
        </div>
        <div className="history-preview__detail">
          <dt>Último registro</dt>
          <dd>{lastDate}</dd>
        </div>
        <div className="history-preview__detail">
          <dt>Completude</dt>
          <dd>{completenessLabels[preview.completeness_score]}</dd>
        </div>
        <div className="history-preview__detail">
          <dt>Categorias</dt>
          <dd className="history-preview__categories">
            {preview.categories.length > 0 ? preview.categories.map((category) => <span key={category}>{category}</span>) : "Não informado"}
          </dd>
        </div>
      </dl>
    </article>
  );
}
