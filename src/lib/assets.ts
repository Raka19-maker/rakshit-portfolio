/**
 * Probes optional media without throwing. Each probe resolves to whether the
 * file is actually usable, never rejects, and gives up after `timeoutMs`
 * so a slow or missing asset can't hold the preloader hostage.
 */

export type MediaProbe = { ok: boolean; duration?: number }

export function probeImage(src: string, timeoutMs = 4000): Promise<MediaProbe> {
  return new Promise((resolve) => {
    const img = new Image()
    const timer = window.setTimeout(() => resolve({ ok: false }), timeoutMs)
    img.onload = () => {
      window.clearTimeout(timer)
      resolve({ ok: img.naturalWidth > 0 })
    }
    img.onerror = () => {
      window.clearTimeout(timer)
      resolve({ ok: false })
    }
    img.src = src
  })
}

export function probeMedia(src: string, kind: 'video' | 'audio', timeoutMs = 4000): Promise<MediaProbe> {
  return new Promise((resolve) => {
    const el = document.createElement(kind)
    el.preload = 'metadata'
    el.muted = true
    const done = (result: MediaProbe) => {
      window.clearTimeout(timer)
      el.removeAttribute('src')
      el.load()
      resolve(result)
    }
    const timer = window.setTimeout(() => done({ ok: false }), timeoutMs)
    el.onloadedmetadata = () =>
      done({ ok: true, duration: Number.isFinite(el.duration) ? el.duration : undefined })
    el.onerror = () => done({ ok: false })
    el.src = src
  })
}

/**
 * Downloads a whole video up front and hands back an object URL, so playback never
 * waits on the network mid-stride. Resolves to null on failure or timeout; the
 * page then streams the file as usual.
 */
export async function preloadVideo(src: string, timeoutMs = 8000): Promise<string | null> {
  const ctrl = new AbortController()
  const timer = window.setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(src, { signal: ctrl.signal })
    const type = res.headers.get('content-type') ?? ''
    if (!res.ok || type.includes('text/html')) return null
    return URL.createObjectURL(await res.blob())
  } catch {
    return null
  } finally {
    window.clearTimeout(timer)
  }
}

export async function fileExists(src: string, timeoutMs = 3000): Promise<boolean> {
  const ctrl = new AbortController()
  const timer = window.setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(src, { method: 'HEAD', signal: ctrl.signal })
    const type = res.headers.get('content-type') ?? ''
    // SPA hosts answer unknown paths with index.html; that is not the file.
    return res.ok && !type.includes('text/html')
  } catch {
    return false
  } finally {
    window.clearTimeout(timer)
  }
}
