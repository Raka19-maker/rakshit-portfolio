/**
 * Single source of truth for every word on the site.
 *
 * Everything here is taken from Rakshit_Tomar_Resume_AppSec.docx and the
 * portfolio brief. Nothing is invented: values the resume doesn't give are
 * left empty, and empty values are simply not rendered. Fill them in here
 * when confirmed.
 */

const base = import.meta.env.BASE_URL

export const asset = (file: string) => `${base}assets/${file}`

export const person = {
  firstName: 'Rakshit',
  lastName: 'Tomar',
  fullName: 'Rakshit Tomar',
  headline: 'Application Security Engineer',
  specialty: 'Web, API & Mobile Penetration Testing',
  location: 'Ghaziabad, U.P., India',
  intro:
    "Hello, I'm Rakshit, AppSec Engineer, Bughunter and Founder of Dark Vector. Welcome to my portfolio.",
}

export const contact = {
  email: 'rakshittomar19@gmail.com',
  linkedin: 'https://www.linkedin.com/in/rakshit-tomar-7604021a',
  /** Left out of the public code. Add a number and set showPhone to true to display it. */
  phone: '',
  showPhone: false,
  github: 'https://github.com/Raka19-maker',
  /** Not on the resume yet. Add the profile URL to show it. */
  hackTheBox: '',
}

export const heroMedia = {
  image: asset('character.png'),
  videoMp4: asset('walk.mp4'),
  videoWebm: asset('walk.webm'),
  /**
   * The whole shot (walk in, turn to camera) with a transparent background, used
   * when walkMode is 'full'. Safari can't show WebM transparency, so it gets the
   * MP4, composited on the page grey. The poster is its last frame.
   */
  videoFull: asset('walk-full.webm'),
  videoFullMp4: asset('walk-full.mp4'),
  poster: asset('walk-poster.png'),
  /** 'full' mode: second of the shot to start from (he is fully in frame by then). */
  shotStartAt: 1,
  /** 'full' mode: he first appears just past this letter of the name (0 = R, 1 = A). */
  shotStartLetter: 1,
  resumePdf: asset('resume.pdf'),
  /**
   * 'translate': the clip walks in place and the site moves it from the left
   *              edge into the right third (default).
   * 'native':    the clip already contains the left-to-right walk; the site
   *              only places it in the right third.
   * 'full':      plays walk-full.mp4 as it is, filling the hero (studio,
   *              turn and camera push-in included); text renders in his wake.
   */
  walkMode: 'full' as 'translate' | 'native' | 'full',
  /** Multiply-blend the clip so a white background disappears into the white hero. */
  blendWhiteBackground: true,
  /**
   * Playback speed of the walk. The page travel follows the video clock
   * (src/content/walkTrack.ts), so the feet stay planted at any speed.
   */
  walkPlaybackRate: 1.4,
  /**
   * Second of the clip the walk-in starts from. The early part happens off
   * screen, so skipping it brings him in right after the loader lifts.
   */
  walkStartAt: 0.6,
}

/**
 * Keep every animation (walk-in, smooth scroll, scroll effects) even when the
 * visitor's system asks for reduced motion. Windows asks for it whenever
 * "Animation effects" is off. Set false to honour that preference instead.
 */
export const ignoreSystemReducedMotion = true

export const roles = ['AppSec Engineer', 'Penetration Tester', 'Bughunter']

export const about = {
  /** The big statement; highlighted parts render in red. */
  statement: [
    { text: "I'm Rakshit, an " },
    { text: 'Application Security Engineer', highlight: true },
    {
      text: ' with 3.5 years of web, API, mobile and thick-client assessments across financial, enterprise and government applications. I take findings from identification through ',
    },
    { text: 'remediation validation', highlight: true },
    { text: ', with a focus on ' },
    { text: 'authentication, authorization and business-logic flaws.', highlight: true },
  ] as { text: string; highlight?: boolean }[],
  /** Counts taken straight from the resume. */
  stats: [
    { value: 3.5, decimals: 1, suffix: ' yrs', label: 'Application security experience' },
    { value: 170, decimals: 0, suffix: '+', label: 'Web, mobile, API & thick-client apps assessed' },
    { value: 43, decimals: 0, suffix: '+', label: 'High-risk vulnerabilities found & documented' },
    { value: 3, decimals: 0, suffix: '', label: 'Certifications, one in progress' },
  ],
  lead: 'Application Security Engineer with 3.5 years of web, API, mobile and thick-client security assessments across financial, enterprise and government applications.',
  body: [
    'Rakshit takes findings from identification through remediation validation, working with development teams through SDLC and sprint cycles, with a focus on authentication, authorization and business-logic flaws.',
    'He is hands-on with Burp Suite, OWASP ZAP, Nuclei, MobSF and Postman, and writes both technical vulnerability reports and executive risk summaries.',
  ],
  focus: [
    'Authentication & authorization',
    'Business-logic flaws',
    'API security (REST, GraphQL, OAuth 2.0, JWT)',
    'Web, Android & thick-client testing',
  ],
  facts: [
    { label: 'Experience', value: '3.5 years' },
    { label: 'Sectors', value: 'Financial · Enterprise · Government' },
    { label: 'Education', value: 'B.Tech CSE, GGSIPU Delhi' },
    { label: 'Founder', value: 'Dark Vector Security Solutions' },
  ],
}

export type WorkItem = {
  index: string
  kind: string
  title: string
  context: string
  contribution: string[]
  /** Animated graphic shown beside the card. */
  visual: 'lifecycle' | 'presenter' | 'review'
  link?: { label: string; href: string }
  note?: string
}

export const work: WorkItem[] = [
  {
    index: '01',
    visual: 'lifecycle',
    kind: 'Engagements · Acquisory Consulting LLP',
    title: 'End-to-end client application assessments',
    context: '50+ client-facing web, Android, API and thick-client applications.',
    contribution: [
      'Runs assessments from vulnerability identification through remediation validation.',
      'Tests manually and with custom scripts for OWASP Top 10, authentication, authorization, input-validation and business-logic flaws.',
      'Builds security testing into development workflows with engineering teams.',
    ],
    note: 'Client names and findings are confidential.',
  },
  {
    index: '02',
    visual: 'presenter',
    kind: 'Engagements · ControlCase International',
    title: 'Financial-sector application testing',
    context: '120+ financial-sector web, mobile and thick-client applications across application, API and client-side attack surfaces.',
    contribution: [
      'Discovered, validated and documented 43+ high-risk vulnerabilities including XSS, SQL injection and CSRF.',
      'Ran dynamic application security testing across authentication, authorization, session management, input validation, API security and business logic.',
    ],
    note: 'Client names and findings are confidential.',
  },
  {
    index: '03',
    visual: 'review',
    kind: 'Engagements · CyberQ',
    title: 'Government web apps & APIs under CERT-In',
    context: 'Government web applications and APIs tested across 4 CERT-In assessment cycles.',
    contribution: [
      'Ran automated and manual vulnerability assessments, then validated and triaged the findings.',
      'Fitted vulnerability identification and remediation validation into development and QA cycles.',
    ],
    note: 'Client names and findings are confidential.',
  },
]

export const skills: { group: string; items: string[]; note?: string }[] = [
  {
    group: 'Application security',
    items: [
      'Web, API & mobile application security testing',
      'Authentication & authorization',
      'Business logic',
      'OWASP Top 10',
      'Secure SDLC',
      'Vulnerability management',
      'Threat modeling',
    ],
  },
  {
    group: 'APIs & protocols',
    items: ['REST', 'GraphQL', 'OAuth 2.0', 'JWT', 'BOLA / IDOR', 'CORS', 'Rate limiting', 'Session management'],
  },
  {
    group: 'Tools',
    items: ['Burp Suite', 'OWASP ZAP', 'Acunetix', 'Nuclei', 'SQLMap', 'Postman', 'MobSF', 'Nmap', 'Wireshark', 'Kali Linux'],
  },
  {
    group: 'Scripting',
    items: ['Python', 'JavaScript', 'Bash', 'REST APIs'],
  },
  {
    group: 'Cloud & identity',
    items: ['Microsoft Entra ID', 'Azure attack techniques'],
    note: 'AzRTS coursework, in progress',
  },
]

export const darkVector = {
  name: 'Dark Vector',
  legalName: 'Dark Vector Security Solutions',
  role: 'Founder',
  /**
   * Dark Vector is new: copy describes the practice and the founder's background,
   * never a client count or track record of its own.
   */
  tagline: 'Application security testing that finds what scanners miss, and stays until it is fixed.',
  description:
    'Dark Vector Security Solutions is a new application security practice founded by Rakshit Tomar, built on his hands-on background testing web, API, mobile and thick-client applications. Each engagement is scoped and tested by him personally, and developers are supported from the first finding to a verified fix.',
  website: '',
  offerings: [
    {
      icon: 'web',
      title: 'Web application testing',
      body: 'Manual and tool-assisted testing against the OWASP Top 10, authentication, authorization and business logic.',
    },
    {
      icon: 'api',
      title: 'API security',
      body: 'REST and GraphQL APIs: OAuth 2.0, JWT, access control, session handling and rate limits.',
    },
    {
      icon: 'mobile',
      title: 'Mobile & thick-client',
      body: 'Android apps and desktop clients, across their API and client-side attack surfaces.',
    },
    {
      icon: 'report',
      title: 'Reporting & retest',
      body: 'Technical reports and executive risk summaries aligned to compliance needs, then every fix validated.',
    },
  ] as const,
  /** Dark Vector is new, so these are commitments, not a track record: no numbers or past-client claims. */
  why: [
    {
      icon: 'founder',
      title: 'Founder-led',
      body: 'Every engagement is tested personally by the founder, never handed off to juniors.',
    },
    {
      icon: 'manual',
      title: 'Manual-first testing',
      body: 'Time goes into the logic and access-control flaws that automated scanners miss.',
    },
    {
      icon: 'actionable',
      title: 'Reports developers can act on',
      body: 'Clear reproduction steps, impact and fix guidance for every finding.',
    },
    {
      icon: 'retest',
      title: 'Retest until fixed',
      body: 'Fixes are verified, not just reported, before a finding is closed.',
    },
  ] as const,
}

export type TimelineItem = {
  period: string
  title: string
  org: string
  type: 'experience' | 'education' | 'certification'
  points?: string[]
  status?: string
}

export const timeline: TimelineItem[] = [
  {
    period: 'Jul 2025 — Present',
    title: 'Associate Cyber Security',
    org: 'Acquisory Consulting LLP',
    type: 'experience',
    points: [
      'End-to-end assessments of 50+ web, Android, API and thick-client applications.',
      'Triage, remediation guidance and fix validation with development teams.',
      'Technical reports and executive risk summaries.',
    ],
  },
  {
    period: 'Dec 2023 — Jun 2025',
    title: 'Associate Consultant',
    org: 'ControlCase International Pvt. Ltd.',
    type: 'experience',
    points: [
      'Assessed 120+ financial-sector web, mobile and thick-client applications.',
      'Found and documented 43+ high-risk XSS, SQLi and CSRF vulnerabilities.',
      'Manual penetration tests with reproducible proof-of-concepts.',
    ],
  },
  {
    period: 'Mar 2023 — Dec 2023',
    title: 'Application Security Analyst',
    org: 'CyberQ Pvt. Ltd.',
    type: 'experience',
    points: [
      'Tested government web applications and APIs under CERT-In across 4 assessment cycles.',
      'Automated and manual assessments with Burp Suite, OWASP ZAP and Acunetix.',
    ],
  },
  {
    period: '2018 — 2022',
    title: 'B.Tech, Computer Science Engineering',
    org: 'Guru Gobind Singh Indraprastha University, Delhi',
    type: 'education',
    points: ['Final-year project: a Python web vulnerability scanner with report generation.'],
  },
]

export const certifications: { name: string; issuer: string; status?: string }[] = [
  { name: 'CJCA', issuer: 'Hack The Box' },
  { name: 'Ethical Hacking', issuer: 'CRAW Academy' },
  { name: 'AzRTS', issuer: 'CyberWarfare Labs', status: 'In progress · expected 2026' },
]

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'dark-vector', label: 'Dark Vector' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]
