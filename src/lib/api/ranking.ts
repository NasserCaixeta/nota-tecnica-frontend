import { apiRequest } from "./client";

export type WorkshopRankingItem = {
  workshop_id: number;
  trade_name: string;
  city: string;
  state: string;
  specialties: string[];
  completed_services_count: number;
  average_total_cost: string;
  average_labor_cost: string;
  average_parts_cost: string;
  on_time_rate: number | null;
  average_delivery_days: number | null;
  score: number;
  score_version: string;
};

export type WorkshopRankingResponse = {
  score_version: string;
  score_explanation: string;
  items: WorkshopRankingItem[];
};

export function getWorkshopRanking(params: URLSearchParams = new URLSearchParams()) {
  const query = params.toString();
  return apiRequest<WorkshopRankingResponse>(
    `/public/workshops/ranking${query ? `?${query}` : ""}`,
    { auth: false },
  );
}
