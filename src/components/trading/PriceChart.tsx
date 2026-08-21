import { useEffect, useMemo, useRef, useState } from "react";

const POINTS = 140;
const W = 1000;
const H = 420;

function seedSeries(): number[] {
  const out: number[] = [];
  let v = 0;
  for (let i = 0; i < POINTS; i++) {
    const roll = Math.random();
    if (roll > 0.965) v += 34 + Math.random() * 26; // sharp spike
    else if (roll > 0.93) v -= 30 + Math.random() * 26; // sudden drop
    else v += (Math.random() - 0.48) * 9;
    v = Math.max(-70, Math.min(70, v * 0.985));
    out.push(v);
  }
  return out;
}

export function PriceChart({ rate }: { rate: number }) {
  const [series, setSeries] = useState<number[]>(() => seedSeries());
  const last = useRef(series[series.length - 1] ?? 0);

  useEffect(() => {
    const t = setInterval(() => {
      setSeries((s) => {
        let v = last.current ?? 0;
        const roll = Math.random();
        if (roll > 0.955) v += 30 + Math.random() * 24;
        else if (roll > 0.915) v -= 26 + Math.random() * 24;
        else v += (Math.random() - 0.48) * 9;
        v = Math.max(-70, Math.min(70, v * 0.985));
        last.current = v;
        return [...s.slice(1), v];
      });
    }, 320);
    return () => clearInterval(t);
  }, []);

  const { linePath, posPath, negPath, zeroY, ticks, lastPoint } = useMemo(() => {
    const max = 80;
    const y = (v: number) => H / 2 - (v / max) * (H / 2 - 14);
    const x = (i: number) => (i / (POINTS - 1)) * W;

    const pts = series.map((v, i) => [x(i), y(v)] as const);
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" ");
    const z = y(0);

    const clampArea = (clampTop: boolean) =>
      `M0 ${z} ` +
      pts
        .map(
          ([px, py]) =>
            `L${px.toFixed(2)} ${(clampTop ? Math.min(py, z) : Math.max(py, z)).toFixed(2)}`,
        )
        .join(" ") +
      ` L${W} ${z} Z`;

    return {
      linePath: line,
      posPath: clampArea(true),
      negPath: clampArea(false),
      zeroY: z,
      ticks: [60, 30, 0, -30, -60].map((v) => ({ v, y: y(v) })),
      lastPoint: pts[pts.length - 1] ?? ([0, H / 2] as const),
    };
  }, [series]);

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-panel">
      {/* Rate badge */}
      <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2">
        <div className="rounded-md border border-border bg-panel-2/90 px-2.5 py-1 text-[11px] font-medium text-foreground">
          Rate: {rate >= 0 ? "+" : "-"}
          {Math.abs(rate).toFixed(4)}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="block h-[340px] w-full sm:h-[420px]">
        {/* dotted grid */}
        {ticks.map((t) => (
          <line
            key={t.v}
            x1={34}
            x2={W}
            y1={t.y}
            y2={t.y}
            stroke="var(--border)"
            strokeWidth={1}
            strokeDasharray="2 5"
          />
        ))}
        {ticks.map((t) => (
          <text
            key={`l-${t.v}`}
            x={4}
            y={t.y + 3}
            fill="var(--muted-foreground)"
            fontSize={10}
          >
            {t.v > 0 ? `+${t.v}` : t.v}
          </text>
        ))}

        {/* negative fill */}
        <path d={negPath} fill="var(--red-deep)" opacity={0.85} />
        {/* positive fill */}
        <path d={posPath} fill="var(--green)" opacity={0.08} />

        {/* zero baseline */}
        <line
          x1={34}
          x2={W}
          y1={zeroY}
          y2={zeroY}
          stroke="var(--green)"
          strokeWidth={1}
          opacity={0.55}
        />

        <path
          d={linePath}
          fill="none"
          stroke="var(--green)"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        <circle cx={lastPoint[0]} cy={lastPoint[1]} r={9} fill="var(--green)" opacity={0.22} />
        <circle cx={lastPoint[0]} cy={lastPoint[1]} r={4} fill="var(--green)" />
      </svg>
    </div>
  );
}
