"use client";

import Image from "next/image";
import { useRef } from "react";
import { chapters } from "@/lib/content";
import { Eyebrow } from "../ui/Button";
import { gsap, MQ, revealLines, useGsap } from "@/lib/motion";

const pad = (n: number) => String(n).padStart(2, "0");

export default function ActiveMinds() {
  const ref = useRef<HTMLElement>(null);

  useGsap(() => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      revealLines(ref.current!.querySelector(".minds__heading")!);
    });

    // Desktop: one scrubbed timeline across the tall track while the stage stays sticky.
    mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
      const n = chapters.length;
      const titles = gsap.utils.toArray<HTMLElement>(".minds__title-inner");
      const texts = gsap.utils.toArray<HTMLElement>(".minds__text");
      const media = gsap.utils.toArray<HTMLElement>(".minds__media");
      const imgs = media.map((m) => m.querySelector(".minds__img"));
      const dot = ref.current!.querySelector<HTMLElement>(".minds__orbit-dot")!;
      const orbit = ref.current!.querySelector<HTMLElement>(".minds__orbit")!;

      gsap.set(titles.slice(1), { yPercent: 140 });
      gsap.set(texts.slice(1), { opacity: 0, y: 24 });
      gsap.set(media.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(imgs, { scale: 1.12 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 0.6 },
        scrollTrigger: {
          trigger: ".minds__track",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            // Travel along a tilted ellipse: one full orbit across the chapters.
            const a = self.progress * Math.PI * 2 - Math.PI / 2;
            const rx = orbit.offsetWidth / 2, ry = orbit.offsetHeight / 2;
            gsap.set(dot, { x: Math.cos(a) * rx, y: Math.sin(a) * ry });
          },
        },
      });

      for (let i = 1; i < n; i++) {
        const at = (i - 1) + 0.5;
        tl.to(titles[i - 1], { yPercent: -140 }, at)
          .to(texts[i - 1], { opacity: 0, y: -24, duration: 0.4 }, at)
          .to(titles[i], { yPercent: 0 }, at + 0.15)
          .to(texts[i], { opacity: 1, y: 0, duration: 0.45 }, at + 0.3)
          .to(media[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75 }, at)
          .fromTo(imgs[i], { scale: 1.3 }, { scale: 1.08, duration: 0.9 }, at)
          .to(imgs[i - 1], { yPercent: -10, duration: 0.75 }, at)
          .to(".minds__count-strip", { yPercent: -(100 / n) * i }, at + 0.1);
      }
      tl.to({}, { duration: 0.5 });

      gsap.fromTo(".minds__bar span", { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: ".minds__track", start: "top top", end: "bottom bottom", scrub: true },
      });
    });

    // Mobile / tablet: a composed vertical sequence with masked image reveals.
    mm.add(`${MQ.motion} and ${MQ.mobile}`, () => {
      gsap.utils.toArray<HTMLElement>(".minds__item").forEach((item) => {
        gsap.fromTo(item.querySelector(".minds__item-media"), { clipPath: "inset(12% 12% 12% 12%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out",
          scrollTrigger: { trigger: item, start: "top 80%", once: true },
        });
        gsap.from(item.querySelectorAll(".minds__item-text > *"), {
          y: 24, opacity: 0, stagger: 0.08, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 70%", once: true },
        });
      });
    });
  }, ref);

  return (
    <section ref={ref} id="active-minds" className="minds section--stone" data-header="light" aria-labelledby="minds-title">
      <div className="container minds__intro">
        <Eyebrow index="03">What guides us</Eyebrow>
        <h2 id="minds-title" className="minds__heading">
          Five qualities that shape <em>how we invest</em>.
        </h2>
      </div>

      {/* Desktop sticky stage */}
      <div className="minds__track" style={{ ["--n" as string]: chapters.length }}>
        <div className="minds__stage">
          <div className="minds__left">
            <div className="minds__count label label--mono" aria-hidden="true">
              <span className="minds__count-window">
                <span className="minds__count-strip">
                  {chapters.map((_, i) => (
                    <span key={i}>{pad(i + 1)}</span>
                  ))}
                </span>
              </span>
              <span>/ {pad(chapters.length)}</span>
            </div>

            <div className="minds__chapters">
              {chapters.map((c, i) => (
                <div key={c.title} className="minds__chapter">
                  <h3 className="minds__title">
                    <span className="minds__title-inner">{c.title}</span>
                  </h3>
                  <p className="minds__text">{c.text}</p>
                  {/* keep every chapter available to assistive tech regardless of scroll */}
                  <span className="sr-only">Chapter {i + 1} of {chapters.length}</span>
                </div>
              ))}
            </div>

            <div className="minds__bar" aria-hidden="true">
              <span />
            </div>
          </div>

          <div className="minds__right" aria-hidden="true">
            {chapters.map((c, i) => (
              <figure key={c.title} className="minds__media">
                <Image className="minds__img img-grade" src={c.image} alt="" fill sizes="(min-width: 1024px) 80vw, 100vw" />
                <figcaption className="minds__caption label label--mono">
                  Fig. {pad(i + 1)} — {c.title}
                </figcaption>
              </figure>
            ))}
            <div className="minds__orbit">
              <span className="minds__orbit-dot" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet sequence */}
      <ol className="minds__list container">
        {chapters.map((c, i) => (
          <li key={c.title} className="minds__item">
            <div className="minds__item-media">
              <Image className="img-grade" src={c.image} alt={c.alt} fill sizes="(min-width: 640px) 90vw, 100vw" />
            </div>
            <div className="minds__item-text">
              <span className="label label--mono">{pad(i + 1)} / {pad(chapters.length)}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
