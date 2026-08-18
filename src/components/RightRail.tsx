import { CREATORS, TRENDING } from "../data";
import { Avatar } from "./ui";
import { IconSignal, IconSpark, IconTrend, IconTrendDown } from "./icons";

type Props = {
  follows: Set<string>;
  onFollow: (handle: string) => void;
  questClaimed: boolean;
  onClaim: () => void;
};

export default function RightRail({ follows, onFollow, questClaimed, onClaim }: Props) {
  return (
    <aside className="hidden xl:block sticky top-[88px] h-[calc(100vh-88px)] w-72 shrink-0 space-y-4 overflow-y-auto border-l border-edge/70 bg-panel/40 px-4 py-6">
      {/* server status */}
      <section className="clip-notch border border-edge bg-abyss p-4">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-fog">
          <IconSignal className="w-3.5 h-3.5 text-lime" />
          SERVER STATUS
        </p>
        <ul className="mt-3 space-y-2 font-mono text-[11px]">
          {[
            { k: "UPLINK", v: "STABLE", c: "#c9f536" },
            { k: "VIBE CHECK", v: "PASSED", c: "#38e1ff" },
            { k: "MODS", v: "ASLEEP", c: "#ffc24b" },
            { k: "PING", v: "12ms", c: "#5ef0b0" },
          ].map((s) => (
            <li key={s.k} className="flex items-center justify-between">
              <span className="text-fog">{s.k}</span>
              <span className="flex items-center gap-1.5 font-bold" style={{ color: s.c }}>
                <span className="h-1.5 w-1.5 rounded-full animate-blink" style={{ background: s.c }} />
                {s.v}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* trending */}
      <section className="clip-notch border border-edge bg-abyss p-4">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-fog">
          <IconTrend className="w-3 h-3 text-mag" />
          TRENDING SIGNALS
        </p>
        <ul className="mt-3 space-y-3">
          {TRENDING.map((t, i) => (
            <li key={t.tag} className="group cursor-default">
              <div className="flex items-baseline justify-between font-mono text-[11px]">
                <span className="flex items-baseline gap-2">
                  <span className="text-fog/50 text-[9px]">0{i + 1}</span>
                  <span className="font-bold text-snow group-hover:text-lime transition-colors">#{t.tag}</span>
                </span>
                <span className={`flex items-center gap-1 text-[10px] font-bold ${t.up ? "text-lime" : "text-mag"}`}>
                  {t.up ? <IconTrend className="w-2 h-2" /> : <IconTrendDown className="w-2 h-2" />}
                  {t.delta}
                </span>
              </div>
              <div className="mt-1.5 h-1 border border-edge/60 bg-void">
                <div
                  className="h-full origin-left animate-bargrow"
                  style={{
                    width: `${t.heat}%`,
                    animationDelay: `${i * 120}ms`,
                    background: t.up
                      ? "linear-gradient(90deg, #c9f536, #38e1ff)"
                      : "linear-gradient(90deg, #ff3dd8, #9d7bff)",
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* creators */}
      <section className="clip-notch border border-edge bg-abyss p-4">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-fog">
          <IconSpark className="w-3.5 h-3.5 text-amberx" />
          TOP CREATORS
        </p>
        <ul className="mt-3 space-y-3">
          {CREATORS.map((c) => {
            const following = follows.has(c.handle);
            return (
              <li key={c.handle} className="flex items-center gap-2.5">
                <Avatar name={c.handle} sizeClass="w-8 h-8 text-xs" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-xs font-bold text-snow">@{c.handle}</p>
                  <p className="font-mono text-[9px] text-fog">
                    {c.tag} · <span className="text-cyber">{c.aura} aura</span>
                  </p>
                </div>
                <button
                  onClick={() => onFollow(c.handle)}
                  className={`border px-2.5 py-1 font-mono text-[9px] font-bold tracking-widest transition active:scale-95 clip-tag ${
                    following
                      ? "border-lime bg-lime text-void"
                      : "border-edge text-fog hover:border-lime hover:text-lime"
                  }`}
                >
                  {following ? "SYNCED" : "SYNC"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* daily quest */}
      <section
        className="clip-notch border p-4"
        style={{ borderColor: "#9d7bff55", background: "linear-gradient(160deg, #14152c, #0d0e1f)" }}
      >
        <p className="font-mono text-[10px] tracking-[0.25em] text-vio">DAILY QUEST</p>
        <p className="mt-2 text-sm font-bold leading-snug">
          Radiate main character energy<span className="text-fog font-normal"> — vote on 5 transmissions</span>
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 border border-edge bg-void">
            <div
              className="h-full origin-left animate-bargrow bg-gradient-to-r from-vio to-mag"
              style={{ width: questClaimed ? "100%" : "60%", animationDelay: "300ms" }}
            />
          </div>
          <span className="font-mono text-[10px] text-fog">{questClaimed ? "5/5" : "3/5"}</span>
        </div>
        <button
          onClick={onClaim}
          disabled={questClaimed}
          className={`mt-3 w-full py-2 font-mono text-[10px] font-bold tracking-[0.2em] clip-tag transition active:scale-95 ${
            questClaimed
              ? "cursor-default border border-mint/50 text-mint"
              : "bg-vio text-void hover:bg-mag hover:shadow-[0_0_20px_-6px_#ff3dd8]"
          }`}
        >
          {questClaimed ? "◈ CLAIMED · +100 AURA" : "CLAIM +100 AURA"}
        </button>
      </section>

      <p className="px-1 pb-2 font-mono text-[9px] leading-relaxed text-fog/50">
        you are the canon event.<br />act accordingly.
      </p>
    </aside>
  );
}
