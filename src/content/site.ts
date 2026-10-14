/**
 * Single source of truth for every word on the site.
 *
 * Everything here is taken from Rakshit_Tomar_Resume_AppSec.docx and the
 * portfolio brief. Nothing is invented: where the resume carries a
 * placeholder ("[N]", "[GitHub URL]") the value is left out or empty, and
 * empty values are simply not rendered. Fill them in here when confirmed.
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
  /** Resume lists "[GitHub URL]" and "[Hack The Box profile URL]" as placeholders. Add real URLs to show them. */
  github: '',
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
  introAudio: asset('intro.mp3'),
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
  /** Set true if walk.mp4 carries the spoken introduction. The sound toggle then unmutes the video. */
  videoHasSpeech: false,
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
    { value: 3, decimals: 0, suffix: '', label: 'Security firms' },
    { value: 4, decimals: 0, suffix: '', label: 'Attack surfaces: web, API, mobile, thick-client' },
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
  stack: string[]
  outcome: string
  link?: { label: string; href: string }
  note?: string
}

export const work: WorkItem[] = [
  {
    index: '01',
    kind: 'Engagements · Acquisory Consulting LLP',
    title: 'End-to-end client application assessments',
    context: 'Client-facing web, Android, API and thick-client applications.',
    contribution: [
      'Runs assessments from vulnerability identification through remediation validation.',
      'Tests manually and with custom scripts for OWASP Top 10, authentication, authorization, input-validation and business-logic flaws.',
      'Builds security testing into development workflows with engineering teams.',
    ],
    stack: ['Burp Suite', 'OWASP ZAP', 'Postman', 'Custom scripts'],
    outcome:
      'Technical vulnerability reports and executive risk summaries aligned with client security and compliance requirements.',
    note: 'Client names and findings are confidential.',
  },
  {
    index: '02',
    kind: 'Engagements · ControlCase International',
    title: 'Financial-sector application testing',
    context: 'Web, mobile and thick-client applications across application, API and client-side attack surfaces.',
    contribution: [
      'Discovered, validated and documented high-risk vulnerabilities including XSS, SQL injection and CSRF.',
      'Ran dynamic application security testing across authentication, authorization, session management, input validation, API security and business logic.',
    ],
    stack: ['Burp Suite', 'OWASP ZAP', 'Kali Linux'],
    outcome:
      'Manual penetration tests delivered with reproducible proof-of-concepts, risk ratings and remediation guidance.',
    note: 'Client names and findings are confidential.',
  },
  {
    index: '03',
    kind: 'Engagements · CyberQ',
    title: 'Government web apps & APIs under CERT-In',
    context: 'Government web applications and APIs tested across multiple CERT-In assessment cycles.',
    contribution: [
      'Ran automated and manual vulnerability assessments, then validated and triaged the findings.',
      'Fitted vulnerability identification and remediation validation into development and QA cycles.',
    ],
    stack: ['Burp Suite', 'OWASP ZAP', 'Acunetix'],
    outcome:
      'OWASP Top 10 findings documented with evidence, impact analysis and remediation recommendations.',
    note: 'Client names and findings are confidential.',
  },
  {
    index: '04',
    kind: 'Project · B.Tech final year',
    title: 'Python web vulnerability scanner',
    context: 'Final-year project, Guru Gobind Singh Indraprastha University.',
    contribution: ['Built a scanner that scans web applications and generates the security report.'],
    stack: ['Python'],
    outcome: 'Automated scan-to-report workflow for web applications.',
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
   * The resume does not describe Dark Vector's services yet, so none are listed.
   * Add a description and services here once confirmed; they render automatically.
   */
  description: '',
  services: [] as string[],
  website: '',
  /** Shown while services are empty: the founder's verified practice areas. */
  practiceAreas: [
    'Web application penetration testing',
    'API security assessments',
    'Mobile (Android) application testing',
    'Thick-client assessments',
    'Remediation validation',
    'Technical & executive reporting',
  ],
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
      'End-to-end assessments of web, Android, API and thick-client applications.',
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
      'Assessed financial-sector web, mobile and thick-client applications.',
      'Found and documented high-risk XSS, SQLi and CSRF vulnerabilities.',
      'Manual penetration tests with reproducible proof-of-concepts.',
    ],
  },
  {
    period: 'Mar 2023 — Dec 2023',
    title: 'Application Security Analyst',
    org: 'CyberQ Pvt. Ltd.',
    type: 'experience',
    points: [
      'Tested government web applications and APIs under CERT-In.',
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
