import { useEffect, useState, type CSSProperties } from "react";
import {
  AWARDS,
  channelOf,
  countComments,
  formatVotes,
  type CommentNode,
  type Post,
} from "../data";
import { Avatar, LevelChip } from "./ui";
import { IconBolt, IconDown, IconReply, IconSend, IconUp, IconX } from "./icons";

type Props = {
  post: Post;
  vote: number;
  pollVote?: string;
  locked?: boolean;
  onVote: (id: string, dir: 1 | -1) => void;
  onClose: () => void;
  onAddComment: (postId: string, parentId: string | null, text: string) => void;
  onPollVote: (postId: string, optionId: string) => void;
};

export default function PostModal({ post, vote, pollVote, locked, onVote, onClose, onAddComment, onPollVote }: Props) {
  const channel = channelOf(post.channelId);
  const [text, setText] = useState("");
  const [commentVotes, setCommentVotes] = useState<Record<string, number>>({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = () => {
    if (locked) return;
    const t = text.trim();
    if (t.length < 2) return;
    onAddComment(post.id, null, t);
    setText("");
  };

  const total = countComments(post.comments);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-void/85 backdrop-blur-sm" onClick={onClose} />

      <div
        className="animate-rise clip-notch relative flex max-h-[88vh] w-full max-w-2xl flex-col border border-edge bg-panel shadow-[0_0_60px_-20px_var(--c)]"
        style={{ "--c": channel.color } as CSSProperties}
      >
        <div className="flex items-center gap-2 border-b border-edge bg-abyss/70 px-4 py-3">
          <span className="h-2 w-2 rotate-45" style={{ background: channel.color }} />
          <span className="font-mono text-xs font-bold" style={{ color: channel.color }}>
            #{channel.name}
          </span>
          <span className="font-mono text-[10px] text-fog">· thread #{post.id.toUpperCase()}</span>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="border border-edge p-1.5 text-fog transition hover:border-mag hover:text-mag clip-tag active:scale-90"
            aria-label="close thread"
          >
            <IconX className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <h2 className="text-xl font-bold leading-snug sm:text-2xl">{post.title}</h2>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-fog">
              <Avatar name={post.author} sizeClass="w-5 h-5 text-[9px]" />
              @{post.author}
            </span>
            <LevelChip level={post.level} />
            <span className="font-mono text-[10px] text-fog/70">{post.time} ago</span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <button
                onClick={() => onVote(post.id, 1)}
                className={`flex items-center gap-1 border px-2 py-0.5 transition active:scale-95 clip-tag ${
                  vote === 1 ? "border-lime bg-lime/15 text-lime" : "border-edge text-fog hover:text-lime"
                }`}
              >
                <IconUp className="w-3 h-3" />
              </button>
              <span key={post.votes} className="animate-votepop font-bold text-snow">{formatVotes(post.votes)}</span>
              <button
                onClick={() => onVote(post.id, -1)}
                className={`flex items-center gap-1 border px-2 py-0.5 transition active:scale-95 clip-tag ${
                  vote === -1 ? "border-mag bg-mag/15 text-mag" : "border-edge text-fog hover:text-mag"
                }`}
              >
                <IconDown className="w-3 h-3" />
              </button>
            </span>
            {post.awards.map((a) => (
              <span
                key={a.type}
                className="clip-tag border px-1.5 py-0.5 font-mono text-[9px] font-bold"
                style={{
                  color: AWARDS[a.type].color,
                  borderColor: AWARDS[a.type].color + "55",
                  background: AWARDS[a.type].color + "10",
                }}
              >
                {a.type} ×{a.count}
              </span>
            ))}
          </div>

          {post.image && (
            <div className="clip-notch-sm mt-4 overflow-hidden border border-edge">
              <img src={post.image} alt="" className="w-full object-cover" />
            </div>
          )}

          {post.poll && (
            <div className="mt-4 space-y-1.5">
              {(() => {
                const voted = pollVote !== undefined;
                const tot = post.poll!.reduce((a, o) => a + o.votes, 0);
                return post.poll!.map((o) => {
                  const pct = tot > 0 ? Math.round((o.votes / tot) * 100) : 0;
                  const mine = pollVote === o.id;
                  return (
                    <button
                      key={o.id}
                      disabled={voted}
                      onClick={() => onPollVote(post.id, o.id)}
                      className={`relative block w-full overflow-hidden border px-3 py-2 text-left transition ${
                        voted ? (mine ? "border-cyber/70" : "border-edge") : "border-edge hover:border-cyber/70"
                      }`}
                    >
                      {voted && (
                        <span
                          className="absolute inset-y-0 left-0 origin-left animate-bargrow bg-cyber/15"
                          style={{ width: `${pct}%`, background: mine ? "rgba(56,225,255,0.28)" : undefined }}
                        />
                      )}
                      <span className="relative flex items-center justify-between text-sm">
                        <span className={mine ? "font-bold text-cyber" : "text-snow/90"}>{o.label}</span>
                        {voted && <span className="font-mono text-xs font-bold text-cyber">{pct}%</span>}
                      </span>
                    </button>
                  );
                });
              })()}
            </div>
          )}

          {post.body && <p className="mt-4 text-sm leading-relaxed text-fog">{post.body}</p>}

          {/* composer */}
          <div className="mt-6 border-t border-edge pt-4">
            <p className="pb-2.5 font-mono text-[10px] tracking-[0.25em] text-fog">
              {formatVotes(total)} REPLIES // {locked ? "SIGNAL FROZEN" : "JOIN THE CHAOS"}
            </p>
            {locked ? (
              <div className="clip-tag border border-amberx/50 bg-amberx/10 px-4 py-3 font-mono text-[11px] text-amberx">
                ◈ CHANNEL LOCKED BY MODS — replies are frozen. lurk respectfully.
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Avatar name="y2k_survivor" sizeClass="w-8 h-8 text-xs" />
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="drop your take… no thoughts, only vibes"
                  className="min-w-0 flex-1 border border-edge bg-abyss px-3 py-2.5 font-mono text-xs text-snow placeholder:text-fog/50 outline-none transition focus:border-lime/70 clip-tag"
                />
                <button
                  onClick={submit}
                  className="bg-lime p-2.5 text-void transition hover:bg-cyber active:scale-90 clip-tag"
                  aria-label="send reply"
                >
                  <IconSend className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* thread */}
          <div className="mt-5 space-y-4">
            {post.comments.map((c, i) => (
              <CommentItem
                key={c.id}
                node={c}
                index={i}
                postId={post.id}
                votes={commentVotes}
                onVoteComment={(id, dir) =>
                  setCommentVotes((v) => ({ ...v, [id]: v[id] === dir ? 0 : dir }))
                }
                onReply={(parentId, replyText) => onAddComment(post.id, parentId, replyText)}
              />
            ))}
            {post.comments.length === 0 && (
              <p className="py-6 text-center font-mono text-xs text-fog">
                no replies yet. be the first to be unhinged.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  node,
  index,
  postId,
  votes,
  onVoteComment,
  onReply,
}: {
  node: CommentNode;
  index: number;
  postId: string;
  votes: Record<string, number>;
  onVoteComment: (id: string, dir: 1 | -1) => void;
  onReply: (parentId: string, text: string) => void;
}) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const v = votes[node.id] ?? 0;
  const shown = node.votes + v;

  const send = () => {
    const t = replyText.trim();
    if (t.length < 2) return;
    onReply(node.id, t);
    setReplyText("");
    setReplying(false);
  };

  return (
    <div className="animate-rise flex gap-2.5" style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}>
      <Avatar name={node.author} sizeClass="w-7 h-7 text-[10px]" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-cyber">@{node.author}</span>
          <LevelChip level={node.level} />
          <span className="font-mono text-[10px] text-fog/70">{node.time}</span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-snow/90">{node.text}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <button
            onClick={() => onVoteComment(node.id, 1)}
            className={`flex items-center gap-1 font-mono text-[10px] transition active:scale-90 ${
              v === 1 ? "text-lime" : "text-fog hover:text-lime"
            }`}
          >
            <IconUp className="w-3 h-3" />
            <span key={shown} className="animate-votepop font-bold">{formatVotes(shown)}</span>
          </button>
          <button
            onClick={() => onVoteComment(node.id, -1)}
            className={`transition active:scale-90 ${v === -1 ? "text-mag" : "text-fog hover:text-mag"}`}
          >
            <IconDown className="w-3 h-3" />
          </button>
          <button
            onClick={() => setReplying((r) => !r)}
            className={`flex items-center gap-1 font-mono text-[10px] transition ${
              replying ? "text-cyber" : "text-fog hover:text-cyber"
            }`}
          >
            <IconReply className="w-3 h-3" />
            reply
          </button>
          <span className="flex items-center gap-1 font-mono text-[9px] text-fog/50">
            <IconBolt className="w-2.5 h-2.5" />
            aura verified
          </span>
        </div>

        {replying && (
          <div className="mt-2 flex items-center gap-2">
            <input
              autoFocus
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
                if (e.key === "Escape") setReplying(false);
              }}
              placeholder={`reply to @${node.author}…`}
              className="min-w-0 flex-1 border border-edge bg-abyss px-3 py-2 font-mono text-xs text-snow placeholder:text-fog/50 outline-none focus:border-cyber/70 clip-tag"
            />
            <button onClick={send} className="bg-cyber p-2 text-void transition hover:bg-lime active:scale-90 clip-tag" aria-label="send">
              <IconSend className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {node.replies.length > 0 && (
          <div className="mt-3 space-y-3 border-l border-edge/70 pl-3.5">
            {node.replies.map((r, i) => (
              <CommentItem
                key={r.id}
                node={r}
                index={i}
                postId={postId}
                votes={votes}
                onVoteComment={onVoteComment}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
