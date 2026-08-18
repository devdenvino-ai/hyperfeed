import { useEffect, useState } from "react";
import { BOOT_LINES, SUGGESTED_HANDLES } from "../data";
import { Avatar } from "./ui";
import { IconBolt, IconLogo } from "./icons";

type Props = { savedHandle: string | null; onEnter: (handle: string) => void };

const VALID = /^[a-z0-9_.]{3,18}$/;

export default function BootScreen({ savedHandle, onEnter }: Props) {
  const [lines, setLines] = useState(0);
  const [phase, setPhase] = useState<"boot" | "id">("boot");
  const [switching, setSwitching] = useState(false);
  const [handle, setHandle] = useState(savedHandle ?? "y2k_survivor");
  const [error, setError] = useState("");

  useEffect(() => {
    if (phase !== "boot") return;
    if (lines < BOOT_LINES.length) {
      const t = window.setTimeout(() => setLines((l) => l + 1), 230);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setPhase("id"), 550);
    return () => window.clearTimeout(t);
  }, [lines, phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase === "boot") setPhase("id");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  const enter = (h: string) => {
    const v = h.trim().toLowerCase();
    if (!VALID.test(v)) {
      setError("3–18 chars · lowercase · a-z 0-9 _ . only");
      return;
    }
    onEnter(v);
  };

  const showForm = !savedHandle || switching;

  return (
    <div className="noise relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4">
      <div className="pointer-events-none absolute inset-0 gridlines" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50rem 30rem at 50% -10%, rgba(56,225,255,0.1), transparent 60%), radial-gradient(40rem 26rem at 85% 110%, rgba(255,61,216,0.09), transparent 60%)",
        }}
      />
      <div className="scanline" />

      {["left-4 top-4 border-l border-t", "right-4 top-4 border-r border-t", "left-4 bottom-4 border-l border-b", "right-4 bottom-4 border-r border-b"].map((c) => (
        <span key={c} className={`pointer-events-none absolute h-6 w-6 border-lime/50 ${c}`} />
      ))}

      <div className="animate-rise relative w-full max-w-lg">
        <div className="clip-notch border border-edge bg-panel/95 shadow-[0_0_80px_-30px_#38e1ff]">
          <div className="flex items-center gap-2.5 border-b border-edge bg-abyss/80 px-5 py-3">
            <IconLogo className="w-6 h-6" />
            <span className="font-display text-sm font-black tracking-tight">
              HYPER<span className="text-lime">FEED</span>
            </span>
            <span className="ml-auto font-mono text-[9px] tracking-[0.25em] text-fog">SYSTEM BOOT // v2.087</span>
          </div>

          <div className="px-5 py-5">
            {phase === "boot" ? (
              <>
                <div className="min-h-[172px] space-y-1.5 font-mono text-[11px] leading-relaxed">
                  {BOOT_LINES.slice(0, lines).map((l, i) => (
                    <p key={l} className={`animate-rise ${i === BOOT_LINES.length - 1 ? "text-lime" : "text-cyber/90"}`}>
                      {l}
                    </p>
                  ))}
                  <p className="text-lime">
                    ▊<span className="animate-blink">_</span>
                  </p>
                </div>
                <div className="mt-4 h-1.5 border border-edge bg-void">
                  <div
                    className="h-full bg-gradient-to-r from-cyber to-lime transition-all duration-300"
                    style={{ width: `${(lines / BOOT_LINES.length) * 100}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-mono text-[9px] tracking-[0.25em] text-fog">
                    ESTABLISHING UPLINK… {Math.round((lines / BOOT_LINES.length) * 100)}%
                  </p>
                  <button
                    onClick={() => setPhase("id")}
                    className="font-mono text-[9px] tracking-[0.25em] text-fog underline-offset-4 transition hover:text-lime hover:underline"
                  >
                    SKIP [ESC]
                  </button>
                </div>
              </>
            ) : showForm ? (
              <>
                <p className="font-mono text-[10px] tracking-[0.3em] text-cyber">IDENTITY UPLINK</p>
                <h1 className="mt-1.5 font-display text-2xl font-black tracking-tight sm:text-3xl">WHO'S JACKING IN?</h1>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar name={handle || "?"} sizeClass="w-14 h-14 text-xl" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center border border-edge bg-abyss clip-tag transition focus-within:border-lime/70 focus-within:shadow-[0_0_20px_-8px_#c9f536]">
                      <span className="pl-3 font-mono text-sm text-lime">@</span>
                      <input
                        autoFocus
                        value={handle}
                        onChange={(e) => {
                          setHandle(e.target.value.toLowerCase());
                          setError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && enter(handle)}
                        placeholder="your_handle"
                        className="w-full bg-transparent px-1.5 py-2.5 font-mono text-sm text-snow outline-none placeholder:text-fog/40"
                      />
                    </div>
                    {error && <p className="mt-1.5 font-mono text-[10px] text-mag">⚠ {error}</p>}
                  </div>
                </div>
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {SUGGESTED_HANDLES.map((h) => (
                    <button
                      key={h}
                      onClick={() => {
                        setHandle(h);
                        setError("");
                      }}
                      className={`clip-tag border px-2 py-1 font-mono text-[10px] transition active:scale-95 ${
                        handle === h ? "border-lime bg-lime/15 text-lime" : "border-edge text-fog hover:border-cyber/60 hover:text-cyber"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => enter(handle)}
                  className="group mt-5 flex w-full items-center justify-center gap-2 bg-lime py-3.5 font-mono text-xs font-bold tracking-[0.3em] text-void clip-notch-sm transition hover:bg-cyber hover:shadow-[0_0_30px_-8px_#38e1ff] active:scale-[0.99]"
                >
                  <IconBolt className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  ENTER THE GRID
                </button>
              </>
            ) : (
              <>
                <p className="font-mono text-[10px] tracking-[0.3em] text-lime">UPLINK RECOGNIZED</p>
                <div className="mt-4 flex items-center gap-4">
                  <Avatar name={savedHandle ?? "y2k_survivor"} sizeClass="w-16 h-16 text-2xl" />
                  <div>
                    <h1 className="font-display text-2xl font-black tracking-tight">WELCOME BACK</h1>
                    <p className="mt-1 font-mono text-xs text-cyber">@{savedHandle}</p>
                  </div>
                </div>
                <button
                  onClick={() => onEnter(savedHandle ?? "y2k_survivor")}
                  className="mt-5 w-full bg-lime py-3.5 font-mono text-xs font-bold tracking-[0.3em] text-void clip-notch-sm transition hover:bg-cyber hover:shadow-[0_0_30px_-8px_#38e1ff] active:scale-[0.99]"
                >
                  ENTER THE GRID
                </button>
                <button
                  onClick={() => setSwitching(true)}
                  className="mt-2.5 w-full py-1 text-center font-mono text-[10px] tracking-[0.2em] text-fog transition hover:text-lime"
                >
                  switch identity
                </button>
              </>
            )}
          </div>
        </div>
        <p className="mt-3 text-center font-mono text-[9px] tracking-[0.25em] text-fog/50">
          UNAUTHORIZED VIBES WILL BE PURGED · MODS ARE ASLEEP
        </p>
      </div>
    </div>
  );
}
