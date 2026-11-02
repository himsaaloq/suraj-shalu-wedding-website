# Suraj & Shalu — Royal Rajasthani Wedding Invitation

A responsive, mobile-first wedding invitation website built with Next.js 15, React 19, TypeScript and Tailwind CSS 4.

## Run locally

Requirements: Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Production check

```bash
npm run typecheck
npm run build
npm start
```

## Project structure

```text
app/
  globals.css       # Theme, responsive layout, animations (motion layer at the bottom)
  layout.tsx        # Metadata, font loading, root layout
  page.tsx          # Wedding invitation (server component)
  components/       # Header (menu + music), Countdown, Events, ScrollEffects, Ornaments
  data/events.ts    # The seven wedding events
  lib/css.ts        # Typed helper for inline CSS variables
public/
  favicon.svg
  music/
    wedding-instrumental.mp3   # Add your licensed instrumental here
```

## Included

- Royal Rajasthani maroon, ivory and antique-gold design
- Responsive mobile navigation
- Hindi and English typography
- Couple invitation card
- Live countdown to Baraat Prasthan (11 Dec 2026, 8 PM IST)
- Seven wedding events with category filters
- Bhilwara pre-wedding and Chittorgarh wedding venue sections
- Google Maps city-search links
- Background music toggle
- Open Graph metadata and custom favicon
- Keyboard focus states and reduced-motion support
- Hero entrance animation, scroll-reveal sections, scroll progress bar, gentle parallax, floating gold sparkles
- Music fades in/out and pauses automatically when the tab is hidden
- Optimised assets: resized photos with WebP, 96 kbps music, long-lived cache headers (next.config.mjs)

## Confirmed event details

| Date | Function | Time | Venue | City |
|---|---|---|---|---|
| 5 Dec 2026 | लग्न / विनायक | 3:00 PM | निवास स्थान | Bhilwara |
| 10 Dec 2026 | हल्दी | 12:00 PM | सामुदायिक भवन | Bhilwara |
| 10 Dec 2026 | मायरा | 2:00 PM | सामुदायिक भवन | Bhilwara |
| 10 Dec 2026 | मंगल कलश | 4:00 PM | निवास स्थान | Bhilwara |
| 10 Dec 2026 | प्रीति भोज | 7:30 PM से | सामुदायिक भवन | Bhilwara |
| 11 Dec 2026 | बारात प्रस्थान | 8:00 PM | निवास स्थान | Bhilwara |
| 11 Dec 2026 | फेरे / परिणय संस्कार | शुभ लग्न अनुसार | विवाह स्थल | Chittorgarh |

## Add background music

Place a royalty-free or properly licensed flute/sitar instrumental MP3 at:

`public/music/wedding-instrumental.mp3`

The music starts only after the visitor taps the music button, as browsers generally block autoplay with sound.

## Before publishing

The exact wedding venue name and street address have not yet been provided. The current map links intentionally open general city searches instead of inventing a venue pin. Update the venue labels and map links in `app/page.tsx` once exact addresses are confirmed.

Use only photographs, illustrations, and audio that you own or have permission to publish.
