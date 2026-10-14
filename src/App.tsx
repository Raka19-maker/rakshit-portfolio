import { useCallback, useEffect, useState } from 'react'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Preloader } from './components/Preloader'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { DarkVector } from './components/sections/DarkVector'
import { Experience } from './components/sections/Experience'
import { Skills } from './components/sections/Skills'
import { Work } from './components/sections/Work'
import { heroMedia } from './content/site'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { Marquee } from './components/sections/Marquee'
import { fileExists, preloadVideo, probeImage, probeMedia, type MediaProbe } from './lib/assets'
import { ScrollTrigger } from './lib/gsap'

export type MediaState = {
  image: boolean
  video: boolean
  mp4: boolean
  webm: boolean
  audio: boolean
  resume: boolean
  videoDuration?: number
  /** Fully downloaded copy of the hero video, when preloading succeeded. */
  fullSrc?: string | null
}

const NO_MEDIA: MediaState = { image: false, video: false, mp4: false, webm: false, audio: false, resume: false }

/** Hard ceiling on the preloader, whatever the network does. */
const PRELOADER_TIMEOUT_MS = 9000

export default function App() {
  const reducedMotion = useReducedMotion()
  const [media, setMedia] = useState<MediaState>(NO_MEDIA)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [preloaderGone, setPreloaderGone] = useState(false)

  // Wait only for what the first screen needs: fonts and the hero media check.
  useEffect(() => {
    let cancelled = false
    const tasks: Promise<unknown>[] = [
      document.fonts?.ready ?? Promise.resolve(),
      probeImage(heroMedia.image),
      probeMedia(heroMedia.videoMp4, 'video'),
      probeMedia(heroMedia.videoWebm, 'video'),
      probeMedia(heroMedia.introAudio, 'audio'),
      fileExists(heroMedia.resumePdf),
      // The hero walk is the first thing seen; download it whole so it never stutters.
      heroMedia.walkMode === 'full' ? preloadVideo(heroMedia.videoFull) : Promise.resolve(null),
    ]
    let settled = 0
    tasks.forEach((t) =>
      t.finally(() => {
        settled += 1
        if (!cancelled) setProgress(settled / tasks.length)
      }),
    )

    Promise.all(tasks).then(([, image, mp4, webm, audio, resume, fullSrc]) => {
      if (cancelled) return
      const m = mp4 as MediaProbe
      const w = webm as MediaProbe
      setMedia({
        image: (image as MediaProbe).ok,
        // Either format is enough; browsers without H.264 can still use the WebM.
        mp4: m.ok,
        webm: w.ok,
        video: m.ok || w.ok,
        videoDuration: m.duration ?? w.duration,
        audio: (audio as MediaProbe).ok,
        resume: resume as boolean,
        fullSrc: fullSrc as string | null,
      })
      setReady(true)
    })

    const timeout = window.setTimeout(() => {
      if (!cancelled) setReady(true)
    }, PRELOADER_TIMEOUT_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [])

  useSmoothScroll(!reducedMotion, !revealed)

  const onReveal = useCallback(() => setRevealed(true), [])
  const onExited = useCallback(() => {
    setPreloaderGone(true)
    ScrollTrigger.refresh()
  }, [])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>

      {!preloaderGone && (
        <Preloader
          progress={progress}
          ready={ready}
          reducedMotion={reducedMotion}
          onReveal={onReveal}
          onExited={onExited}
        />
      )}

      <div aria-hidden={!revealed} inert={!revealed}>
        <Nav />
        <main id="main">
          <Hero play={revealed} media={media} reducedMotion={reducedMotion} />
          <Marquee />
          <About hasImage={media.image} />
          <Work />
          <Skills />
          <DarkVector />
          <Experience />
          <Contact hasResume={media.resume} />
        </main>
      </div>
    </>
  )
}
