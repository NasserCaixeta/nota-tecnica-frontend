import { useEffect, useState } from "react";

import { StateBlock } from "../../../components/data-display/StateBlock";
import { listPendingGarageValidations, type AdminGarageVehicleLinkRead } from "../../../lib/api/admin";
import { AdminValidationQueue } from "../components/AdminValidationQueue";

export function AdminValidationQueuePage() {
  const [items, setItems] = useState<AdminGarageVehicleLinkRead[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    listPendingGarageValidations()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (isLoading) {
    return <StateBlock title="Carregando validações" />;
  }

  return (
    <section className="page-section">
      <AdminValidationQueue items={items} />
    </section>
  );
}
