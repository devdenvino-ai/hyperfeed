import { useEffect, useMemo, useRef, useState } from "react";
import {
  AWARDS,
  CHANNELS,
  CREATORS,
  channelOf,
  countComments,
  DEFAULT_SETTINGS,
  FLAGGED,
  formatVotes,
  ME,
  NOTIF_POOL,
  type AchievementMetric,
  type AwardType,
  type CommentNode,
  type Flagged,
  type MyReply,
  type Notif,
  type NotifKind,
  type Post,
  type Settings,
} from "./data";
import { api, assemblePosts, type Metrics } from "./api/client";
import TopBar from "./components/TopBar";
import Sidebar, { ChannelStrip, type Page } from "./components/Sidebar";
import RightRail from "./components/RightRail";
import PostCard from "./components/PostCard";
import PostModal from "./components/PostModal";
import Composer, { type NewPost } from "./components/Composer";
import ProfilePage from "./components/ProfilePage";
import AdminPage from "./components/AdminPage";
import ChannelsPage from "./components/ChannelsPage";
import InboxPage from "./components/InboxPage";
import LeaderboardPage from "./components/LeaderboardPage";
import SettingsPage from "./components/SettingsPage";
import SearchPage from "./components/SearchPage";
import AchievementsPage from "./components/AchievementsPage";
import PatchNotesPage from "./components/PatchNotesPage";
import NotFoundPage from "./components/NotFoundPage";
import Footer from "./components/Footer";
import BootScreen from "./components/BootScreen";
import { Reveal } from "./components/ui";
import { IconBolt, IconComment, IconFlame, IconGhost, IconOrbit, IconPlus } from "./components/icons";

type Toast = { id: number; text: string; color: string };
const SORTS = ["hot", "new", "top", "wild"] as const;
type Sort = (typeof SORTS)[number];

const HANDLE_RE = /^[a-z0-9_.]{3,18}$/;

function insertReply(nodes: CommentNode[], parentId: string, node: CommentNode): CommentNode[] {
  return nodes.map((n) =>
    n.id === parentId
      ? { ...n, replies: [...n.replies, node] }
      : { ...n, replies: insertReply(n.replies, parentId, node) }
  );
}

const heat = (p: Post) => p.votes / Math.pow(p.minutesAgo + 30, 0.6);

function MobileNav({
  page,
  unread,
  onNavigate,
  onCompose,
}: {
  page: Page;
  unread: number;
  onNavigate: (p: Page) => void;
  onCompose: () => void;
}) {
  const item = (on: boolean) =>
    `flex flex-col items-center gap-1 py-2 font-mono text-[8px] tracking-[0.15em] transition ${on ? "text-lime" : "text-fog"}`;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-edge bg-void/90 backdrop-blur-md lg:hidden">
      <div className="grid grid-cols-5">
        <button className={item(page === "feed")} onClick={() => onNavigate("feed")}>
          <IconFlame className="w-4.5 h-4.5" />
          <span>FEED</span>
        </button>
        <button className={item(page === "channels")} onClick={() => onNavigate("channels")}>
          <IconOrbit className="w-4.5 h-4.5" />
          <span>CHANNELS</span>
        </button>
        <button onClick={onCompose} className="flex flex-col items-center gap-0.5 pt-1" aria-label="drop a post">
          <span className="grid h-9 w-9 -translate-y-2.5 place-items-center bg-lime text-void clip-tag shadow-[0_0_20px_-4px_#c9f536] transition active:scale-90">
            <IconPlus className="w-4 h-4" />
          </span>
          <span className="font-mono text-[8px] tracking-[0.15em] text-lime">DROP</span>
        </button>
        <button className={item(page === "inbox")} onClick={() => onNavigate("inbox")}>
          <span className="relative">
            <IconComment className="w-4.5 h-4.5" />
            {unread > 0 && (
              <span className="absolute -right-1.5 -top-1 grid h-3 min-w-3 place-items-center bg-mag px-0.5 font-mono text-[7px] font-bold text-void">
                {unread}
              </span>
            )}
          </span>
          <span>INBOX</span>
        </button>
        <button className={item(page === "profile")} onClick={() => onNavigate("profile")}>
          <IconBolt className="w-4.5 h-4.5" />
          <span>YOU</span>
        </button>
      </div>
    </nav>
  );
}

export default function App() {
  /* ---------- core state (hydrated from the grid-db on boot) ---------- */
  const [identity, setIdentity] = useState<{ handle: string; booted: boolean; stored: boolean }>({
    handle: ME,
    booted: false,
    stored: false,
  });
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [posts, setPosts] = useState<Post[]>([]);
  const [myVotes, setMyVotes] = useState<Record<string, number>>({});
  const [pollVotes, setPollVotes] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [follows, setFollows] = useState<Set<string>>(new Set());
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [page, setPage] = useState<Page>("feed");
  const [scope, setScope] = useState<string>("feed"); // "feed" | "saved" | "synced" | channelId
  const [sort, setSort] = useState<Sort>("hot");
  const [query, setQuery] = useState("");
  const [aura, setAura] = useState(48_260);
  const [questClaimed, setQuestClaimed] = useState(false);
  const [bio, setBio] = useState("professional delulu · collecting aura since cycle 2084");
  const [myReplies, setMyReplies] = useState<MyReply[]>([]);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [flagged, setFlagged] = useState<Flagged[]>(FLAGGED);
  const [locked, setLocked] = useState<Set<string>>(new Set());
  const [metrics, setMetrics] = useState<Metrics>({ votes: 0, flags: 0, drifts: 0, read: 0, uploads: 0 });
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const toastId = useRef(0);
  const searchRef = useRef<HTMLInputElement>(null);

  const handle = identity.handle;
  const unread = notifs.filter((n) => !n.read).length;

  /* ---------- hydrate from the grid-db ---------- */
  useEffect(() => {
    let alive = true;
    api.init().then((db) => {
      if (!alive) return;
      setPosts(assemblePosts(db));
      setMyVotes(db.votes);
      setPollVotes(db.pollVotes);
      setSaved(new Set(db.saved));
      setFollows(new Set(db.follows));
      setJoined(new Set(db.joined));
      setAura(db.aura);
      setQuestClaimed(db.questClaimed);
      setBio(db.bio);
      setMyReplies(db.myReplies);
      setNotifs(db.notifs);
      setLocked(new Set(db.locked));
      setSettings(db.settings);
      setMetrics(db.metrics);
      setFlagged(FLAGGED.filter((f) => !db.resolvedFlags.includes(f.id)));
      setIdentity({
        handle: HANDLE_RE.test(db.handle) ? db.handle : ME,
        booted: db.booted,
        stored: db.booted,
      });
      setHydrated(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  /* ---------- sync state → grid-db ---------- */
  useEffect(() => {
    if (hydrated) void api.setAura(aura);
  }, [aura, hydrated]);
  useEffect(() => {
    if (hydrated) void api.setNotifs(notifs);
  }, [notifs, hydrated]);
  useEffect(() => {
    if (hydrated) void api.setSaved([...saved]);
  }, [saved, hydrated]);
  useEffect(() => {
    if (hydrated) void api.setFollows([...follows]);
  }, [follows, hydrated]);
  useEffect(() => {
    if (hydrated) void api.setJoined([...joined]);
  }, [joined, hydrated]);
  useEffect(() => {
    if (hydrated) void api.setLocked([...locked]);
  }, [locked, hydrated]);
  useEffect(() => {
    if (hydrated) void api.setVotes(myVotes);
  }, [myVotes, hydrated]);
  useEffect(() => {
    if (hydrated) void api.setPollVotes(pollVotes);
  }, [pollVotes, hydrated]);
  useEffect(() => {
    if (hydrated) void api.setMetrics(metrics);
  }, [metrics, hydrated]);
  useEffect(() => {
    if (hydrated) void api.setMyReplies(myReplies);
  }, [myReplies, hydrated]);
  useEffect(() => {
    if (hydrated) void api.setQuest(questClaimed);
  }, [questClaimed, hydrated]);
  useEffect(() => {
    if (hydrated) void api.setBio(bio);
  }, [bio, hydrated]);
  useEffect(() => {
    if (hydrated) void api.setSettings(settings);
  }, [settings, hydrated]);
  useEffect(() => {
    if (hydrated) void api.setHandle(identity.handle);
  }, [identity, hydrated]);

  const bumpMetric = (k: keyof Metrics, by = 1) => {
    setMetrics((m) => ({ ...m, [k]: m[k] + by }));
  };

  useEffect(() => {
    document.body.style.overflow = openPostId || composerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openPostId, composerOpen]);

  /* ---------- ambient life: notification drips ---------- */
  useEffect(() => {
    let i = 0;
    const iv = window.setInterval(() => {
      setNotifs((ns) => {
        if (ns.length > 20) return ns;
        const src = NOTIF_POOL[i % NOTIF_POOL.length];
        i += 1;
        return [{ id: `drip-${Date.now()}`, ...src, time: "now", read: false }, ...ns];
      });
    }, 21_000);
    return () => window.clearInterval(iv);
  }, []);

  /* ---------- keyboard shortcuts ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;
      if (typing) return;
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.key === "c" || e.key === "C") && !openPostId && !composerOpen) {
        setComposerOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openPostId, composerOpen]);

  /* ---------- helpers ---------- */
  const pushToast = (text: string, color = "#c9f536") => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, text, color }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  };

  const pushNotif = (kind: NotifKind, text: string, who?: string) => {
    setNotifs((ns) =>
      [{ id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, kind, who, text, time: "now", read: false }, ...ns].slice(0, 24)
    );
  };

  const navigate = (p: Page) => {
    setPage(p);
    if (p === "feed") {
      setScope("feed");
      setQuery("");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectChannel = (id: string) => {
    setPage("feed");
    setScope(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setPage("feed");
    setScope("feed");
    setQuery("");
    setSort("hot");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------- actions ---------- */
  const vote = (id: string, dir: 1 | -1) => {
    const cur = myVotes[id] ?? 0;
    const next = cur === dir ? 0 : dir;
    setMyVotes((v) => ({ ...v, [id]: next }));
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, votes: p.votes - cur + next } : p)));
    if (next === 1 && cur !== 1) {
      setAura((a) => a + 2);
      bumpMetric("votes");
    }
  };

  const award = (id: string) => {
    const types = Object.keys(AWARDS) as AwardType[];
    const type = types[Math.floor(Math.random() * types.length)];
    setPosts((ps) =>
      ps.map((p) => {
        if (p.id !== id) return p;
        const existing = p.awards.find((a) => a.type === type);
        return {
          ...p,
          awards: existing
            ? p.awards.map((a) => (a.type === type ? { ...a, count: a.count + 1 } : a))
            : [...p.awards, { type, count: 1 }],
        };
      })
    );
    setAura((a) => a + 5);
    pushToast(`${type} badge sent · +5 aura`, AWARDS[type].color);
  };

  const share = (id: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(`https://hyperfeed.grid/t/${id}`).catch(() => {});
    }
    pushToast("link copied to clipboard", "#38e1ff");
  };

  const toggleSave = (id: string) => {
    const isSaved = saved.has(id);
    setSaved((s) => {
      const n = new Set(s);
      if (isSaved) n.delete(id);
      else n.add(id);
      return n;
    });
    if (!isSaved) pushToast("stashed in saved drops", "#38e1ff");
  };

  const pollVote = (postId: string, optionId: string) => {
    if (pollVotes[postId]) return;
    setPollVotes((v) => ({ ...v, [postId]: optionId }));
    setPosts((ps) =>
      ps.map((p) =>
        p.id === postId && p.poll
          ? { ...p, poll: p.poll.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o)) }
          : p
      )
    );
    setAura((a) => a + 3);
    pushToast("timeline locked · +3 aura", "#38e1ff");
  };

  const addComment = (postId: string, parentId: string | null, text: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post && locked.has(post.channelId)) {
      pushToast("channel locked by mods — replies are frozen", "#ffc24b");
      return;
    }
    const node: CommentNode = {
      id: `uc-${Date.now()}`,
      author: handle,
      level: 42,
      time: "now",
      text,
      votes: 1,
      replies: [],
    };
    setPosts((ps) =>
      ps.map((p) =>
        p.id === postId
          ? { ...p, comments: parentId ? insertReply(p.comments, parentId, node) : [node, ...p.comments] }
          : p
      )
    );
    void api.addComment(postId, parentId, node);
    if (post) {
      setMyReplies((rs) => [{ id: node.id, postId, postTitle: post.title, text, time: "just now" }, ...rs]);
    }
    setAura((a) => a + 4);
    pushToast(parentId ? "reply nested · +4 aura" : "reply transmitted · +4 aura", "#9d7bff");
  };

  const addPost = async (d: NewPost) => {
    const post: Post = {
      id: `u-${Date.now()}`,
      channelId: d.channelId,
      author: handle,
      level: 42,
      minutesAgo: 0,
      time: "now",
      title: d.title,
      body: d.body || undefined,
      image: d.image,
      tags: d.tags,
      flair: "FRESH",
      flairColor: "#c9f536",
      votes: 1,
      awards: [],
      rising: true,
      comments: [],
    };
    await api.createPost(post); // round-trip to the grid-db
    setPosts((ps) => [post, ...ps]);
    setMyVotes((v) => ({ ...v, [post.id]: 1 }));
    if (d.image) bumpMetric("uploads");
    setComposerOpen(false);
    setQuery("");
    setPage("feed");
    setScope(d.channelId);
    setSort("new");
    setAura((a) => a + 50);
    pushNotif("aura", "transmission live · +50 aura banked");
    pushToast("transmission live · +50 aura");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFollow = (h: string) => {
    const on = follows.has(h);
    setFollows((s) => {
      const n = new Set(s);
      if (on) n.delete(h);
      else n.add(h);
      return n;
    });
    if (!on) {
      setAura((a) => a + 10);
      pushToast(`synced with @${h} · +10 aura`, "#ff3dd8");
    }
  };

  const toggleJoin = (channelId: string) => {
    const on = joined.has(channelId);
    setJoined((s) => {
      const n = new Set(s);
      if (on) n.delete(channelId);
      else n.add(channelId);
      return n;
    });
    pushToast(
      on ? `left #${channelId} · no hard feelings` : `joined #${channelId} · welcome to the grid`,
      on ? "#8f93ba" : channelOf(channelId).color
    );
  };

  const claim = () => {
    if (questClaimed) return;
    setQuestClaimed(true);
    setAura((a) => a + 100);
    pushNotif("aura", "daily quest complete · +100 aura banked");
    pushToast("quest complete · +100 aura", "#9d7bff");
  };

  /* ---------- mod actions ---------- */
  const resolveFlagged = (f: Flagged, action: "nuke" | "approve" | "ignore") => {
    setFlagged((fs) => fs.filter((x) => x.id !== f.id));
    void api.resolveFlag(f.id);
    bumpMetric("flags");
    if (action === "nuke") {
      if (f.postId) {
        setPosts((ps) => ps.filter((p) => p.id !== f.postId));
        void api.deletePost(f.postId);
      }
      setAura((a) => a + 15);
      pushToast(`“${f.reason}” nuked from the grid · +15 aura`, "#ff3dd8");
    } else if (action === "approve") {
      setAura((a) => a + 10);
      pushToast("transmission approved · chaos preserved · +10 aura", "#c9f536");
    } else {
      pushToast("flag swept under the rug", "#8f93ba");
    }
  };

  const toggleLock = (id: string) => {
    const on = locked.has(id);
    setLocked((s) => {
      const n = new Set(s);
      if (on) n.delete(id);
      else n.add(id);
      return n;
    });
    pushToast(on ? `#${id} unlocked — chaos resumes` : `#${id} locked — replies frozen`, on ? "#5ef0b0" : "#ffc24b");
  };

  /* ---------- inbox / profile / settings ---------- */
  const markRead = (id: string) => {
    const target = notifs.find((n) => n.id === id);
    if (target && !target.read) bumpMetric("read");
    setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };
  const markAllRead = () => {
    bumpMetric("read", notifs.filter((n) => !n.read).length);
    setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
    pushToast("inbox zero achieved · the grid respects you", "#ffc24b");
  };

  const patchSettings = (p: Partial<Settings>) => setSettings((s) => ({ ...s, ...p }));

  const renameHandle = (h: string) => {
    setIdentity((i) => ({ ...i, handle: h }));
    pushToast(`identity rewritten — you are now @${h}`, "#c9f536");
  };

  const purgeSaved = () => {
    setSaved(new Set());
    pushToast("saved drops vaporized · archive wiped", "#ffc24b");
  };

  const reboot = () => {
    void api.resetAll().then(() => window.location.reload());
  };

  const enterGrid = (h: string) => {
    setIdentity({ handle: h, booted: true, stored: true });
    pushToast(`welcome to the grid, @${h}`, "#c9f536");
  };

  /* ---------- derived ---------- */
  const q = query.trim().toLowerCase();
  const searching = q.length > 0 && page === "feed";

  const visible = useMemo(() => {
    let list = posts;
    if (page === "feed") {
      if (scope === "saved") list = list.filter((p) => saved.has(p.id));
      else if (scope === "synced") list = list.filter((p) => follows.has(p.author));
      else if (scope !== "feed") list = list.filter((p) => p.channelId === scope);
    }
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          channelOf(p.channelId).name.includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }
    if (settings.chaosDampener) list = list.filter((p) => p.flair !== "DANGEROUS" && p.flair !== "unhinged");
    const arr = [...list];
    if (sort === "hot") arr.sort((a, b) => heat(b) - heat(a));
    else if (sort === "new") arr.sort((a, b) => a.minutesAgo - b.minutesAgo);
    else if (sort === "top") arr.sort((a, b) => b.votes - a.votes);
    else arr.sort((a, b) => countComments(b.comments) - countComments(a.comments));
    return arr;
  }, [posts, page, scope, saved, follows, q, sort, settings.chaosDampener]);

  const channelMatches = useMemo(
    () => (q ? CHANNELS.filter((c) => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)) : []),
    [q]
  );
  const creatorMatches = useMemo(
    () => (q ? CREATORS.filter((c) => c.handle.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q)) : []),
    [q]
  );

  const openPost = openPostId ? posts.find((p) => p.id === openPostId) : undefined;
  const activeChannel =
    page === "feed" && scope !== "feed" && scope !== "saved" && scope !== "synced" ? channelOf(scope) : null;

  const title =
    scope === "saved" ? "SAVED DROPS" : scope === "synced" ? "SYNCED FEED" : activeChannel ? `#${activeChannel.name}` : "THE FEED";
  const subtitle =
    scope === "saved"
      ? "// your personal archive of certified bangers"
      : scope === "synced"
        ? follows.size
          ? `// transmissions from the ${follows.size} creator${follows.size === 1 ? "" : "s"} you synced with`
          : "// sync with creators in the aura league to fill this feed"
        : activeChannel
          ? `// ${activeChannel.desc} · ${formatVotes(activeChannel.members)} members`
          : "// everything, everywhere, all unhinged";

  const myPosts = posts.filter((p) => p.author === ME || p.author === handle);

  /* ---------- achievement progress ---------- */
  const progress = useMemo<Record<AchievementMetric, number>>(() => {
    const mine = posts.filter((p) => p.author === handle || p.author === ME);
    const badges = mine.reduce((acc, p) => acc + p.awards.reduce((x, a) => x + a.count, 0), 0);
    return {
      uplink: 1,
      aura,
      posts: mine.length,
      replies: myReplies.length,
      joined: joined.size,
      follows: follows.size,
      saved: saved.size,
      votes: metrics.votes,
      resolved: metrics.flags,
      inbox: metrics.read,
      badges,
      void: metrics.drifts,
    };
  }, [posts, handle, aura, myReplies, joined, follows, saved, metrics]);

  const mapCards = () =>
    visible.map((p, i) => (
      <Reveal key={p.id} delay={Math.min(i, 5) * 70}>
        <PostCard
          post={p}
          vote={myVotes[p.id] ?? 0}
          pollVote={pollVotes[p.id]}
          saved={saved.has(p.id)}
          locked={locked.has(p.channelId)}
          compact={settings.compactMode}
          onVote={vote}
          onOpen={setOpenPostId}
          onAward={award}
          onShare={share}
          onSave={toggleSave}
          onPollVote={pollVote}
          onChannel={selectChannel}
        />
      </Reveal>
    ));

  /* ---------- uplink gate ---------- */
  if (!hydrated) {
    return (
      <div className="noise relative flex min-h-screen items-center justify-center bg-void px-4">
        <div className="pointer-events-none absolute inset-0 gridlines" />
        <div className="scanline" />
        <div className="animate-rise clip-notch relative border border-edge bg-panel/90 px-10 py-10 text-center shadow-[0_0_60px_-24px_#38e1ff]">
          <svg className="mx-auto w-10 h-10 animate-[spin_1.2s_linear_infinite] text-cyber" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="42 16" />
          </svg>
          <p className="mt-4 font-display text-lg font-black tracking-tight">
            HYPER<span className="text-lime">FEED</span>
          </p>
          <p className="mt-2 animate-blink font-mono text-[10px] tracking-[0.3em] text-fog">
            ESTABLISHING UPLINK · SYNCING GRID-DB
          </p>
        </div>
      </div>
    );
  }

  /* ---------- boot gate ---------- */
  if (!identity.booted) {
    return <BootScreen savedHandle={identity.stored ? identity.handle : null} onEnter={enterGrid} />;
  }

  /* ---------- render ---------- */
  return (
    <div className={`noise relative min-h-screen ${settings.reduceMotion ? "rm" : ""}`}>
      {/* ambient layers */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 gridlines" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60rem 40rem at 110% -10%, rgba(56,225,255,0.08), transparent 60%), radial-gradient(50rem 36rem at -15% 110%, rgba(255,61,216,0.07), transparent 60%), radial-gradient(44rem 30rem at 45% -20%, rgba(201,245,54,0.06), transparent 60%)",
          }}
        />
        <svg
          className="absolute -right-28 -top-28 h-[440px] w-[440px] text-edge/80 animate-[spin_70s_linear_infinite]"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.35" strokeDasharray="2 5" />
          <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.35" strokeDasharray="1 7" />
          <circle cx="50" cy="2" r="1.3" fill="#c9f536" />
          <circle cx="98" cy="50" r="0.9" fill="#ff3dd8" />
        </svg>
        <svg
          className="absolute -bottom-24 -left-24 h-[360px] w-[360px] text-edge/70 animate-[spin_90s_linear_infinite_reverse]"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.35" strokeDasharray="3 6" />
          <circle cx="4" cy="50" r="1.1" fill="#38e1ff" />
        </svg>
        <div className="scanline" />
      </div>

      <TopBar
        aura={aura}
        query={query}
        unread={unread}
        inputRef={searchRef}
        onQuery={setQuery}
        onCompose={() => setComposerOpen(true)}
        onHome={goHome}
        onInbox={() => navigate("inbox")}
        onProfile={() => navigate("profile")}
      />

      <div className="relative z-10 mx-auto flex max-w-[1500px]">
        <Sidebar
          page={page}
          active={scope}
          handle={handle}
          onSelect={selectChannel}
          onNavigate={navigate}
          savedCount={saved.size}
          unread={unread}
          aura={aura}
          joined={joined}
          onToggleJoin={toggleJoin}
        />

        <main className="min-w-0 flex-1 px-4 py-5 pb-24 lg:px-8 lg:pb-8">
          {page === "feed" && !searching && (
            <>
              <ChannelStrip active={scope} onSelect={selectChannel} />

              <Reveal>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="min-w-0">
                    <h1
                      className="font-display text-[26px] font-black uppercase leading-none tracking-tight sm:text-4xl transition-colors"
                      style={activeChannel ? { color: activeChannel.color } : undefined}
                    >
                      {title}
                    </h1>
                    <p className="mt-2.5 truncate font-mono text-[10px] tracking-[0.18em] text-fog">{subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="mr-1 hidden font-mono text-[9px] tracking-[0.25em] text-fog/60 sm:block">SORT://</span>
                    {SORTS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSort(s)}
                        className={`clip-tag px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] transition active:scale-95 ${
                          sort === s
                            ? "bg-lime font-bold text-void"
                            : "border border-edge text-fog hover:border-lime/50 hover:text-snow"
                        }`}
                      >
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {activeChannel && (
                  <div
                    className="clip-notch mt-4 flex flex-wrap items-center gap-3 border bg-panel px-4 py-3"
                    style={{ borderColor: activeChannel.color + "44" }}
                  >
                    <span
                      className="h-2.5 w-2.5 rotate-45"
                      style={{ background: activeChannel.color, boxShadow: `0 0 12px ${activeChannel.color}` }}
                    />
                    <p className="min-w-0 flex-1 text-sm text-fog">
                      {activeChannel.desc}{" "}
                      <span className="font-mono text-[10px] text-fog/70">
                        · {formatVotes(activeChannel.members)} members ·{" "}
                        <span className="text-lime">{formatVotes(activeChannel.online)} online</span>
                      </span>
                    </p>
                    <button
                      onClick={() => toggleJoin(activeChannel.id)}
                      className={`clip-tag border px-3.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.2em] transition active:scale-95 ${
                        joined.has(activeChannel.id) ? "text-void" : "border-edge text-fog hover:text-snow"
                      }`}
                      style={
                        joined.has(activeChannel.id)
                          ? { background: activeChannel.color, borderColor: activeChannel.color }
                          : undefined
                      }
                    >
                      {joined.has(activeChannel.id) ? "JOINED ◈" : "JOIN CHANNEL"}
                    </button>
                  </div>
                )}
              </Reveal>

              <p className="mt-4 pb-2 font-mono text-[10px] tracking-[0.25em] text-fog/70">
                {visible.length} TRANSMISSION{visible.length === 1 ? "" : "S"}{" "}
                {sort === "hot" ? "· ranked by heat" : sort === "new" ? "· freshest first" : sort === "top" ? "· most aura" : "· most chaotic"}
                {settings.chaosDampener && <span className="text-amberx"> · chaos dampened</span>}
              </p>

              <div className={`pb-4 ${settings.compactMode ? "space-y-2.5" : "space-y-4"}`}>
                {mapCards()}

                {visible.length === 0 && (
                  <div className="clip-notch border border-dashed border-edge bg-panel/50 px-6 py-16 text-center">
                    <IconGhost className="mx-auto w-12 h-12 text-fog/60" />
                    <p className="mt-4 font-display text-lg font-bold tracking-tight text-fog">
                      {scope === "saved" ? "NOTHING SAVED YET" : "ZERO RESULTS ON THE GRID"}
                    </p>
                    <p className="mt-2 font-mono text-xs text-fog/70">
                      {scope === "saved"
                        ? "hit the bookmark on a post to stash it in your archive."
                        : "try a different signal — the void is quiet today."}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {searching && (
            <SearchPage
              query={query.trim()}
              onClear={() => setQuery("")}
              onSuggest={(s) => setQuery(s)}
              postCount={visible.length}
              posts={mapCards()}
              channels={channelMatches}
              creators={creatorMatches}
              joined={joined}
              onToggleJoin={toggleJoin}
              follows={follows}
              onFollow={toggleFollow}
              onEnterChannel={selectChannel}
            />
          )}

          {page === "channels" && (
            <ChannelsPage posts={posts} joined={joined} onToggleJoin={toggleJoin} onEnter={selectChannel} />
          )}

          {page === "leaderboard" && (
            <LeaderboardPage aura={aura} handle={handle} follows={follows} onFollow={toggleFollow} />
          )}

          {page === "inbox" && <InboxPage notifs={notifs} onRead={markRead} onReadAll={markAllRead} />}

          {page === "profile" && (
            <ProfilePage
              posts={posts}
              saved={saved}
              aura={aura}
              handle={handle}
              bio={bio}
              onBio={(b) => {
                setBio(b);
                pushToast("status updated · main character energy preserved", "#38e1ff");
              }}
              myReplies={myReplies}
              joined={joined}
              onOpenPost={setOpenPostId}
            />
          )}

          {page === "admin" && (
            <AdminPage flagged={flagged} onResolve={resolveFlagged} locked={locked} onLock={toggleLock} />
          )}

          {page === "settings" && (
            <SettingsPage
              handle={handle}
              onRename={renameHandle}
              settings={settings}
              onPatch={patchSettings}
              aura={aura}
              stats={{ posts: myPosts.length, replies: myReplies.length, saved: saved.size, channels: joined.size }}
              onPurgeSaved={purgeSaved}
              onReboot={reboot}
            />
          )}

          {page === "achievements" && <AchievementsPage progress={progress} />}

          {page === "patches" && <PatchNotesPage />}

          {page === "void" && (
            <NotFoundPage onHome={goHome} drifts={metrics.drifts} onDrift={() => bumpMetric("drifts")} />
          )}
        </main>

        {page === "feed" && !searching && (
          <RightRail follows={follows} onFollow={toggleFollow} questClaimed={questClaimed} onClaim={claim} />
        )}
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px]">
        <Footer onNavigate={navigate} onSelect={selectChannel} aura={aura} />
      </div>

      <MobileNav page={page} unread={unread} onNavigate={navigate} onCompose={() => setComposerOpen(true)} />

      {openPost && (
        <PostModal
          post={openPost}
          vote={myVotes[openPost.id] ?? 0}
          pollVote={pollVotes[openPost.id]}
          locked={locked.has(openPost.channelId)}
          onVote={vote}
          onClose={() => setOpenPostId(null)}
          onAddComment={addComment}
          onPollVote={pollVote}
        />
      )}

      {composerOpen && (
        <Composer
          defaultChannel={
            activeChannel?.id ?? (scope !== "feed" && scope !== "saved" && scope !== "synced" ? scope : "brainrot")
          }
          handle={handle}
          onClose={() => setComposerOpen(false)}
          onSubmit={addPost}
        />
      )}

      {/* toasts */}
      <div className="pointer-events-none fixed bottom-20 right-5 z-[70] flex flex-col items-end gap-2 lg:bottom-5">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-rise clip-notch-sm border border-edge bg-panel2 px-4 py-3 font-mono text-xs text-snow shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]"
            style={{ borderLeft: `3px solid ${t.color}` }}
          >
            <span style={{ color: t.color }}>◈ </span>
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}
