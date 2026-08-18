type IP = { className?: string };

export const IconLogo = ({ className = "w-7 h-7" }: IP) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    <path d="M16 2 28 9v14L16 30 4 23V9L16 2Z" stroke="#c9f536" strokeWidth="2" strokeLinejoin="miter" />
    <path d="M17.8 7.5 11 17h4.6l-1.2 7.5L21 15h-4.6l1.4-7.5Z" fill="#38e1ff" />
  </svg>
);

export const IconUp = ({ className = "w-5 h-5" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3.5 20 12.5h-4.6v7.5H8.6V12.5H4L12 3.5Z" fill="currentColor" />
  </svg>
);

export const IconDown = ({ className = "w-5 h-5" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 20.5 4 11.5h4.6V4h7.4v7.5H20L12 20.5Z" fill="currentColor" />
  </svg>
);

export const IconComment = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 4.5h16v11.5h-9.2L6 20.5v-4.5H4V4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter" />
  </svg>
);

export const IconShare = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3.5 11.2 20.5 4l-4.8 16.2-4.2-6.2-8-2.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter" />
    <path d="m11.5 14 9-10" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const IconSave = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6.5 3.5h11V21L12 16.4 6.5 21V3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter" />
  </svg>
);

export const IconSaveFill = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6.5 3.5h11V21L12 16.4 6.5 21V3.5Z" fill="currentColor" />
  </svg>
);

export const IconBolt = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M13.5 2 4.5 13.5h5.6L9 22l10.5-11.5h-5.6L13.5 2Z" fill="currentColor" />
  </svg>
);

export const IconFlame = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 2c3.2 3.8 6 6.4 6 10.8a6 6 0 1 1-12 0c0-2 .8-3.7 2.1-5.2.3 1.7 1 2.6 2.3 3.1C10 7.6 10.4 4.6 12 2Z"
      fill="currentColor"
    />
  </svg>
);

export const IconSearch = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const IconBell = ({ className = "w-5 h-5" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 3a6 6 0 0 0-6 6v4.2L4 16.5v1h16v-1l-2-3.3V9a6 6 0 0 0-6-6Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="miter"
    />
    <path d="M10 20a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const IconPlus = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" />
  </svg>
);

export const IconSend = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3.5 11.2 20.5 4l-4.8 16.2-4.2-6.2-8-2.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter" />
  </svg>
);

export const IconX = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const IconReply = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M9.5 7 4 12.5 9.5 18" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter" />
    <path d="M4 12.5h10a6 6 0 0 1 6 6v1" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const IconGhost = ({ className = "w-10 h-10" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M5 21V11a7 7 0 0 1 14 0v10l-2.3-2-2.35 2-2.35-2-2.35 2-2.35-2L5 21Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="miter"
    />
    <circle cx="9.5" cy="11" r="1.2" fill="currentColor" />
    <circle cx="14.5" cy="11" r="1.2" fill="currentColor" />
  </svg>
);

export const IconSignal = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 19v-3M9.3 19v-7M14.6 19V8M20 19V4" stroke="currentColor" strokeWidth="2.4" />
  </svg>
);

export const IconOrbit = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="3.2" fill="currentColor" />
    <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="currentColor" strokeWidth="1.6" transform="rotate(-18 12 12)" />
  </svg>
);

export const IconSpark = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="m12 2 1.9 6.6L20.5 10l-6.6 1.9L12 18.5l-1.9-6.6L3.5 10l6.6-1.4L12 2Z" fill="currentColor" />
  </svg>
);

export const IconTrend = ({ className = "w-3 h-3" }: IP) => (
  <svg viewBox="0 0 12 12" fill="none" className={className}>
    <path d="M6 1.5 11 9.5H1L6 1.5Z" fill="currentColor" />
  </svg>
);

export const IconTrendDown = ({ className = "w-3 h-3" }: IP) => (
  <svg viewBox="0 0 12 12" fill="none" className={className}>
    <path d="M6 10.5 1 2.5h10L6 10.5Z" fill="currentColor" />
  </svg>
);

export const IconTrophy = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M7 3h10v5.5a5 5 0 0 1-10 0V3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter" />
    <path d="M7 4.5H3.5V7A3.5 3.5 0 0 0 7 10.5M17 4.5h3.5V7A3.5 3.5 0 0 1 17 10.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 13.5v3M8.5 20.5h7l-1-4h-5l-1 4Z" fill="currentColor" />
  </svg>
);

export const IconShield = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2.5 5 5.5v6c0 4.6 3 7.7 7 9.5 4-1.8 7-4.9 7-9.5v-6l-7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter" />
    <path d="m8.8 11.8 2.3 2.4 4.3-4.6" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const IconWrench = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M20.2 6.6a5 5 0 0 1-6.7 6.3l-6.6 6.6a2.1 2.1 0 0 1-3-3l6.6-6.6a5 5 0 0 1 6.3-6.7L13.6 6.4l.5 3.5 3.5.5 3.2-3.2c-.2-.2-.4-.4-.6-.6Z"
      fill="currentColor"
    />
  </svg>
);

export const IconTerminal = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3.5 4.5h17v15h-17v-15Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter" />
    <path d="m7 9 3.5 3L7 15M12.5 15.5H17" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const IconGear = ({ className = "w-4 h-4" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 8.2 13 5h-2l1 3.2Zm0 7.6L11 19h2l-1-3.2ZM8.2 12 5 11v2l3.2-1Zm7.6 0L19 13v-2l-3.2 1ZM9.3 9.3 7.2 7.2 5.8 8.6l2.1 2.1 1.4-1.4Zm5.4 5.4 2.1 2.1 1.4-1.4-2.1-2.1-1.4 1.4Zm0-5.4 1.4 1.4 2.1-2.1-1.4-1.4-2.1 2.1Zm-5.4 5.4L7.2 16.8l1.4 1.4 2.1-2.1-1.4-1.4Z"
      fill="currentColor"
    />
    <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const IconCrown = ({ className = "w-5 h-5" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 8.5 8 12l4-6 4 6 4-3.5-1.5 10h-13L4 8.5Z" fill="currentColor" />
  </svg>
);

export const IconLock = ({ className = "w-3.5 h-3.5" }: IP) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M7 10.5V8a5 5 0 0 1 10 0v2.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5.5 10.5h13V20h-13v-9.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter" />
  </svg>
);
