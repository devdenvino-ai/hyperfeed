/**
 * HYPERFEED service layer.
 *
 * Behaves like a remote backend: every call is async, carries network
 * latency, and persists to a versioned database. The UI is optimistic;
 * the DB is the source of truth across reloads. Swap the internals of
 * `read` / `commit` for fetch() calls to point this at a real server —
 * the public surface stays identical.
 */
import {
  DEFAULT_SETTINGS,
  FLAGGED,
  ME,
  NOTIFS,
  POSTS,
  type CommentNode,
  type Flagged,
  type MyReply,
  type Notif,
  type Post,
  type Settings,
} from "../data";

const DB_KEY = "hf_db_v3";

export type Metrics = {
  votes: number;
  flags: number;
  drifts: number;
  read: number;
  uploads: number;
};

export type DB = {
  v: 3;
  createdAt: number;
  lastSync: number;
  handle: string;
  booted: boolean;
  userPosts: Post[];
  deletedIds: string[];
  commentOps: { postId: string; parentId: string | null; node: CommentNode }[];
  votes: Record<string, number>;
  pollVotes: Record<string, string>;
  saved: string[];
  follows: string[];
  joined: string[];
  aura: number;
  questClaimed: boolean;
  bio: string;
  myReplies: MyReply[];
  notifs: Notif[];
  resolvedFlags: string[];
  locked: string[];
  settings: Settings;
  metrics: Metrics;
};

function seedDB(): DB {
  return {
    v: 3,
    createdAt: Date.now(),
    lastSync: Date.now(),
    handle: ME,
    booted: false,
    userPosts: [],
    deletedIds: [],
    commentOps: [],
    votes: {},
    pollVotes: {},
    saved: ["p3"],
    follows: ["glitchgoblin"],
    joined: ["brainrot", "ai-dreams"],
    aura: 48_260,
    questClaimed: false,
    bio: "professional delulu · collecting aura since cycle 2084",
    myReplies: [],
    notifs: NOTIFS,
    resolvedFlags: [],
    locked: [],
    settings: DEFAULT_SETTINGS,
    metrics: { votes: 0, flags: 0, drifts: 0, read: 0, uploads: 0 },
  };
}

function read(): DB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DB>;
      if (parsed.v === 3) return { ...seedDB(), ...parsed } as DB;
    }
  } catch {
    /* corrupted storage — reseed */
  }
  return seedDB();
}

function write(db: DB): void {
  db.lastSync = Date.now();
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    /* storage full / private mode — the grid forgets, we move on */
  }
}

function latency(): number {
  return 140 + Math.random() * 260;
}

function commit(mutate: (db: DB) => void): Promise<DB> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const db = read();
      mutate(db);
      write(db);
      resolve(db);
    }, latency());
  });
}

function now<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

/* ------------------------------------------------------------------ */
/*  public API                                                         */
/* ------------------------------------------------------------------ */

export const api = {
  /** Hydrate the client: returns the full persisted state. */
  init(): Promise<DB> {
    return new Promise((resolve) => window.setTimeout(() => resolve(read()), 420 + Math.random() * 240));
  },

  sync(): Promise<DB> {
    return now(read());
  },

  /* ---------- posts ---------- */
  createPost(post: Post) {
    return commit((db) => {
      db.userPosts = [post, ...db.userPosts];
    });
  },
  deletePost(id: string) {
    return commit((db) => {
      db.userPosts = db.userPosts.filter((p) => p.id !== id);
      if (POSTS.some((p) => p.id === id)) db.deletedIds = [...new Set([...db.deletedIds, id])];
    });
  },
  addComment(postId: string, parentId: string | null, node: CommentNode) {
    return commit((db) => {
      db.commentOps = [...db.commentOps, { postId, parentId, node }];
    });
  },
  setVotes(votes: Record<string, number>) {
    return commit((db) => {
      db.votes = votes;
    });
  },
  setPollVotes(pollVotes: Record<string, string>) {
    return commit((db) => {
      db.pollVotes = pollVotes;
    });
  },

  /* ---------- social graph ---------- */
  setSaved(ids: string[]) {
    return commit((db) => {
      db.saved = ids;
    });
  },
  setFollows(ids: string[]) {
    return commit((db) => {
      db.follows = ids;
    });
  },
  setJoined(ids: string[]) {
    return commit((db) => {
      db.joined = ids;
    });
  },

  /* ---------- identity & progression ---------- */
  setHandle(handle: string) {
    return commit((db) => {
      db.handle = handle;
      db.booted = true;
    });
  },
  markBooted() {
    return commit((db) => {
      db.booted = true;
    });
  },
  setAura(aura: number) {
    return commit((db) => {
      db.aura = aura;
    });
  },
  setQuest(claimed: boolean) {
    return commit((db) => {
      db.questClaimed = claimed;
    });
  },
  setBio(bio: string) {
    return commit((db) => {
      db.bio = bio;
    });
  },
  setMyReplies(replies: MyReply[]) {
    return commit((db) => {
      db.myReplies = replies.slice(0, 60);
    });
  },

  /* ---------- inbox ---------- */
  setNotifs(notifs: Notif[]) {
    return commit((db) => {
      db.notifs = notifs.slice(0, 24);
    });
  },

  /* ---------- moderation ---------- */
  resolveFlag(id: string) {
    return commit((db) => {
      db.resolvedFlags = [...new Set([...db.resolvedFlags, id])];
    });
  },
  setLocked(ids: string[]) {
    return commit((db) => {
      db.locked = ids;
    });
  },

  /* ---------- settings & metrics ---------- */
  setSettings(settings: Settings) {
    return commit((db) => {
      db.settings = settings;
    });
  },
  setMetrics(metrics: Metrics) {
    return commit((db) => {
      db.metrics = metrics;
    });
  },

  /** Factory reset — vaporizes the whole database. */
  resetAll(): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        try {
          localStorage.removeItem(DB_KEY);
          localStorage.removeItem("hf_identity");
          localStorage.removeItem("hf_settings");
        } catch {
          /* ignore */
        }
        resolve();
      }, 300);
    });
  },
};

/** Reassemble the live post list: seed posts (minus nuked) + user posts + replayed comments. */
export function assemblePosts(db: DB): Post[] {
  const seeds = POSTS.filter((p) => !db.deletedIds.includes(p.id)).map((p) => ({ ...p, comments: [...p.comments] }));
  const user = db.userPosts.map((p) => ({ ...p, comments: [...p.comments] }));
  const all = [...user, ...seeds];
  for (const op of db.commentOps) {
    const post = all.find((p) => p.id === op.postId);
    if (!post) continue;
    if (op.parentId) insertInto(post.comments, op.parentId, op.node);
    else post.comments = [op.node, ...post.comments];
  }
  return all;
}

function insertInto(nodes: CommentNode[], parentId: string, node: CommentNode): boolean {
  for (const n of nodes) {
    if (n.id === parentId) {
      n.replies = [...n.replies, node];
      return true;
    }
    if (insertInto(n.replies, parentId, node)) return true;
  }
  return false;
}

export const seedFlagged: Flagged[] = FLAGGED;
