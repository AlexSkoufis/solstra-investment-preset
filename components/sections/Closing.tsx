"use client";

import { useRef } from "react";
import { gsap, MQ, useGsap } from "@/lib/motion";

export default function Closing() {
  const ref = useRef<HTMLElement>(null);

  useGsap(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.fromTo(ref.current, { clipPath: "inset(6% 4% 0% 4%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 20%", scrub: true },
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
      const lines = gsap.utils.toArray<HTMLElement>(".closing__line");
      tl.fromTo(lines[0], { xPercent: 10 }, { xPercent: -8 }, 0)
        .fromTo(lines[1], { xPercent: -14 }, { xPercent: 10 }, 0)
        .fromTo(lines[2], { xPercent: 6 }, { xPercent: -6 }, 0)
        .fromTo(".closing__rings", { rotate: -20, scale: 0.85 }, { rotate: 25, scale: 1.1 }, 0);

      gsap.from(".closing__line-inner", {
        yPercent: 140, duration: 1.6, stagger: 0.12, ease: "expo.out",
        scrollTrigger: { trigger: ".closing__title", start: "top 80%", once: true },
      });
    });
  }, ref);

  return (
    <section ref={ref} className="closing section--dark" data-header="dark" aria-labelledby="closing-title">
      <svg className="closing__rings" viewBox="0 0 800 800" aria-hidden="true">
        {[380, 300, 220, 140].map((r, i) => (
          <ellipse key={r} cx="400" cy="400" rx={r} ry={r * 0.36} transform="rotate(-18 400 400)" strokeDasharray={i === 1 ? "2 8" : undefined} />
        ))}
        <circle cx="400" cy="400" r="54" className="closing__core" />
        <circle cx="685" cy="307" r="5" className="closing__moon" />
      </svg>

      <p className="closing__label label container">Solstra Capital — since 1991</p>
      <h2 id="closing-title" className="closing__title">
        <span className="sr-only">Conviction over consensus.</span>
        <span className="closing__line" aria-hidden="true">
          <span className="closing__line-inner">Conviction</span>
        </span>
        <span className="closing__line" aria-hidden="true">
          <span className="closing__line-inner">over</span>
        </span>
        <span className="closing__line" aria-hidden="true">
          <span className="closing__line-inner">
            <em>consensus</em><span className="accent-dot">.</span>
          </span>
        </span>
      </h2>
    </section>
  );
}
