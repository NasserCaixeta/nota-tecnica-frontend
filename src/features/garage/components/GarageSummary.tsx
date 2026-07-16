import { Metric } from "../../../components/data-display/Metric";
import { Panel } from "../../../components/ui/Panel";
import type { GarageDashboard } from "../../../lib/api/types";

export function GarageSummary({ summary }: { summary: GarageDashboard["summary"] }) {
  return (
    <Panel>
      <Metric label="Veículos" value={summary.total} />
      <Metric label="Validados" value={summary.active} />
      <Metric label="Em análise" value={summary.under_review} />
      <Metric label="Pendentes" value={summary.pending_documents} />
    </Panel>
  );
}
