import { useState } from "react";
import { Bell, Music2, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { PriceChart } from "./PriceChart";

const PRESETS = [50, 100, 200];

export function TradingPanel({ onTrade }: { onTrade: (side: "BUY" | "SELL", amount: number) => void }) {
  const [amount, setAmount] = useState(50);
  const [music, setMusic] = useState(false);
  const [alerts, setAlerts] = useState(true);

  const clamp = (v: number) => Math.max(10, Math.min(100000, Math.round(v)));

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-2">
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-4">
        <Toggle
          label="Music"
          icon={<Music2 className="h-3.5 w-3.5" />}
          on={music}
          onChange={setMusic}
        />
        <Toggle
          label="Alerts"
          icon={<Bell className="h-3.5 w-3.5" />}
          on={alerts}
          onChange={setAlerts}
        />
      </div>

      <PriceChart rate={0.01} />

      {/* Amount controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setAmount((a) => clamp(a / 2))}
          className="h-9 rounded-md border border-border bg-panel-2 px-2.5 text-[12px] font-semibold text-foreground hover:bg-accent"
        >
          1/2
        </button>
        <button
          onClick={() => setAmount((a) => clamp(a - 10))}
          className="h-9 w-9 rounded-md border border-border bg-panel-2 text-[16px] font-semibold text-foreground hover:bg-accent"
          aria-label="Decrease amount"
        >
          −
        </button>
        <input
          value={amount}
          onChange={(e) => setAmount(clamp(Number(e.target.value.replace(/\D/g, "")) || 10))}
          inputMode="numeric"
          className="h-9 min-w-0 flex-1 rounded-md border border-border bg-foreground px-3 text-center text-[16px] font-bold text-primary-foreground outline-none"
          aria-label="Trade amount"
        />
        <button
          onClick={() => setAmount((a) => clamp(a + 10))}
          className="h-9 w-9 rounded-md border border-border bg-panel-2 text-[16px] font-semibold text-foreground hover:bg-accent"
          aria-label="Increase amount"
        >
          +
        </button>
        <button
          onClick={() => setAmount((a) => clamp(a * 2))}
          className="h-9 rounded-md border border-border bg-panel-2 px-2.5 text-[12px] font-semibold text-foreground hover:bg-accent"
        >
          x2
        </button>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setAmount(p)}
            className={`h-8 flex-1 rounded-md border text-[12px] font-semibold transition-colors ${
              amount === p
                ? "border-green bg-green text-primary-foreground"
                : "border-border bg-panel-2 text-foreground hover:bg-accent"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setAmount(50)}
          className="h-8 flex-1 rounded-md border border-border bg-panel-2 text-[12px] font-semibold text-muted-foreground hover:text-foreground"
        >
          Reset
        </button>
      </div>

      {/* Buy / Sell */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            onTrade("BUY", amount);
            toast.success(`BUY placed · KES ${amount.toFixed(2)}`);
          }}
          className="flex h-[84px] flex-col items-center justify-center gap-0.5 rounded-lg bg-green text-primary-foreground transition-opacity hover:opacity-90"
        >
          <span className="flex items-center gap-1.5 text-[17px] font-extrabold tracking-wide">
            <TrendingUp className="h-4 w-4" /> BUY
          </span>
          <span className="text-[12px] font-bold opacity-80">KES {amount.toFixed(2)}</span>
        </button>
        <button
          onClick={() => {
            onTrade("SELL", amount);
            toast(`SELL placed · KES ${amount.toFixed(2)}`);
          }}
          className="flex h-[84px] flex-col items-center justify-center gap-0.5 rounded-lg bg-red text-foreground transition-opacity hover:opacity-90"
        >
          <span className="flex items-center gap-1.5 text-[17px] font-extrabold tracking-wide">
            <TrendingDown className="h-4 w-4" /> SELL
          </span>
          <span className="text-[12px] font-bold opacity-80">KES {amount.toFixed(2)}</span>
        </button>
      </div>
    </section>
  );
}

function Toggle({
  label,
  icon,
  on,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => onChange(!on)}
        className={`relative h-4 w-8 rounded-full border transition-colors ${
          on ? "border-green bg-green/30" : "border-border bg-panel-2"
        }`}
      >
        <span
          className={`absolute top-[1px] h-3 w-3 rounded-full transition-all ${
            on ? "left-[17px] bg-green" : "left-[2px] bg-muted-foreground"
          }`}
        />
      </button>
    </div>
  );
}
