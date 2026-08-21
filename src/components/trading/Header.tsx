import { useState } from "react";
import { Menu, User, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export function Header({ balance }: { balance: number }) {
  const [lang, setLang] = useState("EN");
  const [currency, setCurrency] = useState("KES");

  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b border-border bg-panel">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-1">
          <span className="text-[17px] font-bold tracking-tight text-foreground">BuySell254</span>
          <span className="text-[17px] font-bold leading-none text-purple">°</span>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 pr-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green/15 text-green">
              <User className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <div className="text-[11px] font-medium text-foreground">2547******967</div>
              <div className="text-[11px] font-semibold text-green">
                KES {balance.toFixed(2)}
              </div>
            </div>
          </div>

          <Selector value={lang} options={["EN", "SW"]} onChange={setLang} />
          <Selector value={currency} options={["KES", "USD"]} onChange={setCurrency} />

          <button
            onClick={() => toast.success("Deposit window opened")}
            className="h-8 rounded-md border border-green bg-transparent px-3 text-[12px] font-semibold text-green transition-colors hover:bg-green/10"
          >
            Deposit
          </button>
          <button
            onClick={() => toast.success("Withdraw window opened")}
            className="h-8 rounded-md bg-green px-3 text-[12px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Withdraw
          </button>

          <button
            onClick={() => toast("Menu")}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Selector({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 items-center gap-1 rounded-md border border-border bg-panel-2 px-2 text-[11px] font-medium text-foreground"
      >
        {value}
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 min-w-[64px] overflow-hidden rounded-md border border-border bg-panel-2 py-1">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className="block w-full px-2 py-1 text-left text-[11px] text-foreground hover:bg-accent"
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
