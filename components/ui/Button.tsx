import type { ReactNode } from "react";

export function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
    </svg>
  );
}

type Props = {
  href: string;
  children: string;
  variant?: "solid" | "outline" | "line";
  cursor?: string;
  className?: string;
};

/**
 * Editorial button: square-cut frame, background sweep, text displacement
 * (label rolls to a duplicate) and an arrow that exits and re-enters.
 */
export function Button({ href, children, variant = "outline", cursor, className = "" }: Props) {
  return (
    <a
      href={href}
      className={`btn btn--${variant} ${className}`}
      data-magnetic={variant === "line" ? undefined : "6"}
      data-cursor={cursor}
    >
      {variant !== "line" && <span className="btn__sweep" aria-hidden="true" />}
      <span className="btn__inner" data-magnetic-inner>
        <span className="btn__label">
          <span className="btn__text" data-text={children}>
            {children}
          </span>
        </span>
        <span className="btn__arrow" aria-hidden="true">
          <Arrow />
          <Arrow />
        </span>
      </span>
    </a>
  );
}

export function Eyebrow({ index, children, className = "" }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow ${className}`}>
      {index && <span className="eyebrow__index">{index}</span>}
      <span className="eyebrow__rule" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export function GridLines({ cols = 4 }: { cols?: number }) {
  return (
    <div className="gridlines" aria-hidden="true" style={{ ["--cols" as string]: cols }}>
      <div className="gridlines__inner" />
    </div>
  );
}

/**
 * Solstra Capital logo (fictional brand). Drawn inline in currentColor so it
 * follows the header theme; the moon and sub-line carry the accent.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo ${className}`} role="img" aria-label="Solstra Capital">
      <svg className="logo__mark" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="8.5" fill="currentColor" />
        <ellipse cx="20" cy="20" rx="18" ry="6.2" fill="none" stroke="currentColor" strokeWidth="1.3" transform="rotate(-24 20 20)" />
        <circle cx="36.2" cy="12.6" r="2.4" className="logo__moon" />
      </svg>
      <span className="logo__text" aria-hidden="true">
        <span className="logo__name">Solstra</span>
        <span className="logo__sub">Capital</span>
      </span>
    </span>
  );
}
