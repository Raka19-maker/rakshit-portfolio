# Asset slots

Drop the real files here with exactly these names. Nothing else needs to change;
the site detects them at load time and falls back gracefully when missing.

| File            | Used for                                                   |
| --------------- | ---------------------------------------------------------- |
| `character.png` | Full-body character image: video poster, reduced-motion and failure fallback |
| `walk.mp4`      | Walking video for the hero entrance (left ➜ right, not mirrored) |
| `walk.webm`     | Optional WebM of the same clip; with an alpha channel it walks over the page with no background |
| `resume.pdf`    | Optional downloadable resume (shows a "Resume" link when present) |

Tune behaviour (walk mode, white-background blending) in
`src/content/site.ts` → `heroMedia`.
