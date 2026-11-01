import { useId, type SelectHTMLAttributes } from "react";
import styles from "./Input.module.css";
type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { fieldClassName?: string; label?: string; hint?: string; error?: string };
export function Select({ id, label, hint, error, className="", fieldClassName="", "aria-describedby": describedBy, ...props }: SelectProps) {
 const generatedId=useId(); const fieldId=id ?? props.name ?? generatedId;
 const description=[describedBy, hint ? fieldId+"-hint" : "", error ? fieldId+"-error" : ""].filter(Boolean).join(" ") || undefined;
 return <div className={`${styles.field} ${fieldClassName}`}>
  {label && <label className={styles.label} htmlFor={fieldId}>{label}</label>}
  <select {...props} id={fieldId} className={`${styles.input} ${className}`} aria-describedby={description} aria-invalid={error ? true : props["aria-invalid"]} />
  {hint && <span id={fieldId+"-hint"} className={styles.hint}>{hint}</span>}
  {error && <span id={fieldId+"-error"} className={styles.error}>{error}</span>}
 </div>;
}
