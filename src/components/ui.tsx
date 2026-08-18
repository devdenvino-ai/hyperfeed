import { useEffect, useRef, useState, type ReactNode } from "react";

const PAIRS: [string, string][] = [
  ["#c9f536", "#38e1ff"],
  ["#ff3dd8", "#9d7bff"],
  ["#38e1ff", "#5ef0b0"],
  ["#ffc24b", "#ff3dd8"],
  ["#9d7bff", "#38e1ff"],
  ["#5ef0b0", "#c9f536"],
];

export function Avatar({
  name,
  sizeClass = "w-6 h-6 text-[10px]",
}: {
  name: string;
  sizeClass?: string;
}) {
  const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const [a, b] = PAIRS[hash % PAIRS.length];
  return (
    <span
      className={`inline-grid shrink-0 place-items-center font-display font-bold text-void ${sizeClass}`}
      style={{
        background: `linear-gradient(135deg, ${a}, ${b})`,
        clipPath: "polygon(25% 0, 100% 0, 100% 75%, 75% 100%, 0 100%, 0 25%)",
      }}
    >
      {name.replace(/[^a-zA-Z0-9]/g, "").charAt(0).toUpperCase() || "?"}
    </span>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function LevelChip({ level }: { level: number }) {
  return (
    <span className="font-mono text-[10px] text-fog border border-edge px-1.5 py-px clip-tag bg-panel2/60">
      LV.{level}
    </span>
  );
}
