import type { WorkshopRankingItem } from "../../../lib/api/ranking";
import { WorkshopRankingCard } from "./WorkshopRankingCard";

export function WorkshopRankingList({ items }: { items: WorkshopRankingItem[] }) {
  if (items.length === 0) {
    return <p>Nenhuma oficina ranqueada ainda.</p>;
  }

  return (
    <div>
      {items.map((item) => (
        <WorkshopRankingCard key={item.workshop_id} workshop={item} />
      ))}
    </div>
  );
}
