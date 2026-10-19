"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { investorLinks } from "@/lib/content";
import { Arrow, Eyebrow } from "../ui/Button";
import { gsap, MQ, revealLines, useGsap } from "@/lib/motion";

export default function InvestorRelations() {
  const ref = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [last, setLast] = useState(0);

  useGsap(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      revealLines(ref.current!.querySelector(".ir__title")!);
      gsap.from(".ir__row", {
        y: 30, opacity: 0, stagger: 0.08, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ".ir__list", start: "top 85%", once: true },
      });
      gsap.from(".ir__list > li", {
        "--rule": 0, stagger: 0.08, duration: 1.4, ease: "expo.inOut",
        scrollTrigger: { trigger: ".ir__list", start: "top 85%", once: true },
      });
    });

    // Floating preview follows the pointer across the list (desktop pointers only).
    mm.add(`${MQ.motion} and ${MQ.fine}`, () => {
      const list = ref.current!.querySelector<HTMLElement>(".ir__list")!;
      const table = ref.current!.querySelector<HTMLElement>(".ir__table")!;
      const el = previewRef.current!;
      const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = table.getBoundingClientRect();
        xTo(e.clientX - r.left);
        yTo(e.clientY - r.top);
      };
      list.addEventListener("pointermove", move);
      return () => list.removeEventListener("pointermove", move);
    });
  }, ref);

  const enter = (i: number) => {
    setHover(i);
    setLast(i);
  };

  return (
    <section ref={ref} id="investor-relations" className="ir section--light" data-header="light" aria-labelledby="ir-title">
      <div className="container">
        <header className="ir__head">
          <Eyebrow index="06">Shareholders</Eyebrow>
          <h2 id="ir-title" className="ir__title">
            Investor <em>relations</em>
          </h2>
          <div className="ir__aside">
            <p>
              Solstra Group plc is listed on the London Stock Exchange. Everything current and potential shareholders
              need, in one place.
            </p>
            <p className="label label--mono">LSE: SLST</p>
          </div>
        </header>

        <div className="ir__table">
          <div className="ir__cols label" aria-hidden="true">
            <span>No.</span>
            <span>Section</span>
            <span>Description</span>
            <span>Category</span>
          </div>
          <ul className="ir__list" onMouseLeave={() => setHover(null)}>
            {investorLinks.map((l, i) => (
              <li key={l.title}>
                <a
                  href="#investor-relations"
                  className={`ir__row ${hover === i ? "is-hover" : ""}`}
                  onMouseEnter={() => enter(i)}
                  onFocus={() => enter(i)}
                  onBlur={() => setHover(null)}
                  data-cursor="Open"
                >
                  <span className="ir__fill" aria-hidden="true" />
                  <span className="ir__index label label--mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ir__name">{l.title}</span>
                  <span className="ir__desc">{l.text}</span>
                  <span className="ir__meta label">{l.meta}</span>
                  <span className="ir__arrow" aria-hidden="true">
                    <Arrow />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div ref={previewRef} className={`ir__preview ${hover !== null ? "is-visible" : ""}`} aria-hidden="true">
            {investorLinks.map((l, i) => (
              <div key={l.title} className={`ir__preview-img ${last === i ? "is-current" : ""}`}>
                <Image className="img-grade" src={l.image} alt="" fill sizes="320px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
