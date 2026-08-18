import { useEffect, useRef, useState } from "react";
import {
  AURA_HISTORY,
  AWARDS,
  channelOf,
  countComments,
  CYCLE_LABELS,
  DAY_LABELS,
  formatVotes,
  ME,
  WEEK_ACTIVITY,
  type MyReply,
  type Post,
} from "../data";
import { Avatar, LevelChip, Reveal } from "./ui";
import { IconBolt, IconComment, IconFlame, IconOrbit, IconSave, IconSend, IconSignal, IconSpark, IconUp } from "./icons";

type Props = {
  posts: Post[];
  saved: Set<string>;
  aura: number;
  handle: string;
  bio: string;
  onBio: (b: string) => void;
  myReplies: MyReply[];
  joined: Set<string>;
  onOpenPost: (id: string) => void;
};

function useCountUp(target: number, dur = 950) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / dur);
          setVal(Math.round(target * (1 - Math.pow(1 - k, 3))));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, dur]);
  return { ref, val };
}

function StatTile({
  label,
  value,
  icon,
  color,
  delay,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  delay: number;
}) {
  const { ref, val } = useCountUp(value);
  return (
    <div
      ref={ref}
      className="reveal in hoverlift clip-notch border border-edge bg-panel px-4 py-3.5"
      style={{ animationDelay: `${delay}ms`, transitionDelay: `${delay}ms`, ["--lift" as string]: "0" }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.22em] text-fog">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-black tabular-nums" style={{ color }}>
        {formatVotes(val)}
      </p>
    </div>
  );
}

function AuraChart() {
  const W = 340;
  const H = 130;
  const max = Math.max(...AURA_HISTORY) * 1.15;
  const pts = AURA_HISTORY.map((v, i) => [
    (i / (AURA_HISTORY.length - 1)) * (W - 16) + 8,
    H - 18 - (v / max) * (H - 34),
  ]);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${H - 12} L${pts[0][0]},${H - 12} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <linearGradient id="auraFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9f536" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c9f536" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="auraLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38e1ff" />
          <stop offset="100%" stopColor="#c9f536" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((k) => (
        <line key={k} x1="8" x2={W - 8} y1={H - 18 - k * (H - 34)} y2={H - 18 - k * (H - 34)} stroke="#24264d" strokeWidth="0.5" strokeDasharray="3 5" />
      ))}
      <path d={area} fill="url(#auraFill)" />
      <path d={line} fill="none" stroke="url(#auraLine)" strokeWidth="2" className="drawline" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 3.4 : 1.8} fill={i === pts.length - 1 ? "#c9f536" : "#38e1ff"} className={i === pts.length - 1 ? "animate-pulseglow" : ""} />
      ))}
      <text x={last[0] - 4} y={last[1] - 9} textAnchor="end" fill="#c9f536" fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
        {AURA_HISTORY[AURA_HISTORY.length - 1]}k
      </text>
      {CYCLE_LABELS.map((l, i) =>
        i % 3 === 0 ? (
          <text key={l} x={pts[i][0]} y={H - 3} textAnchor="middle" fill="#8f93ba" fontSize="6.5" fontFamily="JetBrains Mono, monospace" opacity="0.7">
            {l}
          </text>
        ) : null
      )}
    </svg>
  );
}

function WeekBars() {
  const max = Math.max(...WEEK_ACTIVITY);
  return (
    <div className="flex h-[130px] items-end gap-2.5 pt-2">
      {WEEK_ACTIVITY.map((v, i) => (
        <div key={i} className="group flex flex-1 flex-col items-center gap-2">
          <span className="font-mono text-[9px] font-bold text-fog opacity-0 transition group-hover:opacity-100">{v}</span>
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full origin-bottom animate-bargrow transition-all group-hover:brightness-150"
              style={{
                height: `${(v / max) * 100}%`,
                animationDelay: `${i * 90}ms`,
                background:
                  v === max
                    ? "linear-gradient(180deg, #ff3dd8, #9d7bff)"
                    : "linear-gradient(180deg, #38e1ff, #24264d)",
                boxShadow: v === max ? "0 0 18px -4px #ff3dd8" : "none",
              }}
            />
          </div>
          <span className={`font-mono text-[8px] tracking-widest ${v === max ? "text-mag font-bold" : "text-fog/60"}`}>
            {DAY_LABELS[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

type Tab = "posts" | "replies" | "saved";

export default function ProfilePage({ posts, saved, aura, handle, bio, onBio, myReplies, joined, onOpenPost }: Props) {
  const [tab, setTab] = useState<Tab>("posts");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(bio);

  const myPosts = posts.filter((p) => p.author === ME || p.author === handle);
  const savedPosts = posts.filter((p) => saved.has(p.id));
  const badgeTotals = myPosts.reduce<Record<string, number>>((acc, p) => {
    p.awards.forEach((a) => (acc[a.type] = (acc[a.type] ?? 0) + a.count));
    return acc;
  }, {});
  const totalBadges = Object.values(badgeTotals).reduce((a, b) => a + b, 0);

  const commitBio = () => {
    setEditing(false);
    if (draft.trim()) onBio(draft.trim());
  };

  const Row = ({ p, savedOnly }: { p: Post; savedOnly?: boolean }) => {
    const ch = channelOf(p.channelId);
    return (
      <button
        onClick={() => onOpenPost(p.id)}
        className="hoverlift group clip-notch flex w-full items-center gap-4 border border-edge bg-panel px-4 py-3.5 text-left hover:border-fog/40"
      >
        <span className="hidden h-8 w-8 shrink-0 place-items-center border border-edge bg-abyss sm:grid">
          <span className="h-2.5 w-2.5 rotate-45 transition-transform duration-300 group-hover:rotate-[135deg]" style={{ background: ch.color, boxShadow: `0 0 10px ${ch.color}66` }} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-snow transition group-hover:text-lime">{p.title}</span>
          <span className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-fog">
            <span style={{ color: ch.color }}>#{ch.name}</span>
            <span>·</span>
            <span>{p.time} ago</span>
            {p.rising && (
              <span className="text-lime animate-pulseglow">
                <IconFlame className="inline w-3 h-3" /> RISING
              </span>
            )}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-3 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-lime">
            <IconUp className="w-3 h-3" />
            {formatVotes(p.votes)}
          </span>
          <span className="hidden items-center gap-1 text-fog sm:flex">
            <IconComment className="w-3 h-3" />
            {countComments(p.comments)}
          </span>
          {savedOnly && <IconSave className="w-3.5 h-3.5 text-cyber" />}
        </span>
      </button>
    );
  };

  const TABS: { id: Tab; label: string; n: number }[] = [
    { id: "posts", label: "TRANSMISSIONS", n: myPosts.length },
    { id: "replies", label: "REPLIES", n: myReplies.length },
    { id: "saved", label: "ARCHIVED", n: savedPosts.length },
  ];

  return (
    <div className="pb-16">
      {/* ---- banner ---- */}
      <Reveal>
        <div className="clip-notch relative overflow-hidden border border-edge" style={{ background: "#0a0b18" }}>
          <div className="absolute inset-0 gridlines" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(34rem 16rem at 85% -20%, rgba(201,245,54,0.14), transparent 60%), radial-gradient(30rem 14rem at 0% 130%, rgba(56,225,255,0.13), transparent 60%), linear-gradient(90deg, rgba(255,61,216,0.07), transparent 45%)",
            }}
          />
          <div className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-cyber/40 to-transparent" />
          <p className="absolute -bottom-7 right-3 select-none font-display text-[92px] font-black leading-none tracking-tight text-outline opacity-60 sm:text-[130px]">
            {handle.replace(/[^a-z0-9]/gi, "").slice(0, 3).toUpperCase() || "YOU"}
          </p>
          <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-fog">
            <span className="h-1.5 w-1.5 rounded-full bg-lime animate-blink" />
            OPERATIVE FILE // CLEARANCE: MAIN CHARACTER
          </div>
          <div className="absolute right-4 top-4 hidden font-mono text-[9px] tracking-[0.2em] text-fog sm:block">
            REC ● CYCLE 2087.11
          </div>
          <div className="h-40 sm:h-48" />
        </div>
      </Reveal>

      {/* ---- identity ---- */}
      <div className="relative z-10 -mt-14 px-4 sm:px-8">
        <div className="flex flex-wrap items-end gap-5">
          <div className="relative">
            <svg className="absolute -inset-3 animate-[spin_14s_linear_infinite] text-cyber/50" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" strokeDasharray="10 14" />
              <circle cx="50" cy="2" r="3" fill="#c9f536" />
            </svg>
            <Avatar name={handle} sizeClass="w-24 h-24 border-4 border-void text-3xl" />
            <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center border border-lime bg-void">
              <IconBolt className="w-3.5 h-3.5 text-lime" />
            </span>
          </div>

          <div className="min-w-0 flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-2xl font-black tracking-tight sm:text-3xl">{handle}</h1>
              <LevelChip level={42} />
              <span className="clip-tag border border-mag/50 bg-mag/10 px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.2em] text-mag animate-pulseglow">
                ONLINE
              </span>
            </div>
            <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-fog">
              @{handle} · joined cycle 2084 · <span className="text-cyber">{joined.size} channels joined</span>
            </p>

            <div className="mt-3 max-w-xl">
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={draft}
                    maxLength={80}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitBio();
                      if (e.key === "Escape") setEditing(false);
                    }}
                    className="min-w-0 flex-1 border border-lime/60 bg-abyss px-3 py-2 font-mono text-xs text-snow outline-none clip-tag"
                  />
                  <button onClick={commitBio} className="bg-lime p-2 text-void clip-tag transition hover:bg-cyber active:scale-90" aria-label="save status">
                    <IconSend className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setDraft(bio);
                    setEditing(true);
                  }}
                  className="group flex max-w-full items-center gap-2 text-left"
                >
                  <p className="truncate text-sm text-fog">
                    <span className="mr-2 font-mono text-[9px] tracking-[0.25em] text-lime">STATUS //</span>
                    {bio}
                  </p>
                  <span className="shrink-0 border border-edge px-1.5 py-0.5 font-mono text-[8px] text-fog opacity-0 transition group-hover:opacity-100 group-hover:text-cyber group-hover:border-cyber/60">
                    EDIT
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---- stats ---- */}
      <div className="mt-6 grid grid-cols-2 gap-3 px-4 sm:grid-cols-5 sm:px-8">
        <StatTile label="AURA" value={aura} color="#c9f536" delay={0} icon={<IconBolt className="w-3.5 h-3.5" />} />
        <StatTile label="TRANSMISSIONS" value={myPosts.length} color="#38e1ff" delay={80} icon={<IconSignal className="w-3.5 h-3.5" />} />
        <StatTile label="REPLIES" value={myReplies.length} color="#ff3dd8" delay={160} icon={<IconComment className="w-3.5 h-3.5" />} />
        <StatTile label="BADGES" value={totalBadges} color="#ffc24b" delay={240} icon={<IconSpark className="w-3.5 h-3.5" />} />
        <StatTile label="CHANNELS" value={joined.size} color="#9d7bff" delay={320} icon={<IconOrbit className="w-3.5 h-3.5" />} />
      </div>

      {/* ---- charts ---- */}
      <div className="mt-4 grid gap-3 px-4 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <div className="clip-notch border border-edge bg-panel p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-[0.25em] text-fog">AURA TRAJECTORY</p>
              <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-lime">
                <span className="h-1.5 w-1.5 rounded-full bg-lime animate-blink" />
                +433% / 12 CYCLES
              </span>
            </div>
            <div className="mt-3">
              <AuraChart />
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="clip-notch border border-edge bg-panel p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-[0.25em] text-fog">WEEKLY OUTPUT</p>
              <span className="font-mono text-[10px] text-fog">
                peak: <span className="font-bold text-mag">SAT · 12 drops</span>
              </span>
            </div>
            <WeekBars />
          </div>
        </Reveal>
      </div>

      {/* ---- badge case ---- */}
      <Reveal>
        <div className="mt-4 px-4 sm:px-8">
          <div className="clip-notch border border-edge bg-panel p-5">
            <p className="font-mono text-[10px] tracking-[0.25em] text-fog">BADGE CASE // EARNED BY THE COMMUNITY, WORN BY YOU</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {Object.entries(badgeTotals).map(([type, count], i) => {
                const a = AWARDS[type as keyof typeof AWARDS];
                return (
                  <span
                    key={type}
                    className="clip-tag floaty border px-3 py-1.5 font-mono text-[11px] font-bold tracking-widest"
                    style={{
                      color: a.color,
                      borderColor: a.color + "55",
                      background: a.color + "0f",
                      animationDelay: `${i * 500}ms`,
                    }}
                  >
                    ◈ {type} ×{count}
                  </span>
                );
              })}
              {totalBadges === 0 && <span className="font-mono text-xs text-fog">no badges yet — go cook something</span>}
              <span className="clip-tag border border-dashed border-edge px-3 py-1.5 font-mono text-[11px] text-fog/60">+ ??? locked</span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---- tabs ---- */}
      <div className="mt-6 px-4 sm:px-8">
        <div className="flex gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`clip-tag flex items-center gap-2 px-4 py-2 font-mono text-[10px] font-bold tracking-[0.18em] transition active:scale-95 ${
                tab === t.id ? "bg-lime text-void" : "border border-edge text-fog hover:border-lime/50 hover:text-snow"
              }`}
            >
              {t.label}
              <span className={tab === t.id ? "bg-void/20 px-1.5" : "bg-panel2 px-1.5 text-cyber"}>{t.n}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-2.5">
          {tab === "posts" &&
            (myPosts.length ? (
              myPosts.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <Row p={p} />
                </Reveal>
              ))
            ) : (
              <Empty text="no transmissions yet — hit DROP A POST and cook" />
            ))}

          {tab === "replies" &&
            (myReplies.length ? (
              myReplies.map((r, i) => (
                <Reveal key={r.id} delay={i * 60}>
                  <button
                    onClick={() => onOpenPost(r.postId)}
                    className="hoverlift clip-notch block w-full border border-edge bg-panel px-4 py-3.5 text-left hover:border-mag/40"
                  >
                    <p className="text-sm leading-relaxed text-snow/90">“{r.text}”</p>
                    <p className="mt-1.5 font-mono text-[10px] text-fog">
                      <span className="text-mag">↳</span> on <span className="text-cyber">{r.postTitle}</span> · {r.time}
                    </p>
                  </button>
                </Reveal>
              ))
            ) : (
              <Empty text="no replies logged — open a thread and drop your take" />
            ))}

          {tab === "saved" &&
            (savedPosts.length ? (
              savedPosts.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <Row p={p} savedOnly />
                </Reveal>
              ))
            ) : (
              <Empty text="archive is empty — bookmark a banger to stash it here" />
            ))}
        </div>
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="clip-notch border border-dashed border-edge bg-panel/50 px-6 py-10 text-center">
      <p className="font-mono text-xs text-fog">{text}</p>
    </div>
  );
}
