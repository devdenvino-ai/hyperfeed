import { CHANNELS, formatVotes } from "../data";
import { Avatar } from "./ui";
import { IconBolt, IconComment, IconFlame, IconGear, IconOrbit, IconSave, IconTrend, IconTrophy, IconWrench } from "./icons";

export type Page =
  | "feed"
  | "channels"
  | "leaderboard"
  | "inbox"
  | "profile"
  | "admin"
  | "settings"
  | "achievements"
  | "patches"
  | "void";

type Props = {
  page: Page;
  active: string;
  handle: string;
  onSelect: (id: string) => void;
  onNavigate: (p: Page) => void;
  savedCount: number;
  unread: number;
  aura: number;
  joined: Set<string>;
  onToggleJoin: (id: string) => void;
};

export default function Sidebar({ page, active, handle, onSelect, onNavigate, savedCount, unread, aura, joined, onToggleJoin }: Props) {
  const navBtn = (on: boolean) =>
    `group flex w-full items-center gap-3 px-3 py-2.5 font-mono text-[11px] tracking-[0.18em] transition-all clip-tag ${
      on ? "bg-lime text-void font-bold" : "text-fog hover:text-snow hover:bg-panel2"
    }`;

  const badge = (text: string | number, on: boolean, cls: string) => (
    <span className={`ml-auto font-mono text-[10px] px-1.5 ${on ? "bg-void/20" : cls}`}>{text}</span>
  );

  return (
    <aside className="hidden lg:flex sticky top-[88px] h-[calc(100vh-88px)] w-60 shrink-0 flex-col gap-5 border-r border-edge/70 bg-panel/40 px-4 py-6 overflow-y-auto">
      <nav className="flex flex-col gap-1">
        <p className="px-3 pb-2 font-mono text-[9px] tracking-[0.3em] text-fog/50">BROWSE</p>
        <button className={navBtn(page === "feed")} onClick={() => onNavigate("feed")}>
          <IconFlame className="w-4 h-4" />
          THE FEED
        </button>
        <button className={navBtn(page === "channels")} onClick={() => onNavigate("channels")}>
          <IconOrbit className="w-4 h-4" />
          CHANNELS
        </button>
        <button className={navBtn(page === "leaderboard")} onClick={() => onNavigate("leaderboard")}>
          <IconTrend className="w-4 h-4" />
          AURA LEAGUE
        </button>
        <button className={navBtn(page === "achievements")} onClick={() => onNavigate("achievements")}>
          <IconTrophy className="w-4 h-4" />
          ACHIEVEMENTS
        </button>
        <button className={navBtn(page === "inbox")} onClick={() => onNavigate("inbox")}>
          <IconComment className="w-4 h-4" />
          INBOX
          {unread > 0 && badge(unread, page === "inbox", "bg-mag text-void font-bold")}
        </button>

        <p className="px-3 pb-2 pt-4 font-mono text-[9px] tracking-[0.3em] text-fog/50">YOU</p>
        <button className={navBtn(page === "profile")} onClick={() => onNavigate("profile")}>
          <IconBolt className="w-4 h-4" />
          PROFILE
        </button>
        <button className={navBtn(page === "feed" && active === "saved")} onClick={() => onSelect("saved")}>
          <IconSave className="w-4 h-4" />
          SAVED DROPS
          {badge(savedCount, page === "feed" && active === "saved", "bg-panel2 text-cyber")}
        </button>
        <button className={navBtn(page === "feed" && active === "synced")} onClick={() => onSelect("synced")}>
          <IconTrend className="w-4 h-4" />
          SYNCED FEED
        </button>
        <button className={navBtn(page === "settings")} onClick={() => onNavigate("settings")}>
          <IconGear className="w-4 h-4" />
          SETTINGS
        </button>
        <button className={navBtn(page === "patches")} onClick={() => onNavigate("patches")}>
          <IconWrench className="w-4 h-4" />
          PATCH NOTES
        </button>
        <button
          className={`group flex w-full items-center gap-3 px-3 py-2.5 font-mono text-[11px] tracking-[0.18em] transition-all clip-tag ${
            page === "admin" ? "bg-mag text-void font-bold" : "text-fog hover:text-snow hover:bg-panel2"
          }`}
          onClick={() => onNavigate("admin")}
        >
          <span className={`h-1.5 w-1.5 rounded-full animate-blink ${page === "admin" ? "bg-void" : "bg-mag"}`} />
          MOD TERMINAL
        </button>
      </nav>

      <div>
        <p className="flex items-center gap-2 px-3 pb-3 font-mono text-[10px] tracking-[0.25em] text-fog">
          <IconOrbit className="w-3.5 h-3.5 text-cyber" />
          FREQUENCIES
        </p>
        <ul className="flex flex-col gap-0.5">
          {CHANNELS.map((c) => {
            const on = page === "feed" && active === c.id;
            return (
              <li key={c.id} className="group relative">
                <button
                  onClick={() => onSelect(c.id)}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                    on ? "bg-panel2 text-snow" : "hover:bg-panel2/60"
                  }`}
                >
                  <span
                    className="h-2 w-2 shrink-0 rotate-45 transition-transform group-hover:rotate-[135deg]"
                    style={{ background: c.color, boxShadow: on ? `0 0 10px ${c.color}` : "none" }}
                  />
                  <span className={`font-mono text-xs ${on ? "font-bold" : "text-fog group-hover:text-snow"}`}>
                    #{c.name}
                  </span>
                  {!on && (
                    <span className="ml-auto flex items-center gap-1 font-mono text-[9px] text-fog/70">
                      <span className="h-1 w-1 rounded-full bg-lime animate-blink" />
                      {formatVotes(c.online)}
                    </span>
                  )}
                </button>
                {on && (
                  <span
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 font-mono text-[8px] tracking-widest px-1 py-0.5 border"
                    style={{ color: c.color, borderColor: c.color + "66", background: c.color + "14" }}
                  >
                    {joined.has(c.id) ? "JOINED" : "LIVE"}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <button
        onClick={() => onNavigate("profile")}
        className="group mt-auto border border-edge bg-abyss clip-notch p-3.5 text-left transition hover:border-lime/50"
      >
        <div className="flex items-center gap-2.5">
          <Avatar name={handle} sizeClass="w-9 h-9 text-sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight transition-colors group-hover:text-lime">{handle}</p>
            <p className="font-mono text-[9px] tracking-widest text-lime">CERTIFIED MAIN CHARACTER</p>
          </div>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <p className="font-mono text-[10px] text-fog">AURA</p>
          <p key={aura} className="animate-votepop font-mono text-sm font-bold text-cyber">
            {formatVotes(aura)}
          </p>
        </div>
        <div className="mt-1.5 h-1.5 border border-edge bg-void">
          <div
            className="h-full origin-left animate-bargrow bg-gradient-to-r from-lime to-cyber"
            style={{ width: `${Math.min(96, 62 + (aura - 48260) / 30)}%` }}
          />
        </div>
        <p className="mt-1.5 font-mono text-[9px] text-fog">LVL 42 · {formatVotes(Math.max(0, 50000 - aura))} TO LVL 43</p>
      </button>

      <button
        onClick={() => onNavigate("void")}
        className={`group px-1 text-left font-mono text-[9px] leading-relaxed transition-colors ${
          page === "void" ? "text-vio" : "text-fog/50 hover:text-vio"
        }`}
      >
        ▚ enter the void
        <span className="block text-[8px] text-fog/30 group-hover:text-vio/60">
          {page === "void" ? "you are here. obviously." : "no refunds. no witnesses."}
        </span>
      </button>

      <p className="px-1 font-mono text-[9px] leading-relaxed text-fog/50">
        HYPERFEED v2.087
        <br />
        uplink: stable · ping 12ms
        <br />
        no thoughts, only vibes
      </p>
    </aside>
  );
}

export function ChannelStrip({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex lg:hidden gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      <button
        onClick={() => onSelect("feed")}
        className={`shrink-0 font-mono text-[11px] px-3 py-1.5 clip-tag border transition ${
          active === "feed" ? "bg-lime text-void border-lime font-bold" : "border-edge text-fog"
        }`}
      >
        ALL
      </button>
      <button
        onClick={() => onSelect("synced")}
        className={`shrink-0 font-mono text-[11px] px-3 py-1.5 clip-tag border transition ${
          active === "synced" ? "bg-mag text-void border-mag font-bold" : "border-edge text-fog"
        }`}
      >
        SYNCED ◈
      </button>
      {CHANNELS.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`shrink-0 font-mono text-[11px] px-3 py-1.5 clip-tag border transition ${
            active === c.id ? "font-bold text-void" : "border-edge text-fog"
          }`}
          style={active === c.id ? { background: c.color, borderColor: c.color } : undefined}
        >
          #{c.name}
        </button>
      ))}
    </div>
  );
}
