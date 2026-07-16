import type { SelectHTMLAttributes } from "react";

import styles from "./Input.module.css";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  fieldClassName?: string;
  label?: string;
};

export function Select({ id, label, children, className = "", fieldClassName = "", ...props }: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <label className={`${styles.field} ${fieldClassName}`}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <select id={selectId} className={`${styles.input} ${className}`} {...props}>
        {children}
      </select>
    </label>
  );
}
