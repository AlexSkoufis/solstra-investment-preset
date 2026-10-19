"use client";

import { useRef } from "react";
import { Button, Eyebrow, GridLines } from "../ui/Button";
import { gsap, MQ, SplitText, useGsap } from "@/lib/motion";

export default function Intro() {
  const ref = useRef<HTMLElement>(null);

  useGsap(() => {
    // Trajectory: drawn in real pixels from the hero's scroll line (page centre)
    // and landing on the section label, so it stays accurate at every width.
    const section = ref.current!;
    const svg = section.querySelector<SVGSVGElement>(".intro__trajectory")!;
    const path = svg.querySelector<SVGPathElement>(".intro__path")!;
    const node = section.querySelector<HTMLElement>(".intro__node")!;
    const layout = () => {
      const s = section.getBoundingClientRect();
      const e = section.querySelector(".intro__eyebrow")!.getBoundingClientRect();
      const cx = s.width / 2;
      const ex = e.left - s.left - 22;
      const ey = e.top - s.top + e.height / 2;
      svg.setAttribute("viewBox", `0 0 ${s.width} ${s.height}`);
      path.setAttribute("d", `M${cx} 0 L${cx} ${ey * 0.3} C${cx} ${ey * 0.85} ${ex} ${ey * 0.5} ${ex} ${ey}`);
      node.style.left = `${ex}px`;
      node.style.top = `${ey}px`;
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(section);

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        ".intro__path",
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "center center", scrub: 0.8 },
        },
      );
      gsap.from(".intro__node", {
        scale: 0,
        transformOrigin: "50% 50%",
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "40% center", toggleActions: "play none none reverse" },
      });

      // Statement lights up word by word as it is read.
      const split = SplitText.create(".intro__statement", { type: "words", wordsClass: "word" });
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: ".intro__statement", start: "top 78%", end: "bottom 45%", scrub: true },
        },
      );

      gsap.from(".intro__aside > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ".intro__aside", start: "top 85%", once: true },
      });

      // Oversized outline words drift behind the content in opposite directions.
      gsap.fromTo(".intro__drift--a", { xPercent: 0 }, {
        xPercent: -18, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.fromTo(".intro__drift--b", { xPercent: -22 }, {
        xPercent: -4, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    return () => ro.disconnect();
  }, ref);

  return (
    <section ref={ref} id="active-thinking" className="intro section--light" data-header="light" aria-labelledby="intro-title">
      <GridLines />
      <svg className="intro__trajectory" aria-hidden="true">
        <path className="intro__path" pathLength={1} />
      </svg>
      <span className="intro__node" aria-hidden="true" />

      <div className="intro__drift intro__drift--a" aria-hidden="true">Independent — Active — Curious —</div>

      <div className="container intro__grid">
        <Eyebrow index="01" className="intro__eyebrow">
          Active thinking
        </Eyebrow>
        <h2 id="intro-title" className="intro__statement">
          We are an independent, high-conviction investment house. Our teams are free to{" "}
          <em>think for themselves</em> — and to follow the evidence wherever it leads.
        </h2>
        <div className="intro__aside">
          <p>
            We believe disciplined, active judgement makes a genuine difference to client outcomes. There is no house
            view: each team follows its own philosophy, backed by the resources of a global firm.
          </p>
          <Button href="#active-minds" variant="line" cursor="Read">
            How we think
          </Button>
        </div>
      </div>

      <div className="intro__drift intro__drift--b" aria-hidden="true">Conviction — Opportunity — Perspective —</div>
    </section>
  );
}
