import { useId, useRef, useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSession } from "../../lib/auth/SessionContext";
import "./Shell.css";
export type WorkspaceNavigationItem = {to:string;label:string;end?:boolean};
export function WorkspaceShell({context,navigation,children}:{context:"admin"|"app";navigation:WorkspaceNavigationItem[];children:ReactNode}) {
 const {user,logout}=useSession(); const [open,setOpen]=useState(false);const menu=useRef<HTMLButtonElement>(null);const navigationId=useId();
 const home=context==="admin"?"/admin/participantes":"/app/garagem";
 const brand=<Link to={home} className="workspace__brand"><span aria-hidden="true"/><strong>Nota Técnica</strong></Link>;
 return <div className="shell shell--app workspace" onKeyDown={event=>{if(event.key==="Escape"&&open){setOpen(false);menu.current?.focus();}}}>
  <a className="workspace__skip" href="#workspace-content">Ir para o conteúdo</a>
  <header className="workspace__mobile-header">{brand}<button type="button" ref={menu} className="workspace__menu-trigger" aria-label={open?"Fechar menu":"Abrir menu"} aria-expanded={open} aria-controls={navigationId} onClick={()=>setOpen(value=>!value)}>{open?"Fechar":"Menu"}<span aria-hidden="true">{open?"×":"☰"}</span></button></header>
  <aside className="workspace__sidebar" id={navigationId} data-open={open}>
   <div className="workspace__identity">{brand}<p>{context==="admin"?"Administração":"Área do participante"}</p></div>
   <nav className="workspace__nav" aria-label={context==="admin"?"Navegação admin":"Navegação do app"}>{navigation.map(item=><NavLink key={item.to} to={item.to} end={item.end} onClick={()=>setOpen(false)}>{item.label}<span aria-hidden="true">›</span></NavLink>)}</nav>
   <footer className="workspace__footer"><span className="workspace__user">{user?.full_name}</span><Link to="/app/conta" onClick={()=>setOpen(false)}>Minha conta</Link><button type="button" onClick={logout}>Sair da conta <span aria-hidden="true">↗</span></button></footer>
  </aside>
  <main className="workspace__main" id="workspace-content" tabIndex={-1}>{children}</main>
 </div>;
}
