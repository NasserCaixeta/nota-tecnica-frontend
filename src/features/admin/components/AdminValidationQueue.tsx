import { Panel } from "../../../components/ui/Panel";
import { StatusPill } from "../../../components/ui/StatusPill";
import { StateBlock } from "../../../components/data-display/StateBlock";
import type { AdminGarageVehicleLinkRead } from "../../../lib/api/admin";
import { formatDate } from "../../../lib/format/date";

type AdminValidationQueueProps = {
  items: AdminGarageVehicleLinkRead[];
};

export function AdminValidationQueue({ items }: AdminValidationQueueProps) {
  if (items.length === 0) {
    return <StateBlock title="Nenhuma validação pendente" description="A fila está limpa no momento." />;
  }

  return (
    <Panel title="Fila de validação" eyebrow="Garagem">
      <div className="stack">
        {items.map((item) => (
          <article className="data-row" key={item.vehicle_link_id}>
            <div>
              <a href={`/admin/validacoes/${item.vehicle_link_id}`}>
                <strong>{item.plate}</strong>
              </a>
              <p className="muted">
                Usuário #{item.user_id} - Veículo #{item.vehicle_id} - {item.relationship_type}
              </p>
            </div>
            <div className="data-row__meta">
              <StatusPill tone={item.missing_documents.length > 0 ? "warning" : "accent"}>
                {item.garage_status}
              </StatusPill>
              <span className="muted">
                {item.submitted_for_review_at ? formatDate(item.submitted_for_review_at) : "Sem envio"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}
