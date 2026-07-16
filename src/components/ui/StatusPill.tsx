import type { ReactNode } from "react";

import "./StatusPill.css";

type Tone = "neutral" | "success" | "warning" | "danger" | "accent";

export function StatusPill({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`status-pill status-pill--${tone}`}>{children}</span>;
}
