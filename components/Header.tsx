"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/motion";
import { Arrow, Button, Logo } from "./ui/Button";

const audiences = ["Institutional", "Professional", "Individual"] as const;

export default function Header() {
  const ref = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const searchInput = useRef<HTMLInputElement>(null);

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState<number | null>(null);
  const [preview, setPreview] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [audienceOpen, setAudienceOpen] = useState(false);
  const [audience, setAudience] = useState<(typeof audiences)[number]>("Institutional");

  const overlayOpen = mega !== null || mobileOpen || searchOpen || audienceOpen;

  // Scroll-linked header state: section contrast, compact height, hide on scroll down, progress.
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    document.querySelectorAll<HTMLElement>("[data-header]").forEach((section) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top 36px",
          end: "bottom 36px",
          onToggle: (self) => self.isActive && setTheme(section.dataset.header as "dark" | "light"),
        }),
      );
    });
    triggers.push(
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          setCompact(y > 40);
          setHidden(self.direction === 1 && y > window.innerHeight * 0.9);
        },
      }),
    );
    const progress = gsap.fromTo(
      progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.4 } },
    );
    return () => {
      triggers.forEach((t) => t.kill());
      progress.scrollTrigger?.kill();
      progress.kill();
    };
  }, []);

  // Escape closes everything; mobile menu locks page scroll.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMega(null);
      setMobileOpen(false);
      setSearchOpen(false);
      setAudienceOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const lock = mobileOpen || searchOpen;
    document.documentElement.classList.toggle("is-locked", lock);
    if (lock) window.__lenis?.stop();
    else window.__lenis?.start();
    if (searchOpen) window.setTimeout(() => searchInput.current?.focus(), 350);
  }, [mobileOpen, searchOpen]);

  const openMega = (i: number | null) => {
    window.clearTimeout(closeTimer.current);
    if (i !== mega) setPreview(0);
    setMega(i);
    setSearchOpen(false);
    setAudienceOpen(false);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(null), 180);
  };

  const cls = [
    "header",
    `header--${overlayOpen ? "dark" : theme}`,
    compact && "is-compact",
    hidden && !overlayOpen && "is-hidden",
    overlayOpen && "is-open",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header ref={ref} className={cls} onMouseLeave={scheduleClose}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="header__bar container">
        <a href="#top" className="header__logo" aria-label="Solstra Capital — home" onClick={() => setMobileOpen(false)}>
          <Logo />
        </a>

        <nav className="header__nav" aria-label="Primary">
          <ul>
            {nav.map((item, i) => {
              const hasMenu = "links" in item;
              return (
                <li key={item.label} onMouseEnter={() => (hasMenu ? openMega(i) : scheduleClose())}>
                  {hasMenu ? (
                    <button
                      type="button"
                      className={`header__link ${mega === i ? "is-active" : ""}`}
                      aria-expanded={mega === i}
                      aria-controls={`mega-${i}`}
                      onClick={() => openMega(mega === i ? null : i)}
                    >
                      <span className="header__link-text" data-text={item.label}>{item.label}</span>
                    </button>
                  ) : (
                    <a href={item.href} className="header__link">
                      <span className="header__link-text" data-text={item.label}>{item.label}</span>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header__tools">
          <div className="audience">
            <button
              type="button"
              className="audience__toggle"
              aria-expanded={audienceOpen}
              aria-haspopup="true"
              onClick={() => {
                setAudienceOpen((v) => !v);
                setMega(null);
              }}
            >
              <span className="label">{audience}</span>
              <span className="audience__sep" aria-hidden="true" />
              <span className="label">Global</span>
              <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            <div className={`audience__menu ${audienceOpen ? "is-open" : ""}`} inert={!audienceOpen}>
              <p className="label audience__title">I am an investor who is</p>
              {audiences.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={audience === a}
                  onClick={() => {
                    setAudience(a);
                    setAudienceOpen(false);
                  }}
                >
                  {a}
                  <Arrow />
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="icon-btn"
            aria-label={searchOpen ? "Close search" : "Search"}
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((v) => !v);
              setMega(null);
              setMobileOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.25" />
              <path d="M15 15l5 5" stroke="currentColor" strokeWidth="1.25" />
            </svg>
          </button>

          <button
            type="button"
            className={`menu-btn ${mobileOpen ? "is-open" : ""}`}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => {
              setMobileOpen((v) => !v);
              setSearchOpen(false);
              setMega(null);
            }}
          >
            <span className="menu-btn__label label">{mobileOpen ? "Close" : "Menu"}</span>
            <span className="menu-btn__lines" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <span className="header__progress" aria-hidden="true">
        <span ref={progressRef} />
      </span>

      {/* Mega menu */}
      <div className={`mega ${mega !== null ? "is-open" : ""}`} onMouseEnter={() => window.clearTimeout(closeTimer.current)}>
        {nav.map((item, i) =>
          "links" in item ? (
            <div
              key={item.label}
              id={`mega-${i}`}
              className={`mega__panel ${mega === i ? "is-active" : ""}`}
              inert={mega !== i}
            >
              <div className="mega__grid container">
                <div className="mega__intro">
                  <p className="label">{String(i + 1).padStart(2, "0")} — {item.label}</p>
                  <p className="mega__lede">{item.intro}</p>
                  <Button href={item.href} variant="line">
                    View overview
                  </Button>
                </div>
                <ul className="mega__links">
                  {item.links.map((l, j) => (
                    <li key={l.label} style={{ ["--i" as string]: j }}>
                      <a
                        href={item.href}
                        className={`mega__link ${preview === j ? "is-current" : ""}`}
                        onMouseEnter={() => setPreview(j)}
                        onFocus={() => setPreview(j)}
                        onClick={() => setMega(null)}
                      >
                        <span className="mega__index">{String(j + 1).padStart(2, "0")}</span>
                        <span className="mega__text">{l.label}</span>
                        <Arrow className="mega__arrow" />
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mega__preview" aria-hidden="true">
                  {item.links.map((l, j) => (
                    <div key={l.label} className={`mega__img ${preview === j ? "is-current" : ""}`}>
                      <Image src={l.image} alt="" fill sizes="30vw" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null,
        )}
      </div>

      {/* Search */}
      <div className={`search ${searchOpen ? "is-open" : ""}`} inert={!searchOpen} role="dialog" aria-label="Search">
        <form className="search__inner container" role="search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="site-search" className="label">
            Search Solstra
          </label>
          <div className="search__field">
            <input ref={searchInput} id="site-search" type="search" placeholder="Funds, insights, reports…" autoComplete="off" />
            <button type="submit" aria-label="Submit search">
              <Arrow />
            </button>
          </div>
          <p className="label search__hint">Popular — Annual report 2025 · Global Equity · Income strategies · Stewardship report</p>
        </form>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" className={`mobile-menu ${mobileOpen ? "is-open" : ""}`} inert={!mobileOpen}>
        <nav className="mobile-menu__inner container" aria-label="Mobile">
          <ul className="mobile-menu__list">
            {nav.map((item, i) => (
              <li key={item.label} style={{ ["--i" as string]: i }}>
                {"links" in item ? (
                  <>
                    <button
                      type="button"
                      className="mobile-menu__link"
                      aria-expanded={mobileSub === i}
                      onClick={() => setMobileSub(mobileSub === i ? null : i)}
                    >
                      <span className="mobile-menu__index">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                      <span className="mobile-menu__plus" aria-hidden="true" />
                    </button>
                    <div className={`mobile-menu__sub ${mobileSub === i ? "is-open" : ""}`}>
                      <ul>
                        {item.links.map((l) => (
                          <li key={l.label}>
                            <a href={item.href} onClick={() => setMobileOpen(false)} tabIndex={mobileSub === i ? 0 : -1}>
                              {l.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <a href={item.href} className="mobile-menu__link" onClick={() => setMobileOpen(false)}>
                    <span className="mobile-menu__index">{String(i + 1).padStart(2, "0")}</span>
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
          <div className="mobile-menu__foot">
            <p className="label">Viewing as · {audience} investor</p>
            <a href="tel:+442000000000" className="mobile-menu__tel">+44 (0)20 0000 0000</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
