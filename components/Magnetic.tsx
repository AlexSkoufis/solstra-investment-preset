"use client";

import { useEffect } from "react";
import { gsap, MQ } from "@/lib/motion";

/**
 * Desktop-only magnetic pull for [data-magnetic] elements: the element eases
 * toward the pointer and its [data-magnetic-inner] label travels slightly further.
 */
export default function Magnetic() {
  useEffect(() => {
    if (!matchMedia(MQ.fine).matches || !matchMedia(MQ.motion).matches) return;

    const cleanups: (() => void)[] = [];
    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((m) => {
      const inner = m.querySelector<HTMLElement>("[data-magnetic-inner]");
      const mx = gsap.quickTo(m, "x", { duration: 0.6, ease: "power3.out" });
      const my = gsap.quickTo(m, "y", { duration: 0.6, ease: "power3.out" });
      const ix = inner && gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3.out" });
      const iy = inner && gsap.quickTo(inner, "y", { duration: 0.6, ease: "power3.out" });
      const strength = Number(m.dataset.magnetic) || 8;
      const move = (e: PointerEvent) => {
        const r = m.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        mx(dx * strength);
        my(dy * strength * 0.6);
        ix?.(dx * strength * 0.4);
        iy?.(dy * strength * 0.3);
      };
      const reset = () => {
        mx(0); my(0); ix?.(0); iy?.(0);
      };
      m.addEventListener("pointermove", move);
      m.addEventListener("pointerleave", reset);
      cleanups.push(() => {
        m.removeEventListener("pointermove", move);
        m.removeEventListener("pointerleave", reset);
        gsap.set([m, inner].filter(Boolean), { clearProps: "transform" });
      });
    });

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
