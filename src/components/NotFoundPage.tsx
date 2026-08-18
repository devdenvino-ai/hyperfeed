import { useEffect, useState } from "react";
import { Reveal } from "./ui";
import { IconGhost, IconSignal } from "./icons";

type Props = { onHome: () => void; drifts: number; onDrift: () => void };

const DRIFT_LINES = [
  "drifting… sector 404 echoes with unread group-chat messages",
  "drifting deeper… a holo-pet waves from the static. it remembers you",
  "the void whispers: 'you were supposed to touch grass'",
  "somewhere here: the original cereal-is-soup thread. lost to time",
  "error 404 has achieved sentience and is thriving, actually",
  "you found the edge of the render distance. congrats. go back.",
];

export default function NotFoundPage({ onHome, drifts, onDrift }: Props) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const iv = window.setInterval(() => {
      setGlitch(true);
      window.setTimeout(() => setGlitch(false), 160);
    }, 2600);
    return () => window.clearInterval(iv);
  }, []);

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden pb-16 text-center">
      {/* drifting debris */}
      <span className="floaty absolute left-[12%] top-[18%] h-2 w-2 rotate-45 bg-mag/40" style={{ animationDelay: "0.4s" }} />
      <span className="floaty absolute right-[16%] top-[26%] h-1.5 w-1.5 rotate-45 bg-cyber/50" style={{ animationDelay: "1.2s" }} />
      <span className="floaty absolute left-[22%] bottom-[24%] h-1.5 w-1.5 rotate-45 bg-lime/40" style={{ animationDelay: "2s" }} />
      <span className="floaty absolute right-[24%] bottom-[16%] h-2 w-2 rotate-45 bg-vio/40" style={{ animationDelay: "0.8s" }} />

      <Reveal>
        <p className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.35em] text-mag">
          <IconSignal className="w-3.5 h-3.5 animate-blink" />
          SIGNAL LOST // SECTOR NOT FOUND
        </p>

        <div className="relative mt-4 select-none">
          <span
            aria-hidden
            className={`absolute inset-0 font-display text-[110px] font-black leading-none tracking-tight text-cyber/50 sm:text-[170px] ${
              glitch ? "translate-x-1.5" : ""
            }`}
            style={{ transition: "transform 60ms linear" }}
          >
            404
          </span>
          <span
            aria-hidden
            className={`absolute inset-0 font-display text-[110px] font-black leading-none tracking-tight text-mag/50 sm:text-[170px] ${
              glitch ? "-translate-x-1.5" : ""
            }`}
            style={{ transition: "transform 60ms linear" }}
          >
            404
          </span>
          <h1 className="animate-flicker relative font-display text-[110px] font-black leading-none tracking-tight text-snow sm:text-[170px]">
            404
          </h1>
        </div>

        <h2 className="mt-2 font-display text-xl font-black uppercase tracking-tight text-fog sm:text-2xl">
          this corner of the grid <span className="text-lime">does not exist</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md font-mono text-[11px] leading-relaxed tracking-wider text-fog/70">
          you drifted past the last rendered pixel. out here it's only static, unread messages, and the ghost of every deleted hot take.
        </p>
      </Reveal>

      <Reveal delay={150}>
        <div className="clip-notch mt-8 w-full max-w-sm border border-edge bg-abyss/90 p-4 text-left">
          <p className="pb-2.5 font-mono text-[9px] tracking-[0.3em] text-fog">DIAGNOSTIC READOUT</p>
          <ul className="space-y-1.5 font-mono text-[11px]">
            <li className="flex justify-between gap-3 text-fog">
              <span>pinging sector…</span>
              <span className="font-bold text-mag">TIMEOUT</span>
            </li>
            <li className="flex justify-between gap-3 text-fog">
              <span>reality anchor…</span>
              <span className="font-bold text-mag">NOT FOUND</span>
            </li>
            <li className="flex justify-between gap-3 text-fog">
              <span>vibe integrity…</span>
              <span className="font-bold text-amberx">SCATTERED</span>
            </li>
            <li className="flex justify-between gap-3 text-fog">
              <span>exit route…</span>
              <span className="font-bold text-lime">AVAILABLE</span>
            </li>
          </ul>
        </div>
      </Reveal>

      <Reveal delay={250}>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onHome}
            className="group flex items-center gap-2 bg-lime px-5 py-3 font-mono text-[11px] font-bold tracking-[0.2em] text-void clip-notch-sm transition hover:bg-cyber hover:shadow-[0_0_26px_-6px_#38e1ff] active:scale-95"
          >
            <IconGhost className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            RETURN TO THE FEED
          </button>
          <button
            onClick={onDrift}
            className="clip-notch-sm border border-edge px-5 py-3 font-mono text-[11px] tracking-[0.2em] text-fog transition hover:border-vio/60 hover:text-vio active:scale-95"
          >
            DRIFT DEEPER [{drifts}]
          </button>
        </div>
        <p
          key={drifts}
          className={`mt-5 min-h-[1.25rem] font-mono text-[10px] tracking-[0.15em] ${
            drifts > 0 ? "animate-rise text-vio" : "text-fog/40"
          }`}
        >
          {drifts > 0 ? DRIFT_LINES[(drifts - 1) % DRIFT_LINES.length] : "the void is patient. it can wait."}
        </p>
      </Reveal>
    </div>
  );
}
