"use client";

import { useEffect, useRef } from "react";
import { Photo } from "@/components/Photo";

const FPS = 30;
const SLICES = 3;
const NOISE_SIZE = 96;
/** Сколько помех в серии: каждая следующая сильнее, после серии — спокойная пауза и всё сначала */
const EVENTS_PER_SERIES = 6;

const photoProps = { name: "portrait", widths: [480, 960], sizes: "280px", width: 960, height: 960 };

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

type Kind = "tracking" | "tear" | "chroma" | "snow" | "roll" | "freeze" | "dropout";
/** seed — случайные параметры, выбранные в начале помехи (для «застревания» и дефекта края они не меняются) */
type Glitch = { kind: Kind; start: number; duration: number; level: number; seed: number[] };

const DURATION: Record<Kind, [number, number]> = {
  tracking: [1400, 2000], // полоса медленно проходит сверху вниз
  tear: [350, 700], // кадр «рвёт» полосами вбок
  chroma: [600, 1000], // цвета расходятся и сходятся
  snow: [250, 500], // короткая вспышка «снега»
  roll: [300, 500], // кадр подпрыгивает по вертикали
  freeze: [700, 1300], // кадр «застревает» сдвинутым
  dropout: [1100, 1700], // сигнал пропадает и возвращается с дефектом по краю
};

/**
 * Портрет с аналоговыми помехами (VHS / ТВ): отдельные помехи по очереди — полоса трекинга, разрыв кадра,
 * расхождение цветов, «снег», подскок кадра. В серии каждая следующая сильнее, затем пауза.
 * Анимация идёт, только пока портрет виден; при prefers-reduced-motion — обычное фото.
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
      // После серии — длинная спокойная пауза, внутри серии — 1,5–4 с между помехами
      const calm = index === 0 ? rand(2500, 4000) : rand(1500, 4000);
      nextAt = now + calm;
    };

    let lastKind: Kind | null = null;
    const startGlitch = (now: number) => {
      // Каждая следующая чуть сильнее предыдущей, с небольшим случайным разбросом
      const level = Math.min(1, 0.3 + (0.7 * index) / (EVENTS_PER_SERIES - 1) + rand(-0.08, 0.08));
      // Тяжёлые помехи — ближе к концу серии; один и тот же вид подряд не повторяется
      const kinds: Kind[] = (index < 2 ? ["tracking", "chroma", "tear", "roll"] : ["tracking", "tear", "chroma", "snow", "roll", "freeze", "dropout"]).filter((k) => k !== lastKind) as Kind[];
      const kind = pick(kinds);
      lastKind = kind;
      const [min, max] = DURATION[kind];
      current = { kind, start: now, duration: rand(min, max), level, seed: Array.from({ length: 6 }, Math.random) };
      if (kind === "freeze") drawNoise(20 + 35 * level); // застывший «снег» рисуется один раз
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
      // p — прогресс помехи 0..1; env — плавно вверх и вниз, чтобы помеха «приходила» и «уходила»
      const env = Math.sin(Math.PI * p);
      const L = g.level;
      const [s0, s1, s2, s3] = g.seed;
      // У «застревания» кадр не перерисовывается — держим застывший шум
      if (g.kind !== "freeze") reset();

      switch (g.kind) {
        case "tracking": {
          const band = bandRef.current!;
          band.style.opacity = String(0.35 + 0.35 * L);
          band.style.top = `${-15 + p * 125}%`;
          // Рядом с полосой кадр слегка сдвигается
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
            if (Math.random() < 0.35) continue; // полосы мерцают, а не стоят
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
          // Кадр застрял: сдвиг и сорванная полоса стоят на месте, в конце — рывок и отпускание
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
            // Картинка схлопывается по вертикали и темнеет
            const q = p / 0.15;
            baseRef.current!.style.transform = `scaleY(${(1 - 0.85 * q).toFixed(2)})`;
            root.style.filter = `brightness(${1 + q * 0.6})`;
            black.style.opacity = String(q * 0.6);
          } else if (p < 0.5) {
            // Сигнала нет: тёмный экран и слабый «снег»
            black.style.opacity = "0.92";
            drawNoise(45 + 60 * L);
          } else {
            // Сигнал вернулся с дефектом по краю: полоса у левого или правого края сдвинута и рябит
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

      {/* Цветовые «тени» — красная и голубая, расходятся при помехе */}
      <div ref={redRef} aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen">
        <Photo {...photoProps} alt="" className="w-full [filter:grayscale(1)_sepia(1)_saturate(6)_hue-rotate(-50deg)_brightness(0.8)]" />
      </div>
      <div ref={cyanRef} aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen">
        <Photo {...photoProps} alt="" className="w-full [filter:grayscale(1)_sepia(1)_saturate(6)_hue-rotate(140deg)_brightness(0.8)]" />
      </div>

      {/* Рваные полосы: копии кадра, обрезанные по высоте и сдвинутые вбок */}
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
