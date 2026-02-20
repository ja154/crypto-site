export const SUPPORTED_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "LTCUSDT",
  "BCHUSDT",
  "AVAXUSDT",
  "DOTUSDT",
  "MATICUSDT",
  "LINKUSDT",
  "UNIUSDT",
  "ATOMUSDT",
] as const;

export type SupportedSymbol = (typeof SUPPORTED_SYMBOLS)[number];

export function isSupportedSymbol(symbol: string): symbol is SupportedSymbol {
  return SUPPORTED_SYMBOLS.includes(symbol as SupportedSymbol);
}

/** Format a Binance symbol for display: "BTCUSDT" → "BTC/USDT" */
export function formatSymbol(symbol: string): string {
  if (symbol.endsWith("USDT")) {
    return `${symbol.slice(0, -4)}/USDT`;
  }
  if (symbol.endsWith("BTC")) {
    return `${symbol.slice(0, -3)}/BTC`;
  }
  if (symbol.endsWith("ETH")) {
    return `${symbol.slice(0, -3)}/ETH`;
  }
  return symbol;
}

/** Extract base asset from symbol: "BTCUSDT" → "BTC" */
export function getBaseAsset(symbol: string): string {
  if (symbol.endsWith("USDT")) return symbol.slice(0, -4);
  if (symbol.endsWith("BTC")) return symbol.slice(0, -3);
  if (symbol.endsWith("ETH")) return symbol.slice(0, -3);
  return symbol;
}

/** Extract quote asset from symbol: "BTCUSDT" → "USDT" */
export function getQuoteAsset(symbol: string): string {
  if (symbol.endsWith("USDT")) return "USDT";
  if (symbol.endsWith("BTC")) return "BTC";
  if (symbol.endsWith("ETH")) return "ETH";
  return "USDT";
}

export const BINANCE_WS_BASE = "wss://stream.binance.com:9443";
export const BINANCE_REST_BASE = "https://api.binance.com";
