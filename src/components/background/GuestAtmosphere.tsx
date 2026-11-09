export const GuestAtmosphere = () => (
  <div
    className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    aria-hidden="true"
  >
    <div className="absolute -top-32 -left-32 h-136 w-136 rounded-full bg-primary/15 blur-[120px]" />
    <div className="absolute -bottom-28 -right-28 h-144 w-xl rounded-full bg-muted-foreground/10 sm:bg-muted-foreground/15 blur-[130px]" />
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-2xl rounded-full bg-primary/5 lg:bg-primary/10 blur-[140px]" />

    <div
      className="absolute inset-0 opacity-40 mask-[radial-gradient(ellipse_at_center,transparent_20%,black_75%)]"
      style={{
        backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
      }}
    />

    <svg
      className="absolute inset-0 h-full w-full text-foreground/10"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 900"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="arc-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
          <stop offset="30%" stopColor="var(--primary)" stopOpacity="0.4" />
          <stop
            offset="70%"
            stopColor="var(--muted-foreground)"
            stopOpacity="0.4"
          />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle
        cx="720"
        cy="450"
        r="480"
        stroke="url(#arc-emerald)"
        strokeWidth="1"
        strokeDasharray="4 8"
      />
      <circle
        cx="720"
        cy="450"
        r="620"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.08"
      />
      <path
        d="M -50 240 Q 360 80 720 220 T 1490 180"
        stroke="url(#arc-emerald)"
        strokeWidth="1"
      />
      <path
        d="M -50 680 Q 420 840 820 680 T 1490 740"
        stroke="url(#arc-emerald)"
        strokeWidth="1"
        strokeDasharray="6 6"
      />
    </svg>
  </div>
)
