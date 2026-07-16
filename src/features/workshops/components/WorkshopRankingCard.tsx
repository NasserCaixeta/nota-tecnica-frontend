import { Badge } from "../../../components/ui/Badge";
import { Panel } from "../../../components/ui/Panel";
import type { WorkshopRankingItem } from "../../../lib/api/ranking";

export function WorkshopRankingCard({ workshop }: { workshop: WorkshopRankingItem }) {
  return (
    <Panel>
      <h3>{workshop.trade_name}</h3>
      <p>
        {workshop.city}, {workshop.state}
      </p>
      <strong>{workshop.score.toFixed(1)}</strong>
      <div>
        {workshop.specialties.map((specialty) => (
          <Badge key={specialty}>{specialty}</Badge>
        ))}
      </div>
    </Panel>
  );
}
