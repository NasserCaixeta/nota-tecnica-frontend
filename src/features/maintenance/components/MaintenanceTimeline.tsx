import { Link } from "react-router-dom";
import { serviceStatus } from "../../../lib/api/maintenance";
import { Panel } from "../../../components/ui/Panel";
import { StatusPill } from "../../../components/ui/StatusPill";
import { formatDate } from "../../../lib/format/date";
import { formatMoney } from "../../../lib/format/money";
import type { MaintenanceRecord } from "../../../lib/api/maintenance";

type MaintenanceTimelineProps = {
  records: MaintenanceRecord[];
};

export function MaintenanceTimeline({ records }: MaintenanceTimelineProps) {
  if (records.length === 0) {
    return (
      <Panel title="Linha do tempo">
        <p className="muted">Nenhuma manutenção registrada para este veículo.</p>
      </Panel>
    );
  }

  return (
    <Panel title="Linha do tempo">
      <div className="stack">
        {records.map((record) => {
          const totalCost = Number(record.labor_cost ?? 0) + Number(record.parts_cost ?? 0);

          return (
            <article className="data-row" key={record.id}>
              <div>
                <Link to={`/app/manutencoes/${record.id}`}>{record.description}</Link>
                <p>{serviceStatus(record)}</p>
              </div>
              <div className="data-row__meta">
                <StatusPill>{formatDate(record.service_date)}</StatusPill>
                {record.odometer !== null ? <span className="muted">{record.odometer.toLocaleString("pt-BR")} km</span> : null}
                {totalCost > 0 ? <strong>{formatMoney(totalCost)}</strong> : null}
              </div>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}
