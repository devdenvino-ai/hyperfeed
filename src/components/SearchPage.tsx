import { useEffect, useState, type ReactNode } from "react";
import { formatVotes, TRENDING, type Channel } from "../data";
import { Avatar, Reveal } from "./ui";
import { IconGhost, IconOrbit, IconSearch, IconSpark } from "./icons";

type CreatorRow = { handle: string; aura: string; tag: string };

type Props = {
  query: string;
  onClear: () => void;
  onSuggest: (q: string) => void;
  postCount: number;
  posts: ReactNode;
  channels: Channel[];
  creators: CreatorRow[];
  joined: Set<string>;
  onToggleJoin: (id: string) => void;
  follows: Set<string>;
  onFollow: (h: string) => void;
  onEnterChannel: (id: string) => void;
};

type Tab = "all" | "posts" | "channels" | "creators";

export default function SearchPage({
  query,
  onClear,
  onSuggest,
  postCount,
  posts,
  channels,
  creators,
  joined,
  onToggleJoin,
  follows,
  onFollow,
  onEnterChannel,
}: Props) {
  const [tab, setTab] = useState<Tab>("all");
  useEffect(() => setTab("all"), [query]);

  const total = postCount + channels.length + creators.length;

  const tabs: { id: Tab; label: string; n: number }[] = [
    { id: "all", label: "ALL", n: total },
    { id: "posts", label: "POSTS", n: postCount },
    { id: "channels", label: "CHANNELS", n: channels.length },
    { id: "creators", label: "CREATORS", n: creators.length },
  ];

  const showPosts = tab === "all" || tab === "posts";
  const showChannels = tab === "all" || tab === "channels";
  const showCreators = tab === "all" || tab === "creators";

  return (
    <div className="pb-16">
      <Reveal>
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-cyber">
          <IconSearch className="w-3.5 h-3.5" />
          GRID SCAN // RESULTS FOR
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-[26px] font-black uppercase leading-none tracking-tight text-cyber sm:text-4xl">
            “{query}”
          </h1>
          <button
            onClick={onClear}
            className="clip-tag border border-edge px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-fog transition hover:border-mag hover:text-mag active:scale-95"
          >
            ✕ CLEAR
          </button>
        </div>
        <p className="mt-2.5 font-mono text-[10px] tracking-[0.18em] text-fog">
          // {total === 0 ? "the void stares back" : `${total} signal${total === 1 ? "" : "s"} matched across the grid`}
        </p>
      </Reveal>

      <div className="mt-5 flex gap-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`clip-tag flex items-center gap-2 px-3.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.18em] transition active:scale-95 ${
              tab === t.id ? "bg-cyber text-void" : "border border-edge text-fog hover:border-cyber/60 hover:text-snow"
            }`}
          >
            {t.label}
            <span className={tab === t.id ? "bg-void/20 px-1.5" : "bg-panel2 px-1.5 text-cyber"}>{t.n}</span>
          </button>
        ))}
      </div>

      {total === 0 ? (
        <div className="clip-notch mt-6 border border-dashed border-edge bg-panel/50 px-6 py-16 text-center">
          <IconGhost className="mx-auto w-12 h-12 text-fog/60" />
          <p className="mt-4 font-display text-lg font-black tracking-tight text-fog">ZERO SIGNALS FOUND</p>
          <p className="mt-2 font-mono text-xs text-fog/70">“{query}” returned nothing. the grid suggests scanning these instead:</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {TRENDING.map((t) => (
              <button
                key={t.tag}
                onClick={() => onSuggest(t.tag)}
                className="clip-tag border border-edge px-3 py-1.5 font-mono text-[11px] text-fog transition hover:border-lime hover:text-lime active:scale-95"
              >
                #{t.tag}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {showChannels && channels.length > 0 && (
            <section>
              <p className="pb-3 font-mono text-[10px] tracking-[0.25em] text-fog">
                <IconOrbit className="mr-2 inline w-3.5 h-3.5 text-cyber" />
                FREQUENCIES — {channels.length}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {channels.map((c) => (
                  <div key={c.id} className="hoverlift clip-notch group border border-edge bg-panel p-4 transition hover:border-fog/40">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rotate-45 transition-transform duration-300 group-hover:rotate-[135deg]" style={{ background: c.color, boxShadow: `0 0 10px ${c.color}66` }} />
                      <p className="font-mono text-sm font-bold" style={{ color: c.color }}>#{c.name}</p>
                      <span className="ml-auto font-mono text-[9px] text-fog">{formatVotes(c.members)} members</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-fog">{c.desc}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => onEnterChannel(c.id)}
                        className="clip-tag px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.2em] text-void transition active:scale-95"
                        style={{ background: c.color }}
                      >
                        ENTER →
                      </button>
                      <button
                        onClick={() => onToggleJoin(c.id)}
                        className={`clip-tag border px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.2em] transition active:scale-95 ${
                          joined.has(c.id) ? "text-void" : "border-edge text-fog hover:text-snow"
                        }`}
                        style={joined.has(c.id) ? { background: c.color, borderColor: c.color } : undefined}
                      >
                        {joined.has(c.id) ? "JOINED ◈" : "JOIN"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {showCreators && creators.length > 0 && (
            <section>
              <p className="pb-3 font-mono text-[10px] tracking-[0.25em] text-fog">
                <IconSpark className="mr-2 inline w-3.5 h-3.5 text-amberx" />
                OPERATIVES — {creators.length}
              </p>
              <div className="space-y-2">
                {creators.map((c) => {
                  const synced = follows.has(c.handle);
                  return (
                    <div key={c.handle} className="hoverlift flex items-center gap-3 border border-edge bg-panel px-4 py-3 transition hover:border-fog/40">
                      <Avatar name={c.handle} sizeClass="w-9 h-9 text-sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-xs font-bold text-snow">@{c.handle}</p>
                        <p className="font-mono text-[9px] text-fog">
                          {c.tag} · <span className="text-cyber">{c.aura} aura</span>
                        </p>
                      </div>
                      <button
                        onClick={() => onFollow(c.handle)}
                        className={`clip-tag border px-3 py-1.5 font-mono text-[9px] font-bold tracking-widest transition active:scale-95 ${
                          synced ? "border-lime bg-lime text-void" : "border-edge text-fog hover:border-lime hover:text-lime"
                        }`}
                      >
                        {synced ? "SYNCED" : "SYNC"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {showPosts && (
            <section>
              <p className="pb-3 font-mono text-[10px] tracking-[0.25em] text-fog">TRANSMISSIONS — {postCount}</p>
              {postCount > 0 ? (
                <div className="space-y-4">{posts}</div>
              ) : (
                <p className="clip-notch border border-dashed border-edge bg-panel/50 px-4 py-6 text-center font-mono text-xs text-fog">
                  no posts matched — the channels or operatives above might hold the signal.
                </p>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
