import { useCallback, useEffect, useState } from "react";
import { StateBlock } from "../../../components/data-display/StateBlock";
import { PageHeader } from "../../../components/layout/PageHeader";
import { listPendingGarageValidations, type AdminGarageVehicleLinkRead } from "../../../lib/api/admin";
import { AdminValidationQueue } from "../components/AdminValidationQueue";
export function AdminValidationQueuePage() {
 const [items,setItems]=useState<AdminGarageVehicleLinkRead[]>([]);
 const [loading,setLoading]=useState(true);const [error,setError]=useState(false);
 const load=useCallback(async()=>{setLoading(true);setError(false);try{setItems(await listPendingGarageValidations());}catch{setError(true);}finally{setLoading(false);}},[]);
 useEffect(()=>{void load();},[load]);
 return <section className="page-section"><PageHeader title="Validação de veículos" description="Confira o vínculo com o veículo e os comprovantes antes de liberar o histórico."/>{loading?<StateBlock kind="loading" title="Carregando validações"/>:error?<StateBlock kind="error" title="Não foi possível carregar as validações" description="A fila não foi consultada. Tente novamente para continuar." onRetry={()=>void load()}/>:<AdminValidationQueue items={items}/>}</section>;
}
