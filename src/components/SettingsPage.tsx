import { useEffect, useState } from "react";
import { formatVotes, type Settings } from "../data";
import { Avatar, Reveal } from "./ui";
import { IconBolt, IconGear, IconSend } from "./icons";

type Props = {
  handle: string;
  onRename: (h: string) => void;
  settings: Settings;
  onPatch: (p: Partial<Settings>) => void;
  aura: number;
  stats: { posts: number; replies: number; saved: number; channels: number };
  onPurgeSaved: () => void;
  onReboot: () => void;
};

const VALID = /^[a-z0-9_.]{3,18}$/;

function Toggle({
  on,
  onChange,
  label,
  desc,
  color = "#c9f536",
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc: string;
  color?: string;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      className="group flex w-full items-center justify-between gap-4 border border-edge bg-abyss px-4 py-3 text-left transition hover:border-fog/40"
    >
      <span className="min-w-0">
        <span className="block text-sm font-bold text-snow transition group-hover:text-lime">{label}</span>
        <span className="block font-mono text-[10px] leading-relaxed text-fog">{desc}</span>
      </span>
      <span
        className="relative h-5 w-10 shrink-0 border transition-colors"
        style={on ? { background: color + "22", borderColor: color } : { borderColor: "#24264d" }}
      >
        <span
          className="absolute top-[3px] h-3 w-3 transition-all duration-200"
          style={{ left: on ? 24 : 3, background: on ? color : "#8f93ba" }}
        />
      </span>
    </button>
  );
}

function Section({ title, accent, children, delay = 0 }: { title: string; accent: string; children: React.ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <section className="clip-notch border border-edge bg-panel p-5">
        <p className="flex items-center gap-2 pb-4 font-mono text-[10px] tracking-[0.25em]" style={{ color: accent }}>
          <span className="h-1.5 w-1.5 rotate-45" style={{ background: accent }} />
          {title}
        </p>
        {children}
      </section>
    </Reveal>
  );
}

export default function SettingsPage({ handle, onRename, settings, onPatch, aura, stats, onPurgeSaved, onReboot }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(handle);
  const [error, setError] = useState("");
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const t = window.setTimeout(() => setArmed(false), 2600);
    return () => window.clearTimeout(t);
  }, [armed]);

  const commitRename = () => {
    const v = draft.trim().toLowerCase();
    if (!VALID.test(v)) {
      setError("3–18 chars · lowercase · a-z 0-9 _ . only");
      return;
    }
    setEditing(false);
    setError("");
    onRename(v);
  };

  const exportData = () => {
    const payload = {
      app: "HYPERFEED",
      version: "2.087",
      handle,
      aura,
      stats,
      exported_at: new Date().toISOString(),
      note: "no thoughts, only vibes",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${handle}-aura-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pb-16">
      <Reveal>
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-cyber">
          <IconGear className="w-3.5 h-3.5" />
          CONTROL PANEL // TUNE YOUR EXPERIENCE
        </p>
        <h1 className="mt-2 font-display text-[26px] font-black uppercase leading-none tracking-tight sm:text-4xl">
          SET<span className="text-cyber">TINGS</span>
        </h1>
        <p className="mt-2.5 font-mono text-[10px] tracking-[0.18em] text-fog">
          // everything is stored locally. the grid remembers nothing it shouldn't.
        </p>
      </Reveal>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* identity */}
        <Section title="IDENTITY" accent="#c9f536">
          <div className="flex items-center gap-4">
            <Avatar name={handle} sizeClass="w-16 h-16 text-2xl" />
            <div className="min-w-0 flex-1">
              {editing ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="flex min-w-0 flex-1 items-center border border-lime/60 bg-abyss clip-tag">
                      <span className="pl-2.5 font-mono text-sm text-lime">@</span>
                      <input
                        autoFocus
                        value={draft}
                        onChange={(e) => {
                          setDraft(e.target.value.toLowerCase());
                          setError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitRename();
                          if (e.key === "Escape") setEditing(false);
                        }}
                        className="w-full bg-transparent px-1.5 py-2 font-mono text-sm text-snow outline-none"
                      />
                    </div>
                    <button onClick={commitRename} className="bg-lime p-2 text-void clip-tag transition hover:bg-cyber active:scale-90" aria-label="save handle">
                      <IconSend className="w-4 h-4" />
                    </button>
                  </div>
                  {error && <p className="mt-1.5 font-mono text-[10px] text-mag">⚠ {error}</p>}
                </>
              ) : (
                <>
                  <p className="truncate font-display text-xl font-black tracking-tight">@{handle}</p>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-fog">
                    CLEARANCE: <span className="text-lime">MAIN CHARACTER</span> · LVL 42
                  </p>
                </>
              )}
            </div>
          </div>
          {!editing && (
            <button
              onClick={() => {
                setDraft(handle);
                setEditing(true);
              }}
              className="clip-tag mt-4 border border-edge px-3.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.2em] text-fog transition hover:border-lime hover:text-lime active:scale-95"
            >
              CHANGE HANDLE
            </button>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { k: "AURA", v: formatVotes(aura), c: "#c9f536" },
              { k: "POSTS", v: String(stats.posts), c: "#38e1ff" },
              { k: "REPLIES", v: String(stats.replies), c: "#ff3dd8" },
              { k: "SAVED", v: String(stats.saved), c: "#9d7bff" },
            ].map((s) => (
              <div key={s.k} className="border border-edge bg-abyss px-2.5 py-2 text-center">
                <p className="font-mono text-[8px] tracking-[0.2em] text-fog">{s.k}</p>
                <p className="mt-0.5 font-display text-sm font-black" style={{ color: s.c }}>
                  {s.v}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* feed preferences */}
        <Section title="FEED PREFERENCES" accent="#38e1ff" delay={80}>
          <div className="space-y-2">
            <Toggle
              on={settings.reduceMotion}
              onChange={(v) => onPatch({ reduceMotion: v })}
              label="Reduce motion"
              desc="calms the scanlines, ticker and ambient animation. the grid respects your retinas."
              color="#38e1ff"
            />
            <Toggle
              on={settings.chaosDampener}
              onChange={(v) => onPatch({ chaosDampener: v })}
              label="Chaos dampener"
              desc="hides DANGEROUS and unhinged takes from your feed. courage not included."
              color="#ffc24b"
            />
            <Toggle
              on={settings.compactMode}
              onChange={(v) => onPatch({ compactMode: v })}
              label="Compact mode"
              desc="denser cards, no images. for terminal dwellers and data hoarders."
              color="#9d7bff"
            />
          </div>
        </Section>

        {/* pings */}
        <Section title="PING PREFERENCES" accent="#ffc24b" delay={160}>
          <div className="space-y-2">
            <Toggle on={settings.notifReplies} onChange={(v) => onPatch({ notifReplies: v })} label="Replies" desc="when someone answers your transmissions" color="#38e1ff" />
            <Toggle on={settings.notifAura} onChange={(v) => onPatch({ notifAura: v })} label="Aura events" desc="gains, ratings and S-tier verdicts" color="#c9f536" />
            <Toggle on={settings.notifMentions} onChange={(v) => onPatch({ notifMentions: v })} label="Mentions" desc="when your handle echoes across channels" color="#ffc24b" />
            <Toggle on={settings.notifSystem} onChange={(v) => onPatch({ notifSystem: v })} label="System broadcasts" desc="MODBOT_9000 announcements and patch notes" color="#ff3dd8" />
          </div>
        </Section>

        {/* data & danger */}
        <Section title="DATA & DANGER ZONE" accent="#ff3dd8" delay={240}>
          <div className="space-y-2">
            <button
              onClick={exportData}
              className="clip-tag flex w-full items-center justify-between border border-edge bg-abyss px-4 py-3 font-mono text-[11px] font-bold tracking-[0.15em] text-snow transition hover:border-cyber hover:text-cyber active:scale-[0.99]"
            >
              EXPORT AURA LEDGER (.json)
              <span className="text-cyber">↓</span>
            </button>
            <button
              onClick={() => {
                if (!armed) {
                  setArmed(true);
                  return;
                }
                setArmed(false);
                onPurgeSaved();
              }}
              className={`clip-tag flex w-full items-center justify-between border px-4 py-3 font-mono text-[11px] font-bold tracking-[0.15em] transition active:scale-[0.99] ${
                armed ? "border-amberx bg-amberx/15 text-amberx animate-pulseglow" : "border-edge bg-abyss text-fog hover:border-amberx hover:text-amberx"
              }`}
            >
              {armed ? `SURE? ${stats.saved} DROPS GET VAPORIZED — CLICK AGAIN` : "PURGE SAVED DROPS"}
              <span>{stats.saved}</span>
            </button>
            <button
              onClick={onReboot}
              className="clip-tag flex w-full items-center justify-between border border-mag/50 bg-mag/10 px-4 py-3 font-mono text-[11px] font-bold tracking-[0.15em] text-mag transition hover:bg-mag hover:text-void active:scale-[0.99]"
            >
              REBOOT SEQUENCE — RESETS IDENTITY & SETTINGS
              <span>⟳</span>
            </button>
          </div>
          <p className="mt-3 font-mono text-[9px] leading-relaxed text-fog/60">
            rebooting replays the system boot and clears stored preferences. your aura, however, is eternal.
          </p>
        </Section>
      </div>

      {/* about strip */}
      <Reveal delay={300}>
        <div className="clip-notch mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 border border-edge bg-panel px-5 py-4">
          <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-fog">
            <IconBolt className="w-3.5 h-3.5 text-lime" />
            HYPERFEED v2.087 — kernel stable
          </p>
          <p className="font-mono text-[10px] tracking-[0.2em] text-fog">
            shortcuts: <kbd className="border border-edge bg-abyss px-1 text-cyber">/</kbd> scan ·{" "}
            <kbd className="border border-edge bg-abyss px-1 text-cyber">C</kbd> drop ·{" "}
            <kbd className="border border-edge bg-abyss px-1 text-cyber">ESC</kbd> close
          </p>
          <p className="ml-auto font-mono text-[10px] tracking-[0.2em] text-fog/60">crafted in the grid · 2087</p>
        </div>
      </Reveal>
    </div>
  );
}
