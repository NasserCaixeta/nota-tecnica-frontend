import type { ReactNode } from "react";
export function PageHeader({title,description,actions}:{title:string;description?:string;actions?:ReactNode}) {
 return <header className="page-header"><div><p className="eyebrow">Nota Técnica</p><h1>{title}</h1>{description && <p className="muted">{description}</p>}</div>{actions && <div className="action-group">{actions}</div>}</header>;
}
