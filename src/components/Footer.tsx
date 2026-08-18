import { useEffect, useState } from "react";
import { formatVotes } from "../data";
import { api } from "../api/client";
import { IconLogo } from "./icons";
import type { Page } from "./Sidebar";

type Props = {
  onNavigate: (p: Page) => void;
  onSelect: (id: string) => void;
  aura: number;
};

function SyncStamp() {
  const [ts, setTs] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    const tick = () => api.sync().then((db) => alive && setTs(db.lastSync));
    tick();
    const iv = window.setInterval(tick, 4000);
    return () => {
      alive = false;
      window.clearInterval(iv);
    };
  }, []);
  if (!ts) return <span className="text-fog/50">—</span>;
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-mint animate-blink" />
      GRID-DB SYNCED <span className="text-mint">{hh}:{mm}:{ss}</span>
    </span>
  );
}

export default function Footer({ onNavigate, onSelect, aura }: Props) {
  const link =
    "block w-fit font-mono text-[11px] text-fog transition hover:text-lime hover:translate-x-1 transition-all";

  return (
    <footer className="mt-14 border-t border-edge bg-abyss/60">
      <div className="grid gap-10 px-4 py-10 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <IconLogo className="w-8 h-8" />
            <p className="font-display text-lg font-black tracking-tight leading-none">
              HYPER<span className="text-lime">FEED</span>
            </p>
          </div>
          <p className="mt-3 max-w-xs font-mono text-[10px] leading-relaxed tracking-wider text-fog">
            THE FEED FROM 2087. transmit, vibe, collect aura. moderation is a suggestion.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { k: "UPLINK", v: "STABLE", c: "#c9f536" },
              { k: "PING", v: "12MS", c: "#38e1ff" },
              { k: "VIBE", v: "98%", c: "#ff3dd8" },
            ].map((s) => (
              <span key={s.k} className="clip-tag flex items-center gap-1.5 border border-edge bg-panel px-2.5 py-1.5 font-mono text-[9px] tracking-[0.2em] text-fog">
                <span className="h-1.5 w-1.5 rounded-full animate-blink" style={{ background: s.c }} />
                {s.k}: <b style={{ color: s.c }}>{s.v}</b>
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="pb-3 font-mono text-[9px] tracking-[0.3em] text-fog/50">NAVIGATE</p>
          <div className="flex flex-col gap-2">
            <button className={link} onClick={() => onNavigate("feed")}>→ the feed</button>
            <button className={link} onClick={() => onNavigate("channels")}>→ channels</button>
            <button className={link} onClick={() => onNavigate("leaderboard")}>→ aura league</button>
            <button className={link} onClick={() => onNavigate("inbox")}>→ inbox</button>
          </div>
        </div>

        <div>
          <p className="pb-3 font-mono text-[9px] tracking-[0.3em] text-fog/50">YOU</p>
          <div className="flex flex-col gap-2">
            <button className={link} onClick={() => onNavigate("profile")}>→ profile</button>
            <button className={link} onClick={() => onNavigate("achievements")}>→ achievements</button>
            <button className={link} onClick={() => onSelect("saved")}>→ saved drops</button>
            <button className={link} onClick={() => onSelect("synced")}>→ synced feed</button>
            <button className={link} onClick={() => onNavigate("settings")}>→ settings</button>
          </div>
        </div>

        <div>
          <p className="pb-3 font-mono text-[9px] tracking-[0.3em] text-fog/50">SYSTEM</p>
          <div className="flex flex-col gap-2">
            <button className={link} onClick={() => onNavigate("patches")}>→ patch notes</button>
            <button className={link} onClick={() => onNavigate("admin")}>→ mod terminal</button>
            <button className={`${link} hover:text-vio!`} onClick={() => onNavigate("void")}>→ the void</button>
          </div>
          <div className="mt-5 space-y-2.5 font-mono text-[10px] text-fog">
            <p className="font-mono text-[9px] tracking-[0.3em] text-fog/50">SHORTCUTS</p>
            <p className="flex items-center gap-2">
              <kbd className="border border-edge bg-panel px-1.5 py-0.5 text-[9px] text-cyber">/</kbd> grid scan
              <kbd className="border border-edge bg-panel px-1.5 py-0.5 text-[9px] text-cyber">C</kbd> drop a post
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-edge/70 px-4 py-4 font-mono text-[9px] tracking-[0.2em] text-fog/60 sm:px-8">
        <p>© 2087 HYPERFEED COLLECTIVE — built different on purpose</p>
        <SyncStamp />
        <p>
          YOUR AURA: <span className="font-bold text-lime">{formatVotes(aura)}</span> · v2.087 · no thoughts, only vibes
        </p>
      </div>
    </footer>
  );
}
