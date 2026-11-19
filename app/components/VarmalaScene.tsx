"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

const SCENE_CSS = `/* Varmala scene: groom & bride walk towards each other as the visitor scrolls (--p goes 0 → 1). */
.vm-scene{--p:0;position:relative;max-width:680px;margin:0 auto;border-radius:20px;overflow:hidden;box-shadow:0 18px 50px #4a263022;border:1px solid #d3b57c;background:#fbe3b8}
.vm-scene svg{display:block;width:100%;height:auto}

.vm-groom{transform:translateX(calc(var(--p,0) * 106px))}
.vm-bride{transform:translateX(calc(var(--p,0) * -106px))}
.vm-breath{animation:vm-breath 3.4s ease-in-out infinite}
.vm-bride .vm-breath{animation-delay:-1.7s}
@keyframes vm-breath{50%{transform:translateY(-3px)}}
.vm-tilt-groom{transform:rotate(calc(var(--p,0) * 5deg))}
.vm-tilt-bride{transform:rotate(calc(var(--p,0) * -5deg))}

.vm-link{opacity:clamp(0,calc((var(--p,0) - .8) * 6),1)}
.vm-heart{transform:scale(clamp(0,calc((var(--p,0) - .86) * 8),1))}
.vm-pulse{animation:vm-pulse 1.4s ease-in-out infinite}
@keyframes vm-pulse{50%{transform:scale(1.14)}}
.vm-joy{opacity:clamp(0,calc((var(--p,0) - .84) * 7),1)}

.vm-twinkle{animation:vm-twinkle 1.9s ease-in-out infinite}
@keyframes vm-twinkle{0%,100%{transform:scale(.4);opacity:.3}50%{transform:scale(1.1);opacity:1}}

.vm-petal{animation:vm-fall 5.5s linear infinite;transform-origin:0 0}
@keyframes vm-fall{from{transform:translate(0,-10px) rotate(0)}to{transform:translate(var(--sx,20px),470px) rotate(420deg)}}

.vm-sway{animation:vm-sway 4.2s ease-in-out infinite}
@keyframes vm-sway{0%,100%{transform:rotate(-2.2deg)}50%{transform:rotate(2.2deg)}}
.vm-spin{animation:vm-spin 120s linear infinite}
@keyframes vm-spin{to{transform:rotate(360deg)}}
.vm-flame{animation:vm-flame 1.1s ease-in-out infinite}
@keyframes vm-flame{0%,100%{transform:scale(1,1)}50%{transform:scale(.86,1.14)}}

@media(max-width:700px){.vm-scene{border-radius:16px}}

.vm-blink{animation:vm-blink 5.2s ease-in-out infinite}
.vm-blink-b{animation-delay:-2.1s}
@keyframes vm-blink{0%,93%,100%{transform:scaleY(1)}96.5%{transform:scaleY(.08)}}
`;

/* ---------- helpers ---------- */
const MARIGOLD = ["#f59e0b", "#fbbf24", "#ea7a12", "#fcd34d"];
const SKIN_G = "#dfa77a";
const SKIN_B = "#e9b98f";
const GOLD = "#e0bf7e";
const WINE = "#7a1f36";

type GarlandProps = { x1: number; y1: number; x2: number; y2: number; sag: number; count?: number; r?: number };

/** Marigold garland (varmala): beads along a quadratic curve hanging between two points. */
function Garland({ x1, y1, x2, y2, sag, count = 24, r = 6.5 }: GarlandProps) {
  const mx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 + sag * 2;
  const pts = Array.from({ length: count + 1 }, (_, i) => {
    const t = i / count;
    const a = Math.pow(1 - t, 2);
    const b = 2 * (1 - t) * t;
    const c = t * t;
    return { x: +(a * x1 + b * mx + c * x2).toFixed(1), y: +(a * y1 + b * cy + c * y2).toFixed(1) };
  });
  return (
    <g>
      <path d={`M${x1} ${y1} Q${mx} ${cy} ${x2} ${y2}`} stroke="#7a4a12" strokeWidth="1.6" fill="none" />
      {pts.map((p, i) => (
        <g key={i}>
          {i % 6 === 3 && <ellipse cx={p.x} cy={p.y + r} rx="3" ry="6.5" fill="#3f8f3a" transform={`rotate(${i % 2 ? 20 : -20} ${p.x} ${p.y})`} />}
          <circle cx={p.x} cy={p.y} r={r} fill={MARIGOLD[i % 4]} />
          <circle cx={p.x} cy={p.y} r={r * 0.4} fill="#fff1b8" opacity=".55" />
        </g>
      ))}
    </g>
  );
}

/** Arch interior top edge (matches the arch path below) so toran strings start on the arch. */
const archY = (x: number) => {
  const xm = x > 320 ? 640 - x : x;
  const t = Math.sqrt(Math.max(0, (xm - 56) / 264));
  return 250 - 332 * t + 144 * t * t;
};

const STRINGS = [
  [78, 40], [108, 38], [140, 40], [170, 44], [200, 50], [230, 54], [260, 58], [290, 60], [320, 62],
  [350, 60], [380, 58], [410, 54], [440, 50], [470, 44], [500, 40], [532, 38], [562, 40],
] as const;

const PETALS = [
  [70, 18, 0], [130, -22, 1.2], [190, 26, 2.6], [250, -18, .6], [310, 22, 3.4], [370, -26, 1.9],
  [430, 18, 4.2], [490, -20, .9], [550, 24, 2.2], [160, 16, 4.8], [340, -14, 3.9], [520, 12, 5.1],
] as const;

const STARS = [[196, 150, 0], [444, 150, .5], [258, 112, 1.1], [382, 112, .3], [180, 262, 1.5], [460, 262, .8], [320, 96, 1.3]] as const;

/** Small zari flower used for embroidery. */
function Flower({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx="0" cy="-3.6" r="2.4" fill="#f0d27c" transform={`rotate(${a})`} />
      ))}
      <circle r="1.7" fill="#fff4c4" />
    </g>
  );
}

/** Stack of chooda bangles on the bride's wrist (side = -1 left, 1 right). */
function Bangles({ side }: { side: -1 | 1 }) {
  const wx = side * 29;
  const wy = -186;
  const bx = side * 0.754;
  const by = -0.656;
  const px = 0.656;
  const py = side * 0.754;
  return (
    <g strokeLinecap="round">
      {Array.from({ length: 6 }, (_, i) => {
        const cx = wx + bx * (3.6 * i + 3);
        const cy = wy + by * (3.6 * i + 3);
        return (
          <path
            key={i}
            d={`M${(cx - px * 7).toFixed(1)} ${(cy - py * 7).toFixed(1)} L${(cx + px * 7).toFixed(1)} ${(cy + py * 7).toFixed(1)}`}
            stroke={i % 3 === 1 ? "#e9c870" : "#d6203f"}
            strokeWidth={i % 3 === 1 ? 2.2 : 3.2}
          />
        );
      })}
    </g>
  );
}

export default function VarmalaScene() {
  const ref = useRef<HTMLDivElement>(null);

  // Scroll → progress (0 = standing apart, 1 = side by side), eased with a little inertia.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cur = 0;
    let target = 0;
    let raf = 0;
    const apply = () => el.style.setProperty("--p", cur.toFixed(4));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cur = 1;
      apply();
      return;
    }

    const tween = () => {
      raf = 0;
      const diff = target - cur;
      cur = Math.abs(diff) < 0.001 ? target : cur + diff * 0.12;
      apply();
      if (cur !== target) raf = requestAnimationFrame(tween);
    };
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const startTop = vh * 0.9;
      const endTop = Math.max(vh * 0.5 - rect.height / 2, vh * 0.06);
      const t = Math.min(1, Math.max(0, (startTop - rect.top) / Math.max(1, startTop - endTop)));
      target = t * t * (3 - 2 * t);
      if (!raf) raf = requestAnimationFrame(tween);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="vm-scene" ref={ref} data-reveal="zoom">
      <style>{SCENE_CSS}</style>
      <svg
        viewBox="0 0 640 560"
        role="img"
        aria-label="आयुष्मान सूरज एवं आयुष्मती शालू वरमाला लिए एक-दूसरे के पास आते हुए"
      >
        <defs>
          <linearGradient id="vm-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff2d9" />
            <stop offset="1" stopColor="#f8d6a4" />
          </linearGradient>
          <radialGradient id="vm-sun" cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#fffbe9" />
            <stop offset=".6" stopColor="#ffe6a8" stopOpacity=".7" />
            <stop offset="1" stopColor="#ffe6a8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="vm-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ecd09a" />
            <stop offset="1" stopColor="#cfa062" />
          </linearGradient>
          <linearGradient id="vm-lehenga" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d4152f" />
            <stop offset="1" stopColor="#8f0a22" />
          </linearGradient>
          <linearGradient id="vm-turban" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f2692e" />
            <stop offset="1" stopColor="#cf3c18" />
          </linearGradient>
          <linearGradient id="vm-skin-g" x1=".2" y1="0" x2=".8" y2="1">
            <stop offset="0" stopColor="#efbd92" />
            <stop offset="1" stopColor="#d3946a" />
          </linearGradient>
          <linearGradient id="vm-skin-b" x1=".2" y1="0" x2=".8" y2="1">
            <stop offset="0" stopColor="#f8d3b3" />
            <stop offset="1" stopColor="#e2a67e" />
          </linearGradient>
          <linearGradient id="vm-sherwani" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ecd8ab" />
            <stop offset=".5" stopColor="#fcf2da" />
            <stop offset="1" stopColor="#ead3a2" />
          </linearGradient>
          <linearGradient id="vm-stole" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#923049" />
            <stop offset="1" stopColor="#5a1228" />
          </linearGradient>
          <linearGradient id="vm-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f8e6a6" />
            <stop offset=".55" stopColor="#d9ae56" />
            <stop offset="1" stopColor="#b98430" />
          </linearGradient>
          <linearGradient id="vm-veil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ea3f5b" />
            <stop offset="1" stopColor="#bd1633" />
          </linearGradient>
          <linearGradient id="vm-choli" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cc1531" />
            <stop offset="1" stopColor="#980c24" />
          </linearGradient>
          <pattern id="vm-leheriya" width="15" height="15" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
            <rect width="15" height="15" fill="#f26b2c" />
            <rect y="5" width="15" height="3" fill="#d1306f" />
            <rect y="8" width="15" height="3" fill="#ffc23d" />
          </pattern>
        </defs>

        {/* ---------- backdrop ---------- */}
        <rect width="640" height="560" fill="url(#vm-sky)" />
        <circle cx="320" cy="270" r="250" fill="url(#vm-sun)" />
        <g transform="translate(320 270)">
          <g className="vm-spin" opacity=".55">
            {Array.from({ length: 12 }, (_, i) => (
              <ellipse key={i} cx="0" cy="-170" rx="15" ry="44" fill="none" stroke="#d9b878" strokeWidth="1.4" transform={`rotate(${i * 30})`} />
            ))}
            <circle r="128" fill="none" stroke="#d9b878" strokeWidth="1.2" strokeDasharray="2 7" />
            <circle r="212" fill="none" stroke="#d9b878" strokeWidth="1" />
          </g>
        </g>

        {/* mandap arch */}
        <path d="M56 470 V250 Q56 84 320 62 Q584 84 584 250 V470 Z" fill="#fff8ea" opacity=".45" />
        <path d="M56 470 V250 Q56 84 320 62 Q584 84 584 250 V470" fill="none" stroke={WINE} strokeWidth="16" />
        <path d="M56 470 V250 Q56 84 320 62 Q584 84 584 250 V470" fill="none" stroke="#d9b878" strokeWidth="4" />
        <circle cx="320" cy="54" r="9" fill="#d9b878" stroke={WINE} strokeWidth="2" />
        <path d="M312 70 Q320 84 328 70Z" fill="#d9b878" />

        {/* hanging marigold strings (toran) */}
        {STRINGS.map(([x, len], i) => {
          const y = Math.round(archY(x)) + 8;
          const n = Math.floor(len / 11);
          return (
            <g key={x} transform={`translate(${x} ${y})`}>
              <g className="vm-sway" style={{ animationDelay: `${-(i % 6) * 0.7}s` }}>
                <line x1="0" y1="0" x2="0" y2={n * 11} stroke="#7a4a12" strokeWidth="1.4" />
                {Array.from({ length: n }, (_, k) => (
                  <circle key={k} cx="0" cy={k * 11 + 5} r="5.2" fill={MARIGOLD[(k + i) % 4]} />
                ))}
                <circle cx="0" cy={n * 11 + 6} r="3.6" fill="#d9b878" />
              </g>
            </g>
          );
        })}

        {/* floor + rangoli */}
        <rect x="0" y="470" width="640" height="90" fill="url(#vm-floor)" />
        <line x1="0" y1="470" x2="640" y2="470" stroke="#b98a4a" strokeWidth="2" />
        <ellipse cx="320" cy="512" rx="230" ry="26" fill="none" stroke="#fff3d2" strokeWidth="2" strokeDasharray="3 8" opacity=".9" />
        <ellipse cx="320" cy="512" rx="150" ry="17" fill="none" stroke="#fff3d2" strokeWidth="1.6" opacity=".8" />

        {/* diyas */}
        {[96, 544].map((x) => (
          <g key={x} transform={`translate(${x} 496)`}>
            <path d="M-16 0 Q0 16 16 0 Z" fill="#b8651e" />
            <ellipse cx="0" cy="0" rx="16" ry="4" fill="#d98a2f" />
            <g transform="translate(0 -3)">
              <path className="vm-flame" d="M0 0 Q-8 -11 0 -27 Q8 -11 0 0Z" fill="#ffb21a" />
            </g>
          </g>
        ))}

        {/* ---------- BRIDE ---------- */}
        <g transform="translate(490 470) scale(.9)">
          <g className="vm-bride">
            <ellipse cx="0" cy="3" rx="98" ry="9" fill="#3b1a0f" opacity=".18" />
            <g className="vm-breath">
              {/* dupatta / veil behind */}
              <path d="M-52 -338 C-84 -270 -78 -190 -72 -138 L72 -138 C78 -190 84 -270 52 -338 C26 -384 -26 -384 -52 -338Z" fill="url(#vm-veil)" stroke="#e8c970" strokeWidth="3" />
              <path d="M-60 -300 C-74 -240 -70 -190 -66 -150 L66 -150 C70 -190 74 -240 60 -300 C30 -340 -30 -340 -60 -300Z" fill="#ff8aa0" opacity=".2" />
              <path d="M-72 -138 H72" stroke="#f1d27a" strokeWidth="4" strokeDasharray="7 3" />
              {/* lehenga */}
              <path d="M-34 -176 C-42 -120 -64 -60 -98 -8 Q0 8 98 -8 C64 -60 42 -120 34 -176Z" fill="url(#vm-lehenga)" />
              <path d="M-14 -172 C-22 -110 -42 -50 -58 -4 M14 -172 C22 -110 42 -50 58 -4" stroke="#5e0415" strokeWidth="8" opacity=".16" fill="none" />
              <path d="M-26 -170 C-36 -110 -60 -56 -80 -6 M26 -170 C36 -110 60 -56 80 -6 M0 -172 L0 0" stroke="#ff8a9c" strokeWidth="1.4" opacity=".3" fill="none" />
              <path d="M-98 -8 Q0 8 98 -8 L90 -30 Q0 -12 -90 -30Z" fill="url(#vm-gold)" />
              <path d="M-92 -24 Q0 -6 92 -24" stroke="#7a0b1f" strokeWidth="2.6" fill="none" />
              <path d="M-88 -16 Q0 2 88 -16" stroke="#fff0b8" strokeWidth="2" strokeDasharray="1 6" strokeLinecap="round" fill="none" />
              {[[-46, -78, 1], [0, -66, 1.15], [46, -78, 1], [-26, -118, .85], [26, -118, .85], [0, -148, .7], [-66, -44, .9], [66, -44, .9], [-22, -42, .75], [22, -42, .75]].map(([x, y, s]) => (
                <Flower key={`${x}${y}`} x={x} y={y} s={s} />
              ))}
              {/* blouse + belt */}
              <path d="M-35 -250 Q-42 -205 -34 -170 L34 -170 Q42 -205 35 -250 Q0 -260 -35 -250Z" fill="url(#vm-choli)" />
              <path d="M-36 -178 L36 -178 L35 -166 L-35 -166Z" fill="url(#vm-gold)" />
              {[-26, -13, 0, 13, 26].map((x) => (
                <circle key={x} cx={x} cy="-160" r="2.4" fill="#f0d27c" />
              ))}
              <path d="M-21 -252 Q-10 -234 0 -243 Q10 -234 21 -252" stroke="url(#vm-gold)" strokeWidth="3.2" fill="none" />
              <path d="M-30 -228 Q-22 -222 -16 -230 M30 -228 Q22 -222 16 -230" stroke="#f0d27c" strokeWidth="1.6" fill="none" opacity=".8" />
              {/* neck + jewellery */}
              <rect x="-8" y="-272" width="16" height="24" fill="#e6ac82" />
              <ellipse cx="0" cy="-268" rx="11" ry="4" fill="#9a5a38" opacity=".22" />
              <path d="M-24 -251 Q0 -224 24 -251" stroke="url(#vm-gold)" strokeWidth="5.5" fill="none" />
              {[-16, -8, 0, 8, 16].map((x, i) => (
                <circle key={x} cx={x} cy={-243 + (i === 2 ? 5 : Math.abs(x) === 8 ? 3 : 0)} r="2.2" fill={i % 2 ? "#2f9e5b" : "#d6203f"} />
              ))}
              <path d="M-27 -247 Q0 -194 27 -247" stroke="#fff7de" strokeWidth="3.4" fill="none" strokeDasharray="1 5.2" strokeLinecap="round" />
              <path d="M0 -212 C-5 -206 -4 -199 0 -195 C4 -199 5 -206 0 -212Z" fill="url(#vm-gold)" stroke="#a97a2a" strokeWidth=".8" />
              <circle cx="0" cy="-204" r="2" fill="#d6203f" />
              {/* arms */}
              <path d="M-32 -244 Q-52 -206 -29 -186" stroke="#e6ac82" strokeWidth="15" strokeLinecap="round" fill="none" />
              <path d="M32 -244 Q52 -206 29 -186" stroke="#e6ac82" strokeWidth="15" strokeLinecap="round" fill="none" />
              <path d="M-33 -246 Q-42 -232 -46 -222 M33 -246 Q42 -232 46 -222" stroke="#b60f2b" strokeWidth="17" strokeLinecap="round" fill="none" />
              <path d="M-40 -229 L-52 -223 M40 -229 L52 -223" stroke="url(#vm-gold)" strokeWidth="3" strokeLinecap="round" />
              {/* head (tilts toward groom) */}
              <g transform="translate(0 -268)">
                <g className="vm-tilt-bride">
                  <g transform="translate(0 268)">
                    <path d="M-25 -298 C-25 -320 25 -320 25 -298 C25 -282 16 -268 0 -266 C-16 -268 -25 -282 -25 -298Z" fill="url(#vm-skin-b)" />
                    <path d="M-26 -298 C-30 -330 30 -330 26 -298 C20 -318 8 -322 0 -322 C-8 -322 -20 -318 -26 -298Z" fill="#241010" />
                    <path d="M-16 -314 Q0 -324 16 -314" stroke="#6b3b34" strokeWidth="1.6" fill="none" opacity=".7" />
                    <path d="M0 -322 L0 -312" stroke="#d6203f" strokeWidth="2.2" />
                    <path d="M-33 -296 Q-38 -352 0 -354 Q38 -352 33 -296 L28 -300 Q26 -338 0 -338 Q-26 -338 -28 -300Z" fill="#d6203f" stroke="#e8c970" strokeWidth="2.5" />
                    <path d="M0 -318 L0 -311 M0 -318 Q-12 -314 -22 -304 M0 -318 Q12 -314 22 -304" stroke="#e0bf7e" strokeWidth="1.3" fill="none" />
                    <path d="M0 -312 C-4.5 -308 -3.5 -303 0 -300 C3.5 -303 4.5 -308 0 -312Z" fill="url(#vm-gold)" stroke="#a97a2a" strokeWidth=".7" />
                    <circle cx="0" cy="-306" r="1.5" fill="#d6203f" />
                    <circle cx="0" cy="-299" r="3.6" fill="none" stroke="#e0bf7e" strokeWidth="1" />
                    <circle cx="0" cy="-299" r="2.2" fill="#c1182f" />
                    <g transform="translate(0 -293)">
                      <g className="vm-blink vm-blink-b">
                        <g transform="translate(0 293)">
                          <path d="M-17 -293 Q-11 -298 -4 -293 Q-11 -289 -17 -293Z" fill="#fff" />
                          <path d="M4 -293 Q11 -298 17 -293 Q11 -289 4 -293Z" fill="#fff" />
                          <circle cx="-10.5" cy="-293.2" r="2.8" fill="#3a1d12" />
                          <circle cx="10.5" cy="-293.2" r="2.8" fill="#3a1d12" />
                          <circle cx="-9.6" cy="-294.2" r=".9" fill="#fff" />
                          <circle cx="11.4" cy="-294.2" r=".9" fill="#fff" />
                          <path d="M-18 -293 Q-11 -299 -4 -293 M4 -293 Q11 -299 18 -293" stroke="#140a08" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                          <path d="M-18 -293 L-21 -296 M18 -293 L21 -296" stroke="#140a08" strokeWidth="1.6" strokeLinecap="round" />
                        </g>
                      </g>
                    </g>
                    <path d="M-18 -302 Q-11 -308 -4 -303.5 M4 -303.5 Q11 -308 18 -302" stroke="#241010" strokeWidth="1.7" fill="none" strokeLinecap="round" />
                    <path d="M-1.5 -292 Q-4 -285 -2 -282 Q0 -281 2 -282" stroke="#a8663f" strokeWidth="1.3" fill="none" opacity=".6" strokeLinecap="round" />
                    <circle cx="5.5" cy="-281" r="4.4" fill="none" stroke="url(#vm-gold)" strokeWidth="1.5" />
                    <circle cx="5.5" cy="-276.4" r="1.7" fill="#fff7de" stroke="#d9b878" strokeWidth=".6" />
                    <path d="M-8.5 -276 Q-4 -280 0 -277.5 Q4 -280 8.5 -276 Q0 -267.5 -8.5 -276Z" fill="#c9183a" />
                    <path d="M-10 -277.5 q-1.6 -1.2 -2.6 -3 M10 -277.5 q1.6 -1.2 2.6 -3" stroke="#b9695a" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity=".7" />
                    <ellipse cx="0" cy="-271.5" rx="3.2" ry="1" fill="#fff" opacity=".35" />
                    <circle cx="-16" cy="-280" r="5" fill="#f08a8a" opacity=".3" />
                    <circle cx="16" cy="-280" r="5" fill="#f08a8a" opacity=".3" />
                    <path d="M-28 -284 L-28 -279 M28 -284 L28 -279" stroke="#e0bf7e" strokeWidth="1.4" />
                    <path d="M-32 -278 Q-28 -283 -24 -278 L-25 -270 L-31 -270Z M24 -278 Q28 -283 32 -278 L31 -270 L25 -270Z" fill="url(#vm-gold)" stroke="#a97a2a" strokeWidth=".6" />
                    <circle cx="-28" cy="-267" r="2" fill="#fff7de" />
                    <circle cx="28" cy="-267" r="2" fill="#fff7de" />
                  </g>
                </g>
              </g>
              {/* varmala in her hands */}
              <Garland x1={-28} y1={-182} x2={28} y2={-182} sag={66} count={22} />
              <Garland x1={-26} y1={-176} x2={26} y2={-176} sag={56} count={18} r={5} />
              <circle cx="-28" cy="-182" r="7.5" fill="#efbb92" />
              <circle cx="28" cy="-182" r="7.5" fill="#efbb92" />
              <path d="M-33 -179 q3 5 7 4 M-30 -176 q3 5 7 3 M33 -179 q-3 5 -7 4 M30 -176 q-3 5 -7 3" stroke="#b97a52" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <circle cx="-27" cy="-185" r="1.2" fill="#a3361f" />
              <circle cx="27" cy="-185" r="1.2" fill="#a3361f" />
              <Bangles side={-1} />
              <Bangles side={1} />
            </g>
            <text x="0" y="40" textAnchor="middle" fontSize="24" fontWeight="600" fill="#591b2b">आयुष्मती शालू</text>
          </g>
        </g>

        {/* ---------- GROOM ---------- */}
        <g transform="translate(150 470) scale(.9)">
          <g className="vm-groom">
            <ellipse cx="0" cy="3" rx="74" ry="9" fill="#3b1a0f" opacity=".18" />
            <g className="vm-breath">
              {/* juttis + churidar */}
              <path d="M-33 -135 L-5 -135 L-4 -12 L-32 -12Z M5 -135 L33 -135 L32 -12 L4 -12Z" fill="#f3e5c8" stroke="#d9c49a" strokeWidth="1" />
              <path d="M-32 -34 L-4 -34 M-32 -28 L-4 -28 M-32 -22 L-4 -22 M-32 -16 L-4 -16 M4 -34 L32 -34 M4 -28 L32 -28 M4 -22 L32 -22 M4 -16 L32 -16" stroke="#d3bd90" strokeWidth="1.6" />
              <path d="M-46 0 Q-48 -12 -28 -15 L-5 -15 L-2 0Z M46 0 Q48 -12 28 -15 L5 -15 L2 0Z" fill="#4a2312" stroke="#2a1208" strokeWidth="1" />
              <path d="M-40 -8 Q-24 -12 -8 -8 M40 -8 Q24 -12 8 -8" stroke="url(#vm-gold)" strokeWidth="2.2" fill="none" />
              <path d="M-47 -3 Q-52 -8 -46 -12 M47 -3 Q52 -8 46 -12" stroke="#d9b878" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              {/* sherwani */}
              <path d="M-50 -250 C-56 -215 -54 -185 -50 -168 C-60 -146 -64 -126 -66 -106 L66 -106 C64 -126 60 -146 50 -168 C54 -185 56 -215 50 -250 C20 -264 -20 -264 -50 -250Z" fill="url(#vm-sherwani)" stroke="#cfae6a" strokeWidth="1.4" />
              <path d="M-66 -106 L66 -106 L65 -119 L-65 -119Z" fill="url(#vm-gold)" />
              <path d="M-61 -112 H61" stroke="#8a5f1c" strokeWidth="2.6" strokeDasharray="2 6" />
              <rect x="-4.5" y="-262" width="9" height="150" fill="url(#vm-gold)" />
              <path d="M0 -262 V-112" stroke="#8a5f1c" strokeWidth="1.4" strokeDasharray="2 4" />
              {[-238, -214, -190, -166, -142].map((y) => (
                <g key={y}>
                  <circle cx="0" cy={y} r="3.4" fill="#fff3c4" stroke="#a97a2a" strokeWidth="1" />
                  <circle cx="-.8" cy={y - .8} r="1" fill="#fff" />
                </g>
              ))}
              <path d="M-50 -247 Q-30 -236 -12 -258 M50 -247 Q30 -236 12 -258" stroke="url(#vm-gold)" strokeWidth="2.2" fill="none" />
              <path d="M-40 -170 Q-30 -160 -20 -170 M40 -170 Q30 -160 20 -170" stroke="#d9b878" strokeWidth="1.6" fill="none" />
              {[[-26, -214], [-30, -190], [26, -214], [30, -190], [-24, -150], [24, -150]].map(([x, y]) => (
                <Flower key={`${x}${y}`} x={x} y={y} s={.8} />
              ))}
              {/* stole */}
              <path d="M-52 -252 L-26 -259 L48 -140 L26 -122Z" fill="url(#vm-stole)" />
              <path d="M-52 -252 L26 -122 M-26 -259 L48 -140" stroke="#e8c970" strokeWidth="2" />
              <path d="M26 -124 L48 -142 L54 -94 L32 -88Z" fill="url(#vm-stole)" />
              <path d="M31 -91 L54 -96" stroke="#e8c970" strokeWidth="2.6" />
              <path d="M32 -88 L32 -80 M37 -89 L37 -80 M42 -90 L42 -80 M47 -92 L47 -82 M52 -94 L52 -84" stroke="#e8c970" strokeWidth="1.8" strokeLinecap="round" />
              {/* collar, neck, kundan haar */}
              <path d="M-15 -262 L15 -262 L12 -250 L-12 -250Z" fill="#fcf2da" stroke="#d9b878" />
              <path d="M-15 -262 L15 -262" stroke="url(#vm-gold)" strokeWidth="2.4" />
              <rect x="-9.5" y="-274" width="19" height="22" fill="#d99b6e" />
              <ellipse cx="0" cy="-269" rx="12" ry="4.5" fill="#7a4326" opacity=".25" />
              <path d="M-21 -256 Q0 -222 21 -256" stroke="#fff7de" strokeWidth="4.2" fill="none" strokeDasharray="1 5.6" strokeLinecap="round" />
              <path d="M-24 -253 Q0 -204 24 -253" stroke="#fff7de" strokeWidth="4.2" fill="none" strokeDasharray="1 5.6" strokeLinecap="round" />
              <path d="M0 -216 C-6 -208 -5 -200 0 -195 C5 -200 6 -208 0 -216Z" fill="url(#vm-gold)" stroke="#a97a2a" strokeWidth=".9" />
              <circle cx="0" cy="-206" r="2.4" fill="#d6203f" />
              {/* arms */}
              <path d="M-48 -244 Q-68 -204 -36 -180" stroke="#f1e0b9" strokeWidth="21" strokeLinecap="round" fill="none" />
              <path d="M48 -244 Q68 -204 36 -180" stroke="#f1e0b9" strokeWidth="21" strokeLinecap="round" fill="none" />
              <path d="M-47 -192 L-35 -178 M47 -192 L35 -178" stroke="url(#vm-gold)" strokeWidth="5" strokeLinecap="round" />
              <path d="M-58 -222 Q-60 -208 -52 -198 M58 -222 Q60 -208 52 -198" stroke="#d9b878" strokeWidth="1.6" fill="none" />
              {/* head (tilts toward bride) */}
              <g transform="translate(0 -268)">
                <g className="vm-tilt-groom">
                  <g transform="translate(0 268)">
                    <ellipse cx="-28.5" cy="-295" rx="5" ry="7" fill="#c98b5f" />
                    <ellipse cx="28.5" cy="-295" rx="5" ry="7" fill="#c98b5f" />
                    <circle cx="-28" cy="-288" r="2" fill="#f1d27a" />
                    <circle cx="28" cy="-288" r="2" fill="#f1d27a" />
                    <path d="M-27 -300 C-27 -322 27 -322 27 -300 C27 -282 17 -266 0 -266 C-17 -266 -27 -282 -27 -300Z" fill="url(#vm-skin-g)" />
                    <path d="M-22 -284 Q0 -262 22 -284 Q18 -268 0 -266 Q-18 -268 -22 -284Z" fill="#3a2418" opacity=".12" />
                    <path d="M-38 -300 C-46 -332 -30 -358 0 -360 C30 -358 46 -332 38 -300 C22 -313 -22 -313 -38 -300Z" fill="url(#vm-leheriya)" stroke="#a8260f" strokeWidth="1" />
                    <path d="M-34 -313 C-12 -336 18 -340 38 -319 M-30 -326 C-8 -346 20 -348 36 -333 M-22 -338 C-4 -352 14 -352 26 -342" stroke="#000" strokeWidth="2.2" fill="none" opacity=".18" />
                    <path d="M-30 -318 C-10 -340 14 -344 32 -328" stroke="#fff" strokeWidth="2" fill="none" opacity=".25" />
                    <path d="M-38 -302 C-20 -315 20 -315 38 -302" stroke="url(#vm-gold)" strokeWidth="6" fill="none" />
                    <path d="M-36 -303 C-20 -314 20 -314 36 -303" stroke="#fff7de" strokeWidth="2.6" fill="none" strokeDasharray="1 5" strokeLinecap="round" />
                    <path d="M12 -322 Q36 -362 10 -384 Q26 -358 8 -326Z" fill="#fbf1cf" stroke="#d9b878" strokeWidth="1.2" />
                    <path d="M12 -330 Q24 -358 12 -374" stroke="#d9b878" strokeWidth="1" fill="none" />
                    <path d="M10 -330 C3 -322 4 -313 10 -308 C16 -313 17 -322 10 -330Z" fill="url(#vm-gold)" stroke="#a97a2a" strokeWidth="1" />
                    <circle cx="10" cy="-318" r="2.6" fill="#d6203f" />
                    <circle cx="0" cy="-306" r="2.4" fill="#c1182f" />
                    <g transform="translate(0 -297)">
                      <g className="vm-blink">
                        <g transform="translate(0 297)">
                          <path d="M-17 -297 Q-11 -302 -5 -297 Q-11 -293 -17 -297Z" fill="#fff" />
                          <path d="M5 -297 Q11 -302 17 -297 Q11 -293 5 -297Z" fill="#fff" />
                          <circle cx="-11" cy="-297" r="2.7" fill="#2a1710" />
                          <circle cx="11" cy="-297" r="2.7" fill="#2a1710" />
                          <circle cx="-10.2" cy="-297.9" r=".9" fill="#fff" />
                          <circle cx="11.8" cy="-297.9" r=".9" fill="#fff" />
                          <path d="M-17 -297 Q-11 -302.5 -5 -297 M5 -297 Q11 -302.5 17 -297" stroke="#1b0f0a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                        </g>
                      </g>
                    </g>
                    <path d="M-19 -306 Q-11 -310.5 -4 -306 M4 -306 Q11 -310.5 19 -306" stroke="#1f120c" strokeWidth="2.6" fill="none" strokeLinecap="round" />
                    <path d="M-1.5 -294 Q-4.5 -286 -2.4 -282.5 Q0 -281 2.4 -282.5 M1.5 -294 Q4.5 -286 2.4 -282.5" stroke="#9a5a36" strokeWidth="1.4" fill="none" opacity=".6" strokeLinecap="round" />
                    <path d="M0 -283 C-4 -287 -12 -288 -17 -283.5 C-12 -281.5 -6 -282 0 -279.5 C6 -282 12 -281.5 17 -283.5 C12 -288 4 -287 0 -283Z" fill="#2a1710" />
                    <path d="M-7 -275 Q0 -270 7 -275" stroke="#9a4a38" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    <circle cx="-19" cy="-284" r="5" fill="#e48a74" opacity=".28" />
                    <circle cx="19" cy="-284" r="5" fill="#e48a74" opacity=".28" />
                  </g>
                </g>
              </g>
              {/* varmala in his hands */}
              <Garland x1={-33} y1={-176} x2={33} y2={-176} sag={62} count={24} />
              <Garland x1={-31} y1={-170} x2={31} y2={-170} sag={52} count={20} r={5} />
              <circle cx="-33" cy="-176" r="8.5" fill="#e2a678" />
              <circle cx="33" cy="-176" r="8.5" fill="#e2a678" />
              <path d="M-38 -172 q3 5 8 4 M-35 -168 q3 5 8 3 M38 -172 q-3 5 -8 4 M35 -168 q-3 5 -8 3" stroke="#a96a42" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            </g>
            <text x="0" y="40" textAnchor="middle" fontSize="24" fontWeight="600" fill="#591b2b">आयुष्मान सूरज</text>
          </g>
        </g>

        {/* ---------- when they meet ---------- */}
        <g className="vm-link">
          <Garland x1={275} y1={312} x2={370} y2={306} sag={70} count={26} />
        </g>

        <g className="vm-joy">
          {STARS.map(([x, y, d]) => (
            <g key={`${x}${y}`} transform={`translate(${x} ${y})`}>
              <path className="vm-twinkle" style={{ animationDelay: `${d}s` }} d="M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4Z" fill="#f2c94c" />
            </g>
          ))}
          {PETALS.map(([x, sx, d], i) => (
            <g key={x} transform={`translate(${x} 20)`}>
              <ellipse
                className="vm-petal"
                rx="4.6"
                ry="8.5"
                fill={i % 3 === 0 ? "#f59e0b" : i % 3 === 1 ? "#f2a3b3" : "#fcd34d"}
                style={{ "--sx": `${sx}px`, animationDelay: `${-d}s`, animationDuration: `${4.6 + (i % 4) * 0.5}s` } as CSSProperties}
              />
            </g>
          ))}
        </g>
        <g transform="translate(320 196)">
          <g className="vm-heart">
            <g className="vm-pulse">
              <path d="M0 8 C-18 -5 -18 -24 -7 -24 C-2 -24 0 -19 0 -17 C0 -19 2 -24 7 -24 C18 -24 18 -5 0 8Z" fill="#d6203f" stroke="#fff3d2" strokeWidth="2" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
