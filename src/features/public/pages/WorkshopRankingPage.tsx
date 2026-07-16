import { useEffect, useState } from "react";

import { getWorkshopRanking, type WorkshopRankingItem } from "../../../lib/api/ranking";
import { WorkshopRankingList } from "../../workshops/components/WorkshopRankingList";

export function WorkshopRankingPage() {
  const [items, setItems] = useState<WorkshopRankingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkshopRanking()
      .then((response) => setItems(response.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <h1>Ranking de oficinas</h1>
      {loading ? <p>Carregando ranking...</p> : <WorkshopRankingList items={items} />}
    </main>
  );
}
