import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listNotifications, markNotificationRead, type Notification } from "../../../lib/api/notifications";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(null);
    listNotifications().then((items) => { if (active) setNotifications(items); })
      .catch((caught: unknown) => { if (active) setError(caught instanceof Error ? caught.message : "Não foi possível consultar as pendências."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refresh]);
  async function read(id: number) {
    setBusy(id); setError(null);
    try { const result = await markNotificationRead(id); setNotifications((items) => items.map((item) => item.id === id ? result : item)); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível marcar como lida."); }
    finally { setBusy(null); }
  }
  return <section>
    <h1>Pendências e notificações</h1><p>Acompanhe decisões, documentos, serviços e benefícios da sua conta.</p>
    {error && <p role="alert">{error}</p>}
    {loading ? <p role="status">Consultando pendências...</p> : !error && notifications.length === 0 && <p>Nenhuma notificação no momento.</p>}
    {!loading && notifications.map((notification) => <article key={notification.id}>
      <h2>{notification.title}</h2><p>{notification.body}</p><p>{new Date(notification.created_at).toLocaleString("pt-BR")}</p>
      {notification.link && <p><Link to={notification.link}>Ver pendência</Link></p>}
      {notification.read_at ? <p>Lida</p> : <button disabled={busy !== null} onClick={() => void read(notification.id)}>Marcar como lida</button>}
    </article>)}
    <p><button disabled={loading || busy !== null} onClick={() => setRefresh((value) => value + 1)}>Atualizar notificações</button></p>
  </section>;
}
