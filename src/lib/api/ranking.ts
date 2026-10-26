import { apiRequest } from "./client";
export type WorkshopRankingItem = {
  workshop_id: number; trade_name: string; city: string; state: string; specialties: string[];
  completed_services_count: number; average_total_cost: string | null;
  average_labor_cost: string | null; average_parts_cost: string | null;
  on_time_rate: number | null; average_delivery_days: number | null;
  average_stars: number | null; review_count: number; measured_deadline_count: number; on_time_count: number;
  score: number | null; eligible_for_ranking: boolean; sample_label: string; score_version: string;
};
export type WorkshopRankingResponse = { score_version: string; score_explanation: string; items: WorkshopRankingItem[]; unranked_items: WorkshopRankingItem[] };
type RawItem = Omit<WorkshopRankingItem, "score" | "average_stars"> & { score: string | number | null; average_stars: string | number | null };
const convert = (item: RawItem): WorkshopRankingItem => ({ ...item, score: item.score === null ? null : Number(item.score), average_stars: item.average_stars === null ? null : Number(item.average_stars) });
export async function getWorkshopRanking(params: URLSearchParams = new URLSearchParams()) {
  const query = params.toString();
  const response = await apiRequest<Omit<WorkshopRankingResponse, "items" | "unranked_items"> & { items: RawItem[]; unranked_items?: RawItem[] }>(`/public/workshops/ranking${query ? `?${query}` : ""}`, { auth: false });
  return { ...response, items: response.items.map(convert), unranked_items: (response.unranked_items ?? []).map(convert) };
}
export type WorkshopPerformance = { score_version: string; score_explanation: string; metrics: WorkshopRankingItem; reviews: { stars: number; comment: string | null }[] };
export async function getWorkshopPerformance(id: string | number): Promise<WorkshopPerformance> {
  const response = await apiRequest<Omit<WorkshopPerformance, "metrics"> & { metrics: RawItem }>(`/public/workshops/${id}/performance`, { auth: false });
  return { ...response, metrics: convert(response.metrics) };
}
