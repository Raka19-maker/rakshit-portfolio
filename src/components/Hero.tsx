import { ArrowUpRight } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { heroMedia, person } from '../content/site'
import { shotWalk } from '../content/shotWalk'
import { walkTrack } from '../content/walkTrack'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import type { MediaState } from '../App'
import { CharacterPlaceholder } from './CharacterPlaceholder'

type Props = {
  play: boolean
  media: MediaState
  reducedMotion: boolean
}

const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|chromium|android|crios|fxios).)*safari/i.test(navigator.userAgent)

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*<>/{}[]_+=$@!?'

/**
 * Decodes one character: it flickers through random glyphs, then locks onto the
 * real letter. Its width is pinned first so the line never jitters.
 */
function scramble(node: HTMLElement, duration: number, delay: number) {
  const final = node.textContent ?? ''
  if (!final.trim()) return gsap.set(node, { opacity: 1, yPercent: 0, rotate: 0 })
  node.style.width = `${node.getBoundingClientRect().width}px`
  const state = { p: 0 }
  return gsap.to(state, {
    p: 1,
    duration,
    delay,
    ease: 'none',
    onStart: () => {
      gsap.set(node, { opacity: 1, yPercent: 0, rotate: 0 })
    },
    onUpdate: () => {
      // Settle in the last third; before that, a new random glyph every few frames.
      node.textContent = state.p > 0.66 ? final : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
    },
    onComplete: () => {
      node.textContent = final
      node.style.width = ''
    },
  })
}

export function Hero({ play, media, reducedMotion }: Props) {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const shot = useRef<HTMLVideoElement>(null)

  const [videoFailed, setVideoFailed] = useState(false)

  // Reduced motion always gets the still image when one exists.
  const useVideo = media.video && !videoFailed && !(reducedMotion && media.image)
  const useImage = !useVideo && media.image
  // 'full': the transparent shot plays as it is, in front of the page: he walks in,
  // the name appears as his body reaches each letter, then he turns to camera.
  const fullFrame = useVideo && heroMedia.walkMode === 'full'

  const startVideo = useCallback((from = 0) => {
    const v = video.current
    if (!v) return
    v.currentTime = from
    v.play().catch(() => {
      // Autoplay refused even muted: fall back to the still image, keep the walk.
      setVideoFailed(true)
    })
  }, [])

  useGSAP(
    () => {
      if (!play) return

      const el = stage.current
      const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]')
      const fades = gsap.utils.toArray<HTMLElement>('[data-hero-fade]')

      if (reducedMotion || !el) {
        gsap.set([...lines, ...fades, el], { clearProps: 'all' })
        return
      }

      // Split the type so it can render behind him as he walks past.
      // SplitText keeps an aria-label on each line, and useGSAP reverts the split on cleanup.
      type Piece = { el: Element; x: number; kind: 'rise' | 'name' | 'blur' }
      const hello = SplitText.create('[data-hero-line="hello"]', { type: 'words,chars', charsClass: 'ch' })
      const name = SplitText.create('[data-hero-line="name"]', { type: 'chars', charsClass: 'ch' })
      const roles = SplitText.create('[data-hero-line^="role"]', { type: 'words,chars', charsClass: 'ch' })
      const intro = SplitText.create('[data-hero-intro]', { type: 'words' })
      const centerX = (node: Element) => {
        const r = node.getBoundingClientRect()
        return r.left + r.width / 2
      }
      let pending: Piece[] = [
        ...hello.chars.map((c) => ({ el: c, x: centerX(c), kind: 'rise' as const })),
        ...name.chars.map((c) => ({ el: c, x: centerX(c), kind: 'name' as const })),
        ...roles.chars.map((c) => ({ el: c, x: centerX(c), kind: 'rise' as const })),
        ...intro.words.map((w) => ({ el: w, x: centerX(w), kind: 'blur' as const })),
        // The rules beside the lines draw in with the type rather than waiting on screen.
        ...gsap.utils.toArray<HTMLElement>('[data-hero-deco]').map((d) => ({ el: d, x: centerX(d), kind: 'rise' as const })),
      ].sort((a, b) => a.x - b.x)

      const hidden = {
        rise: { yPercent: 110, opacity: 0 },
        // Each letter of the name waits unseen, then appears as an outline and fills.
        name: { backgroundSize: '0% 100%', opacity: 0, y: 12 },
        blur: { opacity: 0, y: 10, filter: 'blur(6px)' },
      }
      pending.forEach((p) => gsap.set(p.el, hidden[p.kind]))
      gsap.set(fades, { opacity: 0, y: 14 })

      const reveal = (p: Piece, delay = 0) => {
        // As he passes, each letter of the name appears as an outline, then fills in
        // from the left inside it.
        if (p.kind === 'name') {
          return gsap
            .timeline({ delay })
            .to(p.el, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
            .to(p.el, { backgroundSize: '100% 100%', duration: 0.6, ease: 'power2.inOut' }, '+=0.25')
        }
        // The roles decode letter by letter, like a terminal resolving a string.
        if (p.kind !== 'blur' && p.el.classList.contains('ch')) {
          return scramble(p.el as HTMLElement, 0.55, delay)
        }
        return gsap.to(p.el, {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          delay,
          // Soft eases so the type unfurls behind him in one continuous motion; quicker
          // in 'full' mode so each letter visibly lands where he is right now.
          duration: fullFrame ? 0.7 : p.kind === 'blur' ? 1.2 : 1.4,
          ease: p.kind === 'blur' ? 'power2.out' : 'power4.out',
        })
      }

      // Once he has stopped, whatever he hasn't passed yet renders left to right,
      // then the intro line's controls follow.
      let finished = false
      let sway: gsap.core.Tween | null = null
      const finish = () => {
        if (finished) return
        finished = true
        // The rest keeps flowing left to right at the same pace he walked, never all at once.
        pending.forEach((p, i) => reveal(p, i * 0.045))
        const tail = pending.length * 0.045
        pending = []
        gsap.to(fades, { opacity: 1, y: 0, duration: 1.2, stagger: 0.18, ease: 'power3.out', delay: tail + 0.6 })
        // At rest he keeps breathing with a slow sway instead of freezing on the last frame.
        // The full shot keeps playing its own move, so it needs none.
        if (fullFrame) return
        sway = gsap.to(el.querySelector('video, img'), {
          rotate: 0.8,
          y: -6,
          transformOrigin: '50% 100%',
          duration: 2.6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 0.6,
        })
      }

      // Letters join a queue so they always flow in left to right at a steady rate,
      // including anything he is already past when he appears.
      let queueAt = 0
      const revealUpTo = (wake: number) => {
        const now = gsap.ticker.time
        while (pending.length && pending[0].x < wake) {
          const at = Math.max(now, queueAt)
          reveal(pending.shift()!, at - now)
          queueAt = at + 0.035
        }
      }

      if (fullFrame) {
        const s = shot.current
        if (!s) {
          finish()
          return
        }
        const { centers, fps, width, height } = shotWalk
        const t0 = heroMedia.shotStartAt
        const f0 = Math.floor(t0 * fps)
        s.currentTime = t0
        gsap.set(s, { x: 0 })
        // Where his body sits on the page at a given frame (object-fit: contain).
        const bodyX = (f: number) => {
          const vr = s.getBoundingClientRect()
          const scale = Math.min(vr.width / width, vr.height / height)
          const x = Number(gsap.getProperty(s, 'x')) || 0
          return vr.left - x + (vr.width - width * scale) / 2 + centers[f] * width * scale
        }
        // He should first appear just past a letter of the name. The shot slides from
        // there to its resting place as he walks, scaled to his own progress, so he
        // still ends clear of the headline.
        const letter = name.chars[heroMedia.shotStartLetter]
        const shift = letter ? letter.getBoundingClientRect().right + 20 - bodyX(f0) : 0
        const progress = (t: number) => clamp((t - t0) / (shotWalk.walkEnd - t0), 0, 1)
        gsap.set(s, { x: shift })
        gsap.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.8, ease: 'power2.out' })
        // Start only once the clip can play straight through, so it never stalls mid-stride.
        let bufferWait: number | undefined
        const go = () => {
          window.clearTimeout(bufferWait)
          s.removeEventListener('canplaythrough', go)
          s.play().catch(() => finish())
        }
        // Wait for the loader's curtain to clear, so his first step over the name is seen.
        const begin = gsap.delayedCall(0.8, () => {
          if (s.readyState >= 4) go()
          else {
            s.addEventListener('canplaythrough', go)
            bufferWait = window.setTimeout(go, 2500)
          }
        })
        let started = false
        const tickFull = () => {
          // Nothing renders until he is actually walking on screen.
          if (s.paused && !s.ended) return
          const t = s.currentTime
          if (t >= shotWalk.walkEnd || s.ended) finish()
          const f = Math.min(Math.floor(t * fps), centers.length - 1)
          // Ease the slide out over the walk with a smooth curve so it never jolts.
          const p = progress(t)
          gsap.set(s, { x: shift * (1 - p * p * (3 - 2 * p)) })
          const here = bodyX(f) + Number(gsap.getProperty(s, 'x'))
          if (!started) {
            // Letters he is already past when he appears sweep in behind him within half a
            // second, in order, so they never hold up the ones at his feet.
            started = true
            const behind = pending.filter((q) => q.x < here)
            const step = Math.min(0.035, 0.5 / Math.max(behind.length, 1))
            behind.forEach((q, i) => reveal(q, i * step))
            pending = pending.filter((q) => q.x >= here)
            return
          }
          // From then on each letter lands the moment his body reaches its spot.
          while (pending.length && pending[0].x < here) reveal(pending.shift()!)
        }
        gsap.ticker.add(tickFull)
        // Never leave the headline hidden if the video stalls.
        const safetyFull = gsap.delayedCall(shotWalk.walkEnd - t0 + 6, () => {
          gsap.to(s, { x: 0, duration: 0.6 })
          finish()
        })
        return () => {
          begin.kill()
          window.clearTimeout(bufferWait)
          s.removeEventListener('canplaythrough', go)
          gsap.ticker.remove(tickFull)
          safetyFull.kill()
        }
      }

      const walking = useVideo && heroMedia.walkMode === 'translate'
      const rate = heroMedia.walkPlaybackRate
      // Travel is read from the clip's own foot track, so each planted foot stays fixed on the page.
      const { track } = walkTrack
      const xAt = (t: number) => {
        const { fps, height } = walkTrack
        const f = clamp(t * fps, 0, track.length - 1)
        const i = Math.floor(f)
        const g = track[i] + (track[Math.min(i + 1, track.length - 1)] - track[i]) * (f - i)
        return (g - track[track.length - 1]) * (el.offsetHeight / height)
      }
      // Skip the off-screen part of the walk so he enters without a long empty pause.
      const walkFrom = walking ? heroMedia.walkStartAt : 0

      // Move him exactly when each video frame is presented, so the slide across the page
      // and the frame on screen never drift apart (that drift reads as a jerky walk).
      let frameT = walkFrom
      let frameAt = 0
      let frameSync = false
      let frameHandle = 0
      const onFrame = (now: number, meta: { mediaTime: number }) => {
        const v = video.current
        if (!v) return
        frameT = meta.mediaTime
        frameAt = now
        frameHandle = v.requestVideoFrameCallback(onFrame)
      }
      // Between presented frames, glide on from the last one at the playback rate.
      const clock = () => {
        const v = video.current
        if (!v || v.paused || !frameAt) return frameT
        return frameT + Math.min(((performance.now() - frameAt) / 1000) * v.playbackRate, 1 / walkTrack.fps)
      }
      let bufferWait: number | undefined
      let glide: gsap.core.Tween | null = null
      if (walking) {
        gsap.set(el, { x: xAt(walkFrom), force3D: true })
        const v = video.current
        if (v) {
          v.playbackRate = rate
          if ('requestVideoFrameCallback' in v) {
            frameSync = true
            frameHandle = v.requestVideoFrameCallback(onFrame)
          }
          // Start only once the clip can play straight through, so it never stalls mid-stride.
          const go = () => {
            window.clearTimeout(bufferWait)
            v.removeEventListener('canplaythrough', go)
            startVideo(walkFrom)
          }
          if (v.readyState >= 4) go()
          else {
            v.addEventListener('canplaythrough', go)
            bufferWait = window.setTimeout(go, 2500)
          }
        }
      } else if (useVideo) {
        // 'native' and 'full' clips carry their own travel; just play them in place.
        if (video.current) video.current.playbackRate = 1
        startVideo()
      } else {
        // A still photo glides in like a camera move.
        const startX = -(el.getBoundingClientRect().left + el.offsetWidth + 24)
        glide = gsap.fromTo(el, { x: startX }, { x: 0, duration: 3, ease: 'power3.inOut', onComplete: finish })
      }

      const tick = () => {
        const v = video.current
        if (useVideo) {
          if (!v) {
            // The video failed mid-walk: land in place and show everything.
            gsap.to(el, { x: 0, duration: 0.6, ease: 'power2.out' })
            finish()
          } else {
            const t = frameSync ? clock() : v.currentTime
            if (walking) gsap.set(el, { x: xAt(t) })
            if (t >= walkTrack.walkEnd - 0.25 || v.ended) finish()
          }
        }
        // Text appears in his wake: anything his back has passed renders.
        const r = el.getBoundingClientRect()
        revealUpTo(r.left + r.width * 0.4)
      }
      gsap.ticker.add(tick)

      // Never leave the headline hidden if the video stalls.
      const safety = gsap.delayedCall((useVideo ? (walkTrack.walkEnd - walkFrom) / rate : 3) + 5, finish)

      return () => {
        window.clearTimeout(bufferWait)
        if (frameSync) video.current?.cancelVideoFrameCallback(frameHandle)
        gsap.ticker.remove(tick)
        safety.kill()
        glide?.kill()
        sway?.kill()
      }
    },
    { scope: root, dependencies: [play, reducedMotion], revertOnUpdate: true },
  )

  // As the page scrolls on, the shot pushes in and the copy lifts away.
  useGSAP(
    () => {
      if (reducedMotion) return
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 }
      gsap.to('[data-character]', { yPercent: -10, scale: 1.08, transformOrigin: '50% 30%', ease: 'none', scrollTrigger: st })
      gsap.to('[data-hero-copy]', { y: -160, opacity: 0, ease: 'none', scrollTrigger: st })
    },
    { scope: root, dependencies: [reducedMotion] },
  )

  return (
    <section
      ref={root}
      id="top"
      aria-label="Introduction"
      className={`relative isolate flex min-h-[640px] w-full overflow-hidden h-[100svh] ${fullFrame ? 'hero-full-bg' : 'bg-paper'}`}
    >
      {fullFrame && (
        // The transparent shot, in front of the type.
        <div className="hero-full pointer-events-none z-20">
          <div data-character className="relative h-full w-full">
            {/* oxlint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={shot}
              className="hero-full-video"
              src={isSafari ? heroMedia.videoFullMp4 : (media.fullSrc ?? heroMedia.videoFull)}
              poster={heroMedia.poster}
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
              onError={() => setVideoFailed(true)}
            />
          </div>
        </div>
      )}

      {/* Character stage: a close, waist-up framing on the right, like a film shot. */}
      <div
        ref={stage}
        data-stage
        className={fullFrame ? 'hidden' : 'hero-stage pointer-events-none'}
      >
        <div data-character={fullFrame ? undefined : true} className="relative h-full">
          {fullFrame ? null : useVideo ? (
            // Decorative, muted and aria-hidden.
            // oxlint-disable-next-line jsx-a11y/media-has-caption
            <video
              ref={video}
              className={`block h-full w-auto max-w-none ${heroMedia.blendWhiteBackground ? 'mix-blend-multiply' : ''}`}
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
              onError={() => setVideoFailed(true)}
            >
              {/* WebM carries transparency; Safari ignores VP9 alpha, so it gets the white-background MP4 first. */}
              {isSafari && media.mp4 && <source src={heroMedia.videoMp4} type="video/mp4" />}
              {media.webm && <source src={heroMedia.videoWebm} type="video/webm" />}
              {!isSafari && media.mp4 && <source src={heroMedia.videoMp4} type="video/mp4" />}
            </video>
          ) : useImage ? (
            <img
              src={heroMedia.image}
              alt=""
              aria-hidden="true"
              className="block h-full w-auto max-w-none select-none"
              draggable={false}
            />
          ) : (
            <CharacterPlaceholder />
          )}
        </div>
      </div>

      <div data-hero-copy className="container-x relative z-10 flex flex-col justify-start pt-28 sm:justify-center sm:pt-16">
        <h1
          className="font-display text-ink"
          aria-label="Hello, I’m Rakshit. AppSec Engineer. Penetration Tester, Bug Hunter, Founder of Dark Vector."
        >
          <span data-hero-layer className="line-mask">
            <span data-hero-line="hello" className="kt-scramble eyebrow flex items-center gap-3 font-semibold text-ink">
              <span data-hero-deco className="inline-block h-px w-10 bg-ink" aria-hidden="true" />
              HELLO, I’M
            </span>
          </span>
          <span data-hero-layer data-hero-name className="line-mask mt-3">
            <span data-hero-line="name" className="outline-fill text-mega font-black tracking-[-0.045em] text-signal">
              RAKSHIT.
            </span>
          </span>
          <span data-hero-layer className="line-mask mt-2 sm:mt-3">
            <span
              data-hero-line="role-1"
              className="kt-scramble flex items-center gap-4 text-[clamp(1.5rem,3.6vw,3.1rem)] leading-[1] font-black tracking-[-0.03em]"
            >
              {/* nowrap keeps the period on its word once the line is split */}
              <span className="whitespace-nowrap">
                APPSEC ENGINEER<span className="text-signal">.</span>
              </span>
              <span data-hero-deco className="inline-block h-[3px] w-[clamp(2rem,4vw,3.5rem)] bg-signal" aria-hidden="true" />
            </span>
          </span>
          <span data-hero-layer className="line-mask mt-3">
            <span
              data-hero-line="role-2"
              className="kt-scramble text-[clamp(0.78rem,1.25vw,1.05rem)] leading-[1.3] font-extrabold tracking-[0.02em]"
            >
              PENETRATION TESTER. BUG HUNTER. FOUNDER OF{' '}
              <span className="whitespace-nowrap text-signal">DARK VECTOR.</span>
            </span>
          </span>
        </h1>

        <p data-hero-layer data-hero-intro className="mt-6 max-w-[34ch] text-sm leading-relaxed text-muted-strong sm:mt-7 sm:max-w-[44ch] sm:text-[0.95rem]">
          {person.intro}
        </p>

        <div data-hero-layer>
          <div data-hero-fade className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 sm:mt-8">
            <a
              href="#work"
              className="group eyebrow inline-flex items-center gap-2 border-b border-ink pb-1 font-semibold text-ink transition-colors hover:border-signal hover:text-signal"
            >
              Selected work
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="eyebrow inline-flex items-center gap-2 border-b border-transparent pb-1 font-semibold text-muted-strong transition-colors hover:border-signal hover:text-signal"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>

    </section>
  )
}
