import { useEffect, useState } from "react";
import { AURA_MOVERS, formatVotes, LEADERBOARD } from "../data";
import { Avatar, Reveal } from "./ui";
import { IconBolt, IconCrown, IconSignal, IconTrend, IconTrendDown } from "./icons";

type Props = { aura: number; handle: string; follows: Set<string>; onFollow: (h: string) => void };

function useCountdown() {
  const calc = () => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(24, 0, 0, 0);
    const diff = Math.max(0, end.getTime() - now.getTime());
    return {
      h: Math.floor(diff / 3.6e6),
      m: Math.floor((diff % 3.6e6) / 6e4),
      s: Math.floor((diff % 6e4) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const i = window.setInterval(() => setT(calc()), 1000);
    return () => window.clearInterval(i);
  }, []);
  return t;
}

const pad = (n: number) => String(n).padStart(2, "0");

function tierOf(aura: number) {
  if (aura >= 500_000) return { name: "DEITY", next: null as number | null, base: 500_000 };
  if (aura >= 100_000) return { name: "ICON", next: 500_000, base: 100_000 };
  if (aura >= 50_000) return { name: "CERTIFIED", next: 100_000, base: 50_000 };
  if (aura >= 10_000) return { name: "RISING", next: 50_000, base: 10_000 };
  return { name: "ROOKIE", next: 10_000, base: 0 };
}

export default function LeaderboardPage({ aura, handle, follows, onFollow }: Props) {
  const t = useCountdown();
  const [g, s, b] = LEADERBOARD;
  const rest = LEADERBOARD.slice(3);
  const tier = tierOf(aura);
  const pct = tier.next ? Math.min(100, Math.round(((aura - tier.base) / (tier.next - tier.base)) * 100)) : 100;

  const podium = [
    { e: s, rank: 2, h: 112, color: "#c0c7e8", label: "SILVER" },
    { e: g, rank: 1, h: 158, color: "#ffc24b", label: "GOLD" },
    { e: b, rank: 3, h: 82, color: "#d78f5a", label: "BRONZE" },
  ];

  return (
    <div className="pb-16">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-amberx">
              <IconTrend className="w-3 h-3" />
              SEASON 87 // GLOBAL AURA RANKINGS
            </p>
            <h1 className="mt-2 font-display text-[26px] font-black uppercase leading-none tracking-tight sm:text-4xl">
              AURA <span className="text-amberx">LEAGUE</span>
            </h1>
            <p className="mt-2.5 font-mono text-[10px] tracking-[0.18em] text-fog">
              // the only metric that matters. do not touch the grass.
            </p>
          </div>
          <div className="clip-notch border border-edge bg-panel px-4 py-3 text-right">
            <p className="font-mono text-[9px] tracking-[0.25em] text-fog">CYCLE 88 BEGINS IN</p>
            <p className="mt-1 font-display text-xl font-black tabular-nums tracking-tight text-cyber">
              {pad(t.h)}:{pad(t.m)}:<span className="animate-blink">{pad(t.s)}</span>
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          {/* podium */}
          <Reveal>
            <div className="grid grid-cols-3 items-end gap-2.5 sm:gap-4">
              {podium.map((p) => {
                const isGold = p.rank === 1;
                return (
                  <div key={p.rank} className="flex flex-col items-center">
                    {isGold ? (
                      <IconCrown className="floaty w-7 h-7 text-amberx" />
                    ) : (
                      <span className="h-7" />
                    )}
                    <div className="relative">
                      <Avatar name={p.e.handle} sizeClass={isGold ? "w-16 h-16 text-2xl" : "w-12 h-12 text-lg"} />
                      <span
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 font-mono text-[9px] font-bold"
                        style={{ background: p.color, color: "#05050d" }}
                      >
                        #{p.rank}
                      </span>
                    </div>
                    <p className="mt-3.5 max-w-full truncate font-mono text-[11px] font-bold text-snow">@{p.e.handle}</p>
                    <p className="font-mono text-[9px]" style={{ color: p.color }}>
                      {formatVotes(p.e.aura)} AURA
                    </p>
                    <div
                      className="mt-2 flex w-full items-start justify-center border pt-2"
                      style={{
                        height: p.h,
                        borderColor: p.color + "66",
                        background: `linear-gradient(180deg, ${p.color}26, ${p.color}08)`,
                        boxShadow: isGold ? `0 0 40px -12px ${p.color}` : "none",
                      }}
                    >
                      <span className="text-outline font-display text-3xl font-black" style={{ WebkitTextStroke: `1px ${p.color}88` }}>
                        {p.rank}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* table */}
          <div className="mt-5 space-y-1.5">
            {rest.map((e, i) => {
              const rank = i + 4;
              const synced = follows.has(e.handle);
              return (
                <Reveal key={e.handle} delay={Math.min(i, 6) * 50}>
                  <div className="hoverlift group grid grid-cols-[40px_1fr_auto] items-center gap-3 border border-edge bg-panel px-3 py-2.5 transition hover:border-fog/40 sm:grid-cols-[48px_1fr_90px_90px_76px]">
                    <span className="font-display text-sm font-black text-fog/60">#{rank}</span>
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Avatar name={e.handle} sizeClass="w-8 h-8 text-xs" />
                      <span className="min-w-0">
                        <span className="block truncate font-mono text-xs font-bold text-snow transition group-hover:text-lime">@{e.handle}</span>
                        <span className="block truncate font-mono text-[9px] text-fog">{e.tag}</span>
                      </span>
                    </span>
                    <span
                      className={`hidden items-center gap-1 font-mono text-[10px] font-bold sm:flex ${e.up ? "text-lime" : "text-mag"}`}
                    >
                      {e.up ? <IconTrend className="w-2 h-2" /> : <IconTrendDown className="w-2 h-2" />}
                      {e.delta > 0 ? "+" : ""}
                      {e.delta}%
                    </span>
                    <span className="hidden text-right font-mono text-xs font-bold text-cyber sm:block">{formatVotes(e.aura)}</span>
                    <span className="justify-self-end">
                      <button
                        onClick={() => onFollow(e.handle)}
                        className={`clip-tag border px-2.5 py-1 font-mono text-[9px] font-bold tracking-widest transition active:scale-95 ${
                          synced ? "border-lime bg-lime text-void" : "border-edge text-fog hover:border-lime hover:text-lime"
                        }`}
                      >
                        {synced ? "SYNCED" : "SYNC"}
                      </button>
                    </span>
                  </div>
                </Reveal>
              );
            })}

            {/* separator + you */}
            <div className="flex items-center gap-3 py-2">
              <span className="h-px flex-1 border-t border-dashed border-edge" />
              <span className="font-mono text-[9px] tracking-[0.3em] text-fog/50">30 RANKS BELOW</span>
              <span className="h-px flex-1 border-t border-dashed border-edge" />
            </div>

            <div className="grid grid-cols-[40px_1fr_auto] items-center gap-3 border-2 border-lime/60 bg-lime/5 px-3 py-2.5 shadow-[0_0_30px_-14px_#c9f536] sm:grid-cols-[48px_1fr_90px_90px_76px]">
              <span className="font-display text-sm font-black text-lime">#42</span>
              <span className="flex min-w-0 items-center gap-2.5">
                <Avatar name={handle} sizeClass="w-8 h-8 text-xs" />
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-mono text-xs font-bold text-snow">@{handle}</span>
                    <span className="clip-tag bg-lime px-1.5 py-px font-mono text-[8px] font-bold tracking-[0.2em] text-void">YOU</span>
                  </span>
                  <span className="block font-mono text-[9px] text-fog">professional delulu</span>
                </span>
              </span>
              <span className="hidden items-center gap-1 font-mono text-[10px] font-bold text-lime sm:flex">
                <IconTrend className="w-2 h-2" />
                +3.7%
              </span>
              <span key={aura} className="animate-votepop hidden text-right font-mono text-xs font-bold text-lime sm:block">
                {formatVotes(aura)}
              </span>
              <span className="justify-self-end font-mono text-[9px] tracking-widest text-lime/70">CLIMBING</span>
            </div>
          </div>
        </div>

        {/* side rail */}
        <div className="space-y-4">
          <Reveal>
            <div className="clip-notch border border-edge bg-panel p-4">
              <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-fog">
                <IconSignal className="w-3.5 h-3.5 text-mag" />
                FLUX // LAST HOUR
              </p>
              <div className="mt-3 space-y-2.5">
                {AURA_MOVERS.map((m, i) => (
                  <div key={m.handle} className="group">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-fog transition group-hover:text-snow">@{m.handle}</span>
                      <span className={`font-bold ${m.up ? "text-lime" : "text-mag"}`}>{m.delta}</span>
                    </div>
                    <div className="mt-1 h-1 border border-edge/60 bg-void">
                      <div
                        className="h-full origin-left animate-bargrow"
                        style={{
                          width: `${Math.min(100, Math.abs(parseFloat(m.delta)) * 8)}%`,
                          animationDelay: `${i * 110}ms`,
                          background: m.up ? "linear-gradient(90deg, #c9f536, #38e1ff)" : "linear-gradient(90deg, #ff3dd8, #9d7bff)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="clip-notch border border-lime/40 bg-panel p-4" style={{ background: "linear-gradient(160deg, #14152c, #0d0e1f)" }}>
              <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-lime">
                <IconBolt className="w-3.5 h-3.5" />
                YOUR TIER: {tier.name}
              </p>
              <p className="mt-2 font-display text-2xl font-black tabular-nums text-snow">{formatVotes(aura)} <span className="text-xs text-fog font-mono font-normal tracking-widest">AURA</span></p>
              <div className="mt-3 h-2 border border-edge bg-void">
                <div
                  className="h-full origin-left animate-bargrow bg-gradient-to-r from-lime to-cyber"
                  style={{ width: `${pct}%`, animationDelay: "200ms" }}
                />
              </div>
              <p className="mt-2 font-mono text-[10px] text-fog">
                {tier.next ? (
                  <>
                    <span className="text-lime font-bold">{formatVotes(Math.max(0, tier.next - aura))}</span> aura until{" "}
                    <span className="text-cyber">{tierOf(tier.next).name}</span>
                  </>
                ) : (
                  "maximum tier achieved. touch grass? never."
                )}
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="clip-notch border border-edge bg-abyss p-4">
              <p className="font-mono text-[10px] tracking-[0.25em] text-fog">LEAGUE RULES</p>
              <ul className="mt-2.5 space-y-1.5 font-mono text-[10px] leading-relaxed text-fog/80">
                <li><span className="text-lime">01.</span> aura is earned, never bought</li>
                <li><span className="text-cyber">02.</span> downvoting costs 1 aura (karma tax)</li>
                <li><span className="text-mag">03.</span> delulu posts grant 2× aura on fridays</li>
                <li><span className="text-amberx">04.</span> mods may seize aura while asleep</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
