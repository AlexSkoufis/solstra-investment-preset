"use client";

import Image from "next/image";
import { useRef } from "react";
import { pathways } from "@/lib/content";
import { Arrow, Eyebrow } from "../ui/Button";
import { gsap, MQ, revealLines, useGsap } from "@/lib/motion";

export default function Pathways() {
  const ref = useRef<HTMLElement>(null);

  useGsap(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      revealLines(ref.current!.querySelector(".paths__title")!);
      gsap.from(".path", {
        yPercent: 12,
        opacity: 0,
        duration: 1.4,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: ".paths__panels", start: "top 85%", once: true },
      });
    });
  }, ref);

  return (
    <section ref={ref} id="pathways" className="paths section--light" data-header="light" aria-labelledby="paths-title">
      <div className="container">
        <header className="paths__head">
          <Eyebrow index="05">Your pathway</Eyebrow>
          <h2 id="paths-title" className="paths__title">
            Insight for every kind of <em>investor</em>.
          </h2>
          <p className="paths__lede">
            Choose the view that fits you best — each is tailored with the funds, insights and support relevant to how you
            invest.
          </p>
        </header>
      </div>

      <div className="paths__panels container container--wide">
        {pathways.map((p, i) => (
          <a key={p.title} href="#pathways" className="path" data-cursor="Enter">
            <div className="path__media" aria-hidden="true">
              <Image className="img-grade" src={p.image} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" />
            </div>
            <span className="path__index label label--mono">{String(i + 1).padStart(2, "0")}</span>
            <span className="path__vertical label" aria-hidden="true">{p.title} investors</span>
            <div className="path__body">
              <h3 className="path__title">
                {p.title}
                <span className="sr-only"> investors</span>
              </h3>
              <p className="path__desc">{p.text}</p>
              <span className="path__cta label">
                Enter site
                <Arrow />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
