"use client";

import { useEffect, useRef } from "react";

/**
 * - Adds `.in-view` to [data-reveal] / [data-stagger] elements when they enter the viewport
 * - Scroll progress bar (gold line at the top)
 * - Gentle hero parallax
 * Everything is passive + rAF-throttled and only touches transform/opacity.
 */
export default function ScrollEffects() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal],[data-stagger]");
    let observer: IntersectionObserver | null = null;

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("in-view");
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0 },
      );
      targets.forEach((el) => observer?.observe(el));
    } else {
      targets.forEach((el) => el.classList.add("in-view"));
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = document.querySelector<HTMLElement>(".hero");
    const pattern = hero?.querySelector<HTMLElement>(".hero-pattern") ?? null;
    const inner = hero?.querySelector<HTMLElement>(".hero-inner") ?? null;
    const bar = barRef.current;

    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      if (!reduceMotion && hero && pattern && inner) {
        const heroHeight = hero.offsetHeight;
        if (y < heroHeight) {
          pattern.style.transform = `translate3d(0, ${(y * 0.18).toFixed(1)}px, 0)`;
          inner.style.transform = `translate3d(0, ${(y * 0.08).toFixed(1)}px, 0)`;
          inner.style.opacity = String(Math.max(0, 1 - y / (heroHeight * 0.95)).toFixed(3));
        }
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div className="scroll-progress" ref={barRef} aria-hidden="true" />;
}
