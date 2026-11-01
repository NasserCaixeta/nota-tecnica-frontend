import { Link, type LinkProps } from "react-router-dom";
import type { ButtonVariant } from "./Button";
import styles from "./Button.module.css";
export function ButtonLink({variant="primary",className="",...props}:LinkProps & {variant?:ButtonVariant}) {
 return <Link {...props} className={`${styles.button} ${styles[variant]} ${className}`} />;
}
