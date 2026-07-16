import type { InputHTMLAttributes } from "react";

import styles from "./Input.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  fieldClassName?: string;
  label?: string;
};

export function Input({ id, label, className = "", fieldClassName = "", ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className={`${styles.field} ${fieldClassName}`}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <input id={inputId} className={`${styles.input} ${className}`} {...props} />
    </label>
  );
}
