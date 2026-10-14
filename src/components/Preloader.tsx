import { useEffect, useRef, useState } from 'react'
import { person } from '../content/site'
import { gsap, useGSAP } from '../lib/gsap'

type Props = {
  /** Real loading progress from 0 to 1 (critical assets only). */
  progress: number
  /** True once critical assets resolved, or the timeout fallback fired. */
  ready: boolean
  reducedMotion: boolean
  /** Fired when the reveal starts, so the hero can begin underneath. */
  onReveal: () => void
  /** Fired when the overlay is fully gone and can unmount. */
  onExited: () => void
}

const NAME = person.fullName.toUpperCase()

export function Preloader({ progress, ready, reducedMotion, onReveal, onExited }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [introDone, setIntroDone] = useState(reducedMotion)

  // Letter-by-letter intro. Runs once; useGSAP reverts it on unmount.
  useGSAP(
    () => {
      if (reducedMotion) return
      const tl = gsap.timeline({ onComplete: () => setIntroDone(true) })
      tl.from('[data-letter]', {
        yPercent: 110,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.045,
      })
        .from('[data-pre-sub]', { opacity: 0, y: 8, duration: 0.5, ease: 'power2.out' }, '-=0.35')
        .from('[data-pre-meta]', { opacity: 0, duration: 0.4 }, '<0.1')
    },
    { scope: root },
  )

  // The red line tracks real progress, never a fake timer.
  useEffect(() => {
    if (!bar.current) return
    gsap.to(bar.current, {
      scaleX: progress,
      duration: reducedMotion ? 0 : 0.5,
      ease: 'power2.out',
      overwrite: true,
    })
  }, [progress, reducedMotion])

  // Exit once both the assets and the intro are done.
  useEffect(() => {
    if (!ready || !introDone || !root.current) return
    const el = root.current

    if (reducedMotion) {
      onReveal()
      const tween = gsap.to(el, { opacity: 0, duration: 0.2, onComplete: onExited })
      return () => {
        tween.kill()
      }
    }

    const tl = gsap.timeline({ onComplete: onExited })
    tl.to(bar.current, { scaleX: 1, duration: 0.35, ease: 'power2.out', overwrite: true })
      .to('[data-pre-content]', { yPercent: -12, opacity: 0, duration: 0.5, ease: 'power3.in' }, '+=0.15')
      .add(onReveal, '-=0.1')
      .fromTo(
        el,
        { clipPath: 'inset(0% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut' },
        '<',
      )
    return () => {
      tl.kill()
    }
  }, [ready, introDone, reducedMotion, onReveal, onExited])

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-paper"
      aria-busy={!ready}
    >
      <span className="sr-only" aria-live="polite">
        {ready ? 'Loaded' : 'Loading portfolio'}
      </span>
      <div data-pre-content className="container-x flex flex-col items-center text-center">
        <p
          className="font-display text-[clamp(2.2rem,8vw,6.5rem)] leading-[0.9] font-black tracking-[-0.03em] text-ink"
          aria-label={NAME}
        >
          {NAME.split(' ').map((word, w) => (
            <span key={w} className="inline-block overflow-hidden whitespace-nowrap pb-[0.05em] align-bottom">
              {Array.from(word).map((ch, i) => (
                <span key={i} data-letter aria-hidden="true" className="inline-block">
                  {ch}
                </span>
              ))}
              {w === 0 && <span aria-hidden="true">&nbsp;</span>}
            </span>
          ))}
        </p>

        <p data-pre-sub className="eyebrow mt-6 text-muted-strong sm:mt-8">
          AppSec Engineer <span className="text-signal">·</span> Penetration Tester{' '}
          <span className="text-signal">·</span> Bughunter
        </p>

        <div data-pre-meta className="mt-14 w-[min(320px,70vw)] sm:mt-20">
          <div className="h-px w-full bg-line">
            <div ref={bar} className="h-px w-full origin-left scale-x-0 bg-signal" />
          </div>
          <div className="mt-3 flex justify-between font-mono text-[0.65rem] tracking-[0.2em] text-muted-strong">
            <span>INITIALIZING EXPERIENCE</span>
            <span aria-hidden="true">{String(Math.round(progress * 100)).padStart(3, '0')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
