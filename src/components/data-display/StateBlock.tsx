import { Button } from "../ui/Button";
import "./StateBlock.css";
type StateBlockProps={title:string;message?:string;description?:string;kind?:"loading"|"empty"|"error"|"success";onRetry?:()=>void};
export function StateBlock({title,message,description,kind="empty",onRetry}:StateBlockProps) {
 return <section className={`state-block state-block--${kind}`} role={kind==="error"?"alert":kind==="loading"||kind==="success"?"status":undefined}>
 <span className="state-block__mark" aria-hidden="true">{kind==="error"?"!":kind==="success"?"✓":kind==="loading"?"…":"—"}</span>
 <h2>{title}</h2>{(message||description)&&<p>{message??description}</p>}{onRetry&&<Button variant="secondary" type="button" onClick={onRetry}>Tentar novamente</Button>}
 </section>;
}
