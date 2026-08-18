import { ACHIEVEMENTS, formatVotes, type AchievementMetric } from "../data";
import { Reveal } from "./ui";
import {
  IconBell,
  IconBolt,
  IconComment,
  IconGhost,
  IconOrbit,
  IconSave,
  IconShield,
  IconSignal,
  IconSpark,
  IconTrophy,
  IconUp,
} from "./icons";

type Props = { progress: Record<AchievementMetric, number> };

function MetricIcon({ metric, className }: { metric: AchievementMetric; className: string }) {
  switch (metric) {
    case "uplink": return <IconSignal className={className} />;
    case "aura": return <IconBolt className={className} />;
    case "posts": return <IconSignal className={className} />;
    case "replies": return <IconComment className={className} />;
    case "joined": return <IconOrbit className={className} />;
    case "follows": return <IconSpark className={className} />;
    case "saved": return <IconSave className={className} />;
    case "votes": return <IconUp className={className} />;
    case "resolved": return <IconShield className={className} />;
    case "inbox": return <IconBell className={className} />;
    case "badges": return <IconTrophy className={className} />;
    case "void": return <IconGhost className={className} />;
  }
}

export default function AchievementsPage({ progress }: Props) {
  const rows = ACHIEVEMENTS.map((a) => ({
    ...a,
    value: Math.min(progress[a.metric] ?? 0, a.target),
    unlocked: (progress[a.metric] ?? 0) >= a.target,
  }));
  const unlockedCount = rows.filter((r) => r.unlocked).length;
  const pct = Math.round((unlockedCount / rows.length) * 100);

  return (
    <div className="pb-16">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-amberx">
              <IconTrophy className="w-3.5 h-3.5" />
              ACHIEVEMENT PROTOCOL // TROPHY SHELF
            </p>
            <h1 className="mt-2 font-display text-[26px] font-black uppercase leading-none tracking-tight sm:text-4xl">
              PROOF YOU <span className="text-amberx">EXISTED</span>
            </h1>
            <p className="mt-2.5 font-mono text-[10px] tracking-[0.18em] text-fog">
              // the grid remembers everything. wear it.
            </p>
          </div>
          <div className="clip-notch border border-edge bg-panel px-4 py-3">
            <p className="font-mono text-[9px] tracking-[0.25em] text-fog">COLLECTION</p>
            <p className="mt-1 font-display text-2xl font-black text-amberx">
              {unlockedCount}
              <span className="text-fog">/{rows.length}</span>
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between pb-1.5 font-mono text-[9px] tracking-[0.2em] text-fog">
            <span>SHELF COMPLETION</span>
            <span className="font-bold text-amberx">{pct}%</span>
          </div>
          <div className="h-2 border border-edge bg-void">
            <div
              className="h-full origin-left animate-bargrow bg-gradient-to-r from-amberx via-mag to-vio"
              style={{ width: `${Math.max(pct, 2)}%`, animationDelay: "150ms" }}
            />
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {rows.map((a, i) => {
          const p = Math.round((a.value / a.target) * 100);
          return (
            <Reveal key={a.id} delay={Math.min(i, 8) * 55}>
              <div
                className={`hoverlift clip-notch group relative h-full border p-4 transition-colors ${
                  a.unlocked ? "bg-panel" : "border-edge bg-panel/40 hover:bg-panel/70"
                }`}
                style={a.unlocked ? { borderColor: a.color + "55", boxShadow: `inset 0 0 40px -30px ${a.color}` } : undefined}
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center border transition-transform duration-300 group-hover:rotate-[10deg] ${
                      a.unlocked ? "animate-pulseglow" : ""
                    }`}
                    style={{
                      borderColor: a.unlocked ? a.color + "66" : "#24264d",
                      background: a.unlocked ? a.color + "14" : "#0a0b18",
                      color: a.unlocked ? a.color : "#4a4d75",
                      boxShadow: a.unlocked ? `0 0 18px -6px ${a.color}` : "none",
                    }}
                  >
                    <MetricIcon metric={a.metric} className="w-5 h-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-display text-sm font-black tracking-tight ${a.unlocked ? "text-snow" : "text-fog"}`}>
                        {a.secret && !a.unlocked ? "▓▓▓▓▓▓▓▓▓▓▓▓▓" : a.name}
                      </h3>
                      {a.secret && !a.unlocked && (
                        <span className="clip-tag border border-edge px-1.5 py-0.5 font-mono text-[8px] tracking-[0.2em] text-fog/60">
                          HIDDEN
                        </span>
                      )}
                    </div>
                    <p className={`mt-1 text-xs leading-relaxed ${a.unlocked ? "text-fog" : "text-fog/60"}`}>
                      {a.secret && !a.unlocked ? "an achievement that does not wish to be named. keep wandering." : a.desc}
                    </p>

                    <div className="mt-3 flex items-center gap-2.5">
                      <div className="h-1.5 flex-1 border border-edge/70 bg-void">
                        <div
                          className="h-full origin-left animate-bargrow"
                          style={{
                            width: `${Math.max(p, 1.5)}%`,
                            animationDelay: `${200 + i * 60}ms`,
                            background: a.unlocked ? a.color : "linear-gradient(90deg, #24264d, #4a4d75)",
                          }}
                        />
                      </div>
                      <span className="font-mono text-[10px] tabular-nums text-fog">
                        {a.metric === "aura" ? formatVotes(a.value) : a.value}
                        <span className="text-fog/50">/{a.metric === "aura" ? formatVotes(a.target) : a.target}</span>
                      </span>
                    </div>
                  </div>

                  <span
                    className={`clip-tag shrink-0 px-2 py-1 font-mono text-[8px] font-bold tracking-[0.2em] ${
                      a.unlocked ? "animate-votepop" : ""
                    }`}
                    style={
                      a.unlocked
                        ? { background: a.color, color: "#05050d" }
                        : { border: "1px solid #24264d", color: "#4a4d75" }
                    }
                  >
                    {a.unlocked ? "UNLOCKED" : "LOCKED"}
                  </span>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal>
        <div className="clip-notch mt-6 border border-dashed border-edge bg-panel/40 px-5 py-4 text-center">
          <p className="font-mono text-[10px] leading-relaxed tracking-[0.15em] text-fog/70">
            ◈ MORE ACHIEVEMENTS ARE BEING COMPILED IN A LAB SOMEWHERE IN NEO-OSAKA ◈
            <br />
            <span className="text-fog/40">rumor: one unlocks only at exactly 4:04 AM. do not look into it.</span>
          </p>
        </div>
      </Reveal>
    </div>
  );
}
