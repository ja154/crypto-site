import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-surface mt-auto">
      <div className="mx-auto max-w-screen-2xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-brand-yellow flex items-center justify-center">
              <span className="text-brand-dark font-black text-xs">F</span>
            </div>
            <span className="font-semibold text-sm">Fynor</span>
          </div>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/market" className="hover:text-foreground transition-colors">Markets</Link>
            <Link href="/trade/BTCUSDT" className="hover:text-foreground transition-colors">Trade</Link>
            <Link href="/wallet" className="hover:text-foreground transition-colors">Wallet</Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Fynor. Market data by Binance.
          </p>
        </div>
      </div>
    </footer>
  );
}
