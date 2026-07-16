export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Sem data";
  }
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(value));
}
