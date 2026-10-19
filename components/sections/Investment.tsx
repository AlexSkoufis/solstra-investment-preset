"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { capabilities } from "@/lib/content";
import { Arrow, Button, Eyebrow } from "../ui/Button";
import { gsap, MQ, revealLines, useGsap } from "@/lib/motion";

export default function Investment() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGsap(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      // Light-to-dark transition: the dark field opens out from an inset frame.
      gsap.fromTo(ref.current, { clipPath: "inset(0% 5% 0% 5%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 15%", scrub: true },
      });
      gsap.fromTo(".invest__bg", { yPercent: -8 }, {
        yPercent: 8, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      revealLines(ref.current!.querySelector(".invest__title")!);
      gsap.from(".invest__item", {
        y: 40, opacity: 0, stagger: 0.08, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ".invest__list", start: "top 85%", once: true },
      });
    });
  }, ref);

  const current = capabilities[active];

  return (
    <section ref={ref} id="investment" className="invest section--dark" data-header="dark" aria-labelledby="invest-title">
      <div className="invest__bg" aria-hidden="true">
        {capabilities.map((c, i) => (
          <div key={c.title} className={`invest__bg-img ${i === active ? "is-active" : ""}`}>
            <Image className="img-grade" src={c.image} alt="" fill sizes="100vw" />
          </div>
        ))}
      </div>
      <div className="invest__shade" aria-hidden="true" />

      <div className="container invest__grid">
        <div className="invest__head">
          <Eyebrow index="04">Investment &amp; stewardship</Eyebrow>
          <h2 id="invest-title" className="invest__title">
            Conviction in every portfolio. <em>Responsibility</em> in every decision.
          </h2>
        </div>

        <ul className="invest__list">
          {capabilities.map((c, i) => (
            <li key={c.title}>
              <a
                href="#investment"
                className={`invest__item ${i === active ? "is-active" : ""}`}
                aria-current={i === active ? "true" : undefined}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                data-cursor="Explore"
              >
                <span className="invest__index label label--mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="invest__name">{c.title}</span>
                <Arrow className="invest__arrow" />
              </a>
            </li>
          ))}
        </ul>

        <div className="invest__detail" aria-live="polite">
          <div key={current.title} className="invest__detail-inner">
            <p className="label">{String(active + 1).padStart(2, "0")} — {current.title}</p>
            <p className="invest__desc">{current.text}</p>
            <ul className="invest__tags">
              {current.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <Button href="#investment" variant="outline" cursor="Explore">
            Our capabilities
          </Button>
        </div>
      </div>
    </section>
  );
}
