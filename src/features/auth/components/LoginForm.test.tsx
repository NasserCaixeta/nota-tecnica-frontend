import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("submits email and password", () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} isSubmitting={false} error={null} />);

    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "driver@example.com" } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: "strong-password" } });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: "driver@example.com",
      password: "strong-password",
    });
  });
});
