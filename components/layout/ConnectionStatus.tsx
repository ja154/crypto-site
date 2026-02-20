"use client";

import { cn } from "@/lib/utils";
import type { ConnectionState } from "@/types/market";

interface Props {
  state: ConnectionState;
}

const labels: Record<ConnectionState, string> = {
  connecting: "Connecting…",
  open: "Live",
  reconnecting: "Reconnecting…",
  polling_fallback: "Polling",
  closed: "Disconnected",
};

const dotColors: Record<ConnectionState, string> = {
  connecting: "bg-yellow-400",
  open: "bg-brand-success",
  reconnecting: "bg-yellow-400 animate-pulse",
  polling_fallback: "bg-brand-text-sub",
  closed: "bg-brand-danger",
};

export function ConnectionStatus({ state }: Props) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={cn("size-1.5 rounded-full", dotColors[state])} />
      {labels[state]}
    </span>
  );
}
