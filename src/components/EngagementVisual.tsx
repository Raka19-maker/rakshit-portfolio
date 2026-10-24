import { useEffect, useId, useRef, useState } from 'react'
import type { WorkItem } from '../content/site'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap, useGSAP } from '../lib/gsap'

/**
 * Looping, code-drawn graphics for the engagement cards. They illustrate the
 * kind of work, never real client data, and are labelled as such.
 */

/** True while the element is on screen, so off-screen loops stop ticking. */
function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, inView] as const
}

function Frame({ label, stat, tall, children }: { label: string; stat: string; tall?: boolean; children: React.ReactNode }) {
  return (
    <div className={`relative flex ${tall ? 'aspect-square sm:aspect-[4/3]' : 'aspect-[4/3]'} w-full flex-col overflow-hidden bg-panel p-5 text-ink sm:p-7 lg:aspect-auto lg:h-full lg:min-h-[420px]`} aria-hidden="true">
      <div className="flex items-center justify-between font-mono text-[0.62rem] tracking-[0.2em] text-ink/60">
        <span className="flex items-center gap-2">
          <span className="ev-live size-1.5 rounded-full bg-signal" />
          {label}
        </span>
        <span className="text-signal">{stat}</span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
      <p className="font-mono text-[0.58rem] tracking-[0.2em] text-ink/35">ILLUSTRATIVE · CLIENT DATA CONFIDENTIAL</p>
      <div className="absolute top-0 right-0 h-full w-[3px] bg-signal" />
    </div>
  )
}

const STAGES = ['SCOPE', 'RECON', 'TEST', 'TRIAGE', 'FIX', 'RETEST']
const TARGETS = ['WEB', 'ANDROID', 'API', 'THICK-CLIENT']

/** 01: the assessment lifecycle, a pulse running stage to stage. */
function Lifecycle() {
  const xs = STAGES.map((_, i) => 34 + i * 66.4)
  const path = `M${xs[0]} 150 L${xs[xs.length - 1]} 150`
  return (
    <Frame label="ASSESSMENT LIFECYCLE" stat="50+ APPS">
      <svg viewBox="0 0 400 260" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
        {/* Targets feed into scoping */}
        {TARGETS.map((t, i) => {
          const x = 50 + i * 100
          const wire = `M${x} 58 C ${x} 100, ${xs[0]} 100, ${xs[0]} 138`
          return (
            <g key={t}>
              <rect x={x - 42} y={36} width={84} height={22} fill="none" stroke="currentColor" strokeOpacity={0.25} />
              <text x={x} y={51} textAnchor="middle" className="fill-current font-mono" fontSize={9} letterSpacing={1.5} opacity={0.8}>
                {t}
              </text>
              <path d={wire} fill="none" stroke="currentColor" strokeOpacity={0.15} />
              <circle r={2} className="fill-signal">
                <animateMotion dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" path={wire} />
              </circle>
            </g>
          )
        })}
        <path d={path} stroke="currentColor" strokeOpacity={0.2} strokeWidth={2} />
        <path d={path} className="ev-flow stroke-signal" strokeWidth={2} strokeDasharray="12 10" />
        {STAGES.map((s, i) => (
          <g key={s} className="ev-stage" style={{ animationDelay: `${i * 0.6}s` }}>
            <circle cx={xs[i]} cy={150} r={12} className="fill-panel stroke-signal" strokeWidth={2} />
            <circle cx={xs[i]} cy={150} r={4} className="fill-signal" />
            <text x={xs[i]} y={182} textAnchor="middle" className="fill-current font-mono" fontSize={9} letterSpacing={1.2}>
              {s}
            </text>
            <text x={xs[i]} y={124} textAnchor="middle" className="fill-signal font-mono" fontSize={8}>
              {String(i + 1).padStart(2, '0')}
            </text>
          </g>
        ))}
        <circle r={6} className="fill-signal">
          <animateMotion dur="3.6s" repeatCount="indefinite" path={path} />
        </circle>
        {/* Retest loops back to triage until the fix holds */}
        <path d={`M${xs[5]} 196 C ${xs[5]} 236, ${xs[3]} 236, ${xs[3]} 196`} fill="none" stroke="currentColor" strokeOpacity={0.25} strokeDasharray="3 4" />
        <text x={(xs[3] + xs[5]) / 2} y={250} textAnchor="middle" className="fill-current font-mono" fontSize={8} opacity={0.5} letterSpacing={1}>
          VALIDATE UNTIL FIXED
        </text>
      </svg>
    </Frame>
  )
}

const STEPS = [
  { title: 'SCOPE', cmd: '$ scope --target bank-app', caption: 'First I scope the banking app: web, mobile and thick-client.' },
  { title: 'AUTH & SESSIONS', cmd: '$ map-auth --roles --sessions', caption: 'Then I map how login, roles and sessions really work.' },
  { title: 'INPUTS & APIs', cmd: '$ fuzz --xss --sqli --idor', caption: 'Every input and API gets attacked: XSS, SQLi, IDOR, CSRF.' },
  { title: 'BUSINESS LOGIC', cmd: '$ tamper transfer.amount=-1000', caption: 'Business logic next: can a transfer amount be tampered with?' },
  { title: 'REPORT', cmd: '$ report --high-risk', caption: 'Each proven issue is risk-rated and reported: 43+ high-risk.' },
  { title: 'RETEST', cmd: '$ retest --verify-fixes', caption: 'Finally, every fix is retested until it is verified.' },
]
/** Each step: the command types out, then its result shows for the rest of the beat. */
const STEP_MS = 3000
const TYPE_MS = 38

const HOODIE = '#262b36'
const HOODIE_DARK = '#1a1e27'
const SKIN = '#a8744f'
const HAIR = '#15130f'

function Chip({ x, y, w, label, flash }: { x: number; y: number; w: number; label: string; flash: number }) {
  return (
    <g className="ev-flash" style={{ animationDelay: `${flash}s` }}>
      <rect x={x} y={y} width={w} height={24} className="stroke-signal" fill="none" strokeWidth={1.5} />
      <text x={x + w / 2} y={y + 16} textAnchor="middle" className="fill-current font-mono" fontSize={12} fontWeight={700} letterSpacing={1}>
        {label}
      </text>
    </g>
  )
}

function Label({ x, y, size = 12, tone, weight, children }: { x: number; y: number; size?: number; tone?: 'signal' | 'dim'; weight?: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      letterSpacing={1}
      className={`font-mono ${tone === 'signal' ? 'fill-signal' : 'fill-current'}`}
      opacity={tone === 'dim' ? 0.65 : 1}
    >
      {children}
    </text>
  )
}

/** What the screen shows at each step of the walkthrough. */
function Slide({ step }: { step: number }) {
  switch (step) {
    case 0:
      // A browser and a phone: the app in scope.
      return (
        <>
          <rect x={40} y={60} width={112} height={76} fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5} />
          <path d="M40 72 H152" stroke="currentColor" strokeOpacity={0.5} />
          <Label x={52} y={98} size={13} weight={700}>₹ BANK</Label>
          <rect x={52} y={110} width={60} height={6} className="fill-signal" opacity={0.7} />
          <rect x={172} y={56} width={46} height={84} rx={6} fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5} />
          <rect x={180} y={70} width={30} height={5} className="fill-signal" opacity={0.7} />
          <rect x={180} y={82} width={22} height={5} fill="currentColor" opacity={0.3} />
          <circle cx={195} cy={130} r={3} className="fill-signal" />
          <Label x={40} y={162} size={11} tone="dim">FINTECH APP IN SCOPE</Label>
        </>
      )
    case 1:
      return (
        <>
          <rect x={40} y={52} width={124} height={104} fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5} />
          <Label x={52} y={72} weight={700}>LOGIN</Label>
          <rect x={52} y={82} width={100} height={18} fill="none" stroke="currentColor" strokeOpacity={0.35} />
          <Label x={58} y={95} size={10} tone="dim">user</Label>
          <rect x={52} y={106} width={100} height={18} fill="none" stroke="currentColor" strokeOpacity={0.35} />
          <Label x={58} y={119} size={10} tone="dim">••••••</Label>
          <rect x={52} y={132} width={100} height={14} className="fill-signal" />
          {/* Padlock */}
          <path d="M196 92 V82 a12 12 0 0 1 24 0 V92" fill="none" className="stroke-signal" strokeWidth={4} />
          <rect x={188} y={92} width={40} height={34} rx={4} className="fill-signal" />
          <circle cx={208} cy={108} r={4} fill="var(--color-paper)" />
          <Label x={176} y={146} size={10} tone="dim">ROLES · TOKENS</Label>
        </>
      )
    case 2:
      return (
        <>
          <Chip x={40} y={60} w={86} label="XSS" flash={0} />
          <Chip x={140} y={60} w={86} label="SQLi" flash={0.4} />
          <Chip x={40} y={96} w={86} label="IDOR" flash={0.8} />
          <Chip x={140} y={96} w={86} label="CSRF" flash={1.2} />
          <Label x={40} y={148} size={11} tone="dim">GET /api/accounts</Label>
          <Label x={40} y={166} size={11} tone="signal">?id=1' OR '1'='1</Label>
        </>
      )
    case 3:
      return (
        <>
          <Label x={40} y={68} weight={700}>TRANSFER</Label>
          <rect x={40} y={78} width={186} height={26} fill="none" stroke="currentColor" strokeOpacity={0.4} />
          <Label x={50} y={95}>amount = 1,000</Label>
          <path d="M132 110 v16 m-6 -6 l6 6 6 -6" fill="none" className="stroke-signal" strokeWidth={2} />
          <g className="ev-flash">
            <rect x={40} y={132} width={186} height={26} className="stroke-signal" fill="none" strokeWidth={2} />
            <Label x={50} y={149} size={11} tone="signal" weight={700}>amount = -1,000</Label>
            <Label x={176} y={149} size={9} tone="signal">FLAGGED</Label>
          </g>
        </>
      )
    case 4:
      return (
        <>
          <text x={40} y={112} fontSize={58} fontWeight={900} letterSpacing={-2} className="fill-signal font-display">
            43+
          </text>
          <Label x={40} y={134} size={11}>HIGH-RISK FINDINGS</Label>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={164} y={60 + i * 18} width={62 - (i % 2) * 18} height={6} fill="currentColor" opacity={0.3} />
          ))}
          <Label x={40} y={160} size={10} tone="dim">PoC · RISK · FIX</Label>
        </>
      )
    default:
      // A shield with a check.
      return (
        <>
          <path d="M136 52 L176 66 V100 C176 126 158 142 136 152 C114 142 96 126 96 100 V66 Z" className="fill-signal" opacity={0.9} />
          <path d="M118 100 L132 114 L156 88" fill="none" stroke="var(--color-paper)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          <Label x={92} y={174} tone="signal" weight={700}>FIX VERIFIED</Label>
        </>
      )
  }
}

/** 02: a hooded hacker types on a laptop; each command and its result appear on the big screen. */
function Presenter() {
  const reduced = useReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  const [step, setStep] = useState(0)
  const [typed, setTyped] = useState(0)
  useEffect(() => {
    if (reduced || !inView) return
    const id = window.setInterval(() => setStep((n) => (n + 1) % STEPS.length), STEP_MS)
    return () => window.clearInterval(id)
  }, [inView, reduced])
  // Reduced motion gets the final frame, still.
  const shown = reduced ? STEPS.length - 1 : step
  const current = STEPS[shown]
  useEffect(() => {
    setTyped(0)
    if (reduced) return
    const id = window.setInterval(() => setTyped((n) => (n >= current.cmd.length ? n : n + 1)), TYPE_MS)
    return () => window.clearInterval(id)
  }, [current.cmd, reduced])
  const done = reduced || typed >= current.cmd.length
  // The result appears once the command has finished typing.
  const resultDelay = `${(current.cmd.length * TYPE_MS) / 1000 + 0.15}s`

  return (
    <Frame label="FINANCIAL APP WALKTHROUGH" stat="120+ APPS" tall>
      <div ref={ref} className={`absolute inset-0 flex flex-col pt-2 ${reduced ? 'ev-still' : ''}`}>
        <svg viewBox="0 0 400 240" className="min-h-0 w-full flex-1" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="ev-glow">
              <stop offset="0" stopColor="var(--color-signal)" stopOpacity={0.35} />
              <stop offset="1" stopColor="var(--color-signal)" stopOpacity={0} />
            </radialGradient>
          </defs>
          {/* Screen */}
          <rect x={10} y={14} width={256} height={182} rx={6} fill="var(--color-paper)" stroke="currentColor" strokeOpacity={0.25} strokeWidth={2} />
          <path d="M10 36 H266" stroke="currentColor" strokeOpacity={0.15} />
          <circle cx={24} cy={25} r={3} fill="currentColor" opacity={0.25} />
          <circle cx={34} cy={25} r={3} fill="currentColor" opacity={0.25} />
          <circle cx={44} cy={25} r={3} className="fill-signal" />
          <text x={58} y={29} fontSize={10} className="fill-current font-mono" opacity={0.5} letterSpacing={1}>
            {`STEP ${shown + 1}/${STEPS.length}`}
          </text>
          <text x={254} y={29} textAnchor="end" fontSize={11} fontWeight={700} className="fill-signal font-mono" letterSpacing={1}>
            {current.title}
          </text>
          {/* What he types, mirrored live on the big screen */}
          <text x={22} y={54} fontSize={12} fontWeight={700} className="fill-signal font-mono">
            {current.cmd.slice(0, reduced ? undefined : typed)}
            <tspan className={done ? 'ev-caret' : undefined}>▌</tspan>
          </text>
          <g key={shown} className="ev-slide" style={{ animationDelay: reduced ? '0s' : resultDelay }}>
            <g transform="translate(16 26) scale(0.86)">
              <Slide step={shown} />
            </g>
          </g>
          {STEPS.map((_, i) => (
            <rect key={i} x={24 + i * 39} y={184} width={33} height={4} fill={i <= shown ? 'var(--color-signal)' : 'currentColor'} opacity={i <= shown ? 1 : 0.15} />
          ))}
          <rect x={130} y={196} width={16} height={22} fill="currentColor" opacity={0.2} />
          <rect x={92} y={218} width={92} height={5} fill="currentColor" opacity={0.2} />

          {/* Data flowing from the laptop to the big screen */}
          <path d="M300 130 C 286 130, 282 112, 268 112" fill="none" className="ev-flow stroke-signal" strokeWidth={1.5} strokeDasharray="4 5" opacity={0.7} />
          {!reduced &&
            [0, 0.5].map((d) => (
              <circle key={d} r={2.2} className="fill-signal">
                <animateMotion dur="1s" begin={`${d}s`} repeatCount="indefinite" path="M300 130 C 286 130, 282 112, 268 112" />
              </circle>
            ))}

          {/* The hacker */}
          <g className="ev-breathe" style={{ transformOrigin: '330px 236px' }}>
            {/* Sneakers and jeans */}
            <path d="M306 236 h22 v-6 q-12 -4 -22 0 Z" fill="#e7e9ee" />
            <path d="M332 236 h22 v-6 q-10 -4 -22 0 Z" fill="#e7e9ee" />
            <rect x={311} y={166} width={14} height={64} fill="#2b3445" />
            <rect x={335} y={166} width={14} height={64} fill="#252d3c" />
            {/* Hoodie body, pocket and lime drawstrings */}
            <path d="M302 100 Q330 88 358 100 L362 172 L298 172 Z" fill={HOODIE} />
            <path d="M312 150 H348 L344 168 H316 Z" fill={HOODIE_DARK} />
            <path d="M325 96 L323 120 M335 96 L337 120" className="stroke-signal" strokeWidth={1.5} strokeLinecap="round" />
            <circle cx={323} cy={121} r={1.8} className="fill-signal" />
            <circle cx={337} cy={121} r={1.8} className="fill-signal" />
            {/* Hood up, face in shadow, lit by the laptop */}
            <path d="M306 76 Q302 34 330 32 Q358 34 354 76 Q354 96 330 100 Q306 96 306 76 Z" fill={HOODIE} />
            <ellipse cx={330} cy={70} rx={15} ry={17} fill={SKIN} />
            <path d="M315 66 Q316 48 330 48 Q344 48 345 66 Q340 56 330 56 Q320 56 315 66 Z" fill={HAIR} />
            <path d="M313 60 Q330 40 347 60 Q344 46 330 44 Q316 46 313 60 Z" fill={HOODIE_DARK} />
            <path d="M316 74 Q318 88 330 88 Q342 88 344 74 Q340 83 330 83 Q320 83 316 74 Z" fill={HAIR} opacity={0.6} />
            <ellipse cx={330} cy={86} rx={20} ry={14} fill="url(#ev-glow)" />
            {/* Eyes down on the laptop, with an occasional blink */}
            <g className="ev-blink" style={{ transformOrigin: '330px 70px' }}>
              <ellipse cx={324} cy={70} rx={2.2} ry={1.4} fill={HAIR} />
              <ellipse cx={336} cy={70} rx={2.2} ry={1.4} fill={HAIR} />
            </g>
            <path d="M320 65 l7 1.5 M340 65 l-7 1.5" stroke={HAIR} strokeWidth={1.6} strokeLinecap="round" />
            <path d="M326 80 q4 1.5 8 0" fill="none" stroke="#4a2619" strokeWidth={1.4} strokeLinecap="round" />
            {/* Arms bent forward under the laptop */}
            <path d="M306 106 L298 140 L310 150" fill="none" stroke={HOODIE} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M354 106 L362 140 L350 150" fill="none" stroke={HOODIE} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
            {/* Laptop: lid back towards us, glowing logo */}
            <rect x={300} y={112} width={60} height={34} rx={3} fill="#3a4150" stroke="#596274" strokeWidth={1.5} />
            <rect x={300} y={112} width={60} height={34} rx={3} fill="url(#ev-glow)" className="ev-live" />
            <text x={330} y={133} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-signal font-mono">
              {'</>'}
            </text>
            <path d="M294 146 H366 L360 153 H300 Z" fill="#596274" />
            {/* Fingers tapping the keys */}
            <circle cx={312} cy={150} r={4.5} fill={SKIN} className={reduced ? undefined : 'ev-tap'} style={{ transformOrigin: '312px 150px' }} />
            <circle cx={348} cy={150} r={4.5} fill={SKIN} className={reduced ? undefined : 'ev-tap'} style={{ transformOrigin: '348px 150px', animationDelay: '0.12s' }} />
          </g>
        </svg>
        {/* Subtitle */}
        <p key={shown} className="ev-slide mt-1 mb-3 min-h-[2.8em] px-2 text-center text-[clamp(0.75rem,1.15vw,0.92rem)] leading-snug text-ink/90">
          {current.caption}
        </p>
      </div>
    </Frame>
  )
}

const GREY = '#8b93a1'
const LIME = '#c6ff3d'
const AMBER = '#ffb020'
const STAMP = '#4ade80'

/** Points the scan checks on the page; the one at TARGET is where it stops. */
const DOTS = [
  { x: 92, y: 62 },
  { x: 136, y: 112 },
  { x: 180, y: 192 },
  { x: 226, y: 96 },
  { x: 268, y: 147 },
  { x: 300, y: 166 },
  { x: 318, y: 192 },
]
const TARGET = 4
const SCAN_FROM = 60
const SCAN_PAUSE = DOTS[TARGET].x
const SCAN_TO = 340
/** Chapters of the take, with their spans on the timeline in seconds. */
const CHAPTERS = [
  { title: '01 · Scan', caption: 'Scanning', start: 0, end: 3 },
  { title: '02 · Finding', caption: 'Issue found', start: 3, end: 5 },
  { title: '03 · Report', caption: 'Reported', start: 5, end: 8.6 },
  { title: '04 · Fix verified', caption: 'Fix verified', start: 8.6, end: 11.6 },
]
const LINES = ['Finding #1 · High', 'Reported & fixed']
/** JetBrains Mono advances 0.6em per character. */
const CHAR_W = 0.6 * 10

/** A camera transform that puts world point (px, py) in the centre of the 400×240 view at scale s. */
const shot = (px: number, py: number, s: number) => ({ x: 200 - s * px, y: 120 - s * py, scale: s })

/** 03: one continuous take in four chapters: scan, finding, report, fix verified. */
function Review() {
  const reduced = useReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  const tl = useRef<gsap.core.Timeline | null>(null)
  const uid = useId().replace(/:/g, '')

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)
      const t = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: 'power2.inOut' } })
      const tick = (x: number, from: number, to: number, start: number, dur: number) => start + ((x - from) / (to - from)) * dur
      /** Cross-fade the chapter label and subtitle to chapter i. */
      const chapter = (i: number, at: number) =>
        t.to(q(`.rv-sub-${i - 1}, .rv-ch-${i - 1}`), { opacity: 0, duration: 0.3 }, at).to(q(`.rv-sub-${i}, .rv-ch-${i}`), { opacity: 1, duration: 0.4 }, at + 0.2)

      // Reset everything at the top of each loop.
      t.set(q('.rv-cam'), { svgOrigin: '0 0', ...shot(200, 120, 1) }, 0)
        .set(q('.rv-scan'), { x: SCAN_FROM, opacity: 1 }, 0)
        .set(q('.rv-dot'), { attr: { fill: GREY } }, 0)
        .set(q('.rv-check, .rv-ring, .rv-ring-fix, .rv-tag, .rv-fix, .rv-stamp, .rv-chip, .rv-sub, .rv-ch'), { opacity: 0 }, 0)
        .set(q('.rv-card'), { opacity: 0, y: 24, scale: 0.92, transformOrigin: '50% 100%' }, 0)
        .set(q('.rv-link'), { strokeDashoffset: 12 }, 0)
        .set(q('.rv-type'), { attr: { width: 0 } }, 0)
        .set(q('.rv-stamp'), { scale: 1.8, rotation: -10, transformOrigin: '50% 50%' }, 0)
        .set(q('.rv-chip'), { y: 6 }, 0)
        .fromTo(q('.rv-world'), { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'none' }, 0)
        .to(q('.rv-sub-0, .rv-ch-0'), { opacity: 1, duration: 0.4 }, 0.2)
      // Each chapter fills its segment of the progress strip.
      CHAPTERS.forEach((c, i) => {
        t.fromTo(q(`.rv-seg-${i}`), { scaleX: 0 }, { scaleX: 1, duration: c.end - c.start, ease: 'none' }, c.start)
      })

      // 01 Scan: the scan sweeps the page while the camera drifts in.
      t.to(q('.rv-cam'), { ...shot(200, 120, 1.06), duration: 3, ease: 'sine.inOut' }, 0)
      t.to(q('.rv-scan'), { x: SCAN_PAUSE, duration: 2.5, ease: 'none' }, 0.4)
      DOTS.slice(0, TARGET).forEach((d, i) => {
        const at = tick(d.x, SCAN_FROM, SCAN_PAUSE, 0.4, 2.5)
        t.to(q(`.rv-dot-${i}`), { attr: { fill: LIME }, duration: 0.15, ease: 'none' }, at).to(q(`.rv-check-${i}`), { opacity: 1, duration: 0.15 }, at)
      })

      // 02 Finding: it stops on one point; push in, the point turns amber.
      const target = DOTS[TARGET]
      chapter(1, 3.5)
      t.to(q('.rv-cam'), { ...shot(target.x + 26, target.y - 6, 2.2), duration: 0.9 }, 3)
        .to(q(`.rv-dot-${TARGET}`), { attr: { fill: AMBER }, duration: 0.2, ease: 'none' }, 3.7)
        .fromTo(q('.rv-ring'), { opacity: 0.9, scale: 1, transformOrigin: '50% 50%' }, { opacity: 0, scale: 3, duration: 0.9, ease: 'power1.out', repeat: 1 }, 3.7)
        .fromTo(q('.rv-tag'), { opacity: 0, x: -4 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, 3.85)

      // 03 Report: pull out; the scan finishes and a report card rises from the point.
      chapter(2, 5)
      t.to(q('.rv-tag'), { opacity: 0, duration: 0.3 }, 5)
        .to(q('.rv-cam'), { ...shot(220, 115, 1.25), duration: 0.9 }, 5)
        .to(q('.rv-scan'), { x: SCAN_TO, duration: 0.5, ease: 'none' }, 5)
        .to(q('.rv-scan'), { opacity: 0, duration: 0.3 }, 5.5)
      DOTS.slice(TARGET + 1).forEach((d, i) => {
        const at = tick(d.x, SCAN_PAUSE, SCAN_TO, 5, 0.5)
        const n = TARGET + 1 + i
        t.to(q(`.rv-dot-${n}`), { attr: { fill: LIME }, duration: 0.15, ease: 'none' }, at).to(q(`.rv-check-${n}`), { opacity: 1, duration: 0.15 }, at)
      })
      t.to(q('.rv-link'), { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, 5.6)
        .to(q('.rv-card'), { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }, 5.7)
      LINES.forEach((l, i) => {
        t.to(q(`.rv-type-${i}`), { attr: { width: l.length * CHAR_W + 2 }, duration: 0.8, ease: `steps(${l.length})` }, 6.2 + i * 0.9)
      })
      t.to(q('.rv-stamp'), { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, 8)

      // 04 Fix verified: back in on the point, a retest pass turns it green, then pull out.
      chapter(3, 8.6)
      t.to(q('.rv-cam'), { ...shot(target.x - 20, target.y + 4, 1.7), duration: 0.8 }, 8.6)
        .set(q('.rv-scan'), { x: target.x - 28, opacity: 1 }, 9.3)
        .to(q('.rv-scan'), { x: target.x + 28, duration: 0.5, ease: 'none' }, 9.3)
        .to(q('.rv-scan'), { opacity: 0, duration: 0.25 }, 9.8)
        .to(q(`.rv-dot-${TARGET}`), { attr: { fill: STAMP }, duration: 0.15, ease: 'none' }, 9.55)
        .to(q(`.rv-check-${TARGET}`), { opacity: 1, duration: 0.15 }, 9.55)
        .fromTo(q('.rv-ring-fix'), { opacity: 0.9, scale: 1, transformOrigin: '50% 50%' }, { opacity: 0, scale: 3, duration: 0.8, ease: 'power1.out' }, 9.55)
        .fromTo(q('.rv-fix'), { opacity: 0, x: -4 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, 9.7)
        .to(q('.rv-fix'), { opacity: 0, duration: 0.3 }, 10.6)
        .to(q('.rv-cam'), { ...shot(208, 118, 1.12), duration: 0.8 }, 10.6)
        .to(q('.rv-chip'), { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 11)
        .addLabel('final', 11.8)
        .to(q('.rv-world, .rv-sub-3'), { opacity: 0, duration: 0.6, ease: 'none' }, 12.1)
        .set({}, {}, 12.9)

      tl.current = t
      return () => {
        tl.current = null
      }
    },
    { scope: ref },
  )

  // Play only while on screen; reduced motion holds the final frame.
  useEffect(() => {
    const t = tl.current
    if (!t) return
    if (reduced) t.pause('final')
    else if (inView) t.play()
    else t.pause()
  }, [inView, reduced])

  return (
    <Frame label="GOV PORTAL REVIEW" stat="4 CYCLES" tall>
      <div ref={ref} className="absolute inset-0 flex flex-col pt-3">
        {/* Chapter label and progress strip */}
        <div className="flex items-center gap-3 px-1 pb-2 font-mono text-[0.62rem] tracking-[0.18em] uppercase sm:text-[0.68rem]">
          <span className="grid shrink-0 text-signal">
            {CHAPTERS.map((c, i) => (
              <span key={c.title} className={`rv-ch rv-ch-${i} [grid-area:1/1]`} style={{ opacity: i === 0 ? 1 : 0 }}>
                {c.title}
              </span>
            ))}
          </span>
          <span className="flex flex-1 gap-1">
            {CHAPTERS.map((c, i) => (
              <span key={c.title} className="h-[3px] flex-1 bg-ink/15">
                <span className={`rv-seg rv-seg-${i} block h-full origin-left bg-signal`} style={{ transform: 'scaleX(0)' }} />
              </span>
            ))}
          </span>
        </div>
        <svg viewBox="0 0 400 240" className="min-h-0 w-full flex-1" preserveAspectRatio="xMidYMid meet">
          <defs>
            <clipPath id={`${uid}-view`}>
              <rect width={400} height={240} />
            </clipPath>
            <radialGradient id={`${uid}-vignette`} r="0.75">
              <stop offset="0.55" stopColor="#000" stopOpacity={0} />
              <stop offset="1" stopColor="#000" stopOpacity={0.6} />
            </radialGradient>
            {LINES.map((_, i) => (
              <clipPath key={i} id={`${uid}-type-${i}`}>
                <rect className={`rv-type rv-type-${i}`} x={196} y={77 + i * 18} width={0} height={15} />
              </clipPath>
            ))}
          </defs>
          <g clipPath={`url(#${uid}-view)`}>
            <g className="rv-cam">
              <g className="rv-world">
                {/* Wireframe portal page */}
                <rect x={60} y={30} width={280} height={180} rx={4} fill="var(--color-paper)" stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.2} />
                <path d="M60 46 H340" stroke="currentColor" strokeOpacity={0.15} />
                {[70, 78, 86].map((cx) => (
                  <circle key={cx} cx={cx} cy={38} r={2} fill="currentColor" opacity={0.25} />
                ))}
                <rect x={100} y={35} width={140} height={6} rx={3} fill="currentColor" opacity={0.1} />
                <rect x={76} y={58} width={90} height={8} fill="currentColor" opacity={0.22} />
                <rect x={76} y={72} width={60} height={6} fill="currentColor" opacity={0.12} />
                <rect x={76} y={88} width={120} height={50} fill="none" stroke="currentColor" strokeOpacity={0.18} />
                <path d="M76 138 L116 108 L140 126 L160 112 L196 138" fill="none" stroke="currentColor" strokeOpacity={0.15} />
                <rect x={210} y={90} width={110} height={6} fill="currentColor" opacity={0.18} />
                <rect x={210} y={102} width={90} height={6} fill="currentColor" opacity={0.12} />
                <rect x={210} y={114} width={100} height={6} fill="currentColor" opacity={0.12} />
                <rect x={210} y={140} width={110} height={14} fill="none" stroke="currentColor" strokeOpacity={0.25} />
                <rect x={210} y={160} width={50} height={12} fill="currentColor" opacity={0.2} />
                <rect x={76} y={188} width={248} height={4} fill="currentColor" opacity={0.08} />
                <rect x={76} y={196} width={160} height={4} fill="currentColor" opacity={0.08} />

                {/* Scan line, with a soft trail behind it */}
                <g className="rv-scan">
                  <rect x={-18} y={46} width={18} height={164} fill={LIME} opacity={0.1} />
                  <rect x={-0.75} y={46} width={1.5} height={164} fill={LIME} />
                </g>

                {/* Check points */}
                {DOTS.map((d, i) => (
                  <g key={i} transform={`translate(${d.x} ${d.y})`}>
                    {i === TARGET && <circle className="rv-ring" r={4} fill="none" stroke={AMBER} strokeWidth={1} />}
                    {i === TARGET && <circle className="rv-ring-fix" r={4} fill="none" stroke={STAMP} strokeWidth={1} />}
                    <circle className={`rv-dot rv-dot-${i}`} r={4} fill={GREY} />
                    <path className={`rv-check rv-check-${i}`} d="M-2 0 l1.3 1.4 l2.7 -2.9" fill="none" stroke="var(--color-paper)" strokeWidth={1.2} strokeLinecap="round" />
                  </g>
                ))}

                {/* Close-up tag */}
                <g className="rv-tag">
                  <rect x={DOTS[TARGET].x + 9} y={DOTS[TARGET].y - 21} width={76} height={13} rx={2} fill="var(--color-paper)" stroke={AMBER} strokeWidth={0.8} />
                  <text x={DOTS[TARGET].x + 13} y={DOTS[TARGET].y - 12.2} fontSize={6.2} fontWeight={700} letterSpacing={0.2} fill={AMBER} className="font-mono">
                    Issue found · High
                  </text>
                </g>

                <g className="rv-fix">
                  <rect x={DOTS[TARGET].x - 67} y={DOTS[TARGET].y - 6.5} width={58} height={13} rx={2} fill="var(--color-paper)" stroke={STAMP} strokeWidth={0.8} />
                  <text x={DOTS[TARGET].x - 63} y={DOTS[TARGET].y + 2.3} fontSize={6.8} fontWeight={700} fill={STAMP} className="font-mono">
                    Fix verified
                  </text>
                </g>

                {/* Report card rising from the point */}
                <path className="rv-link" d={`M${DOTS[TARGET].x} ${DOTS[TARGET].y - 5} V140`} stroke={AMBER} strokeWidth={1} strokeDasharray="12" />
                <g className="rv-card">
                  <rect x={184} y={50} width={156} height={90} rx={3} fill="var(--color-panel)" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1} />
                  <rect x={184} y={50} width={3} height={90} fill={AMBER} />
                  <text x={196} y={66} fontSize={7.5} letterSpacing={1.4} className="fill-current font-mono" opacity={0.55}>
                    FINDING REPORT
                  </text>
                  {LINES.map((l, i) => (
                    <text key={l} x={196} y={88 + i * 18} fontSize={10} fontWeight={i === 0 ? 700 : 400} className="fill-current font-mono" clipPath={`url(#${uid}-type-${i})`}>
                      {l}
                    </text>
                  ))}
                  <g className="rv-stamp">
                    <rect x={270} y={116} width={64} height={18} rx={2} fill="none" stroke={STAMP} strokeWidth={1.6} />
                    <text x={302} y={128.5} textAnchor="middle" fontSize={8.5} fontWeight={800} letterSpacing={1.4} fill={STAMP} className="font-mono">
                      REPORTED
                    </text>
                  </g>
                </g>
                <g className="rv-chip">
                  <rect x={76} y={150} width={112} height={20} rx={2} fill="var(--color-paper)" stroke={LIME} strokeWidth={1.2} />
                  <text x={132} y={163.5} textAnchor="middle" fontSize={8.5} fontWeight={700} letterSpacing={1} fill={LIME} className="font-mono">
                    4 CERT-In cycles
                  </text>
                </g>
              </g>
            </g>
          </g>
          {/* Lens: vignette and letterbox bars stay fixed while the camera moves */}
          <rect width={400} height={240} fill={`url(#${uid}-vignette)`} pointerEvents="none" />
          <rect width={400} height={14} fill="#000" opacity={0.85} />
          <rect y={226} width={400} height={14} fill="#000" opacity={0.85} />
        </svg>
        {/* One subtitle line, cross-fading between beats */}
        <p className="relative mt-1 mb-3 min-h-[1.6em] px-2 text-center font-mono text-[clamp(0.78rem,1.15vw,0.92rem)] tracking-[0.18em] text-ink/90 uppercase">
          {CHAPTERS.map((c, i) => (
            <span key={c.caption} className={`rv-sub rv-sub-${i} absolute inset-x-0 top-0`} style={{ opacity: i === 0 ? 1 : 0 }}>
              {c.caption}
            </span>
          ))}
        </p>
      </div>
    </Frame>
  )
}

export function EngagementVisual({ item }: { item: WorkItem }) {
  if (item.visual === 'presenter') return <Presenter />
  if (item.visual === 'review') return <Review />
  return <Lifecycle />
}
