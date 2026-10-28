import { apiRequest } from "./client";
export type Notification = { id: number; kind: string; title: string; body: string; link: string | null; created_at: string; read_at: string | null };
export const listNotifications = () => apiRequest<Notification[]>("/notifications");
export const markNotificationRead = (id: number) => apiRequest<Notification>(`/notifications/${id}/read`, { method: "POST" });
