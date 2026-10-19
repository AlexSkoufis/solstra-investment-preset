"use client";

import { useEffect, useRef } from "react";
import { MQ } from "@/lib/motion";

type Body = { orbit: number; angle: number; speed: number; size: number; node: boolean };

const PAPER = "246, 243, 238";
const ACCENT = "242, 164, 30";
const TILT = (-18 * Math.PI) / 180;

/**
 * Abstract "active minds" field: tilted orbits around a faintly banded body,
 * bodies travelling at Kepler-like speeds, and fine links drawn between bodies
 * that pass close to one another. Pointer adds a slow perspective drift; scroll
 * gently expands the system. Draws a single still frame for reduced motion.
 */
export default function OrbitField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = !matchMedia(MQ.motion).matches;

    let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, R = 0;
    let raf = 0, running = false, visible = true;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const ORBITS = 8;
    const rng = mulberry32(1991);
    const bodies: Body[] = [];
    for (let i = 0; i < 86; i++) {
      const orbit = Math.floor(rng() * ORBITS);
      bodies.push({
        orbit,
        angle: rng() * Math.PI * 2,
        speed: (0.00022 + rng() * 0.00008) / Math.pow((orbit + 2) / 3, 1.5),
        size: 0.6 + rng() * 1.1,
        node: rng() > 0.9,
      });
    }
    // The single accent body: "the opportunity".
    const accent: Body = { orbit: 5, angle: 0.7, speed: 0.00016, size: 2.6, node: true };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const wide = w >= 1024;
      cx = wide ? w * 0.7 : w * 0.62;
      cy = wide ? h * 0.46 : h * 0.34;
      R = wide ? Math.min(w * 0.42, h * 0.9) : Math.max(w * 0.62, 260);
    };

    const orbitRadius = (i: number, expand: number) => R * (0.26 + i * 0.105) * expand;

    const position = (b: Body, expand: number, tilt: number) => {
      const rx = orbitRadius(b.orbit, expand);
      const ry = rx * (0.34 + pointer.y * 0.04);
      const x = Math.cos(b.angle) * rx;
      const y = Math.sin(b.angle) * ry;
      return {
        x: cx + x * Math.cos(tilt) - y * Math.sin(tilt) + pointer.x * 14,
        y: cy + x * Math.sin(tilt) + y * Math.cos(tilt) + pointer.y * 10,
        front: Math.sin(b.angle) > 0,
      };
    };

    const draw = (t: number, dt: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      const scrollP = Math.min(window.scrollY / Math.max(h, 1), 1);
      const expand = 1 + scrollP * 0.22;
      const tilt = TILT + pointer.x * 0.05;

      ctx.clearRect(0, 0, w, h);

      // Central body with slow-moving horizontal bands, almost subliminal.
      const r = R * 0.15 * expand;
      const glow = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 3.2);
      glow.addColorStop(0, `rgba(${ACCENT}, 0.07)`);
      glow.addColorStop(1, `rgba(${ACCENT}, 0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(cx - r * 3.2, cy - r * 3.2, r * 6.4, r * 6.4);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx + pointer.x * 6, cy + pointer.y * 4, r, 0, Math.PI * 2);
      ctx.clip();
      const shade = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
      shade.addColorStop(0, "rgba(38, 50, 84, 1)");
      shade.addColorStop(1, "rgba(12, 18, 36, 1)");
      ctx.fillStyle = shade;
      ctx.fillRect(cx - r - 10, cy - r - 10, r * 2 + 20, r * 2 + 20);
      for (let i = 0; i < 9; i++) {
        const by = cy - r + ((i / 9) * 2 * r + ((t * 0.004) % ((2 * r) / 9)));
        ctx.fillStyle = `rgba(${i % 3 === 1 ? ACCENT : PAPER}, ${i % 3 === 1 ? 0.05 : 0.035})`;
        ctx.fillRect(cx - r - 10, by, r * 2 + 20, r * (0.05 + (i % 4) * 0.025));
      }
      ctx.restore();
      ctx.beginPath();
      ctx.arc(cx + pointer.x * 6, cy + pointer.y * 4, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${PAPER}, 0.18)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Orbits.
      for (let i = 0; i < ORBITS; i++) {
        const rx = orbitRadius(i, expand);
        ctx.beginPath();
        ctx.ellipse(cx + pointer.x * 14, cy + pointer.y * 10, rx, rx * (0.34 + pointer.y * 0.04), tilt, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${PAPER}, ${i === accent.orbit ? 0.2 : 0.075 + (i % 2) * 0.03})`;
        ctx.lineWidth = 1;
        ctx.setLineDash(i % 3 === 2 ? [2, 6] : []);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Bodies and proximity links.
      const pts = bodies.map((b) => {
        b.angle += b.speed * dt;
        return { ...position(b, expand, tilt), b };
      });
      const LINK = Math.min(110, R * 0.22);
      ctx.lineWidth = 0.6;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(${PAPER}, ${(1 - d / LINK) * 0.22})`;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.b.size * (p.front ? 1 : 0.7), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PAPER}, ${p.front ? 0.85 : 0.35})`;
        ctx.fill();
        if (p.b.node) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${PAPER}, 0.25)`;
          ctx.stroke();
        }
      }

      // Accent body with a fading trail and a fine crosshair.
      accent.angle += accent.speed * dt;
      const trail = 26;
      for (let k = trail; k >= 0; k--) {
        const ghost = { ...accent, angle: accent.angle - k * 0.012 };
        const p = position(ghost, expand, tilt);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT}, ${(1 - k / trail) * 0.5})`;
        ctx.fill();
      }
      const a = position(accent, expand, tilt);
      ctx.beginPath();
      ctx.arc(a.x, a.y, accent.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${ACCENT})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${ACCENT}, 0.5)`;
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.arc(a.x, a.y, 10 + Math.sin(t * 0.002) * 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(a.x - 22, a.y); ctx.lineTo(a.x - 14, a.y);
      ctx.moveTo(a.x + 14, a.y); ctx.lineTo(a.x + 22, a.y);
      ctx.moveTo(a.x, a.y - 22); ctx.lineTo(a.x, a.y - 14);
      ctx.moveTo(a.x, a.y + 14); ctx.lineTo(a.x, a.y + 22);
      ctx.stroke();
    };

    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(t - last, 48);
      last = t;
      draw(t, dt);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw(0, 0);
    start();

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(performance.now(), 0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (matchMedia(MQ.fine).matches) window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
