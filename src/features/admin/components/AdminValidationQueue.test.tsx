import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AdminValidationQueue } from "./AdminValidationQueue";

describe("AdminValidationQueue", () => {
  it("renders pending vehicle links", () => {
    render(
      <AdminValidationQueue
        items={[
          {
            vehicle_link_id: 7,
            vehicle_id: 3,
            user_id: 9,
            plate: "ABC1D23",
            relationship_type: "owner",
            garage_status: "under_review",
            required_documents: ["crlv"],
            uploaded_documents: ["crlv"],
            missing_documents: [],
            verification_rejection_reason: null,
            review_attempts: 0,
            submitted_for_review_at: "2026-07-08T00:00:00Z",
            reviewed_at: null,
          },
        ]}
      />,
    );

    expect(screen.getByText("ABC1D23")).toBeInTheDocument();
  });
});
