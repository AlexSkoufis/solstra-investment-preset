"use client";

import Image from "next/image";
import { useRef } from "react";
import { Button, Eyebrow } from "../ui/Button";
import { gsap, MQ, revealLines, useGsap } from "@/lib/motion";

export default function Careers() {
  const ref = useRef<HTMLElement>(null);

  useGsap(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      revealLines(ref.current!.querySelector(".careers__title")!, { stagger: 0.14 });

      // Image opens out from a centred geometric window, then keeps a slow parallax.
      gsap.fromTo(".careers__media", { clipPath: "inset(18% 22% 18% 22%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", ease: "none",
        scrollTrigger: { trigger: ".careers__media", start: "top 90%", end: "center 55%", scrub: 0.8 },
      });
      gsap.fromTo(".careers__media img", { yPercent: -8, scale: 1.18 }, {
        yPercent: 8, scale: 1.06, ease: "none",
        scrollTrigger: { trigger: ".careers__media", start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.fromTo(".careers__portrait", { yPercent: 30 }, {
        yPercent: -20, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.from(".careers__copy > *", {
        y: 30, opacity: 0, stagger: 0.1, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: ".careers__copy", start: "top 85%", once: true },
      });
    });
  }, ref);

  return (
    <section ref={ref} id="careers" className="careers section--light" data-header="light" aria-labelledby="careers-title">
      <div className="container careers__grid">
        <div className="careers__intro">
          <Eyebrow index="07">Working at Solstra</Eyebrow>
          <h2 id="careers-title" className="careers__title">
            Build what
            <br />
            <em>comes next</em>.
          </h2>
        </div>

        <figure className="careers__media">
          <Image
            className="img-grade"
            src="/images/careers.jpg"
            alt="Colleagues gathered around a table in conversation"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
          />
        </figure>

        <figure className="careers__portrait" aria-hidden="true">
          <Image className="img-grade" src="/images/portrait.jpg" alt="" fill sizes="(min-width: 1024px) 22vw, 40vw" />
        </figure>

        <div className="careers__copy">
          <p className="careers__lede">
            Our people are our edge. We give them the freedom to think independently, the support to grow, and the
            responsibility that comes with genuine ownership.
          </p>
          <ul className="careers__values label">
            <li>Freedom to think</li>
            <li>Room to grow</li>
            <li>Shared ownership</li>
          </ul>
          <Button href="#careers" variant="solid" cursor="Explore">
            Explore careers
          </Button>
        </div>
      </div>
    </section>
  );
}
