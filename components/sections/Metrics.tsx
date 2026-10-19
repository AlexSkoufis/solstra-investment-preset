"use client";

import { useRef } from "react";
import { metrics } from "@/lib/content";
import { Eyebrow, GridLines } from "../ui/Button";
import { gsap, MQ, useGsap } from "@/lib/motion";

const REEL = [..."01234567890123456789"];

/** Each digit is a vertical reel that rolls and locks onto its value. */
function Figure({ value }: { value: string }) {
  return (
    <span className="figure" aria-hidden="true">
      {[...value].map((ch, i) =>
        /\d/.test(ch) ? (
          <span className="reel" key={i}>
            <span className="reel__strip" data-digit={ch} style={{ transform: `translateY(-${(Number(ch) + 10) * 5}%)` }}>
              {REEL.map((d, k) => (
                <span key={k}>{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span className="figure__char" key={i}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

export default function Metrics() {
  const ref = useRef<HTMLElement>(null);

  useGsap(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.utils.toArray<HTMLElement>(".metric").forEach((row) => {
        const strips = row.querySelectorAll<HTMLElement>(".reel__strip");
        gsap.set(strips, { clearProps: "transform" });
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 78%", once: true } });
        tl.from(row.querySelector(".metric__rule"), { scaleX: 0, duration: 1.6, ease: "expo.inOut" }, 0)
          .fromTo(
            strips,
            { yPercent: 0 },
            {
              yPercent: (_i, el: HTMLElement) => -(Number(el.dataset.digit) + 10) * 5,
              duration: 2.4,
              ease: "expo.out",
              stagger: { each: 0.12, from: "end" },
            },
            0.15,
          )
          .from(row.querySelectorAll(".metric__index, .metric__text > *"), { y: 20, opacity: 0, stagger: 0.08, duration: 1.1, ease: "power3.out" }, 0.5);

        // Only some figures have non-digit parts (£ . B); skip the tween when there are none.
        const chars = row.querySelectorAll(".figure__char, .metric__unit");
        if (chars.length) tl.from(chars, { yPercent: 60, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.3);

        // Very slight scrubbed drift so the figures feel set into the page as it moves.
        gsap.fromTo(row.querySelector(".metric__value"), { yPercent: 8 }, {
          yPercent: -4, ease: "none",
          scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });
  }, ref);

  return (
    <section ref={ref} className="metrics section--light" data-header="light" aria-labelledby="metrics-title">
      <GridLines />
      <div className="container">
        <header className="metrics__head">
          <Eyebrow index="02">Solstra in numbers</Eyebrow>
          <h2 id="metrics-title" className="metrics__title">
            Scale that serves <em>independence</em>.
          </h2>
        </header>

        {metrics.map((m, i) => (
          <div key={m.label} className={`metric metric--${i + 1}`}>
            <span className="metric__rule" aria-hidden="true" />
            <span className="metric__index label label--mono">({String(i + 1).padStart(2, "0")})</span>
            <p className="metric__value">
              <span className="sr-only">{m.spoken}</span>
              {"prefix" in m && <span className="metric__unit metric__unit--pre" aria-hidden="true">{m.prefix}</span>}
              <Figure value={m.value} />
              {"suffix" in m && <span className="metric__unit" aria-hidden="true">{m.suffix}</span>}
            </p>
            <div className="metric__text">
              <h3>{m.label}</h3>
              <p>{m.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
