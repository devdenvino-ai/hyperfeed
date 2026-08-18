import { useEffect, useRef, useState } from "react";
import { CHANNELS, formatVotes, LOG_POOL, REPORT_POOL, type Flagged, type Severity } from "../data";
import { Reveal } from "./ui";
import { IconBolt, IconFlame, IconSignal, IconX } from "./icons";

type Props = {
  flagged: Flagged[];
  onResolve: (f: Flagged, action: "nuke" | "approve" | "ignore") => void;
  locked: Set<string>;
  onLock: (id: string) => void;
};

const SEV: Record<Severity, { color: string; label: string }> = {
  LOW: { color: "#8f93ba", label: "LOW" },
  MID: { color: "#ffc24b", label: "MID" },
  MAX: { color: "#ff3dd8", label: "MAX" },
};

function Vitals() {
  const data = [22, 35, 28, 51, 44, 63, 58, 72, 66, 84];
  const W = 340;
  const H = 90;
  const max = Math.max(...data) * 1.15;
  const pts = data.map((v, i) => [8 + (i / (data.length - 1)) * (W - 16), H - 10 - (v / max) * (H - 24)]);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <path d={line} fill="none" stroke="#38e1ff" strokeWidth="2" className="drawline" />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 3 : 1.5} fill={i === pts.length - 1 ? "#c9f536" : "#38e1ff"} className={i === pts.length - 1 ? "animate-pulseglow" : ""} />
        ))}
        <text x={last[0] - 6} y={last[1] - 8} textAnchor="end" fill="#c9f536" fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
          84/hr
        </text>
      </svg>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {[
          { k: "POSTS/HR", v: "84", c: "#c9f536" },
          { k: "REPORTS OPEN", v: "OPEN_Q", c: "#ffc24b", live: true },
          { k: "BOTS BANISHED", v: "1,204", c: "#ff3dd8" },
        ].map((s) => (
          <div key={s.k} className="border border-edge bg-abyss px-2.5 py-2 text-center">
            <p className="font-mono text-[8px] tracking-[0.2em] text-fog">{s.k}</p>
            {s.live ? (
              <OpenCount color={s.c} />
            ) : (
              <p className="mt-1 font-display text-sm font-black" style={{ color: s.c }}>
                {s.v}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function OpenCount({ color }: { color: string }) {
  // reads nothing; App renders flagged length via prop drilling would be overkill — show live marker
  return (
    <p className="mt-1 flex items-center justify-center gap-1.5 font-display text-sm font-black" style={{ color }}>
      <span className="h-1.5 w-1.5 rounded-full animate-blink" style={{ background: color }} />
      LIVE
    </p>
  );
}

export default function AdminPage({ flagged, onResolve, locked, onLock }: Props) {
  const [live, setLive] = useState<Flagged[]>([]);
  const [logs, setLogs] = useState<{ id: number; text: string; tone: string; ts: string }[]>(() =>
    LOG_POOL.slice(0, 6).map((l, i) => ({ id: i, ...l, ts: `12:0${i}` }))
  );
  const poolIdx = useRef(0);
  const logId = useRef(100);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stamp = () => {
      const d = new Date();
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
    };
    const r = window.setInterval(() => {
      const src = REPORT_POOL[poolIdx.current % REPORT_POOL.length];
      poolIdx.current += 1;
      setLive((l) => [{ ...src, id: `live-${Date.now()}`, reports: 1 }, ...l].slice(0, 6));
    }, 9000);
    const lg = window.setInterval(() => {
      const src = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)];
      setLogs((ls) => [...ls.slice(-13), { id: ++logId.current, ...src, ts: stamp() }]);
    }, 3600);
    return () => {
      window.clearInterval(r);
      window.clearInterval(lg);
    };
  }, []);

  useEffect(() => {
    consoleRef.current?.scrollTo({ top: consoleRef.current.scrollHeight });
  }, [logs]);

  return (
    <div className="pb-16">
      {/* header */}
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mag">
              <span className="h-1.5 w-1.5 rounded-full bg-mag animate-blink" />
              RESTRICTED // CLEARANCE: OMEGA
            </p>
            <h1 className="mt-2 font-display text-[26px] font-black uppercase leading-none tracking-tight sm:text-4xl">
              MOD <span className="text-mag">TERMINAL</span>
            </h1>
            <p className="mt-2.5 font-mono text-[10px] tracking-[0.18em] text-fog">
              // keep the grid unhinged, but never broken
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="clip-tag border border-mag/50 bg-mag/10 px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.2em] text-mag">
              MODBOT_9000 · ACTIVE
            </span>
            <span className="clip-tag border border-edge bg-panel px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-fog">
              QUEUE: <span className="font-bold text-lime">{flagged.length}</span>
            </span>
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_320px]">
        {/* ===== left: queue + console ===== */}
        <div className="min-w-0">
          {/* moderation queue */}
          <Reveal>
            <p className="flex items-center gap-2 pb-2.5 font-mono text-[10px] tracking-[0.25em] text-fog">
              <IconFlame className="w-3.5 h-3.5 text-mag" />
              FLAGGED QUEUE — DECIDE THE FATE OF EACH TRANSMISSION
            </p>
          </Reveal>
          <div className="space-y-3">
            {flagged.map((f, i) => (
              <Reveal key={f.id} delay={Math.min(i, 4) * 80}>
                <div
                  className="hoverlift clip-notch group border border-edge bg-panel p-4 transition-colors hover:border-mag/50"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`clip-tag px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.2em] ${
                        f.severity === "MAX" ? "animate-pulseglow" : ""
                      }`}
                      style={{ background: SEV[f.severity].color + "1a", color: SEV[f.severity].color, border: `1px solid ${SEV[f.severity].color}55` }}
                    >
                      SEV-{SEV[f.severity].label}
                    </span>
                    <span className="font-mono text-[10px] font-bold tracking-widest text-snow">{f.reason}</span>
                    <span className="font-mono text-[10px] text-fog">
                      · {f.reports} report{f.reports === 1 ? "" : "s"} · by <span className="text-cyber">@{f.reporter}</span>
                    </span>
                    <span className="ml-auto font-mono text-[9px] text-fog/60">#{f.channel}</span>
                  </div>
                  <p className="mt-2.5 text-sm font-bold leading-snug text-snow">{f.title}</p>
                  <p className="mt-1 font-mono text-[11px] italic text-fog">“{f.excerpt}”</p>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    <button
                      onClick={() => onResolve(f, "nuke")}
                      className="clip-tag bg-mag px-3.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.2em] text-void transition hover:brightness-125 hover:shadow-[0_0_20px_-6px_#ff3dd8] active:scale-95"
                    >
                      ✕ NUKE{f.postId ? " FROM FEED" : ""}
                    </button>
                    <button
                      onClick={() => onResolve(f, "approve")}
                      className="clip-tag border border-lime/60 px-3.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.2em] text-lime transition hover:bg-lime hover:text-void active:scale-95"
                    >
                      ✓ APPROVE
                    </button>
                    <button
                      onClick={() => onResolve(f, "ignore")}
                      className="clip-tag border border-edge px-3.5 py-1.5 font-mono text-[10px] tracking-[0.2em] text-fog transition hover:border-fog hover:text-snow active:scale-95"
                    >
                      IGNORE
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
            {flagged.length === 0 && (
              <div className="clip-notch border border-dashed border-lime/40 bg-panel/50 px-6 py-12 text-center">
                <p className="font-display text-lg font-black text-lime">QUEUE CLEARED</p>
                <p className="mt-2 font-mono text-xs text-fog">the grid is lawless but at peace. new flags will roll in — they always do.</p>
              </div>
            )}
          </div>

          {/* system console */}
          <Reveal>
            <div className="clip-notch mt-6 border border-edge bg-abyss">
              <div className="flex items-center justify-between border-b border-edge px-4 py-2.5">
                <p className="font-mono text-[10px] tracking-[0.25em] text-fog">SYSTEM CONSOLE</p>
                <span className="flex items-center gap-1.5 font-mono text-[9px] text-lime">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime animate-blink" />
                  tailing
                </span>
              </div>
              <div ref={consoleRef} className="h-44 overflow-y-auto px-4 py-3 font-mono text-[11px] leading-relaxed">
                {logs.map((l) => (
                  <p key={l.id} className="animate-rise whitespace-pre-wrap">
                    <span className="text-fog/50">[{l.ts}]</span>{" "}
                    <span
                      style={{
                        color:
                          l.tone === "lime" ? "#c9f536" : l.tone === "cyber" ? "#38e1ff" : l.tone === "mag" ? "#ff3dd8" : l.tone === "amber" ? "#ffc24b" : "#8f93ba",
                      }}
                    >
                      {l.text}
                    </span>
                  </p>
                ))}
                <p className="text-lime">
                  ▊<span className="animate-blink">_</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ===== right rail: live feed / vitals / lockdown ===== */}
        <div className="space-y-4">
          <Reveal>
            <div className="clip-notch border border-edge bg-panel p-4">
              <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-fog">
                <IconSignal className="w-3.5 h-3.5 text-cyber" />
                COMMUNITY VITALS
              </p>
              <div className="mt-3">
                <Vitals />
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="clip-notch border border-edge bg-panel p-4">
              <p className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-fog">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-mag animate-blink" />
                  INCOMING SIGNALS
                </span>
                <span className="text-mag">LIVE</span>
              </p>
              <div className="mt-3 space-y-2">
                {live.length === 0 && <p className="py-3 text-center font-mono text-[10px] text-fog/60">scanning… the grid is suspiciously calm</p>}
                {live.map((l) => (
                  <div key={l.id} className="animate-rise border border-edge/70 bg-abyss px-3 py-2">
                    <div className="flex items-center justify-between font-mono text-[9px]">
                      <span style={{ color: SEV[l.severity].color }}>● {l.reason}</span>
                      <span className="text-fog/60">#{l.channel}</span>
                    </div>
                    <p className="mt-1 truncate font-mono text-[11px] text-snow/85">{l.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="clip-notch border border-edge bg-panel p-4">
              <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-fog">
                <IconBolt className="w-3.5 h-3.5 text-amberx" />
                CHANNEL LOCKDOWN
              </p>
              <p className="mt-2 font-mono text-[10px] leading-relaxed text-fog/70">
                locking a channel freezes replies on its transmissions. use responsibly (or don't).
              </p>
              <div className="mt-3 space-y-1.5">
                {CHANNELS.map((c) => {
                  const on = locked.has(c.id);
                  return (
                    <div key={c.id} className="flex items-center gap-2.5 border border-edge/70 bg-abyss px-3 py-2">
                      <span className="h-2 w-2 rotate-45" style={{ background: on ? "#8f93ba" : c.color }} />
                      <span className={`font-mono text-[11px] ${on ? "text-fog line-through" : "text-snow"}`}>#{c.name}</span>
                      <span className="ml-auto font-mono text-[9px] text-fog/60">{formatVotes(c.online)} on</span>
                      <button
                        onClick={() => onLock(c.id)}
                        className={`clip-tag px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.15em] transition active:scale-95 ${
                          on
                            ? "bg-amberx text-void"
                            : "border border-edge text-fog hover:border-amberx hover:text-amberx"
                        }`}
                      >
                        {on ? "UNLOCK" : "LOCK"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
