import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/trading/Header";
import { ChatSidebar } from "@/components/trading/ChatSidebar";
import { TradingPanel } from "@/components/trading/TradingPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BuySell254 — Live Trading Terminal" },
      {
        name: "description",
        content:
          "BuySell254 trading terminal: live price chart, instant BUY/SELL trades in KES, public chat feed, deposits and withdrawals.",
      },
      { property: "og:title", content: "BuySell254 — Live Trading Terminal" },
      {
        property: "og:description",
        content:
          "Trade live rates in KES with instant BUY/SELL execution, real-time chart and public transaction feed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [balance, setBalance] = useState(1250);

  return (
    <div className="min-h-screen bg-terminal-bg">
      <Header balance={balance} />
      <main className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-4 lg:flex-row">
        <ChatSidebar />
        <TradingPanel
          onTrade={(_side, amount) => setBalance((b) => Math.max(0, b - amount))}
        />
      </main>
    </div>
  );
}
