export type Award = { type: AwardType; count: number };
export type AwardType = "GOATED" | "REAL" | "AURA" | "SUS" | "COOKED";

export type CommentNode = {
  id: string;
  author: string;
  level: number;
  time: string;
  text: string;
  votes: number;
  replies: CommentNode[];
};

export type PollOption = { id: string; label: string; votes: number };

export type Post = {
  id: string;
  channelId: string;
  author: string;
  level: number;
  minutesAgo: number;
  time: string;
  title: string;
  body?: string;
  tags: string[];
  flair?: string;
  flairColor?: string;
  image?: string;
  poll?: PollOption[];
  votes: number;
  awards: Award[];
  rising?: boolean;
  comments: CommentNode[];
};

export type Channel = {
  id: string;
  name: string;
  color: string;
  members: number;
  online: number;
  desc: string;
};

const IMG = {
  sneaker:
    "https://image.qwenlm.ai/generated-images/7e824b49-1fae-4261-b0c1-21f1deb9dd86/_result.png",
  city: "https://image.qwenlm.ai/generated-images/2e1a4666-ebf9-4923-8737-ed0d0d2572bf/_result.png",
  station:
    "https://image.qwenlm.ai/generated-images/33d14278-26e8-4cce-8aa8-274ef5636c5b/_result.png",
  heart:
    "https://image.qwenlm.ai/generated-images/ce9405e5-7ab3-463d-a0ac-13c4ab319fa9/_result.png",
  pet: "https://image.qwenlm.ai/generated-images/6025332b-756f-45c8-9e0e-42a09b990d60/_result.png",
};

export const GALLERY: { src: string; label: string }[] = [
  { src: IMG.city, label: "NEO-CITY" },
  { src: IMG.station, label: "BATTLESTATION" },
  { src: IMG.heart, label: "CHROME HEART" },
  { src: IMG.pet, label: "HOLO-PET" },
  { src: IMG.sneaker, label: "NIGHT MARKET" },
];

export const ME = "y2k_survivor";

export type MyReply = { id: string; postId: string; postTitle: string; text: string; time: string };

export const CHANNELS: Channel[] = [
  {
    id: "brainrot",
    name: "brainrot",
    color: "#c9f536",
    members: 2_800_000,
    online: 48_213,
    desc: "certified terminal brainrot. no cure, only cope.",
  },
  {
    id: "fit-check",
    name: "fit-check",
    color: "#ff3dd8",
    members: 1_900_000,
    online: 23_904,
    desc: "fits from 2087 and beyond. drip or get deleted.",
  },
  {
    id: "ai-dreams",
    name: "ai-dreams",
    color: "#38e1ff",
    members: 3_400_000,
    online: 71_102,
    desc: "machine hallucinations, served fresh daily.",
  },
  {
    id: "main-character",
    name: "main-character",
    color: "#9d7bff",
    members: 1_200_000,
    online: 15_877,
    desc: "POV: the universe is rendering for you specifically.",
  },
  {
    id: "hot-takes",
    name: "hot-takes",
    color: "#ffc24b",
    members: 2_100_000,
    online: 39_541,
    desc: "dangerous opinions only. mods are asleep.",
  },
  {
    id: "cyber-gear",
    name: "cyber-gear",
    color: "#5ef0b0",
    members: 980_000,
    online: 12_040,
    desc: "battlestations, chrome & neon hardware worship.",
  },
];

export const AWARDS: Record<AwardType, { color: string }> = {
  GOATED: { color: "#ffc24b" },
  REAL: { color: "#c9f536" },
  AURA: { color: "#38e1ff" },
  SUS: { color: "#ff3dd8" },
  COOKED: { color: "#9d7bff" },
};

export const POSTS: Post[] = [
  {
    id: "p1",
    channelId: "ai-dreams",
    author: "kai.exe",
    level: 61,
    minutesAgo: 180,
    time: "3h",
    title: "i asked the AI to draw my city in 2087 and it cooked HARD",
    body: "fed it 400 photos of my block, zero prompting tricks, one shot. it put the ramen shop on 5th in there. i never told it about the ramen shop. should i be scared or flattered?",
    tags: ["ai-core", "neo-tokyo", "oc"],
    flair: "OC",
    flairColor: "#38e1ff",
    image: IMG.city,
    votes: 42_100,
    awards: [
      { type: "GOATED", count: 12 },
      { type: "AURA", count: 8 },
      { type: "REAL", count: 4 },
    ],
    comments: [
      {
        id: "c1",
        author: "glitchgoblin",
        level: 69,
        time: "2h",
        text: "the fact that it knew about the ramen shop on 5th is concerning",
        votes: 2_431,
        replies: [
          {
            id: "c1a",
            author: "kai.exe",
            level: 61,
            time: "2h",
            text: "it's not AI if it isn't a little scary fr",
            votes: 894,
            replies: [
              {
                id: "c1b",
                author: "noturavgnpc",
                level: 23,
                time: "1h",
                text: "this is a canon event. do not interfere.",
                votes: 312,
                replies: [],
              },
            ],
          },
        ],
      },
      {
        id: "c2",
        author: "chrome.angel",
        level: 55,
        time: "2h",
        text: "save this. this is literally the aesthetic of the entire decade.",
        votes: 1_108,
        replies: [],
      },
      {
        id: "c3",
        author: "serotonin_gremlin",
        level: 34,
        time: "1h",
        text: "bro the AI did your city better than the city did your city",
        votes: 743,
        replies: [],
      },
    ],
  },
  {
    id: "p2",
    channelId: "brainrot",
    author: "glitchgoblin",
    level: 69,
    minutesAgo: 120,
    time: "2h",
    title: "my aura after saying 'skibidi' in my job interview: +10000 (i did not get the job)",
    body: "interviewer asked about my greatest strength. i said 'unmatched aura'. silence. then i said skibidi. the silence got louder. worth it.",
    tags: ["aura-farming", "corporate-npc", "noregrets"],
    flair: "W",
    flairColor: "#c9f536",
    votes: 31_400,
    awards: [
      { type: "REAL", count: 21 },
      { type: "GOATED", count: 9 },
      { type: "COOKED", count: 3 },
    ],
    rising: true,
    comments: [
      {
        id: "c4",
        author: "vibe.auditor",
        level: 48,
        time: "1h",
        text: "the silence getting louder is the most accurate description of anything ever posted here",
        votes: 3_902,
        replies: [
          {
            id: "c4a",
            author: "frfrfrl",
            level: 19,
            time: "1h",
            text: "aura exchange rate was NOT in your favor bestie",
            votes: 1_240,
            replies: [],
          },
        ],
      },
      {
        id: "c5",
        author: "z0mbiequeen",
        level: 42,
        time: "54m",
        text: "hire status: denied. aura status: infinite.",
        votes: 2_111,
        replies: [],
      },
    ],
  },
  {
    id: "p3",
    channelId: "fit-check",
    author: "chrome.angel",
    level: 55,
    minutesAgo: 360,
    time: "6h",
    title: "thrifted a Y2K chrome heart for $4, flipped it into a whole aesthetic",
    body: "found it in a bin labeled 'misc cursed objects'. paired it with liquid silver cargo and mirror shades. the cashier asked if it was 'from the future'. yes. yes it is.",
    tags: ["chrome-core", "y2k", "thrift-flip"],
    flair: "DRIP",
    flairColor: "#ff3dd8",
    image: IMG.heart,
    votes: 25_300,
    awards: [
      { type: "GOATED", count: 15 },
      { type: "AURA", count: 11 },
    ],
    comments: [
      {
        id: "c6",
        author: "noturavgnpc",
        level: 23,
        time: "5h",
        text: "'misc cursed objects' is the most real retail category i've ever heard",
        votes: 1_876,
        replies: [],
      },
      {
        id: "c7",
        author: "glitchgoblin",
        level: 69,
        time: "4h",
        text: "this fit is a whole timeline. i'm moving in.",
        votes: 954,
        replies: [],
      },
    ],
  },
  {
    id: "p4",
    channelId: "brainrot",
    author: "serotonin_gremlin",
    level: 34,
    minutesAgo: 1440,
    time: "1d",
    title: "day 47 of explaining gen z slang to my robot vacuum. it finally understands 'delulu'",
    body: "update: it now spins in circles whenever i say 'the solulu'. my entire apartment is the solution. we are thriving.",
    tags: ["delulu", "robotics", "wholesome"],
    votes: 21_900,
    awards: [
      { type: "AURA", count: 7 },
      { type: "REAL", count: 5 },
    ],
    comments: [
      {
        id: "c8",
        author: "kai.exe",
        level: 61,
        time: "20h",
        text: "this is the wholesome robotics content the timeline deserved",
        votes: 812,
        replies: [],
      },
    ],
  },
  {
    id: "p5",
    channelId: "cyber-gear",
    author: "byte.bandit",
    level: 47,
    minutesAgo: 480,
    time: "8h",
    title: "rate the battlestation. my sleep schedule is already gone so no holding back",
    body: "triple ultrawide, one (1) plant for emotional support, keyboard louder than my future. what's the verdict?",
    tags: ["battlestation", "rgb", "nocap"],
    flair: "SETUP",
    flairColor: "#5ef0b0",
    image: IMG.station,
    votes: 18_700,
    awards: [
      { type: "GOATED", count: 6 },
      { type: "COOKED", count: 2 },
    ],
    comments: [
      {
        id: "c9",
        author: "chrome.angel",
        level: 55,
        time: "7h",
        text: "the plant is carrying the entire emotional load and we all know it",
        votes: 1_534,
        replies: [
          {
            id: "c9a",
            author: "byte.bandit",
            level: 47,
            time: "6h",
            text: "his name is Gerald and he has seen things",
            votes: 2_210,
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: "p6",
    channelId: "main-character",
    author: "noturavgnpc",
    level: 23,
    minutesAgo: 47,
    time: "47m",
    title: "adopted a holographic pet and it already has more emotional intelligence than my ex",
    body: "it senses when i'm doomscrolling and dims the lights. it purrs in dial-up sounds. i have never felt more seen by a consumer product.",
    tags: ["holo-pets", "main-character-energy", "healing"],
    flair: "LORE",
    flairColor: "#9d7bff",
    image: IMG.pet,
    votes: 15_200,
    awards: [
      { type: "REAL", count: 9 },
      { type: "AURA", count: 3 },
    ],
    rising: true,
    comments: [
      {
        id: "c10",
        author: "vibe.auditor",
        level: 48,
        time: "30m",
        text: "'purrs in dial-up sounds' — putting this on my tombstone",
        votes: 641,
        replies: [],
      },
      {
        id: "c11",
        author: "frfrfrl",
        level: 19,
        time: "22m",
        text: "petition for the pet to run for mayor",
        votes: 388,
        replies: [],
      },
    ],
  },
  {
    id: "p7",
    channelId: "cyber-gear",
    author: "night.market.nate",
    level: 38,
    minutesAgo: 720,
    time: "12h",
    title: "found these at a night market in neo-osaka. the glow is REAL, no filter",
    body: "vendor said they fell off a cargo drone. i said 'cool story'. we both knew. 200 credits, best purchase of my entire timeline.",
    tags: ["grails", "neo-osaka", "nightmarket"],
    image: IMG.sneaker,
    votes: 12_900,
    awards: [{ type: "SUS", count: 8 }],
    comments: [
      {
        id: "c12",
        author: "byte.bandit",
        level: 47,
        time: "11h",
        text: "'fell off a cargo drone' is the most neo-osaka sentence ever written",
        votes: 720,
        replies: [],
      },
    ],
  },
  {
    id: "p8",
    channelId: "hot-takes",
    author: "vibe.auditor",
    level: 48,
    minutesAgo: 780,
    time: "13h",
    title: "POLL: which timeline are we actually living in right now",
    body: "the vibes need quantifying. vote wisely, there are no wrong answers except one of these.",
    tags: ["poll", "simulation", "meta"],
    flair: "POLL",
    flairColor: "#ffc24b",
    poll: [
      { id: "o1", label: "full simulation (confirmed)", votes: 14_802 },
      { id: "o2", label: "NPC arc (respectable)", votes: 6_220 },
      { id: "o3", label: "main character arc (delulu)", votes: 9_415 },
      { id: "o4", label: "canon event (do not interfere)", votes: 11_930 },
    ],
    votes: 9_800,
    awards: [{ type: "SUS", count: 5 }],
    comments: [
      {
        id: "c13",
        author: "z0mbiequeen",
        level: 42,
        time: "12h",
        text: "voted NPC arc out of respect for the craft",
        votes: 1_102,
        replies: [
          {
            id: "c13a",
            author: "noturavgnpc",
            level: 23,
            time: "11h",
            text: "as a professional i can confirm it's an honest living",
            votes: 1_890,
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: "p9",
    channelId: "hot-takes",
    author: "frfrfrl",
    level: 19,
    minutesAgo: 12,
    time: "12m",
    title: "cereal is a soup. this is not a joke. this is a cry for help.",
    body: "broth: milk. solids: cereal. served cold like a gazpacho. i have prepared my legal defense. the comments section can have my belongings.",
    tags: ["hottake", "food-crimes", "sendhelp"],
    flair: "DANGEROUS",
    flairColor: "#ff3dd8",
    votes: 7_400,
    awards: [
      { type: "SUS", count: 14 },
      { type: "COOKED", count: 6 },
    ],
    rising: true,
    comments: [
      {
        id: "c14",
        author: "vibe.auditor",
        level: 48,
        time: "9m",
        text: "cereal is a soup and milk is the broth. i will not be taking questions at this time.",
        votes: 3_204,
        replies: [
          {
            id: "c14a",
            author: "frfrfrl",
            level: 19,
            time: "8m",
            text: "blocked and reported",
            votes: 1_501,
            replies: [
              {
                id: "c14b",
                author: "vibe.auditor",
                level: 48,
                time: "6m",
                text: "see you tomorrow bestie",
                votes: 2_187,
                replies: [],
              },
            ],
          },
        ],
      },
      {
        id: "c15",
        author: "z0mbiequeen",
        level: 42,
        time: "7m",
        text: "the UN needs to get involved in this thread",
        votes: 986,
        replies: [],
      },
      {
        id: "c16",
        author: "noturavgnpc",
        level: 23,
        time: "5m",
        text: "technically it's a gazpacho and honestly that's worse",
        votes: 654,
        replies: [],
      },
    ],
  },
  {
    id: "p10",
    channelId: "hot-takes",
    author: "z0mbiequeen",
    level: 42,
    minutesAgo: 300,
    time: "5h",
    title: "the group chat IS the real social network. apps are just the lobby.",
    body: "everything real happens in a chat with 6 people and 4000 unread messages. the feed is just the loading screen of friendship.",
    tags: ["meta", "friendship", "noregrets"],
    votes: 8_900,
    awards: [{ type: "REAL", count: 7 }],
    comments: [
      {
        id: "c17",
        author: "serotonin_gremlin",
        level: 34,
        time: "4h",
        text: "4000 unread messages is a love language and i'm tired of pretending it's not",
        votes: 1_320,
        replies: [],
      },
    ],
  },
  {
    id: "p11",
    channelId: "main-character",
    author: ME,
    level: 42,
    minutesAgo: 380,
    time: "6h",
    title: "POV: you're the side character in someone else's canon event and the camera catches you vibing",
    body: "the director's cut has 40 extra seconds of me eating noodles in the background. i was born for this moment.",
    tags: ["canon", "pov", "lore"],
    flair: "LORE",
    flairColor: "#c9f536",
    votes: 12_800,
    awards: [{ type: "REAL", count: 3 }],
    comments: [
      {
        id: "c18",
        author: "maincharacter_mia",
        level: 44,
        time: "5h",
        text: "the noodle scene carried the whole film. oscar-worthy chewing.",
        votes: 840,
        replies: [
          { id: "c18a", author: ME, level: 42, time: "5h", text: "method acting. i didn't break character for 3 days.", votes: 620, replies: [] },
        ],
      },
      { id: "c19", author: "npc_energy", level: 8, time: "4h", text: "bro was literally radiating background-character aura", votes: 410, replies: [] },
    ],
  },
  {
    id: "p12",
    channelId: "hot-takes",
    author: ME,
    level: 42,
    minutesAgo: 1560,
    time: "1d",
    title: "sleep is just the free trial of death and i refuse to subscribe",
    body: "8 hours?? in this economy?? my body can run on 3 hours and an iced coffee with 4 shots of pure delusion.",
    tags: ["hottake", "health-horror"],
    flair: "DANGEROUS",
    flairColor: "#ff3dd8",
    votes: 5_400,
    awards: [
      { type: "SUS", count: 9 },
      { type: "COOKED", count: 2 },
    ],
    comments: [
      { id: "c20", author: "doomscroll_dan", level: 61, time: "22h", text: "the free trial ended and now i pay for sleep with my 20s", votes: 730, replies: [] },
      { id: "c21", author: "melatonin.maxxer", level: 55, time: "20h", text: "as a sleep enthusiast i find this post deeply concerning and relatable", votes: 555, replies: [] },
    ],
  },
];

export const TRENDING = [
  { tag: "delulu", delta: "+212%", up: true, heat: 96 },
  { tag: "chrome-core", delta: "+164%", up: true, heat: 84 },
  { tag: "canon-event", delta: "+121%", up: true, heat: 71 },
  { tag: "npc-energy", delta: "+89%", up: true, heat: 58 },
  { tag: "aura-farming", delta: "-12%", up: false, heat: 44 },
];

export const CREATORS = [
  { handle: "glitchgoblin", aura: "412k", tag: "brainrot CEO" },
  { handle: "chrome.angel", aura: "388k", tag: "fit prophet" },
  { handle: "kai.exe", aura: "296k", tag: "prompt wizard" },
  { handle: "noturavgnpc", aura: "203k", tag: "lore keeper" },
];

export const TICKER: { text: string; up: boolean }[] = [
  { text: "#delulu +212%", up: true },
  { text: "cyber-gear just hit 1M members", up: true },
  { text: "#chrome-core trending in neo-tokyo", up: true },
  { text: "server ping 12ms · all systems vibing", up: true },
  { text: "#aura-farming -12%", up: false },
  { text: "new drop: holo-pets update 2.0", up: true },
  { text: "hot-takes mods are still asleep", up: false },
  { text: "#canon-event +121%", up: true },
];

export function formatVotes(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

export function countComments(nodes: CommentNode[]): number {
  return nodes.reduce((acc, n) => acc + 1 + countComments(n.replies), 0);
}

export function channelOf(id: string): Channel {
  return CHANNELS.find((c) => c.id === id) ?? CHANNELS[0];
}

/* ---------- leaderboard / league ---------- */
export type LeagueEntry = { handle: string; tag: string; aura: number; delta: number; up: boolean };

export const LEADERBOARD: LeagueEntry[] = [
  { handle: "glitchgoblin", tag: "brainrot CEO", aura: 412_000, delta: 4.2, up: true },
  { handle: "chrome.angel", tag: "fit prophet", aura: 388_400, delta: 2.8, up: true },
  { handle: "kai.exe", tag: "prompt wizard", aura: 296_100, delta: -1.4, up: false },
  { handle: "noturavgnpc", tag: "lore keeper", aura: 203_900, delta: 6.1, up: true },
  { handle: "serotonin_gremlin", tag: "chaos agent", aura: 188_200, delta: 3.3, up: true },
  { handle: "vibe.auditor", tag: "vibe inspector", aura: 172_800, delta: 0.9, up: true },
  { handle: "z0mbiequeen", tag: "graveyard shift", aura: 154_500, delta: -2.2, up: false },
  { handle: "doomscroll_dan", tag: "scroll veteran", aura: 141_700, delta: 1.7, up: true },
  { handle: "night.market.nate", tag: "grail hunter", aura: 128_300, delta: 5.5, up: true },
  { handle: "maincharacter_mia", tag: "protagonist", aura: 119_600, delta: -0.6, up: false },
  { handle: "byte.bandit", tag: "data thief", aura: 104_200, delta: 2.1, up: true },
  { handle: "frfrfrl", tag: "soup apologist", aura: 96_800, delta: 12.4, up: true },
];

export const AURA_MOVERS = [
  { handle: "frfrfrl", delta: "+12.4%", up: true },
  { handle: "noturavgnpc", delta: "+6.1%", up: true },
  { handle: "night.market.nate", delta: "+5.5%", up: true },
  { handle: "glitchgoblin", delta: "+4.2%", up: true },
  { handle: "z0mbiequeen", delta: "-2.2%", up: false },
  { handle: "kai.exe", delta: "-1.4%", up: false },
];

/* ---------- boot / identity ---------- */
export const BOOT_LINES = [
  "> initializing HYPERFEED kernel v2.087 …",
  "> mounting vibe drives … OK",
  "> calibrating aura sensors … OK",
  "> scanning 6 frequencies … 42,187 signals detected",
  "> mod status: asleep (as usual)",
  "> uplink secured. welcome to the grid.",
];

export const SUGGESTED_HANDLES = ["y2k_survivor", "neon.nomad", "static_bloom", "ghostwire_kid", "pixel_prophet", "midnight.exe"];

/* ---------- settings ---------- */
export type Settings = {
  reduceMotion: boolean;
  chaosDampener: boolean;
  compactMode: boolean;
  notifReplies: boolean;
  notifAura: boolean;
  notifMentions: boolean;
  notifSystem: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  reduceMotion: false,
  chaosDampener: false,
  compactMode: false,
  notifReplies: true,
  notifAura: true,
  notifMentions: true,
  notifSystem: false,
};

/* ---------- ambient notification drips ---------- */
export const AMBIENT_NOTIFS: { kind: NotifKind; who?: string; text: string }[] = [
  { kind: "mention", who: "glitchgoblin", text: "mentioned you in #brainrot — “they literally invented the bit”" },
  { kind: "follow", who: "chrome.angel", text: "synced with your signal" },
  { kind: "aura", text: "your aura was rated S-tier by 3 independent auditors" },
  { kind: "reply", who: "noturavgnpc", text: "replied to your transmission: “lore acknowledged and archived”" },
  { kind: "system", text: "MODBOT_9000 fast-approved your last drop · +20 aura" },
  { kind: "mention", who: "z0mbiequeen", text: "quoted you in #hot-takes — “no notes, only screams”" },
];

/* ================= MOD TERMINAL ================= */

export type Severity = "LOW" | "MID" | "MAX";

export type Flagged = {
  id: string;
  postId?: string;
  channel: string;
  title: string;
  excerpt: string;
  reason: string;
  reporter: string;
  severity: Severity;
  reports: number;
};

export const FLAGGED: Flagged[] = [
  {
    id: "f1",
    postId: "p9",
    channel: "hot-takes",
    title: "cereal is a soup. this is not a joke. this is a cry for help.",
    excerpt: "broth: milk. solids: cereal. served cold like a gazpacho…",
    reason: "GASTRONOMIC WARCRIME",
    reporter: "modbot_9000",
    severity: "MAX",
    reports: 47,
  },
  {
    id: "f2",
    channel: "cyber-gear",
    title: "someone is selling “genuine RAM” (it is a ram, the animal)",
    excerpt: "very fluffy. 16 gigs of wool. no refunds…",
    reason: "MARKETPLACE FRAUD",
    reporter: "cable_gremlin",
    severity: "MID",
    reports: 23,
  },
  {
    id: "f3",
    channel: "brainrot",
    title: "47-minute skibidi sermon with subtitles in 12 languages",
    excerpt: "the congregation is cookin. the algorithm is weeping…",
    reason: "TERMINAL BRAINROT",
    reporter: "touch_grass_union",
    severity: "LOW",
    reports: 12,
  },
  {
    id: "f4",
    channel: "ai-dreams",
    title: "prompt thread is summoning something. we cannot un-summon it",
    excerpt: "iteration 4,096 has started prompting US back…",
    reason: "REALITY BREACH",
    reporter: "kai.exe",
    severity: "MAX",
    reports: 61,
  },
  {
    id: "f5",
    channel: "fit-check",
    title: "excessive rizz detected in mirror selfie sector 7",
    excerpt: "witnesses report spontaneous jaw-dropping within 3m radius…",
    reason: "RIZZ OVERLOAD",
    reporter: "chrome.angel",
    severity: "LOW",
    reports: 8,
  },
];

export const REPORT_POOL: Omit<Flagged, "id" | "reports">[] = [
  { channel: "brainrot", title: "user posted the same vine 400 times (it's a lifestyle)", excerpt: "do it for the vine. do it for the vine. do it for…", reason: "LOOP DETECTED", reporter: "modbot_9000", severity: "LOW" },
  { channel: "main-character", title: "someone claims the camera follows them IRL", excerpt: "there is no camera. they keep looking at one anyway…", reason: "DELULU OVERFLOW", reporter: "npc_energy", severity: "MID" },
  { channel: "cyber-gear", title: "RGB keyboard found emitting visible light into orbit", excerpt: "satellites are confused. the RGB is load-bearing…", reason: "LIGHT POLLUTION", reporter: "night.market.nate", severity: "MID" },
  { channel: "ai-dreams", title: "AI generated a dream about generating dreams", excerpt: "recursion depth: yes. the dreamer is asleep inside the dream…", reason: "RECURSION HAZARD", reporter: "vibe.auditor", severity: "MAX" },
  { channel: "hot-takes", title: "a hot take so hot it warmed the server room by 2°C", excerpt: "facility team is asking who posted about pineapple…", reason: "THERMAL EVENT", reporter: "frfrfrl", severity: "MID" },
  { channel: "fit-check", title: "mirror selfie broke the fourth wall", excerpt: "the mirror is now posting its own fit-checks…", reason: "ONTOLoGY ERROR", reporter: "glitchgoblin", severity: "LOW" },
];

export const LOG_POOL: { text: string; tone: "lime" | "cyber" | "mag" | "fog" | "amber" }[] = [
  { text: "aura_ledger :: synced 48,260 units · drift 0.002%", tone: "lime" },
  { text: "firewall :: blocked 3 skibidi packets at the border", tone: "mag" },
  { text: "modbot_9000 :: scanned 1,204 transmissions · 0 thoughts found", tone: "cyber" },
  { text: "vibe_check :: PASSED (confidence 99.2%)", tone: "lime" },
  { text: "cache :: purged 88MB of stale memes (RIP)", tone: "fog" },
  { text: "uplink :: rerouted via neo-tokyo node · ping 12ms", tone: "cyber" },
  { text: "cryptid_watch :: no activity under bed sector 7", tone: "fog" },
  { text: "aura_faucet :: drip nominal · pressure excellent", tone: "lime" },
  { text: "rizz_limiter :: throttled 2 users in #fit-check", tone: "amber" },
  { text: "timeline_sync :: branch #4,096 merged · no conflicts (suspicious)", tone: "mag" },
  { text: "npc_union :: filed grievance about main character energy", tone: "amber" },
  { text: "delulu_engine :: operating at 110% (as intended)", tone: "cyber" },
];

/* ================= INBOX ================= */

export type NotifKind = "reply" | "aura" | "mention" | "follow" | "system";

export type Notif = {
  id: string;
  kind: NotifKind;
  text: string;
  who?: string;
  time: string;
  read: boolean;
};

export const NOTIFS: Notif[] = [
  { id: "n1", kind: "reply", who: "glitchgoblin", text: "replied to your canon-event lore: “this is the content i signed up for”", time: "2m", read: false },
  { id: "n2", kind: "aura", text: "aura milestone unlocked: 48K — certified main character tier", time: "18m", read: false },
  { id: "n3", kind: "mention", who: "z0mbiequeen", text: "mentioned you in #hot-takes: “@y2k_survivor cooked with the sleep take”", time: "41m", read: false },
  { id: "n4", kind: "follow", who: "npc_energy", text: "synced with your signal", time: "1h", read: false },
  { id: "n5", kind: "system", text: "weekly vibe report: your transmissions reached 12.4K timelines", time: "3h", read: true },
  { id: "n6", kind: "reply", who: "doomscroll_dan", text: "replied: “the free trial analogy is going to live in my head rent-free”", time: "5h", read: true },
  { id: "n7", kind: "system", text: "modbot_9000 queued 5 transmissions for review in the mod terminal", time: "7h", read: true },
];

export const NOTIF_POOL: Omit<Notif, "id" | "time" | "read">[] = [
  { kind: "reply", who: "maincharacter_mia", text: "replied: “the prophecy was about you all along”" },
  { kind: "aura", text: "aura drip collected: +120 while you were doomscrolling" },
  { kind: "mention", who: "glitchgoblin", text: "mentioned you in #brainrot: “ask @y2k_survivor, they literally cooked”" },
  { kind: "follow", who: "lorekeeper_00", text: "synced with your signal" },
  { kind: "system", text: "daily quest refreshed — a new objective is waiting" },
  { kind: "aura", text: "your noodle-scene post hit the trending grid" },
  { kind: "reply", who: "vibe.auditor", text: "audited your aura and left a glowing review" },
];

/* ================= PROFILE STATS ================= */

export const AURA_HISTORY = [9, 12, 11, 16, 22, 19, 27, 31, 29, 38, 44, 48]; // k-aura per cycle
export const CYCLE_LABELS = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11", "C12"];
export const WEEK_ACTIVITY = [3, 6, 2, 9, 5, 12, 7]; // transmissions per day
export const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

/* ---------------- achievements ---------------- */
export type AchievementMetric =
  | "uplink" | "aura" | "posts" | "replies" | "joined" | "follows"
  | "saved" | "votes" | "resolved" | "inbox" | "badges" | "void";

export type AchievementDef = {
  id: string;
  metric: AchievementMetric;
  name: string;
  desc: string;
  target: number;
  color: string;
  secret?: boolean;
};

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "a-uplink", metric: "uplink", name: "SIGNAL ONLINE", desc: "establish your uplink to the grid. hardest step: existing.", target: 1, color: "#c9f536" },
  { id: "a-votes", metric: "votes", name: "DEMOCRACY ENJOYER", desc: "cast 15 votes. every upvote is a small prayer.", target: 15, color: "#c9f536" },
  { id: "a-aura", metric: "aura", name: "AURA BARON", desc: "bank 50k total aura. the grid kneels.", target: 50_000, color: "#c9f536" },
  { id: "a-posts", metric: "posts", name: "SERIAL TRANSMITTER", desc: "drop 4 transmissions into the void and hope they echo.", target: 4, color: "#38e1ff" },
  { id: "a-replies", metric: "replies", name: "REPLY GUY (AFFECTIONATE)", desc: "leave 5 replies in other people's threads. be so fr.", target: 5, color: "#9d7bff" },
  { id: "a-joined", metric: "joined", name: "FREQUENCY HOPPER", desc: "join 5 channels. commitment issues, but make it aesthetic.", target: 5, color: "#38e1ff" },
  { id: "a-follows", metric: "follows", name: "SYNC LORD", desc: "sync with 4 creators. parasocial? never heard of her.", target: 4, color: "#ff3dd8" },
  { id: "a-saved", metric: "saved", name: "DOOMSCROLL ARCHIVIST", desc: "archive 4 drops. future you says thanks.", target: 4, color: "#38e1ff" },
  { id: "a-resolved", metric: "resolved", name: "CHAOS MODERATOR", desc: "resolve 5 cases in the mod terminal. mercy is optional.", target: 5, color: "#ff3dd8" },
  { id: "a-inbox", metric: "inbox", name: "INBOX ZERO", desc: "clear every ping in one sweep. the grid respects you.", target: 1, color: "#ffc24b" },
  { id: "a-badges", metric: "badges", name: "TROPHY SHELF", desc: "collect 16 award badges across your transmissions.", target: 16, color: "#ffc24b" },
  { id: "a-void", metric: "void", name: "TOUCHED THE VOID", desc: "▓▓▓▓▓▓▓▓ ▓▓▓ ▓▓▓▓▓. it looked back.", target: 1, color: "#8f93ba", secret: true },
];

/* ---------------- patch notes ---------------- */
export type PatchNote = { type: "NEW" | "BUFF" | "NERF" | "FIX" | "CHAOS"; text: string };
export type Patch = {
  v: string;
  code: string;
  cycle: string;
  tag: "LATEST" | "STABLE" | "LEGACY" | "ANCIENT";
  notes: PatchNote[];
};

export const PATCHES: Patch[] = [
  {
    v: "2.087",
    code: "CHROME RENAISSANCE",
    cycle: "2087.11",
    tag: "LATEST",
    notes: [
      { type: "NEW", text: "Aura League — live rankings of the grid's most radiant beings" },
      { type: "NEW", text: "Mod Terminal with channel lockdown capabilities. mods finally have tools (and opinions)" },
      { type: "NEW", text: "Achievements, patch notes, and a 404 sector for those who wander" },
      { type: "NEW", text: "Synced feed — transmissions only from creators you've synced with" },
      { type: "BUFF", text: "reply aura raised to +4. reply guys, this is your renaissance" },
      { type: "FIX", text: "mods now wake up on a schedule instead of a prayer" },
      { type: "CHAOS", text: "the cereal-is-soup discourse remains unresolved by design" },
    ],
  },
  {
    v: "2.084",
    code: "HOLO-PET UPDATE",
    cycle: "2087.08",
    tag: "STABLE",
    notes: [
      { type: "NEW", text: "holo-pets now purr in dial-up sounds. you're welcome" },
      { type: "NEW", text: "saved drops archive — stash bangers for the timeline collapse" },
      { type: "BUFF", text: "night market vendor economy. cargo drone 'accidents' up 12%" },
      { type: "FIX", text: "chrome hearts no longer melt in direct sunlight" },
      { type: "NERF", text: "aura farming via self-upvote. we saw you. we always see you" },
    ],
  },
  {
    v: "2.077",
    code: "MAIN CHARACTER PATCH",
    cycle: "2087.04",
    tag: "LEGACY",
    notes: [
      { type: "NEW", text: "canon events now respect personal space (mostly)" },
      { type: "NEW", text: "fit-check channel with holographic mirrors and zero judgement (some judgement)" },
      { type: "FIX", text: "NPCs no longer clip through walls on tuesdays" },
      { type: "CHAOS", text: "added 4,000 unread messages to every group chat, forever" },
    ],
  },
  {
    v: "1.000",
    code: "GENESIS DROP",
    cycle: "2084.01",
    tag: "ANCIENT",
    notes: [
      { type: "NEW", text: "the grid came online. it was immediately unhinged" },
      { type: "NEW", text: "aura introduced as currency. inflation was instantaneous" },
      { type: "FIX", text: "reality (detailed patch notes unavailable)" },
    ],
  },
];
