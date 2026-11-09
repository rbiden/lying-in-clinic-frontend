import { cn } from 'cn'

export const AuthAtmosphere = ({
  wrapperClassName,
}: {
  wrapperClassName?: string
}) => (
  <div
    className={cn(
      'pointer-events-none absolute inset-0 z-0 overflow-hidden select-none opacity-50',
      wrapperClassName,
    )}
    aria-hidden="true"
  >
    <div className="absolute -top-48 -right-32 size-160 rounded-full bg-primary/10 blur-[120px]" />
    <div className="absolute top-1/2 -left-48 size-128 rounded-full bg-emerald-500/5 blur-[120px]" />
    <div className="absolute -right-24 -bottom-48 size-144 rounded-full bg-amber-500/10 blur-[130px]" />

    <div
      className="absolute inset-0 text-primary/10 mask-[radial-gradient(ellipse_at_top_right,black_15%,transparent_90%)]"
      style={{
        backgroundImage:
          'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    />

    <div className="absolute -top-48 -right-48 size-128 rounded-full border border-primary/10" />
    <div className="absolute -top-64 -right-64 size-192 rounded-full border border-primary/10" />
    <div className="absolute -top-80 -right-80 size-256 rounded-full border border-primary/10" />
    <div className="absolute -bottom-64 -left-64 size-160 rounded-full border border-primary/10" />
    <div className="absolute -bottom-80 -left-80 size-224 rounded-full border border-primary/10" />
  </div>
)
