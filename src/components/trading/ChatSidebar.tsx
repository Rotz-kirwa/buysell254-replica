import { useEffect, useRef, useState } from "react";
import { HelpCircle, MessageSquare, Plus, Send } from "lucide-react";

type Msg = {
  id: number;
  phone: string;
  time: string;
  text: string;
  own?: boolean;
};

const NAMES = ["2547", "2541", "2547", "2547"];

function maskedPhone() {
  const p = NAMES[Math.floor(Math.random() * NAMES.length)];
  const tail = String(Math.floor(Math.random() * 900) + 100);
  return `${p}******${tail}`;
}

function stamp(d = new Date()) {
  return d
    .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    .replace(/^0/, "");
}

function randomEvent(id: number): Msg {
  const amount = (Math.floor(Math.random() * 400) + 50 + Math.random()).toFixed(2);
  const phone = maskedPhone();
  const deposit = Math.random() > 0.5;
  return {
    id,
    phone,
    time: stamp(),
    text: deposit
      ? `💸 ${phone} has deposited KES ${amount} 💰💰`
      : `💸 ${phone} has withdrawn KES ${amount} 💰💰`,
  };
}

const SEED: Msg[] = Array.from({ length: 18 }, (_, i) => randomEvent(i));

const TABS = ["CHAT", "HISTORY", "FEED"] as const;

export function ChatSidebar() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("CHAT");
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [draft, setDraft] = useState("");
  const feedRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(SEED.length);

  useEffect(() => {
    const t = setInterval(() => {
      setMessages((m) => [...m.slice(-60), randomEvent(nextId.current++)]);
    }, 4200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = feedRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, tab]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      { id: nextId.current++, phone: "2547******967", time: stamp(), text, own: true },
    ]);
    setDraft("");
  };

  return (
    <aside className="flex w-full shrink-0 flex-col gap-2 lg:w-[310px]">
      <button className="flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground">
        <HelpCircle className="h-3.5 w-3.5" />
        How to Trade
      </button>

      {/* Tabs */}
      <div className="flex overflow-hidden rounded-md border border-border bg-panel">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 border-b-2 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              tab === t
                ? "border-green text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-md border border-border bg-panel">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <MessageSquare className="h-3.5 w-3.5 text-green" />
          <span className="text-[12px] font-semibold text-foreground">Public Chat</span>
          <span className="ml-auto flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green" />
            <span className="text-[10px] font-medium text-green">Live</span>
          </span>
        </div>

        <div
          ref={feedRef}
          className="scroll-thin flex-1 space-y-1.5 overflow-y-auto px-2 py-2"
        >
          {(tab === "HISTORY" ? messages.slice(-8) : messages).map((m) => (
            <div
              key={m.id}
              className="border-l-2 bg-panel-2/60 py-1 pl-2 pr-1.5"
              style={{ borderColor: m.own ? "var(--green)" : "var(--cyan)" }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-cyan">{m.phone}</span>
                {!m.own && (
                  <span className="rounded bg-accent px-1 text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">
                    System
                  </span>
                )}
                <span className="ml-auto text-[9px] text-muted-foreground">{m.time}</span>
              </div>
              <p className="mt-0.5 text-[11px] leading-snug text-foreground/90">{m.text}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 border-t border-border p-2">
          <button
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
            aria-label="Attach"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Write a message..."
            className="h-7 min-w-0 flex-1 rounded-md border border-border bg-panel-2 px-2 text-[11px] text-foreground outline-none placeholder:text-muted-foreground focus:border-green/60"
          />
          <button
            onClick={send}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-green text-primary-foreground"
            aria-label="Send message"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
