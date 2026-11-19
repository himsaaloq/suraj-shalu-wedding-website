"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
// @ts-ignore: Next.js resolves CSS side-effect imports through its bundler.
import "./varmala.css";

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
            <ellipse cx="0" cy="3" rx="92" ry="9" fill="#3b1a0f" opacity=".18" />
            <g className="vm-breath">
              {/* veil behind */}
              <path d="M-48 -336 Q-72 -250 -66 -146 L66 -146 Q72 -250 48 -336 Q0 -380 -48 -336Z" fill="#d6203f" opacity=".92" stroke="#e8c970" strokeWidth="3" />
              {/* lehenga */}
              <path d="M-36 -174 Q-48 -96 -92 -10 Q0 6 92 -10 Q48 -96 36 -174Z" fill="url(#vm-lehenga)" />
              <path d="M-12 -170 Q-18 -90 -40 -8 M12 -170 Q18 -90 40 -8 M0 -170 L0 -2 M-24 -168 Q-34 -90 -66 -9 M24 -168 Q34 -90 66 -9" stroke="#f0d27c" strokeWidth="1.2" opacity=".35" fill="none" />
              <path d="M-92 -10 Q0 6 92 -10 L85 -30 Q0 -14 -85 -30Z" fill={GOLD} />
              {[[-40, -70], [0, -60], [40, -70], [-20, -112], [20, -112], [0, -140], [-58, -40], [58, -40]].map(([x, y]) => (
                <circle key={`${x}${y}`} cx={x} cy={y} r="3.2" fill="#f0d27c" />
              ))}
              {/* blouse */}
              <path d="M-35 -250 Q-42 -205 -34 -170 L34 -170 Q42 -205 35 -250 Q0 -260 -35 -250Z" fill="#b60f2b" />
              <path d="M-35 -174 L35 -174 L36 -164 L-36 -164Z" fill={GOLD} />
              <path d="M-18 -252 Q0 -228 18 -252" stroke={GOLD} strokeWidth="3" fill="none" />
              {/* neck + necklaces */}
              <rect x="-8" y="-272" width="16" height="24" fill={SKIN_B} />
              <path d="M-24 -250 Q0 -222 24 -250" stroke={GOLD} strokeWidth="5" fill="none" />
              <path d="M-26 -247 Q0 -196 26 -247" stroke="#f3dc95" strokeWidth="3" fill="none" strokeDasharray="1 5.5" strokeLinecap="round" />
              {/* arms */}
              <path d="M-32 -244 Q-52 -206 -29 -186" stroke={SKIN_B} strokeWidth="15" strokeLinecap="round" fill="none" />
              <path d="M32 -244 Q52 -206 29 -186" stroke={SKIN_B} strokeWidth="15" strokeLinecap="round" fill="none" />
              <path d="M-33 -246 Q-42 -232 -46 -222 M33 -246 Q42 -232 46 -222" stroke="#b60f2b" strokeWidth="17" strokeLinecap="round" fill="none" />
              {/* head (tilts toward groom) */}
              <g transform="translate(0 -268)">
                <g className="vm-tilt-bride">
                  <g transform="translate(0 268)">
                    <circle cx="0" cy="-294" r="27" fill={SKIN_B} />
                    <path d="M-27 -296 Q-28 -330 0 -332 Q28 -330 27 -296 Q14 -318 0 -318 Q-14 -318 -27 -296Z" fill="#2a1210" />
                    <path d="M0 -332 L0 -318" stroke="#d6203f" strokeWidth="2.4" />
                    <path d="M-33 -296 Q-38 -352 0 -354 Q38 -352 33 -296 L28 -300 Q26 -338 0 -338 Q-26 -338 -28 -300Z" fill="#d6203f" stroke="#e8c970" strokeWidth="2.5" />
                    <path d="M0 -318 L0 -310" stroke={GOLD} strokeWidth="1.5" />
                    <circle cx="0" cy="-308" r="3.6" fill={GOLD} />
                    <circle cx="0" cy="-308" r="1.6" fill="#d6203f" />
                    <circle cx="0" cy="-300" r="2.3" fill="#c1182f" />
                    <ellipse cx="-10" cy="-292" rx="3.4" ry="2.3" fill="#2a1210" />
                    <ellipse cx="10" cy="-292" rx="3.4" ry="2.3" fill="#2a1210" />
                    <path d="M-15 -299 Q-10 -302 -5 -299 M5 -299 Q10 -302 15 -299" stroke="#2a1210" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                    <circle cx="7" cy="-281" r="3.4" fill="none" stroke={GOLD} strokeWidth="1.4" />
                    <path d="M-7 -273 Q0 -268 7 -273 Q0 -277 -7 -273Z" fill="#c1182f" />
                    <circle cx="-17" cy="-280" r="5" fill="#f08a8a" opacity=".35" />
                    <circle cx="17" cy="-280" r="5" fill="#f08a8a" opacity=".35" />
                    <path d="M-29 -286 L-29 -276 M29 -286 L29 -276" stroke={GOLD} strokeWidth="1.4" />
                    <circle cx="-29" cy="-273" r="3.4" fill={GOLD} />
                    <circle cx="29" cy="-273" r="3.4" fill={GOLD} />
                  </g>
                </g>
              </g>
              {/* varmala in her hands */}
              <Garland x1={-28} y1={-182} x2={28} y2={-182} sag={66} count={22} />
              <Garland x1={-26} y1={-176} x2={26} y2={-176} sag={56} count={18} r={5} />
              <circle cx="-28" cy="-182" r="7.5" fill={SKIN_B} />
              <circle cx="28" cy="-182" r="7.5" fill={SKIN_B} />
              <path d="M-36 -192 L-30 -187 M-34 -196 L-27 -190 M36 -192 L30 -187 M34 -196 L27 -190" stroke="#d6203f" strokeWidth="3.4" strokeLinecap="round" />
              <path d="M-38 -189 L-32 -184 M38 -189 L32 -184" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
            </g>
            <text x="0" y="40" textAnchor="middle" fontSize="24" fontWeight="600" fill="#591b2b"> </text>
          </g>
        </g>

        {/* ---------- GROOM ---------- */}
        <g transform="translate(150 470) scale(.9)">
          <g className="vm-groom">
            <ellipse cx="0" cy="3" rx="72" ry="9" fill="#3b1a0f" opacity=".18" />
            <g className="vm-breath">
              {/* shoes + legs */}
              <path d="M-44 0 Q-44 -12 -26 -14 L-4 -14 L-2 0Z M44 0 Q44 -12 26 -14 L4 -14 L2 0Z" fill="#4a2312" />
              <circle cx="-44" cy="-4" r="2.6" fill="#d9b878" />
              <circle cx="44" cy="-4" r="2.6" fill="#d9b878" />
              <rect x="-34" y="-135" width="30" height="124" rx="6" fill="#f4e6c9" />
              <rect x="4" y="-135" width="30" height="124" rx="6" fill="#f4e6c9" />
              <path d="M-33 -30 L-5 -30 M-33 -22 L-5 -22 M5 -30 L33 -30 M5 -22 L33 -22" stroke="#d8c39a" strokeWidth="1.6" />
              {/* sherwani */}
              <path d="M-52 -250 Q-60 -170 -62 -112 L62 -112 Q60 -170 52 -250 Q0 -264 -52 -250Z" fill="#f7e8c9" stroke="#d9b878" strokeWidth="2" />
              <path d="M-62 -112 L62 -112 L61 -123 L-61 -123Z" fill="#d9b878" />
              <path d="M0 -262 V-114" stroke="#d9b878" strokeWidth="2.5" />
              {[-236, -212, -188, -164, -140].map((y) => (
                <circle key={y} cx="0" cy={y} r="3.2" fill="#b8862e" />
              ))}
              {/* stole */}
              <path d="M-52 -252 L-26 -258 L48 -140 L26 -122Z" fill={WINE} />
              <path d="M-52 -252 L26 -122" stroke={GOLD} strokeWidth="2.2" />
              <path d="M26 -124 L48 -142 L53 -94 L31 -88Z" fill={WINE} />
              <path d="M30 -92 L53 -97" stroke={GOLD} strokeWidth="2.4" />
              {/* collar, neck, mala */}
              <path d="M-15 -262 L15 -262 L12 -250 L-12 -250Z" fill="#f7e8c9" stroke="#d9b878" />
              <rect x="-9" y="-274" width="18" height="22" fill={SKIN_G} />
              <path d="M-20 -258 Q0 -226 20 -258" stroke="#fff6dc" strokeWidth="4.5" fill="none" strokeDasharray="1 6.5" strokeLinecap="round" />
              <path d="M-23 -255 Q0 -206 23 -255" stroke={GOLD} strokeWidth="3" fill="none" strokeDasharray="1 6" strokeLinecap="round" />
              {/* arms */}
              <path d="M-48 -244 Q-68 -204 -36 -180" stroke="#f7e8c9" strokeWidth="21" strokeLinecap="round" fill="none" />
              <path d="M48 -244 Q68 -204 36 -180" stroke="#f7e8c9" strokeWidth="21" strokeLinecap="round" fill="none" />
              {/* head (tilts toward bride) */}
              <g transform="translate(0 -268)">
                <g className="vm-tilt-groom">
                  <g transform="translate(0 268)">
                    <circle cx="-31" cy="-294" r="6" fill="#cf9568" />
                    <circle cx="31" cy="-294" r="6" fill="#cf9568" />
                    <circle cx="0" cy="-296" r="30" fill={SKIN_G} />
                    <path d="M-36 -302 Q-42 -346 0 -352 Q42 -346 36 -302 Q0 -322 -36 -302Z" fill="url(#vm-turban)" />
                    <path d="M-30 -318 Q0 -340 30 -318 M-34 -330 Q0 -352 34 -330 M-22 -340 Q0 -352 22 -340" stroke="#ffb067" strokeWidth="2.2" fill="none" opacity=".8" />
                    <path d="M-36 -304 Q0 -322 36 -304" stroke={GOLD} strokeWidth="5" fill="none" />
                    <circle cx="10" cy="-318" r="5" fill={GOLD} stroke="#b8862e" strokeWidth="1.2" />
                    <path d="M12 -322 Q34 -360 10 -380 Q24 -356 8 -326Z" fill="#f6e3a1" stroke="#d9b878" strokeWidth="1.2" />
                    <circle cx="0" cy="-308" r="2.6" fill="#c1182f" />
                    <circle cx="-11" cy="-298" r="2.6" fill="#2a1210" />
                    <circle cx="11" cy="-298" r="2.6" fill="#2a1210" />
                    <path d="M-17 -306 Q-11 -309 -5 -306 M5 -306 Q11 -309 17 -306" stroke="#2a1210" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    <path d="M-13 -285 Q0 -291 13 -285 Q0 -281 -13 -285Z" fill="#2a1210" />
                    <path d="M-8 -276 Q0 -270 8 -276" stroke="#8f3b2a" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <circle cx="-19" cy="-284" r="5" fill="#e48a74" opacity=".3" />
                    <circle cx="19" cy="-284" r="5" fill="#e48a74" opacity=".3" />
                  </g>
                </g>
              </g>
              {/* varmala in his hands */}
              <Garland x1={-33} y1={-176} x2={33} y2={-176} sag={62} count={24} />
              <Garland x1={-31} y1={-170} x2={31} y2={-170} sag={52} count={20} r={5} />
              <circle cx="-33" cy="-176" r="8.5" fill={SKIN_G} />
              <circle cx="33" cy="-176" r="8.5" fill={SKIN_G} />
            </g>
            <text x="0" y="40" textAnchor="middle" fontSize="24" fontWeight="600" fill="#591b2b"> </text>
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
