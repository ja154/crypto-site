import { BINANCE_REST_BASE } from "./symbols";

export async function binanceFetch<T>(
  path: string,
  options?: RequestInit & { next?: { revalidate?: number } }
): Promise<T> {
  const url = `${BINANCE_REST_BASE}${path}`;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Binance API error ${response.status}: ${path}`);
  }

  return response.json() as Promise<T>;
}
