import { type Notif, type NotifKind } from "../data";
import { Avatar, Reveal } from "./ui";
import { IconBell, IconBolt, IconOrbit, IconReply, IconSignal, IconSpark } from "./icons";

type Props = {
  notifs: Notif[];
  onRead: (id: string) => void;
  onReadAll: () => void;
};

const KIND_META: Record<NotifKind, { color: string; label: string }> = {
  reply: { color: "#38e1ff", label: "REPLY" },
  aura: { color: "#c9f536", label: "AURA" },
  mention: { color: "#ffc24b", label: "MENTION" },
  follow: { color: "#ff3dd8", label: "SYNC" },
  system: { color: "#8f93ba", label: "SYSTEM" },
};

function KindIcon({ kind }: { kind: NotifKind }) {
  const cls = "w-4 h-4";
  switch (kind) {
    case "reply":
      return <IconReply className={cls} />;
    case "aura":
      return <IconBolt className={cls} />;
    case "mention":
      return <IconSpark className={cls} />;
    case "follow":
      return <IconOrbit className={cls} />;
    default:
      return <IconSignal className={cls} />;
  }
}

export default function InboxPage({ notifs, onRead, onReadAll }: Props) {
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="pb-16">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-amberx">
              <IconBell className="w-3.5 h-3.5" />
              SIGNAL INBOX // PINGS FROM THE GRID
            </p>
            <h1 className="mt-2 font-display text-[26px] font-black uppercase leading-none tracking-tight sm:text-4xl">
              YOUR <span className="text-amberx">PINGS</span>
            </h1>
            <p className="mt-2.5 font-mono text-[10px] tracking-[0.18em] text-fog">
              // {unread > 0 ? `${unread} unread signal${unread === 1 ? "" : "s"} demanding your attention` : "inbox zero. the grid respects you."}
            </p>
          </div>
          <button
            onClick={onReadAll}
            disabled={unread === 0}
            className={`clip-tag border px-4 py-2 font-mono text-[10px] font-bold tracking-[0.2em] transition active:scale-95 ${
              unread === 0
                ? "cursor-default border-edge text-fog/40"
                : "border-amberx/60 text-amberx hover:bg-amberx hover:text-void"
            }`}
          >
            MARK ALL READ [{unread}]
          </button>
        </div>
      </Reveal>

      <div className="mt-6 space-y-2.5">
        {notifs.map((n, i) => {
          const meta = KIND_META[n.kind];
          return (
            <Reveal key={n.id} delay={Math.min(i, 6) * 50}>
              <button
                onClick={() => onRead(n.id)}
                className={`hoverlift clip-notch group relative flex w-full items-center gap-4 border px-4 py-3.5 text-left transition-colors ${
                  n.read
                    ? "border-edge/70 bg-panel/50 hover:border-edge"
                    : "border-edge bg-panel hover:border-fog/50"
                }`}
                style={n.read ? undefined : { borderLeft: `3px solid ${meta.color}` }}
              >
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center border"
                  style={{
                    borderColor: meta.color + "55",
                    background: meta.color + (n.read ? "08" : "14"),
                    color: meta.color,
                  }}
                >
                  <KindIcon kind={n.kind} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className={`block text-sm leading-snug ${n.read ? "text-fog" : "font-medium text-snow"}`}>
                    {n.who && (
                      <span className="mr-1.5 font-mono text-xs font-bold" style={{ color: meta.color }}>
                        @{n.who}
                      </span>
                    )}
                    {n.text}
                  </span>
                  <span className="mt-1 flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] text-fog/60">
                    <span style={{ color: meta.color }}>{meta.label}</span>
                    <span>·</span>
                    <span>{n.time} AGO</span>
                  </span>
                </span>

                {!n.read && (
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="h-2 w-2 rotate-45 animate-blink" style={{ background: meta.color }} />
                    <span className="hidden font-mono text-[9px] tracking-widest text-fog/50 group-hover:text-snow sm:block">
                      TAP TO CLEAR
                    </span>
                  </span>
                )}
                {n.read && n.who && <Avatar name={n.who} sizeClass="w-7 h-7 text-[10px] shrink-0 opacity-60" />}
              </button>
            </Reveal>
          );
        })}

        {notifs.length === 0 && (
          <div className="clip-notch border border-dashed border-edge bg-panel/50 px-6 py-16 text-center">
            <IconBell className="mx-auto w-10 h-10 text-fog/50" />
            <p className="mt-4 font-display text-lg font-black text-fog">INBOX ZERO</p>
            <p className="mt-2 font-mono text-xs text-fog/70">the grid is quiet. go post something unhinged to fix that.</p>
          </div>
        )}
      </div>
    </div>
  );
}
