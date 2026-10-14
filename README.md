# Rakshit Tomar · Portfolio

Cinematic personal site: React + TypeScript + Vite, Tailwind CSS v4, GSAP + ScrollTrigger, Lucide icons.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
npm run lint     # oxlint (react, a11y, typescript rules)
npm run preview  # serve the production build
```

## Where things live

| Path | What |
| --- | --- |
| `src/content/site.ts` | **All copy**, links and hero media settings. Sourced from the resume only. |
| `public/assets/` | Asset slots: `character.png`, `walk.mp4` / `walk.webm`, optional `intro.mp3`, `resume.pdf`. See the README there. |
| `src/components/Preloader.tsx` | White preloader, letter reveal, real-progress red line, clip-path exit. |
| `src/components/Hero.tsx` | Character walk-in + typography timeline, sound toggle, fallbacks. |
| `src/components/sections/` | About, Work, Skills, Dark Vector, Experience, Contact + footer. |
| `src/hooks/useReveal.ts` | Scroll reveals (scoped with `useGSAP`, cleaned up on unmount). |

## How the hero behaves

- The preloader waits only for fonts and a metadata check of the hero media, each capped at 4s, with a 6s hard ceiling.
- **Video present** → plays muted inline. The clip has its background removed and walks in place; the page moves it by the clip's own foot track (`src/content/walkTrack.ts`, read from the video clock), so planted feet don't slide. The headline renders letter by letter in his wake as he passes, and whatever he hasn't passed renders when he stops. The clip is never mirrored. Safari gets the white-background MP4, multiply-blended into the page.
- **Only `character.png`** → the still image makes the same walk with a light step rhythm.
- **Neither** → a marked "character asset slot" silhouette.
- **Reduced motion** → no walk, no letter animation; the still image sits in its final place and all text is visible immediately.
- **Autoplay refused / video error** → falls back to the still image without stopping the timeline.
- Sound: shown only when `intro.mp3` exists, or `videoHasSpeech: true` is set for a clip with speech. Starts muted, opt-in via button.

If the walking clip already moves left-to-right inside its own frame, set `heroMedia.walkMode = 'native'` in `src/content/site.ts`.

## Content still to confirm

The resume has placeholders, which the site leaves out rather than guessing:

- GitHub and Hack The Box URLs (`contact.github`, `contact.hackTheBox`)
- Counts written as `[N]` in the experience bullets (dropped from the copy)
- Dark Vector Security Solutions description, services and website (`darkVector.*`); until set, the section lists the founder's practice areas from the resume
- Phone number is on the resume but hidden by default (`contact.showPhone`)
- Project screenshots or a repo link for the Python web vulnerability scanner
