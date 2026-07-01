// ---------------------------------------------------------------------------
// Northeastern Satellite Lab — content data.
// ---------------------------------------------------------------------------

export const CONTACT_EMAIL = 'northeasternsatellitelab@gmail.com'

export const NSL_TEXT =
  'NSL is a brand-new spin-out club from the Northeastern Aerospace Club, originally founded in 2022 by undergraduate students. The club is run by a management team of 8 undergrads and supported by our faculty advisor, Dr. Jornet, the Associate Dean of Research in the Northeastern College of Engineering. We\'re also backed by a small but dedicated group of satellite club alumni.'

export const CUBESAT_TEXT =
  'A CubeSat is a miniaturized satellite, typically under 20 kg, built to a standardized modular design where each unit (a "1U") measures just 10×10×10 cm and weighs about 1.33 kg. Originally developed in 1999 as an educational tool, CubeSats have grown into a platform used by universities, startups, and space agencies to conduct science, test new technology, and enable commercial applications at a fraction of the cost of traditional satellites. Their small size and standardized form factor make them far cheaper to build and launch — democratizing access to space for organizations that previously couldn\'t afford it.'

export const TEAMS = [
  { icon: 'wrench', title: 'Hardware',    body: 'Structures, power, payloads, and the physical satellite platform — designed, built, and tested by students.' },
  { icon: 'zap',    title: 'Software',    body: 'Flight software, onboard processing, and ground-station comms that keep the mission alive in orbit.' },
  { icon: 'globe',  title: 'Simulations', body: 'Orbital mechanics, spacecraft dynamics, and mission analysis — modeling the mission before it flies.' },
]

export const PARTNERS = [
  'NASA CSLI', 'AFRL UNP', 'UN Laboratory NU', 'INSI',
  'NSF CIRC', 'PROVES', 'Cal Poly Pomona · Bronco Space', 'MSU',
]

export const ALUMNI_COMPANIES = [
  'MIT Lincoln Laboratory', 'Draper Laboratory', 'Specter Aerospace', 'Blue Origin',
  'Space Dynamics Laboratory', 'Shield AI', 'Northeastern INSI', 'Stealth Start-up',
  'Fidelity Investments', 'Harvard Medical School', 'Stripe', 'SpaceX',
]

// ── Programs (active missions & ground stations) ─────────────────────────────
export const PROGRAMS = [
  {
    id: 'teralink-1',
    name: 'Teralink-1',
    tag: 'Active satellite program',
    image: '/img/satellite.svg',
    body: 'An in-development CubeSat program pushing high-frequency communications. [Placeholder — full mission description coming from the Teralink-1 team.]',
    placeholder: true,
  },
  {
    id: 'sub-thz',
    name: 'Sub-THz Ground Station',
    tag: 'Ground segment',
    image: '/img/groundstation.svg',
    body: 'A student-built ground station exploring sub-terahertz communication links. [Placeholder — full description coming soon.]',
    placeholder: true,
  },
  {
    id: 'proves-atlas',
    name: 'PROVES Atlas',
    tag: 'Launched · April 2026',
    image: '/img/proves.svg',
    body: "In April 2026, Northeastern went to space for the first time — a student-built CubeSat, launched into orbit alongside four others as part of a constellation network. About 15 students built it in under a year, working shoulder-to-shoulder with the Pleiades Consortium, a group of five partner university teams. Our students worked on both the hardware and the software of the platform, and we open-sourced all of it. It carries a Sony Spresense camera payload for image capture, and it's part of PROVES — an educational satellite program that's also building CubeSat platform kits universities can get for under $3,000, lowering the barrier to space for students and researchers everywhere.",
  },
]

// ── Competitions ─────────────────────────────────────────────────────────────
export const COMPETITIONS = [
  {
    id: 'dewsat',
    name: 'DEWSat — NASA Space to Soil',
    tag: 'Finalist',
    image: '/img/dewsat.svg',
    body: "NASA's Space to Soil challenge asked teams to design a small satellite with onboard, adaptive processing for agriculture and forestry. NSL's four-member group was selected as a finalist for DEWSat — a Drought Early Warning Satellite. It captures multispectral data and processes it directly onboard to calculate vegetation indices, detect soil stress, and produce actionable risk alerts within hours, using a custom compute architecture running a quantized Bi-LSTM model. Doing the analysis in orbit means faster responses and makes soil-stress monitoring accessible to organizations without heavy ground infrastructure. The same onboard-intelligence architecture extends to wildfire, floods, and urban heat — especially as a constellation. The competition has concluded, but the team is still exploring how to take DEWSat from a strong concept to a launch-ready mission.",
  },
  {
    id: 'gtoc-14',
    name: 'GTOC-14',
    tag: 'Intending to compete',
    body: 'The Global Trajectory Optimization Competition is an annual international astrodynamics contest — solving hard interplanetary mission-design problems through trajectory optimization. Often called "America\'s Cup of Rocket Science." GTOC-14 hasn\'t been announced yet, but NSL intends to participate.',
  },
]

// ── R&D projects ─────────────────────────────────────────────────────────────
export const RND = [
  { icon: 'star',   title: 'Open-Source Star Tracker Algorithm', body: 'An open attitude-determination algorithm that identifies a spacecraft\'s orientation from the stars it sees.' },
  { icon: 'globe',  title: 'Open-Source Radio Telescope',        body: 'A radio telescope built in collaboration with SEDS — open hardware for listening to the sky.' },
  { icon: 'layers', title: 'SatSim: Mission Analysis Tool',      body: 'An open-source Python framework for end-to-end CubeSat mission simulation — a flexible, modular architecture covering orbital mechanics, spacecraft dynamics, and mission analysis. Early development, aiming to become an accessible tool for CubeSat mission design and education.' },
  { icon: 'wrench', title: 'Deployable Solar Panel Mechanism',   body: 'A student-designed deployable solar-panel mechanism for CubeSats — more power in a small package.' },
]

// ── This semester ────────────────────────────────────────────────────────────
export const SCHEDULE = [
  { day: 'Monday',    what: 'Hardware team build session',     time: '6:00 – 8:00 PM', where: 'ISEC — Lab' },
  { day: 'Tuesday',   what: 'Software / flight code',          time: '7:00 – 9:00 PM', where: 'Snell Library' },
  { day: 'Wednesday', what: 'All-hands general meeting',       time: '7:30 – 9:00 PM', where: 'Forsyth 129' },
  { day: 'Thursday',  what: 'Simulations & mission analysis',  time: '6:00 – 8:00 PM', where: 'Remote / Discord' },
  { day: 'Friday',    what: 'Open lab / office hours',         time: '3:00 – 6:00 PM', where: 'ISEC — Lab' },
]

export const ROSTER = [
  { group: 'E-Board', members: ['Laura Teixeira', 'Swati Sundaram', 'Orlando LuPone', 'Sandhya Moorthi', 'Gavin Sarno'] },
  { group: 'Teralink-1', members: ['Landon Bayer', 'Noah Typrin', 'Riley Ashok'] },
]
