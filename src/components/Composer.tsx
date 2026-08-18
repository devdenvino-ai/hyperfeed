import { useRef, useState, type DragEvent } from "react";
import { CHANNELS, GALLERY } from "../data";
import { IconSend, IconSpark, IconX } from "./icons";

export type NewPost = {
  channelId: string;
  title: string;
  body: string;
  tags: string[];
  image?: string;
};

type Props = {
  defaultChannel: string;
  handle: string;
  onClose: () => void;
  onSubmit: (data: NewPost) => Promise<void>;
};

const MAX_TITLE = 140;
const MAX_FILE_MB = 1.5;

export default function Composer({ defaultChannel, handle, onClose, onSubmit }: Props) {
  const [channelId, setChannelId] = useState(defaultChannel);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imgError, setImgError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [shake, setShake] = useState(false);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const over = title.length > MAX_TITLE;
  const channel = CHANNELS.find((c) => c.id === channelId) ?? CHANNELS[0];

  const fail = (msg: string) => {
    setImgError(msg);
    window.setTimeout(() => setImgError(""), 2600);
  };

  const attachFile = (file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      fail("that's not an image — the grid only accepts visual signals");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      fail(`too heavy — max ${MAX_FILE_MB}MB. compress it, bestie`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(String(reader.result));
      setImgError("");
    };
    reader.onerror = () => fail("read failed — the file ghosted us");
    reader.readAsDataURL(file);
  };

  const applyUrl = () => {
    const u = imageUrl.trim();
    if (!/^https?:\/\/.+/i.test(u)) {
      fail("paste a full http(s) image link");
      return;
    }
    setImage(u);
    setImageUrl("");
    setImgError("");
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    attachFile(e.dataTransfer.files?.[0]);
  };

  const submit = async () => {
    if (sending) return;
    if (title.trim().length < 8 || over) {
      setShake(true);
      window.setTimeout(() => setShake(false), 400);
      return;
    }
    setSending(true);
    try {
      await onSubmit({
        channelId,
        title: title.trim(),
        body: body.trim(),
        tags: tags
          .split(/[,\s]+/)
          .map((t) => t.replace(/^#/, "").toLowerCase())
          .filter(Boolean)
          .slice(0, 4),
        image: image ?? undefined,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-void/85 backdrop-blur-sm" onClick={sending ? undefined : onClose} />
      <div
        className={`animate-rise clip-notch relative flex max-h-[92vh] w-full max-w-xl flex-col border bg-panel transition-transform ${
          shake ? "translate-x-1" : ""
        }`}
        style={{ borderColor: channel.color + "66", boxShadow: `0 0 60px -24px ${channel.color}` }}
      >
        <div className="flex items-center gap-2 border-b border-edge bg-abyss/70 px-4 py-3">
          <IconSpark className={`w-4 h-4 text-lime ${sending ? "animate-pulseglow" : ""}`} />
          <span className="font-display text-sm font-black tracking-wide">DROP A POST</span>
          <span className="font-mono text-[9px] tracking-[0.25em] text-fog">TRANSMISSION UPLINK</span>
          <div className="flex-1" />
          <button
            onClick={onClose}
            disabled={sending}
            className="border border-edge p-1.5 text-fog transition hover:border-mag hover:text-mag clip-tag active:scale-90 disabled:opacity-40"
            aria-label="close composer"
          >
            <IconX className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
          <div>
            <label className="mb-1.5 block font-mono text-[10px] tracking-[0.25em] text-fog">TARGET CHANNEL</label>
            <div className="flex flex-wrap gap-1.5">
              {CHANNELS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setChannelId(c.id)}
                  className={`flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[11px] transition clip-tag ${
                    channelId === c.id ? "font-bold text-void" : "border-edge text-fog hover:text-snow"
                  }`}
                  style={channelId === c.id ? { background: c.color, borderColor: c.color } : undefined}
                >
                  <span
                    className="h-1.5 w-1.5 rotate-45"
                    style={{ background: channelId === c.id ? "#05050d" : c.color }}
                  />
                  #{c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label className="font-mono text-[10px] tracking-[0.25em] text-fog">HEADLINE</label>
              <span className={`font-mono text-[10px] ${over ? "text-mag font-bold" : "text-fog/60"}`}>
                {title.length}/{MAX_TITLE}
              </span>
            </div>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="say something unhinged (min 8 chars)…"
              className="w-full border border-edge bg-abyss px-3 py-2.5 text-sm font-medium text-snow placeholder:text-fog/50 outline-none transition focus:border-lime/70 clip-notch-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10px] tracking-[0.25em] text-fog">LORE (optional)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              placeholder="context, receipts, the whole story…"
              className="w-full resize-none border border-edge bg-abyss px-3 py-2.5 text-sm text-snow placeholder:text-fog/50 outline-none transition focus:border-lime/70 clip-notch-sm"
            />
          </div>

          {/* ---------- image attachment ---------- */}
          <div>
            <label className="mb-1.5 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-fog">
              <span>VISUAL SIGNAL (optional)</span>
              <span className="text-fog/50">PNG · JPG · GIF ≤ {MAX_FILE_MB}MB</span>
            </label>

            {image ? (
              <div className="group relative overflow-hidden border border-cyber/50 clip-notch-sm">
                <img src={image} alt="attachment preview" className="max-h-56 w-full object-cover" />
                <span className="absolute left-2 top-2 clip-tag bg-void/80 px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] text-cyber">
                  ATTACHED ◈
                </span>
                <button
                  onClick={() => setImage(null)}
                  className="absolute right-2 top-2 border border-mag/60 bg-void/80 p-1.5 text-mag transition hover:bg-mag hover:text-void clip-tag active:scale-90"
                  aria-label="remove attachment"
                >
                  <IconX className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 border border-dashed px-4 py-6 text-center transition ${
                    dragging
                      ? "border-cyber bg-cyber/10 shadow-[0_0_30px_-10px_#38e1ff]"
                      : "border-edge bg-abyss/60 hover:border-cyber/60 hover:bg-abyss"
                  } clip-notch-sm`}
                >
                  <svg viewBox="0 0 24 24" fill="none" className={`w-6 h-6 transition-transform ${dragging ? "text-cyber -translate-y-0.5" : "text-fog"}`}>
                    <path d="M4 6.5h16v11H4v-11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="miter" />
                    <circle cx="9" cy="10.5" r="1.4" fill="currentColor" />
                    <path d="m6 16 4-3.5 2.6 2.2 3-3 2.4 2.4" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                  <p className="font-mono text-[11px] text-snow/85">
                    {dragging ? "release to attach ◈" : "drag an image here or click to browse"}
                  </p>
                  <p className="font-mono text-[9px] text-fog/60">uploaded files are stored in your local grid-db</p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      attachFile(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyUrl()}
                    placeholder="…or paste an image URL"
                    className="min-w-0 flex-1 border border-edge bg-abyss px-3 py-2 font-mono text-xs text-snow placeholder:text-fog/50 outline-none transition focus:border-cyber/70 clip-tag"
                  />
                  <button
                    onClick={applyUrl}
                    className="clip-tag border border-cyber/50 px-3 py-2 font-mono text-[10px] font-bold tracking-widest text-cyber transition hover:bg-cyber hover:text-void active:scale-95"
                  >
                    LINK
                  </button>
                </div>

                <div>
                  <p className="pb-1.5 font-mono text-[9px] tracking-[0.2em] text-fog/60">QUICK-GRAB FROM THE VAULT</p>
                  <div className="flex gap-2">
                    {GALLERY.map((g) => (
                      <button
                        key={g.src}
                        onClick={() => setImage(g.src)}
                        title={g.label}
                        className="group relative h-14 w-16 shrink-0 overflow-hidden border border-edge transition hover:border-lime hover:shadow-[0_0_16px_-6px_#c9f536] clip-tag active:scale-95"
                      >
                        <img src={g.src} alt={g.label} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        <span className="absolute inset-x-0 bottom-0 bg-void/70 px-1 py-0.5 text-center font-mono text-[6.5px] tracking-[0.15em] text-fog group-hover:text-lime">
                          {g.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {imgError && (
              <p className="animate-rise mt-2 font-mono text-[10px] font-bold text-mag">⚠ {imgError}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10px] tracking-[0.25em] text-fog">
              SIGNAL TAGS (space or comma separated)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="delulu, chrome-core, no-cap"
              className="w-full border border-edge bg-abyss px-3 py-2.5 font-mono text-xs text-snow placeholder:text-fog/50 outline-none transition focus:border-lime/70 clip-tag"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-edge bg-abyss/50 px-4 py-3.5 sm:px-6">
          <p className="font-mono text-[10px] text-fog">
            reward: <span className="text-lime font-bold">+50 aura</span> · posting as{" "}
            <span className="text-cyber">@{handle}</span>
          </p>
          <div className="flex-1" />
          <button
            onClick={submit}
            disabled={sending}
            className={`flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] font-bold tracking-widest clip-notch-sm transition active:scale-95 ${
              sending ? "cursor-wait bg-cyber text-void" : "bg-lime text-void hover:bg-cyber hover:shadow-[0_0_24px_-6px_#38e1ff]"
            }`}
          >
            {sending ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 animate-[spin_0.8s_linear_infinite]">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeDasharray="40 18" />
                </svg>
                TRANSMITTING…
              </>
            ) : (
              <>
                <IconSend className="w-3.5 h-3.5" />
                TRANSMIT
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
