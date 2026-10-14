/**
 * Stand-in for the character until public/assets/character.png or walk.mp4
 * is supplied. Clearly marked as an asset slot so it is never mistaken for
 * the final artwork.
 */
export function CharacterPlaceholder() {
  return (
    <div className="relative h-full aspect-[5/12]" aria-hidden="true">
      <svg viewBox="0 0 100 240" className="h-full w-full" preserveAspectRatio="xMidYMax meet">
        <g fill="#EDEDED" stroke="#D6D6D6" strokeWidth="0.6">
          <ellipse cx="50" cy="22" rx="12" ry="14" />
          <path d="M34 42 Q50 36 66 42 L72 108 Q70 114 64 112 L60 74 L58 128 L40 128 L41 74 L36 112 Q30 114 28 108 Z" />
          <path d="M40 126 L58 126 L60 232 L50 232 L49 150 L47 232 L37 232 Z" />
        </g>
        <rect x="49.25" y="42" width="1.5" height="84" fill="#FF3038" />
      </svg>
      <span className="absolute bottom-3 left-1/2 hidden sm:block -translate-x-1/2 whitespace-nowrap bg-paper px-2 font-mono text-[0.6rem] tracking-[0.2em] text-muted-strong">
        CHARACTER ASSET SLOT
      </span>
    </div>
  )
}
