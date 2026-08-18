import type { RefObject } from "react";
import { TICKER, formatVotes } from "../data";
import { Avatar } from "./ui";
import { IconBell, IconBolt, IconLogo, IconPlus, IconSearch, IconTrend, IconTrendDown, IconX } from "./icons";

type Props = {
  aura: number;
  query: string;
  unread: number;
  inputRef?: RefObject<HTMLInputElement>;
  onQuery: (q: string) => void;
  onCompose: () => void;
  onHome: () => void;
  onInbox: () => void;
  onProfile: () => void;
};

export default function TopBar({ aura, query, unread, inputRef, onQuery, onCompose, onHome, onInbox, onProfile }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-void/85 backdrop-blur-md">
      <div className="mx-auto flex h-[58px] max-w-[1500px] items-center gap-3 px-4 lg:px-6">
        <button onClick={onHome} className="group flex items-center gap-2.5 shrink-0" aria-label="HYPERFEED home">
          <span className="transition-transform duration-300 group-hover:rotate-[30deg]">
            <IconLogo className="w-8 h-8" />
          </span>
          <span className="hidden sm:block text-left leading-none">
            <span className="block font-display text-[15px] font-black tracking-tight animate-flicker">
              HYPER<span className="text-lime">FEED</span>
            </span>
            <span className="mt-0.5 block font-mono text-[8px] tracking-[0.3em] text-fog">THE FEED FROM 2087</span>
          </span>
        </button>

        <div className="relative mx-auto w-full max-w-md">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-fog" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="search the grid…"
            className="w-full border border-edge bg-panel py-2 pl-9 pr-16 font-mono text-xs text-snow placeholder:text-fog/60 outline-none transition focus:border-cyber/70 focus:shadow-[0_0_20px_-8px_#38e1ff] clip-notch-sm"
          />
          {query ? (
            <button
              onClick={() => onQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 border border-edge p-1 text-fog transition hover:border-mag hover:text-mag active:scale-90"
              aria-label="clear search"
            >
              <IconX className="w-3 h-3" />
            </button>
          ) : (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 border border-edge px-1.5 py-0.5 font-mono text-[9px] text-fog">
              /scan
            </kbd>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div
            key={aura}
            className="animate-votepop hidden md:flex items-center gap-1.5 border border-edge bg-panel px-3 py-2 clip-tag"
            title="your aura"
          >
            <IconBolt className="w-3.5 h-3.5 text-lime" />
            <span className="font-mono text-xs font-bold text-lime">{formatVotes(aura)}</span>
          </div>

          <button
            onClick={onInbox}
            className="relative border border-edge bg-panel p-2.5 text-fog transition hover:border-mag/60 hover:text-mag clip-tag"
            aria-label="open inbox"
          >
            <IconBell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center bg-mag px-0.5 font-mono text-[8px] font-bold text-void">
                {unread}
              </span>
            )}
          </button>

          <button
            onClick={onProfile}
            className="group hidden border border-edge bg-panel p-1 transition hover:border-lime/60 clip-tag sm:block"
            aria-label="open profile"
          >
            <Avatar name="y2k_survivor" sizeClass="w-7 h-7 text-[10px] transition-transform group-hover:scale-110" />
          </button>

          <button
            onClick={onCompose}
            className="group flex items-center gap-1.5 bg-lime px-3.5 py-2.5 font-mono text-[11px] font-bold tracking-widest text-void clip-notch-sm transition hover:bg-cyber hover:shadow-[0_0_24px_-6px_#38e1ff] active:scale-95"
          >
            <IconPlus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
            <span className="hidden sm:inline">DROP A POST</span>
            <span className="sm:hidden">DROP</span>
          </button>
        </div>
      </div>

      <div className="ticker relative overflow-hidden border-t border-edge/60 bg-abyss/80">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-void to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-void to-transparent" />
        <div className="flex items-center">
          <span className="z-20 flex shrink-0 items-center gap-1.5 border-r border-edge bg-panel px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.25em] text-mag">
            <span className="h-1.5 w-1.5 rounded-full bg-mag animate-blink" />
            LIVE
          </span>
          <div className="overflow-hidden">
            <div className="ticker-track items-center">
              {[...TICKER, ...TICKER].map((t, i) => (
                <span key={i} className="flex items-center gap-1.5 whitespace-nowrap px-5 py-1.5 font-mono text-[10px] text-fog">
                  {t.up ? (
                    <IconTrend className="w-2.5 h-2.5 text-lime" />
                  ) : (
                    <IconTrendDown className="w-2.5 h-2.5 text-mag" />
                  )}
                  <span className={t.up ? "text-snow/80" : "text-fog"}>{t.text}</span>
                  <span className="pl-4 text-edge">///</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
