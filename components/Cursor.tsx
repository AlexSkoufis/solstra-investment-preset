"use client";

import { useEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/motion";

/**
 * Desktop-only cursor: a small dot that lerps behind the pointer and opens into
 * a labelled ring over [data-cursor] elements. Also drives [data-magnetic] pull.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia(MQ.fine).matches || !matchMedia(MQ.motion).matches) return;

    document.documentElement.classList.add("has-cursor");
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      el.classList.add("is-visible");
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element;
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      const interactive = target.closest("a, button, [role='button'], input, label");
      el.classList.toggle("is-label", !!labelled);
      el.classList.toggle("is-link", !labelled && !!interactive);
      if (labelled && labelRef.current) labelRef.current.textContent = labelled.dataset.cursor ?? "";
    };
    const onLeave = () => el.classList.remove("is-visible");
    const onDown = () => el.classList.add("is-down");
    const onUp = () => el.classList.remove("is-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    // Magnetic elements: pull the element and, slightly further, its label.
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

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span className="cursor__ring">
        <span ref={labelRef} className="cursor__label" />
      </span>
    </div>
  );
}
