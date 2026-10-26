import { ApiError, apiRequest } from "./client";
import type { DocumentRead } from "./documents";
export type MaintenanceCreatePayload = {
  workshop_id?: number | null; plate?: string;
  service_date: string; odometer: number; category: string; vehicle_system: string;
  description: string; labor_cost: string; parts_cost: string;
  entry_date?: string | null; promised_delivery_date?: string | null; actual_delivery_date?: string | null;
  warranty_months?: number | null; status?: "draft" | "completed" | "cancelled";
};
export type MaintenanceRecord = MaintenanceCreatePayload & {
  id: number; vehicle_id: number; author_user_id: number; workshop_id: number | null;
  origin: "customer" | "workshop"; total_cost: string; created_at: string; updated_at: string;
  current_revision_id: number; editorial_status: "draft" | "submitted" | "cancelled";
  admin_status: "pending" | "approved" | "rejected" | "changes_requested";
  customer_acknowledgement: "author_acknowledged" | "awaiting_customer" | "confirmed" | "disputed";
  customer_user_id: number | null; review_version: number; review_reason: string | null;
  public_description: string | null; published: boolean; dispute_open: boolean; superseded_by_id: number | null;
  permissions: { can_edit: boolean; can_submit: boolean; can_acknowledge: boolean; can_dispute: boolean; can_invite: boolean };
};
export type RevisionRead = { id: number; revision_number: number; snapshot: MaintenanceCreatePayload; admin_status: string; customer_acknowledgement: string };
export type DisputeRead = { id: number; record_id: number; revision_id: number; customer_user_id: number;
  reason: string; status: "open" | "closed"; resolution: string | null; resolution_reason: string | null;
  review_version: number; documents: DocumentRead[]; messages: { id: number; actor_id: number; body: string }[] };
export type InvitationResult = { state: "participation_pending" | "relationship_required" | "awaiting_confirmation"; record_id?: number; revision_id?: number };
export type PendingInvitation = { id: number; created_at: string; expires_at: string };
const post = <T>(path: string, payload: unknown) => apiRequest<T>(path, { method: "POST", body: JSON.stringify(payload) });
export const listVehicleMaintenance = (vehicleId: string | number) => apiRequest<MaintenanceRecord[]>(`/vehicles/${vehicleId}/maintenance-records`);
export const createVehicleMaintenance = (vehicleId: string | number, payload: MaintenanceCreatePayload) => post<MaintenanceRecord>(`/vehicles/${vehicleId}/maintenance-records`, payload);
export const getMaintenance = (id: string | number) => apiRequest<MaintenanceRecord>(`/maintenance-records/${id}`);
export const updateMaintenance = (record: MaintenanceRecord, payload: MaintenanceCreatePayload) => apiRequest<MaintenanceRecord>(`/maintenance-records/${record.id}`, { method: "PATCH", body: JSON.stringify({ ...payload, expected_revision_id: record.current_revision_id }) });
export const submitMaintenance = (record: MaintenanceRecord) => post<MaintenanceRecord>(`/maintenance-records/${record.id}/submit`, { revision_id: record.current_revision_id });
export const acknowledgeMaintenance = (record: MaintenanceRecord) => post<MaintenanceRecord>(`/maintenance-records/${record.id}/acknowledge`, { revision_id: record.current_revision_id });
export const openServiceDispute = (record: MaintenanceRecord, reason: string) => post<DisputeRead>(`/maintenance-records/${record.id}/disputes`, { revision_id: record.current_revision_id, reason });
export const listServiceDisputes = (id: number) => apiRequest<DisputeRead[]>(`/maintenance-records/${id}/disputes`);
export const replyServiceDispute = (id: number, body: string) => post<DisputeRead>(`/service-disputes/${id}/messages`, { body });
export const listServiceRevisions = (id: number) => apiRequest<RevisionRead[]>(`/maintenance-records/${id}/revisions`);
export const listServiceDocuments = (id: number) => apiRequest<DocumentRead[]>(`/maintenance-records/${id}/documents`);
export const listPendingServices = () => apiRequest<MaintenanceRecord[]>("/customer-services/pending");
export const listWorkshopServices = (id: string | number) => apiRequest<MaintenanceRecord[]>(`/workshops/${id}/maintenance-records`);
export const createWorkshopService = (id: string | number, payload: MaintenanceCreatePayload) => post<MaintenanceRecord>(`/workshops/${id}/maintenance-records`, payload);
export const issueServiceInvitation = (record: MaintenanceRecord, recipient_email: string) => post<{ id: number; url: string; expires_at: string }>(`/maintenance-records/${record.id}/invitations`, { revision_id: record.current_revision_id, recipient_email });
export const acceptServiceInvitation = (token: string) => post<InvitationResult>("/service-invitations/accept", { token });
export const listPendingInvitations = () => apiRequest<PendingInvitation[]>("/service-invitations/pending");
export const resumeServiceInvitation = (id: number) => post<InvitationResult>(`/service-invitations/${id}/resume`, {});
export const requestInvitationRelationship = (token: string, vehicle: unknown) => post<{ vehicle_id: number; vehicle_link_id: number }>("/service-invitations/relationship", { token, vehicle });
export function serviceError(error: unknown) {
  if (error instanceof ApiError && error.status === 409) return "A versão ou situação mudou. Atualize os dados e tente novamente.";
  return error instanceof Error ? error.message : "Não foi possível concluir a operação. Tente novamente.";
}
export function serviceStatus(record: MaintenanceRecord) {
  if (record.dispute_open || record.customer_acknowledgement === "disputed") return "Contestado";
  if (record.superseded_by_id) return "Associado a outro serviço";
  if (record.published) return "Publicado";
  const editorial = { draft: "Rascunho", submitted: "Enviado para análise", cancelled: "Cancelado" };
  const admin = { pending: "Análise pendente", approved: "Análise aprovada", rejected: "Recusado", changes_requested: "Correção solicitada" };
  return `${editorial[record.editorial_status]} · ${admin[record.admin_status]}${record.customer_acknowledgement === "awaiting_customer" ? " · Aguardando confirmação" : ""}`;
}

export const listDuplicateCandidates = (id: number) => apiRequest<MaintenanceRecord[]>(`/maintenance-records/${id}/duplicates`);
export const associateServices = (first: MaintenanceRecord, second: MaintenanceRecord, reason: string) => post<MaintenanceRecord>(`/maintenance-records/${first.id}/associate`, { revision_id: first.current_revision_id, other_record_id: second.id, other_revision_id: second.current_revision_id, reason });
