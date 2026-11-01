import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { SessionContext } from "../../lib/auth/SessionContext";
import { participant } from "../../test/fixtures";
import type { UserRead } from "../../lib/api/types";
import { WorkspaceShell } from "./WorkspaceShell";
afterEach(cleanup);
function workspace() {
 render(<MemoryRouter initialEntries={["/admin/servicos/42"]}><SessionContext.Provider value={{user:{...participant,is_admin:true} as UserRead,status:"authenticated",error:null,refresh:vi.fn(),logout:vi.fn()}}><WorkspaceShell context="admin" navigation={[{to:"/admin/servicos",label:"Serviços"},{to:"/admin/participantes",label:"Participantes"}]}><h1>Revisão</h1></WorkspaceShell></SessionContext.Provider></MemoryRouter>);
}
it("marks the parent queue active while viewing a service detail",()=>{workspace();expect(screen.getByRole("link",{name:"Serviços"})).toHaveAttribute("aria-current","page");expect(screen.getByRole("link",{name:"Participantes"})).not.toHaveAttribute("aria-current");});
it("closes the disclosure with Escape and restores the trigger focus",()=>{workspace();const menu=screen.getByRole("button",{name:"Abrir menu"});fireEvent.click(menu);expect(menu).toHaveAttribute("aria-expanded","true");const link=screen.getByRole("link",{name:"Serviços"});link.focus();fireEvent.keyDown(link,{key:"Escape"});expect(menu).toHaveAttribute("aria-expanded","false");expect(menu).toHaveFocus();});
it("closes the menu when a navigation destination is chosen",()=>{workspace();const menu=screen.getByRole("button",{name:"Abrir menu"});fireEvent.click(menu);fireEvent.click(screen.getByRole("link",{name:"Participantes"}));expect(menu).toHaveAttribute("aria-expanded","false");});
