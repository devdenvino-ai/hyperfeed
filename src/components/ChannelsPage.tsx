import { CHANNELS, formatVotes, type Channel, type Post } from "../data";
import { Reveal } from "./ui";
import { IconOrbit, IconSignal, IconTrend } from "./icons";

type Props = {
  posts: Post[];
  joined: Set<string>;
  onToggleJoin: (id: string) => void;
  onEnter: (id: string) => void;
};

function ChannelCard({ c, postCount, isJoined, onToggleJoin, onEnter, delay }: {
  c: Channel;
  postCount: number;
  isJoined: boolean;
  onToggleJoin: () => void;
  onEnter: () => void;
  delay: number;
}) {
  const signal = Math.min(5, 1 + Math.round((c.online / c.members) * 40));
  return (
    <Reveal delay={delay}>
      <div
        className="hoverlift clip-notch group relative flex h-full flex-col border border-edge bg-panel p-5 transition-colors"
        style={{ boxShadow: `inset 3px 0 0 ${c.color}` }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = c.color + "66")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
      >
        <div className="flex items-start justify-between">
          <span
            className="grid h-10 w-10 place-items-center border transition-transform duration-300 group-hover:rotate-[180deg]"
            style={{ borderColor: c.color + "55", background: c.color + "10", color: c.color }}
          >
            <IconOrbit className="w-5 h-5" />
          </span>
          <span
            className="clip-tag flex items-center gap-1.5 px-2 py-1 font-mono text-[9px] font-bold tracking-[0.2em]"
            style={{ background: c.color + "14", color: c.color, border: `1px solid ${c.color}44` }}
          >
            <span className="h-1 w-1 rounded-full animate-blink" style={{ background: c.color }} />
            LIVE
          </span>
        </div>

        <h2 className="mt-4 font-display text-xl font-black tracking-tight" style={{ color: c.color }}>
          #{c.name}
        </h2>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-fog">{c.desc}</p>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-edge/70 pt-3.5 font-mono text-[10px]">
          <div>
            <p className="text-fog/60">MEMBERS</p>
            <p className="mt-0.5 font-bold text-snow">{formatVotes(c.members)}</p>
          </div>
          <div>
            <p className="text-fog/60">ONLINE</p>
            <p className="mt-0.5 font-bold text-lime">{formatVotes(c.online)}</p>
          </div>
          <div>
            <p className="text-fog/60">DROPS</p>
            <p className="mt-0.5 font-bold text-snow">{postCount}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="font-mono text-[9px] tracking-[0.2em] text-fog/60">SIGNAL</span>
          <div className="flex flex-1 gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="h-2 flex-1"
                style={{
                  background: i < signal ? c.color : "#24264d",
                  boxShadow: i < signal ? `0 0 8px ${c.color}88` : "none",
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onToggleJoin}
            className={`clip-tag flex-1 py-2 font-mono text-[10px] font-bold tracking-[0.2em] transition active:scale-95 ${
              isJoined ? "text-void" : "border border-edge text-fog hover:text-snow"
            }`}
            style={isJoined ? { background: c.color } : undefined}
          >
            {isJoined ? "JOINED ◈" : "JOIN"}
          </button>
          <button
            onClick={onEnter}
            className="clip-tag border border-edge px-3.5 py-2 font-mono text-[10px] font-bold tracking-[0.2em] text-snow transition hover:bg-panel2 active:scale-95"
          >
            ENTER ▸
          </button>
        </div>
      </div>
    </Reveal>
  );
}

export default function ChannelsPage({ posts, joined, onToggleJoin, onEnter }: Props) {
  const countFor = (id: string) => posts.filter((p) => p.channelId === id).length;
  const totalMembers = CHANNELS.reduce((a, c) => a + c.members, 0);

  return (
    <div className="pb-16">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-cyber">
              <IconSignal className="w-3.5 h-3.5" />
              SECTOR MAP // 6 FREQUENCIES
            </p>
            <h1 className="mt-2 font-display text-[26px] font-black uppercase leading-none tracking-tight sm:text-4xl">
              THE <span className="text-cyber">CHANNELS</span>
            </h1>
            <p className="mt-2.5 font-mono text-[10px] tracking-[0.18em] text-fog">
              // {formatVotes(totalMembers)} souls across the grid · pick a frequency, any frequency
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-fog">
            <IconTrend className="w-3 h-3 text-lime" />
            <span>
              <span className="font-bold text-lime">{joined.size}</span> / {CHANNELS.length} synced
            </span>
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CHANNELS.map((c, i) => (
          <ChannelCard
            key={c.id}
            c={c}
            postCount={countFor(c.id)}
            isJoined={joined.has(c.id)}
            onToggleJoin={() => onToggleJoin(c.id)}
            onEnter={() => onEnter(c.id)}
            delay={Math.min(i, 5) * 80}
          />
        ))}
      </div>
    </div>
  );
}
