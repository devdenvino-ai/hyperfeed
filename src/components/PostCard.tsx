import { useState, type CSSProperties } from "react";
import {
  AWARDS,
  channelOf,
  countComments,
  formatVotes,
  type Post,
} from "../data";
import { Avatar, LevelChip } from "./ui";
import {
  IconBolt,
  IconComment,
  IconDown,
  IconSave,
  IconSaveFill,
  IconShare,
  IconUp,
} from "./icons";

type Props = {
  post: Post;
  vote: number;
  pollVote?: string;
  saved: boolean;
  locked?: boolean;
  compact?: boolean;
  onVote: (id: string, dir: 1 | -1) => void;
  onOpen: (id: string) => void;
  onAward: (id: string) => void;
  onShare: (id: string) => void;
  onSave: (id: string) => void;
  onPollVote: (postId: string, optionId: string) => void;
  onChannel: (id: string) => void;
};

export default function PostCard({
  post,
  vote,
  pollVote,
  saved,
  locked,
  compact,
  onVote,
  onOpen,
  onAward,
  onShare,
  onSave,
  onPollVote,
  onChannel,
}: Props) {
  const channel = channelOf(post.channelId);
  const [burst, setBurst] = useState<{ dir: 1 | -1; key: number } | null>(null);

  const handleVote = (dir: 1 | -1) => {
    onVote(post.id, dir);
    setBurst({ dir, key: Date.now() });
    window.setTimeout(() => setBurst((b) => (b && Date.now() - b.key >= 550 ? null : b)), 600);
  };

  const actionBtn =
    "flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[11px] text-fog transition clip-tag hover:bg-panel2";

  return (
    <article
      className="hoverlift clip-notch group relative flex border border-edge bg-panel hover:shadow-[0_0_34px_-14px_var(--c)]"
      style={{ "--c": channel.color } as CSSProperties}
    >
      {/* corner tick */}
      <span
        className="pointer-events-none absolute right-0 top-0 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: `linear-gradient(225deg, ${channel.color} 48%, transparent 50%)` }}
      />

      {/* vote rail */}
      <div className="flex w-13 shrink-0 flex-col items-center gap-1 border-r border-edge/60 bg-abyss/50 py-4 px-1.5">
        <button
          onClick={() => handleVote(1)}
          aria-label="upvote"
          className={`relative p-1.5 transition-all active:scale-90 clip-tag ${
            vote === 1 ? "bg-lime text-void" : "text-fog hover:bg-panel2 hover:text-lime"
          }`}
        >
          <IconUp className="w-5 h-5" />
          {burst?.dir === 1 && (
            <span key={burst.key} className="animate-burst absolute left-1/2 top-0 font-mono text-[10px] font-bold text-lime">
              +1
            </span>
          )}
        </button>
        <span
          key={post.votes}
          className={`animate-votepop font-mono text-[13px] font-bold ${
            vote === 1 ? "text-lime" : vote === -1 ? "text-mag" : "text-snow"
          }`}
        >
          {formatVotes(post.votes)}
        </span>
        <button
          onClick={() => handleVote(-1)}
          aria-label="downvote"
          className={`relative p-1.5 transition-all active:scale-90 clip-tag ${
            vote === -1 ? "bg-mag text-void" : "text-fog hover:bg-panel2 hover:text-mag"
          }`}
        >
          <IconDown className="w-5 h-5" />
          {burst?.dir === -1 && (
            <span key={burst.key} className="animate-burst absolute left-1/2 top-2 font-mono text-[10px] font-bold text-mag">
              -1
            </span>
          )}
        </button>
      </div>

      {/* body */}
      <div className="min-w-0 flex-1 p-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <button
            onClick={() => onChannel(post.channelId)}
            className="flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-wide transition hover:opacity-80"
            style={{ color: channel.color }}
          >
            <span className="h-1.5 w-1.5 rotate-45" style={{ background: channel.color }} />
            #{channel.name}
          </button>
          {post.flair && (
            <span
              className="clip-tag border px-2 py-px font-mono text-[9px] font-bold tracking-[0.15em]"
              style={{
                color: post.flairColor,
                borderColor: (post.flairColor ?? "#fff") + "55",
                background: (post.flairColor ?? "#fff") + "12",
              }}
            >
              {post.flair}
            </span>
          )}
          {locked && (
            <span className="clip-tag border border-amberx/60 bg-amberx/10 px-2 py-px font-mono text-[9px] font-bold tracking-[0.15em] text-amberx">
              LOCKED
            </span>
          )}
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-fog">
            <Avatar name={post.author} sizeClass="w-4.5 h-4.5 text-[8px]" />
            @{post.author}
          </span>
          <LevelChip level={post.level} />
          <span className="font-mono text-[10px] text-fog/70">· {post.time}</span>
          {post.rising && (
            <span className="flex items-center gap-1 font-mono text-[9px] font-bold tracking-widest text-lime animate-pulseglow">
              ▲ RISING
            </span>
          )}
        </div>

        <button onClick={() => onOpen(post.id)} className="mt-2 block text-left">
          <h3 className="text-[17px] font-bold leading-snug transition-colors hover:text-lime">
            {post.title}
          </h3>
        </button>

        {post.body && (
          <p className="mt-1.5 text-sm leading-relaxed text-fog line-clamp-3">{post.body}</p>
        )}

          {post.image && !compact && (
            <div className="clip-notch-sm mt-3 overflow-hidden border border-edge">            <img
              src={post.image}
              alt=""
              loading="lazy"
              className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
        )}

        {post.poll && <PollBlock post={post} pollVote={pollVote} onPollVote={onPollVote} />}

        {(post.tags.length > 0 || post.awards.length > 0) && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {post.awards.map((a) => (
              <span
                key={a.type}
                className="clip-tag flex items-center gap-1 border px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest"
                style={{
                  color: AWARDS[a.type].color,
                  borderColor: AWARDS[a.type].color + "55",
                  background: AWARDS[a.type].color + "10",
                }}
              >
                <IconBolt className="w-2.5 h-2.5" />
                {a.type} ×{a.count}
              </span>
            ))}
            {post.tags.map((t) => (
              <span
                key={t}
                className="cursor-default border border-edge px-1.5 py-0.5 font-mono text-[10px] text-fog transition hover:border-lime hover:text-lime"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center border-t border-edge/60 pt-2.5">
          <button onClick={() => onOpen(post.id)} className={`${actionBtn} hover:text-cyber`}>
            <IconComment className="w-4 h-4" />
            {formatVotes(countComments(post.comments))} replies
          </button>
          <button onClick={() => onAward(post.id)} className={`${actionBtn} hover:text-amberx`}>
            <IconBolt className="w-4 h-4" />
            award
          </button>
          <button onClick={() => onShare(post.id)} className={`${actionBtn} hover:text-mag`}>
            <IconShare className="w-4 h-4" />
            share
          </button>
          <div className="flex-1" />
          <button
            onClick={() => onSave(post.id)}
            aria-label="save post"
            className={`p-1.5 transition active:scale-90 ${
              saved ? "text-cyber" : "text-fog hover:text-cyber"
            }`}
          >
            {saved ? <IconSaveFill className="w-4 h-4" /> : <IconSave className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </article>
  );
}

function PollBlock({
  post,
  pollVote,
  onPollVote,
}: {
  post: Post;
  pollVote?: string;
  onPollVote: (postId: string, optionId: string) => void;
}) {
  const options = post.poll ?? [];
  const voted = pollVote !== undefined;
  const total = options.reduce((a, o) => a + o.votes, 0);

  return (
    <div className="mt-3 space-y-1.5">
      {options.map((o) => {
        const pct = total > 0 ? Math.round((o.votes / total) * 100) : 0;
        const mine = pollVote === o.id;
        return (
          <button
            key={o.id}
            disabled={voted}
            onClick={() => onPollVote(post.id, o.id)}
            className={`relative block w-full overflow-hidden border px-3 py-2 text-left transition ${
              voted
                ? mine
                  ? "border-cyber/70"
                  : "border-edge"
                : "border-edge hover:border-cyber/70 hover:bg-panel2/60 active:scale-[0.99]"
            }`}
          >
            {voted && (
              <span
                className="absolute inset-y-0 left-0 origin-left animate-bargrow bg-cyber/15"
                style={{ width: `${pct}%`, background: mine ? "rgba(56,225,255,0.28)" : undefined }}
              />
            )}
            <span className="relative flex items-center justify-between gap-3 text-sm">
              <span className={mine ? "font-bold text-cyber" : "text-snow/90"}>
                {o.label}
                {mine && <span className="ml-2 font-mono text-[9px] tracking-widest">◈ YOUR VOTE</span>}
              </span>
              {voted && <span className="font-mono text-xs font-bold text-cyber">{pct}%</span>}
            </span>
          </button>
        );
      })}
      <p className="pt-0.5 font-mono text-[10px] text-fog">
        {formatVotes(total)} votes {voted ? "· timeline locked" : "· tap a timeline to vote"}
      </p>
    </div>
  );
}
