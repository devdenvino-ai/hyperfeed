import { PATCHES, type PatchNote } from "../data";
import { Reveal } from "./ui";
import { IconTerminal, IconWrench } from "./icons";

const NOTE_COLOR: Record<PatchNote["type"], string> = {
  NEW: "#c9f536",
  BUFF: "#5ef0b0",
  NERF: "#ff3dd8",
  FIX: "#ffc24b",
  CHAOS: "#9d7bff",
};

const TAG_COLOR: Record<string, string> = {
  LATEST: "#c9f536",
  STABLE: "#38e1ff",
  LEGACY: "#8f93ba",
  ANCIENT: "#ffc24b",
};

export default function PatchNotesPage() {
  return (
    <div className="pb-16">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-cyber">
              <IconWrench className="w-3.5 h-3.5" />
              SYSTEM HISTORY // CHANGELOG FROM THE FUTURE
            </p>
            <h1 className="mt-2 font-display text-[26px] font-black uppercase leading-none tracking-tight sm:text-4xl">
              PATCH <span className="text-cyber">NOTES</span>
            </h1>
            <p className="mt-2.5 font-mono text-[10px] tracking-[0.18em] text-fog">
              // every cycle the grid evolves. this is the receipt.
            </p>
          </div>
          <div className="clip-tag flex items-center gap-2 border border-lime/50 bg-lime/10 px-3.5 py-2 font-mono text-[10px] font-bold tracking-[0.2em] text-lime">
            <span className="h-1.5 w-1.5 rounded-full bg-lime animate-blink" />
            RUNNING v2.087
          </div>
        </div>
      </Reveal>

      <div className="relative mt-8 space-y-8 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-edge sm:before:left-[9px]">
        {PATCHES.map((p, i) => (
          <Reveal key={p.v} delay={Math.min(i, 4) * 110}>
            <article className="relative pl-8 sm:pl-10">
              {/* node */}
              <span
                className={`absolute left-0 top-1 h-[15px] w-[15px] rotate-45 border-2 sm:h-[19px] sm:w-[19px] ${
                  p.tag === "LATEST" ? "animate-pulseglow" : ""
                }`}
                style={{
                  borderColor: TAG_COLOR[p.tag],
                  background: p.tag === "LATEST" ? TAG_COLOR[p.tag] : "#0a0b18",
                  boxShadow: p.tag === "LATEST" ? `0 0 14px ${TAG_COLOR[p.tag]}` : "none",
                }}
              />

              <div
                className={`hoverlift clip-notch border bg-panel p-5 transition-colors ${
                  p.tag === "LATEST" ? "border-lime/40" : "border-edge hover:border-fog/40"
                }`}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
                    v{p.v}
                  </h2>
                  <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-fog">{p.code}</span>
                  <span
                    className={`clip-tag px-2 py-0.5 font-mono text-[8px] font-bold tracking-[0.25em] ${
                      p.tag === "LATEST" ? "animate-pulseglow" : ""
                    }`}
                    style={{
                      color: TAG_COLOR[p.tag],
                      border: `1px solid ${TAG_COLOR[p.tag]}55`,
                      background: TAG_COLOR[p.tag] + "12",
                    }}
                  >
                    {p.tag}
                  </span>
                  <span className="ml-auto font-mono text-[10px] tracking-[0.2em] text-fog/60">CYCLE {p.cycle}</span>
                </div>

                <ul className="mt-4 space-y-2">
                  {p.notes.map((n, j) => (
                    <li key={j} className="group flex items-start gap-2.5">
                      <span
                        className="clip-tag mt-0.5 shrink-0 px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-[0.15em] transition-transform group-hover:scale-110"
                        style={{
                          color: NOTE_COLOR[n.type],
                          border: `1px solid ${NOTE_COLOR[n.type]}44`,
                          background: NOTE_COLOR[n.type] + "0f",
                        }}
                      >
                        {n.type}
                      </span>
                      <p className="text-[13px] leading-relaxed text-snow/85 transition-colors group-hover:text-snow">
                        {n.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="clip-notch mt-8 border border-edge bg-abyss p-4">
          <div className="flex items-center gap-2 pb-2 font-mono text-[9px] tracking-[0.25em] text-fog">
            <IconTerminal className="w-3.5 h-3.5 text-cyber" />
            DEV TRANSMISSION // pinned
          </div>
          <p className="font-mono text-[11px] leading-relaxed text-fog">
            <span className="text-cyber">&gt;</span> we read every report. we fix what we can. we keep what's funny.
            <br />
            <span className="text-cyber">&gt;</span> next cycle: <span className="text-lime">v2.090 "GLASS PARADISE"</span> — group chats get
            holograms. stay unhinged.
            <span className="text-lime animate-blink"> ▊</span>
          </p>
        </div>
      </Reveal>
    </div>
  );
}
