import { clearStoredToken, getStoredToken } from "../auth/token-storage";

const DEFAULT_API_BASE_URL = "http://localhost:8000/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly detail: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function apiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
}

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getStoredToken();

  if (!headers.has("Content-Type") && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (options.auth !== false && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...options,
    headers,
  });
  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try { data = JSON.parse(text); }
    catch {
      if (response.ok) throw new ApiError("Resposta inválida da API", response.status, null);
      data = null;
    }
  }
  const detail = data && typeof data === "object" && "detail" in data ? data.detail : null;

  if (!response.ok) {
    if (response.status === 401 && options.auth !== false && token && token === getStoredToken()) clearStoredToken();
    throw new ApiError(
      typeof detail === "string" ? detail : "Erro ao comunicar com a API",
      response.status,
      data,
    );
  }

  return data as T;
}
