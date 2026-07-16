const TOKEN_KEY = "nota_tecnica_token";

function browserStorage() {
  if (
    typeof window === "undefined" ||
    typeof window.localStorage?.getItem !== "function" ||
    typeof window.localStorage?.setItem !== "function" ||
    typeof window.localStorage?.removeItem !== "function"
  ) {
    return null;
  }
  return window.localStorage;
}

export function getStoredToken() {
  return browserStorage()?.getItem(TOKEN_KEY) ?? null;
}

export function setStoredToken(token: string) {
  browserStorage()?.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  browserStorage()?.removeItem(TOKEN_KEY);
}
