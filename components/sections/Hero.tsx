"use client";

import { useRef } from "react";
import OrbitField from "../OrbitField";
import { Button } from "../ui/Button";
import { gsap, MQ, useGsap } from "@/lib/motion";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGsap(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      // Entrance: masked lines rise, then the supporting cast settles in.
      const intro = gsap.timeline({ delay: 0.15 });
      intro
        .fromTo(".hero__line-inner", { y: 0, yPercent: 140 }, { yPercent: 0, duration: 1.6, stagger: 0.12, ease: "expo.out" })
        .fromTo(".hero__field", { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 2.6, ease: "power2.out" }, 0.1)
        .from(".hero__meta > *", { y: 16, opacity: 0, duration: 1, stagger: 0.08, ease: "power3.out" }, 0.6)
        .from(".hero__foot > *", { y: 24, opacity: 0, duration: 1.1, stagger: 0.1, ease: "power3.out" }, 0.8)
        .from(".hero__scroll-line", { scaleY: 0, duration: 1.4, ease: "expo.inOut" }, 1);

      // Scroll: lines separate at different speeds, the field drifts and expands.
      const out = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 0.6 },
        defaults: { ease: "none" },
      });
      const lines = gsap.utils.toArray<HTMLElement>(".hero__line");
      out
        .to(lines[0], { xPercent: -7 }, 0)
        .to(lines[1], { xPercent: 5 }, 0)
        .to(lines[2], { xPercent: -3 }, 0)
        .to(".hero__title", { yPercent: 22, opacity: 0.25 }, 0)
        .to(".hero__field", { yPercent: 16, scale: 1.08 }, 0)
        .to(".hero__meta, .hero__foot", { opacity: 0, y: -30 }, 0);
    });
  }, ref);

  return (
    <section ref={ref} id="top" className="hero section--dark" data-header="dark" aria-labelledby="hero-title">
      <OrbitField className="hero__field" />
      <div className="hero__veil" aria-hidden="true" />

      <div className="hero__inner container">
        <div className="hero__meta" aria-hidden="true">
          <span className="label">Specialist active asset manager</span>
          <span className="label label--mono">51.5155° N — 0.0922° W</span>
          <span className="label">Est. 1991, London</span>
        </div>

        <h1 id="hero-title" className="hero__title">
          <span className="sr-only">Independent minds navigating every horizon.</span>
          <span className="hero__line" aria-hidden="true">
            <span className="hero__line-inner">Independent minds</span>
          </span>
          <span className="hero__line hero__line--indent" aria-hidden="true">
            <span className="hero__line-inner">navigating every</span>
          </span>
          <span className="hero__line" aria-hidden="true">
            <span className="hero__line-inner">
              <em>horizon</em>
              <span className="accent-dot">.</span>
            </span>
          </span>
        </h1>

        <div className="hero__foot">
          <p className="hero__intro">
            For more than thirty years our specialist teams have looked past the obvious to find lasting value —
            on behalf of clients around the world.
          </p>
          <Button href="#active-thinking" variant="solid" cursor="Explore">
            Discover our approach
          </Button>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span className="label">Scroll</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
}
