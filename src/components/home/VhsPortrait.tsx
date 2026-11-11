"use client";

import { useEffect, useRef } from "react";
import { Photo } from "@/components/Photo";

const FPS = 30;
const SLICES = 3;
const NOISE_SIZE = 96;
/** Glitches per series: each one stronger than the last, then a calm pause and it starts over */
const EVENTS_PER_SERIES = 6;

const photoProps = { name: "portrait", widths: [480, 960], sizes: "280px", width: 960, height: 960 };

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

type Kind = "tracking" | "tear" | "chroma" | "snow" | "roll" | "freeze" | "dropout";
/** seed: random parameters picked when a glitch starts (fixed for freeze and the edge defect) */
type Glitch = { kind: Kind; start: number; duration: number; level: number; seed: number[] };

const DURATION: Record<Kind, [number, number]> = {
  tracking: [1400, 2000], // a band slowly rolls from top to bottom
  tear: [350, 700], // the frame tears sideways in strips
  chroma: [600, 1000], // colours split apart and rejoin
  snow: [250, 500], // a short burst of snow
  roll: [300, 500], // the frame jumps vertically
  freeze: [700, 1300], // the frame freezes while shifted
  dropout: [1100, 1700], // the signal drops out and returns with an edge defect
};

/**
 * Portrait with analogue interference (VHS / TV): separate glitches one after another — tracking band, frame tear,
 * colour split, snow, frame jump. Within a series each is stronger than the last, then a pause.
 * Animates only while visible; with prefers-reduced-motion it is a plain photo.
 */
export function VhsPortrait({ alt }: { alt: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const redRef = useRef<HTMLDivElement>(null);
  const cyanRef = useRef<HTMLDivElement>(null);
  const sliceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bandRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLCanvasElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = noiseRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const noise = ctx.createImageData(NOISE_SIZE, NOISE_SIZE);
    let frame = 0;
    let last = 0;
    let visible = false;
    let current: Glitch | null = null;
    let nextAt = 0;
    let index = 0;

    const schedule = (now: number) => {
      // Long calm pause after a series, 1.5–4 s between glitches within one
      const calm = index === 0 ? rand(2500, 4000) : rand(1500, 4000);
      nextAt = now + calm;
    };

    let lastKind: Kind | null = null;
    const startGlitch = (now: number) => {
      // Each one slightly stronger than the previous, with a little random spread
      const level = Math.min(1, 0.3 + (0.7 * index) / (EVENTS_PER_SERIES - 1) + rand(-0.08, 0.08));
      // Heavy glitches come late in the series; the same kind never repeats twice in a row
      const kinds: Kind[] = (index < 2 ? ["tracking", "chroma", "tear", "roll"] : ["tracking", "tear", "chroma", "snow", "roll", "freeze", "dropout"]).filter((k) => k !== lastKind) as Kind[];
      const kind = pick(kinds);
      lastKind = kind;
      const [min, max] = DURATION[kind];
      current = { kind, start: now, duration: rand(min, max), level, seed: Array.from({ length: 6 }, Math.random) };
      if (kind === "freeze") drawNoise(20 + 35 * level); // frozen snow is drawn once
      index = (index + 1) % EVENTS_PER_SERIES;
    };

    const drawNoise = (alpha: number) => {
      const d = noise.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = alpha;
      }
      ctx.putImageData(noise, 0, 0);
    };

    const reset = () => {
      baseRef.current!.style.transform = "";
      root.style.filter = "";
      for (const el of [redRef.current, cyanRef.current]) {
        el!.style.opacity = "0";
        el!.style.transform = "";
        el!.style.clipPath = "";
      }
      for (const el of sliceRefs.current) if (el) el.style.opacity = "0";
      bandRef.current!.style.opacity = "0";
      blackRef.current!.style.opacity = "0";
      ctx.clearRect(0, 0, NOISE_SIZE, NOISE_SIZE);
    };

    const render = (g: Glitch, p: number) => {
      // p: glitch progress 0..1; env: smooth ramp up and down so the glitch fades in and out
      const env = Math.sin(Math.PI * p);
      const L = g.level;
      const [s0, s1, s2, s3] = g.seed;
      // Freeze does not redraw the frame — keep the frozen noise
      if (g.kind !== "freeze") reset();

      switch (g.kind) {
        case "tracking": {
          const band = bandRef.current!;
          band.style.opacity = String(0.35 + 0.35 * L);
          band.style.top = `${-15 + p * 125}%`;
          // The frame shifts slightly next to the band
          const near = sliceRefs.current[0]!;
          const top = Math.max(0, -15 + p * 125);
          near.style.opacity = "1";
          near.style.clipPath = `inset(${top}% 0 ${Math.max(0, 100 - top - 10)}% 0)`;
          near.style.transform = `translateX(${(rand(4, 10) * L).toFixed(0)}px)`;
          drawNoise(20 + 30 * L * env);
          break;
        }
        case "tear": {
          const count = L > 0.6 ? SLICES : 2;
          for (let i = 0; i < count; i++) {
            const el = sliceRefs.current[i]!;
            if (Math.random() < 0.35) continue; // strips flicker instead of standing still
            const top = rand(5, 90);
            const h = rand(3, 6 + 10 * L);
            el.style.opacity = "1";
            el.style.clipPath = `inset(${top}% 0 ${Math.max(0, 100 - top - h)}% 0)`;
            el.style.transform = `translateX(${(rand(-1, 1) * (12 + 40 * L) * env).toFixed(0)}px)`;
          }
          baseRef.current!.style.transform = `translateX(${(rand(-1, 1) * 3 * L).toFixed(1)}px)`;
          break;
        }
        case "chroma": {
          const shift = (3 + 10 * L) * env;
          redRef.current!.style.opacity = String(0.7 * env);
          redRef.current!.style.transform = `translateX(${(-shift).toFixed(1)}px)`;
          cyanRef.current!.style.opacity = String(0.7 * env);
          cyanRef.current!.style.transform = `translateX(${shift.toFixed(1)}px)`;
          root.style.filter = `contrast(${1 + 0.2 * env})`;
          break;
        }
        case "snow": {
          drawNoise((90 + 140 * L) * env);
          root.style.filter = `brightness(${1 + 0.15 * env})`;
          break;
        }
        case "freeze": {
          // Frame is stuck: shift and torn strip hold still, then a jerk and release at the end
          const release = p > 0.85;
          baseRef.current!.style.transform = release ? `translateX(${(rand(-1, 1) * 6 * L).toFixed(1)}px)` : `translate(${((s0 - 0.5) * 16 * L).toFixed(1)}px, ${((s1 - 0.5) * 4 * L).toFixed(1)}%)`;
          const el = sliceRefs.current[0]!;
          const top = 10 + s2 * 70;
          const h = 6 + 10 * L;
          el.style.opacity = release ? "0" : "1";
          el.style.clipPath = `inset(${top}% 0 ${Math.max(0, 100 - top - h)}% 0)`;
          el.style.transform = `translateX(${((s3 - 0.5) * 70 * L).toFixed(0)}px)`;
          root.style.filter = release ? "" : `contrast(${1 + 0.25 * L}) brightness(${1 - 0.08 * L})`;
          if (release) ctx.clearRect(0, 0, NOISE_SIZE, NOISE_SIZE);
          break;
        }
        case "dropout": {
          const black = blackRef.current!;
          if (p < 0.15) {
            // The picture collapses vertically and darkens
            const q = p / 0.15;
            baseRef.current!.style.transform = `scaleY(${(1 - 0.85 * q).toFixed(2)})`;
            root.style.filter = `brightness(${1 + q * 0.6})`;
            black.style.opacity = String(q * 0.6);
          } else if (p < 0.5) {
            // No signal: dark screen and faint snow
            black.style.opacity = "0.92";
            drawNoise(45 + 60 * L);
          } else {
            // Signal is back with an edge defect: a strip at the left or right edge is shifted and jitters
            const q = (p - 0.5) / 0.5;
            const fade = 1 - q;
            black.style.opacity = String(Math.max(0, 0.5 - q * 2));
            const right = s0 > 0.5;
            const width = 12 + 18 * L;
            const edge = sliceRefs.current[1]!;
            edge.style.opacity = "1";
            edge.style.clipPath = right ? `inset(0 0 0 ${100 - width}%)` : `inset(0 ${100 - width}% 0 0)`;
            edge.style.transform = `translate(${((right ? 1 : -1) * rand(2, 10) * L * fade).toFixed(1)}px, ${(rand(-1, 1) * 12 * L * fade).toFixed(1)}%)`;
            const chroma = right ? cyanRef.current! : redRef.current!;
            chroma.style.opacity = String(0.6 * fade);
            chroma.style.clipPath = edge.style.clipPath;
            chroma.style.transform = `translateX(${((right ? 1 : -1) * 6 * L * fade).toFixed(1)}px)`;
            baseRef.current!.style.transform = `translateX(${(rand(-1, 1) * 3 * L * fade).toFixed(1)}px)`;
            drawNoise(30 * L * fade);
          }
          break;
        }
        case "roll": {
          const y = (p < 0.5 ? p * 2 : 2 - p * 2) * 12 * L;
          baseRef.current!.style.transform = `translateY(${(-y).toFixed(1)}%)`;
          bandRef.current!.style.opacity = String(0.5 * env);
          bandRef.current!.style.top = `${90 - y * 4}%`;
          drawNoise(40 * env);
          break;
        }
      }
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - last < 1000 / FPS) return;
      last = now;

      if (!current && now >= nextAt) startGlitch(now);
      if (current) {
        const p = (now - current.start) / current.duration;
        if (p >= 1) {
          current = null;
          reset();
          schedule(now);
        } else {
          render(current, p);
        }
      }
    };

    const run = () => {
      if (frame) return;
      schedule(performance.now());
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      current = null;
      reset();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) run();
      else stop();
    });
    observer.observe(root);
    const onVisibility = () => (document.hidden || !visible ? stop() : run());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className="scanlines relative overflow-hidden">
      <div ref={baseRef} className="origin-center will-change-transform">
        <Photo {...photoProps} alt={alt} className="w-full grayscale" />
      </div>

      {/* Colour ghosts, red and cyan, split apart during a glitch */}
      <div ref={redRef} aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen">
        <Photo {...photoProps} alt="" className="w-full [filter:grayscale(1)_sepia(1)_saturate(6)_hue-rotate(-50deg)_brightness(0.8)]" />
      </div>
      <div ref={cyanRef} aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen">
        <Photo {...photoProps} alt="" className="w-full [filter:grayscale(1)_sepia(1)_saturate(6)_hue-rotate(140deg)_brightness(0.8)]" />
      </div>

      {/* Torn strips: copies of the frame clipped vertically and shifted sideways */}
      {Array.from({ length: SLICES }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            sliceRefs.current[i] = el;
          }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0"
        >
          <Photo {...photoProps} alt="" className="w-full grayscale" />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 bg-phosphor/15 mix-blend-color" />

      <div ref={blackRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#050807] opacity-0" />
      <div
        ref={bandRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 h-[12%] bg-gradient-to-b from-transparent via-white/40 to-transparent opacity-0 blur-[2px]"
      />
      <canvas
        ref={noiseRef}
        width={NOISE_SIZE}
        height={NOISE_SIZE}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full [image-rendering:pixelated]"
      />
    </div>
  );
}
