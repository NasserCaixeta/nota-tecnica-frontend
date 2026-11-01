import { useId, type ReactNode, type TextareaHTMLAttributes } from "react";
import styles from "./Input.module.css";
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { fieldClassName?: string; label?: ReactNode; hint?: string; error?: string };
export function Textarea({ id, label, hint, error, className="", fieldClassName="", "aria-describedby": describedBy, ...props }: TextareaProps) {
 const generatedId=useId(); const fieldId=id ?? props.name ?? generatedId;
 const description=[describedBy, hint ? fieldId+"-hint" : "", error ? fieldId+"-error" : ""].filter(Boolean).join(" ") || undefined;
 return <div className={`${styles.field} ${fieldClassName}`}>
  {label && <label className={styles.label} htmlFor={fieldId}>{label}</label>}
  <textarea {...props} id={fieldId} className={`${styles.input} ${styles.textarea} ${className}`} aria-describedby={description} aria-invalid={error ? true : props["aria-invalid"]} />
  {hint && <span id={fieldId+"-hint"} className={styles.hint}>{hint}</span>}
  {error && <span id={fieldId+"-error"} className={styles.error}>{error}</span>}
 </div>;
}
