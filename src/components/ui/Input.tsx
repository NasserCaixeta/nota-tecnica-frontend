import { useId, type ReactNode, type InputHTMLAttributes } from "react";
import styles from "./Input.module.css";
type InputProps = InputHTMLAttributes<HTMLInputElement> & { fieldClassName?: string; label?: ReactNode; hint?: string; error?: string };
export function Input({ id, label, hint, error, className="", fieldClassName="", "aria-describedby": describedBy, ...props }: InputProps) {
 const generatedId=useId(); const fieldId=id ?? props.name ?? generatedId;
 const description=[describedBy, hint ? fieldId+"-hint" : "", error ? fieldId+"-error" : ""].filter(Boolean).join(" ") || undefined;
 return <div className={`${styles.field} ${fieldClassName}`}>
  {label && <label className={styles.label} htmlFor={fieldId}>{label}</label>}
  <input {...props} id={fieldId} className={`${styles.input} ${className}`} aria-describedby={description} aria-invalid={error ? true : props["aria-invalid"]} />
  {hint && <span id={fieldId+"-hint"} className={styles.hint}>{hint}</span>}
  {error && <span id={fieldId+"-error"} className={styles.error}>{error}</span>}
 </div>;
}
