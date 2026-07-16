import type { HTMLAttributes, ReactNode } from "react";

import "./Panel.css";

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
};

export function Panel({ children, className = "", eyebrow, title, ...props }: PanelProps) {
  return (
    <section className={`panel ${className}`} {...props}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
}
