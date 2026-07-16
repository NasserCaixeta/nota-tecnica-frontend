import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("renders a named button and handles clicks", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Consultar</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Consultar" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
