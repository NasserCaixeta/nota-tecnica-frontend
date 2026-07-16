import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GarageVehicleCard } from "./GarageVehicleCard";

describe("GarageVehicleCard", () => {
  it("renders vehicle identity and status", () => {
    render(
      <GarageVehicleCard
        vehicle={{
          vehicle_id: 1,
          vehicle_link_id: 10,
          plate: "ABC1D23",
          brand: "Volkswagen",
          model: "Golf",
          model_year: 2020,
          relationship_type: "owner",
          garage_status: "pending_documents",
          verification_rejection_reason: null,
          review_attempts: 0,
          permissions: {
            can_add_maintenance: true,
            can_upload_documents: true,
            can_submit_review: false,
            can_share_history: false,
            can_generate_sale_report: false,
          },
          documents: { required: ["crlv"], uploaded: [], missing: ["crlv"] },
          maintenance_alerts: [],
          recommended_workshops: [],
          created_at: "2026-07-08T00:00:00Z",
          updated_at: "2026-07-08T00:00:00Z",
        }}
      />,
    );

    expect(screen.getByText("ABC1D23")).toBeInTheDocument();
    expect(screen.getByText(/Documentos pendentes/i)).toBeInTheDocument();
  });
});
