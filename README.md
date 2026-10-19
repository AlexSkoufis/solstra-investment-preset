# Solstra Capital — Asset Management Preset

An editorial homepage for a **fictional** independent asset manager in London. Deep ink and midnight navy against warm paper, one amber accent; Instrument Serif + Inter Tight + JetBrains Mono.

Next.js 16 · GSAP 3 + ScrollTrigger · Lenis · Canvas 2D · plain CSS. No UI libraries.

```bash
npm install
npm run dev
npm run build     # then `npm start`, or deploy to any Next.js host
```

Photos go through `next/image`, so this preset needs a Next.js server or host (Vercel, Netlify, a Node server). For plain static hosting, add `output: 'export'` and `images: { unoptimized: true }` to `next.config.mjs`.

## Signature pieces

| Section | What it does |
|---|---|
| Header | Changes contrast with the section beneath it, compacts and hides on scroll down, and shows reading progress. Mega-menus preview an image for each link. |
| Hero | Masked headline lines rise in, then separate at different speeds on scroll over an "orbit field": tilted orbits, bodies at Kepler-like speeds and fine links between bodies that pass close. |
| Intro | A trajectory line drawn from the hero to the section label, a statement that lights up word by word, and oversized outline words drifting behind. |
| Metrics | Each digit is a vertical reel that rolls and locks onto its value. |
| Active minds | Five chapters on a sticky stage, scrubbed by scroll along a tilted orbit on desktop; a vertical sequence with masked image reveals on smaller screens. |
| Investment | The dark field opens out from an inset frame; five capabilities with tags and a matching image. |
| Pathways | Institutional, professional and individual entry points as large image cards. |
| Investor relations | A link list with a floating image preview that follows the pointer. |
| Careers & closing | An image that opens from a centred window with slow parallax, then a closing statement. |

Pointer: on desktop, a dot that lerps behind the cursor and opens into a labelled ring over interactive elements; buttons and links have a magnetic pull.

## Re-skin

- **Copy & data** — `lib/content.ts`: navigation and menus, metrics, chapters, capabilities, pathways, investor links.
- **Logo** — inline SVG in `components/ui/Button.tsx`, drawn in `currentColor`.
- **Photos** — `public/images/`, referenced by path in `lib/content.ts`.
- **Colour & scale** — tokens at the top of `app/globals.css` (`--ink`, `--midnight`, `--navy`, `--paper`, `--accent`, type sizes `--fs-*`).
- **Type** — `app/layout.tsx`.

## Accessibility & motion

`prefers-reduced-motion` stops the entrance and scroll animations, the orbit field (a single still frame is drawn) and the rolling digits. Smooth scrolling and the custom cursor run on desktop pointers only; touch devices keep native scrolling.

## Demo content

Solstra Capital, its figures, people, addresses and ticker are fictional; photographs are Unsplash placeholders. A real firm must replace them, and have its regulatory disclosures reviewed, before launch.
