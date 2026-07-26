/**
 * GlaciaNav One-Pager: single source of truth.
 *
 * WEEKLY UPDATE: edit the copy below and bump `meta.lastUpdated`.
 * Everything the mentors read lives in this file. No layout code here.
 */

export const meta = {
  name: "GlaciaNav",
  tagline:
    "AI ice forecasting for maritime: detection, thickness and drift, hours ahead.",
  descriptor: "The predictive ice picture for winter shipping.",
  location: "Turku, Finland",
  email: "info@glacianav.com",
  linkedin: "https://www.linkedin.com/company/glacianav/",
  lastUpdated: "July 27, 2026",
};

export const nav = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Traction", href: "#traction" },
  { label: "Team", href: "#team" },
  { label: "Ask", href: "#ask" },
];

export const hero = {
  eyebrow: "Deep-tech AI · Turku, Finland",
  headline: "AI ice forecasting for maritime.",
  subtext:
    "We detect the ice, measure its thickness and forecast its drift from all-weather satellite radar, so the bridge sees the field as it will be, not as it was.",
  primaryCta: "Contact us",
  secondaryCta: "How it works",
};

export const problem = {
  headline: "Ships sail with outdated data.",
  subtext:
    "In ice, unknown thickness burns fuel, triggers carbon penalties and risks the hull, while the tools on the bridge lag hours behind a field that shifts by the minute.",
  stats: [
    { value: "11,000+", label: "vessels need Baltic ice assistance every winter" },
    { value: "24h", label: "the age of the ice charts crews still navigate on" },
    { value: "6h+", label: "that legacy forecast models lag behind reality" },
  ],
  crises: [
    {
      kicker: "Fuel",
      title: "Exponential burn",
      body: "Ice multiplies hull resistance and engine load. Fuel is already the largest cost of a voyage, and ice makes it climb fast and unpredictably.",
      metric: "Cost ↑",
    },
    {
      kicker: "Carbon",
      title: "A double penalty",
      body: "The EU Emissions Trading System now covers shipping. Fuel burned forcing through ice is paid for twice: once at the pump, once in carbon allowances.",
      metric: "EU ETS",
    },
    {
      kicker: "Tools",
      title: "Navigating blind",
      body: "Static charts age by the hour and lagging models miss fast ice shifts, so captains commit on information that is already wrong.",
      metric: "Reactive",
    },
  ],
};

export const solution = {
  headline: "A live ice picture, not a static chart.",
  subtext:
    "GlaciaNav reads continuous SAR satellite radar to detect the ice, estimate how thick it is and forecast where it drifts. SAR sees through cloud and polar darkness, so the picture never goes blind.",
  benefits: [
    { title: "Lower fuel burn", note: "See where ice resistance is lowest." },
    { title: "Avoid carbon penalties", note: "Cut EU ETS costs with lower emissions." },
    { title: "Protect the hull", note: "Steer clear of multiyear and packed ice." },
  ],
  /** Wilma: the savings are a working hypothesis until the Baltic Beta measures them. */
  benefitsNote:
    "Working hypothesis, to be measured against real vessel baselines in the Baltic Beta.",
  flagship: {
    title: "Iceberg movement prediction",
    body: "Detect every iceberg in all-weather radar, forecast its drift hours ahead, and alert the bridge when one enters the planned corridor.",
  },
  howItWorks: [
    {
      title: "Ice detection",
      body: "A proprietary encoder-decoder model classifies ridges, leads, floes and compression zones from all-weather radar, day or night, across an entire ice field.",
    },
    {
      title: "Ice thickness",
      body: "Thickness and concentration estimated across the whole field rather than a handful of measured points, updated as each new satellite pass lands, with confidence attached.",
    },
    {
      title: "Drift forecast",
      body: "Water current, wind speed and direction, and wave information drive a physics-informed model, so the forecast stays physically consistent even where data is sparse.",
    },
  ],
};

export const stage = {
  headline: "Where we are",
  subtext:
    "From a two-year research program to a vessel-ready product, in clear stages.",
  milestones: [
    {
      status: "Done",
      tone: "done" as const,
      title: "Research",
      body: "2+ years at the University of Turku. The core encoder-decoder and physics-informed models, peer-reviewed and published at IEEE ITSC.",
    },
    {
      status: "In progress",
      tone: "active" as const,
      title: "MVP build",
      body: "SAR satellite ingestion fused with oceanographic models into one live detection, thickness and drift forecasting pipeline.",
    },
    {
      status: "Next",
      tone: "next" as const,
      title: "Baltic Beta",
      body: "A closed pilot with selected early-adopter fleets, measuring forecast accuracy and the savings hypothesis on real winter voyages.",
    },
  ],
};

export const traction = {
  headline: "What we have proven",
  items: [
    {
      kicker: "University of Turku",
      body: "Core technology from 2+ years of academic research and development.",
    },
    {
      kicker: "IEEE ITSC",
      body: "Foundational research peer-reviewed and published at the Intelligent Transportation Systems Conference.",
    },
    {
      kicker: "Industry validation",
      body: "Validated with icebreaker captains, ice-navigation solution providers and the Icelandic Coast Guard.",
    },
  ],
};

export const market = {
  headline: "The market is large, and the timing is now.",
  whyNow:
    "EU ETS now prices the carbon that ice wastes, so every tonne of fuel burned forcing through it is paid for twice. Better ice information is worth money today, not someday.",
  phases: [
    {
      no: "01",
      title: "Baltic early adopters",
      body: "Land the first icebreaker fleets: Arctia Oy and the Swedish icebreakers.",
    },
    {
      no: "02",
      title: "Norwegian and Greenland seas",
      body: "Take the AI north, where the ice is harder, the charts are thinner and satellite radar is the only reliable eye.",
    },
    {
      no: "03",
      title: "Global winter lanes",
      body: "The Northeast Passage and the world's other winter shipping lanes.",
    },
  ],
};

export const businessModel = {
  headline: "How we make money",
  subtext:
    "Subscription only. Buy the platform, or buy the forecast as data and run it inside your own systems.",
  streams: [
    {
      tag: "Recurring",
      title: "SaaS subscription",
      body: "Fleet operators license GlaciaNav per vessel for live ice detection, thickness and drift forecasts, with iceberg alerts.",
      points: [
        "Per-vessel licence",
        "Billed annually or per voyage",
        "Scales with the fleet",
      ],
    },
    {
      tag: "Recurring",
      title: "Data subscription",
      body: "The same detection, thickness and drift forecasts delivered as a feed into an operator's own bridge software or planning tools.",
      points: [
        "API and data feed",
        "Priced by area and refresh rate",
        "Runs inside existing tools",
      ],
    },
  ],
};

export const team = {
  headline: "The team",
  note: "A University of Turku spin-off building deep-tech for the sea.",
  members: [
    { name: "Javad Sheikh", role: "ML Scientist", email: "javad.sheikh@glacianav.com", photo: "/team/javad.jpg", focus: "50% 32%" },
    { name: "Nima Emami", role: "ML Scientist", email: "nima.emami@glacianav.com", photo: "/team/nima.jpg", focus: "50% 28%" },
    { name: "Sepehr Seifizarei", role: "ML Scientist", email: "sepehr.seifizarei@glacianav.com", photo: "/team/sepehr.jpg", focus: "50% 30%" },
    { name: "Wilma Tiainen", role: "Business Developer", email: "wilma.tiainen@glacianav.com", photo: "/team/wilma.jpg", focus: "50% 30%" },
  ],
};

export const ask = {
  headline: "What we need from mentors",
  subtext: "Concrete introductions and hard questions, both welcome.",
  items: [
    {
      title: "Customer validation",
      body: "How do we get enterprise fleet managers to commit time and data?",
    },
    {
      title: "First paid pilot",
      body: "How do we structure and negotiate a first paid pilot agreement?",
    },
    {
      title: "Pricing the forecast",
      body: "How should we price an ice-forecast subscription before the savings are proven?",
    },
  ],
};

export const contact = {
  headline: "Contact us",
  subtext:
    "Partner with us to make the winter ice picture predictable. Tell us about your fleet and we will be in touch.",
};
