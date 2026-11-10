"use client";

// the furnace token graph on the card back basically showing per-model stacked bars
// uses a deterministic seed from model+date so the whole readout stays consistent across reloads
// smooth svg line chart with hover scrubber and model filter pins for deep inspections ( for now ig )

import { useEffect, useId, useMemo, useRef, useState, type PointerEvent } from "react";
import type { BackHonorAgent } from "../portfolio/data";
import { buildTokenWeek, formatTokens } from "@/lib/token-usage";

const MODEL_COLOR: Record<string, string> = {
  "Claude Code": "#d97757",
  Cursor: "#3b6fd6",
  Codex: "#10a37f",
  Gemini: "#4285f4",
  OpenCode: "#7c3aed",
  DeepSeek: "#4d6bfe",
};

function axisBounds(values: number[]) {
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const span = Math.max(rawMax - rawMin, rawMax * 0.18, 1);
  const step = rawMax > 80_000_000 ? 10_000_000 : 5_000_000;
  const yMin = Math.max(0, Math.floor((rawMin - span * 0.55) / step) * step);
  const yMax = Math.ceil((rawMax + span * 0.4) / step) * step;
  return { yMin, yMax: Math.max(yMax, yMin + step) };
}

export function TokenUsageGraph({
  agents,
  accent,
  mobile = false,
}: {
  agents: BackHonorAgent[];
  accent: string;
  mobile?: boolean;
}) {
  const modelKeys = useMemo(() => agents.map((agent) => agent.label), [agents]);
  const days = useMemo(() => buildTokenWeek(modelKeys), [modelKeys]);
  const [pinned, setPinned] = useState<string | null>(null);
  const [hoverModel, setHoverModel] = useState<string | "all" | null>(null);
  const [hoverDay, setHoverDay] = useState<number | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const fillId = useId().replace(/:/g, "");

  const active = hoverModel === "all" ? null : hoverModel ?? pinned;
  const activeAgent = agents.find((agent) => agent.label === active) ?? null;
  const lineColor = activeAgent ? (MODEL_COLOR[activeAgent.label] ?? accent) : accent;
  const values = days.map((day) => (activeAgent ? day.byModel[activeAgent.label] ?? 0 : day.total));
  const focusIndex = hoverDay ?? days.length - 1;
  const focusValue = values[focusIndex] ?? 0;
  const { yMin, yMax } = axisBounds(values);

  useEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const measure = () => {
      // layout box, not the zoomed screen box — the card is CSS-scaled
      const next = { w: el.clientWidth, h: el.clientHeight };
      setSize((prev) => (prev.w === next.w && prev.h === next.h ? prev : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [mobile]);

  const pad = mobile
    ? { l: 34, r: 10, t: 12, b: 16 }
    : { l: 42, r: 14, t: 14, b: 20 };
  const plotW = Math.max(1, size.w - pad.l - pad.r);
  const plotH = Math.max(1, size.h - pad.t - pad.b);
  const xOf = (index: number) => pad.l + (days.length <= 1 ? plotW / 2 : (index / (days.length - 1)) * plotW);
  const ySpan = Math.max(1, yMax - yMin);
  const yOf = (value: number) => pad.t + (1 - (value - yMin) / ySpan) * plotH;
  const points = values.map((value, index) => ({ x: xOf(index), y: yOf(value) }));
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const area = points.length
    ? `${line} L${points[points.length - 1].x.toFixed(1)} ${(pad.t + plotH).toFixed(1)} L${points[0].x.toFixed(1)} ${(pad.t + plotH).toFixed(1)} Z`
    : "";
  const ticks = [yMin, Math.round((yMin + yMax) / 2), yMax];
  const labelStep = size.w < 460 ? 2 : 1;

  function dayFromPointer(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - pad.l;
    const t = plotW <= 0 ? 0 : x / plotW;
    const index = Math.round(t * (days.length - 1));
    return Math.max(0, Math.min(days.length - 1, index));
  }

  return (
    <div data-no-flip className="flex h-full min-h-0 w-full min-w-0 flex-col" onPointerDown={(event) => event.stopPropagation()}>
      <div className={`flex shrink-0 items-baseline justify-between gap-2 ${mobile ? "px-1.5 pt-1" : "px-2.5 pt-1.5"}`}>
        <span className="min-w-0">
          <span className={`block font-pixel leading-none tracking-wide text-[#7a6a3d] ${mobile ? "text-[7px]" : "text-[8px]"}`}>
            {activeAgent ? (activeAgent.short ?? activeAgent.label).toUpperCase() : "ALL TOOLS"}
          </span>
          <span className={`block font-pixel leading-none text-[#b0a57a] ${mobile ? "mt-0.5 text-[6px]" : "mt-1 text-[7px]"}`}>
            {days[focusIndex]?.label ?? ""} · last 7 days
          </span>
        </span>
        <span className={`font-card font-bold leading-none tabular-nums ${mobile ? "text-[16px]" : "text-[22px]"}`} style={{ color: lineColor }}>
          {formatTokens(focusValue)}
        </span>
      </div>

      <div ref={plotRef} className="relative min-h-0 w-full min-w-0 flex-1">
        {size.w > 0 && size.h > 0 ? (
          <svg
            viewBox={`0 0 ${size.w} ${size.h}`}
            preserveAspectRatio="none"
            className="block h-full w-full touch-none"
            role="img"
            aria-label="Daily token use for the last 7 days"
            onPointerMove={(event) => setHoverDay(dayFromPointer(event))}
            onPointerLeave={() => setHoverDay(null)}
          >
            <defs>
              <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity="0.28" />
                <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {ticks.map((tick) => {
              const y = yOf(tick);
              return (
                <g key={tick}>
                  <line x1={pad.l} x2={size.w - pad.r} y1={y} y2={y} stroke="#e4d7b0" strokeWidth="1" />
                  <text x={pad.l - 5} y={y + 3} textAnchor="end" className="font-pixel" fill="#9a8d62" fontSize={mobile ? 7 : 8}>
                    {formatTokens(tick)}
                  </text>
                </g>
              );
            })}
            <path d={area} fill={`url(#${fillId})`} />
            <path d={line} fill="none" stroke={lineColor} strokeWidth={mobile ? 2 : 2.5} strokeLinejoin="round" strokeLinecap="round" />
            {points.map((point, index) => (
              <circle key={days[index].iso} cx={point.x} cy={point.y} r={index === focusIndex ? (mobile ? 3.5 : 4) : mobile ? 2 : 2.4} fill={index === focusIndex ? lineColor : "#fffaf0"} stroke={lineColor} strokeWidth="1.5" />
            ))}
            {hoverDay !== null ? (
              <line x1={points[hoverDay].x} x2={points[hoverDay].x} y1={pad.t} y2={pad.t + plotH} stroke={lineColor} strokeOpacity="0.35" strokeDasharray="3 3" />
            ) : null}
            {days.map((day, index) => {
              const show = index === 0 || index === days.length - 1 || index % labelStep === 0;
              if (!show) return null;
              const anchor = index === 0 ? "start" : index === days.length - 1 ? "end" : "middle";
              return (
                <text key={day.iso} x={xOf(index)} y={size.h - 3} textAnchor={anchor} className="font-pixel" fill="#9a8d62" fontSize={mobile ? 7 : 8}>
                  {day.label}
                </text>
              );
            })}
          </svg>
        ) : null}
      </div>

      <div className={`flex shrink-0 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${mobile ? "px-1 pb-1" : "px-1.5 pb-1.5"}`}>
        <ToolChip
          name="All"
          selected={active === null}
          accent={accent}
          mobile={mobile}
          onClick={() => setPinned(null)}
          onHover={(over) => setHoverModel(over ? "all" : null)}
        />
        {agents.map((agent) => (
          <ToolChip
            key={agent.label}
            name={agent.short ?? agent.label}
            logo={agent.logo}
            selected={active === agent.label}
            accent={MODEL_COLOR[agent.label] ?? accent}
            mobile={mobile}
            onClick={() => setPinned((current) => (current === agent.label ? null : agent.label))}
            onHover={(over) => setHoverModel(over ? agent.label : null)}
          />
        ))}
      </div>
    </div>
  );
}

function ToolChip({
  name,
  logo,
  selected,
  accent,
  mobile,
  onClick,
  onHover,
}: {
  name: string;
  logo?: string;
  selected: boolean;
  accent: string;
  mobile?: boolean;
  onClick: () => void;
  onHover: (over: boolean) => void;
}) {
  return (
    <button
      type="button"
      data-no-flip
      aria-label={name}
      aria-pressed={selected}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      className={`flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center rounded-[5px] border bg-white ${mobile ? "h-[28px] px-0.5" : "h-[42px] gap-1 px-1"}`}
      style={{
        borderColor: selected ? accent : "#e6d6a6",
        boxShadow: selected ? `inset 0 0 0 1px ${accent}` : undefined,
      }}
    >
      {logo ? (
        <img src={`/logos/${logo}.svg`} alt="" className="h-[16px] w-[16px]" draggable={false} />
      ) : (
        <span className="font-pixel text-[7px] leading-none" style={{ color: accent }}>ALL</span>
      )}
      {mobile || !logo ? null : (
        <span className="max-w-full truncate font-pixel text-[6px] leading-none" style={{ color: selected ? accent : "#7a6a3d" }}>
          {name}
        </span>
      )}
    </button>
  );
}
