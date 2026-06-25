/**
 * GlaciaNav One-Pager: single source of truth.
 *
 * WEEKLY UPDATE: edit the copy below and bump `meta.lastUpdated`.
 * Everything the mentors read lives in this file. No layout code here.
 */

export const meta = {
  name: "GlaciaNav",
  tagline:
    "Navigating the path of least resistance through proactive AI ice forecasting.",
  descriptor: "The predictive nervous system for winter shipping.",
  location: "Turku, Finland",
  email: "info@glacianav.com",
  lastUpdated: "June 25, 2026",
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
  headline: "See the ice before it moves.",
  subtext:
    "The predictive nervous system for winter shipping. AI ice forecasting that routes vessels around danger, hours ahead.",
  primaryCta: "Join the Baltic Beta",
  secondaryCta: "How it works",
};

export const problem = {
  headline: "Every winter, ships sail blind.",
  subtext:
    "Vessels in ice face three compounding crises at once, and the tools on the bridge cannot keep up.",
  stat: { value: "11,000+", label: "vessels need Baltic ice assistance every winter" },
  crises: [
    {
      kicker: "Fuel",
      title: "Exponential burn",
      body: "Ice multiplies hull resistance and engine load. Every extra tonne of fuel is cost the voyage never planned for.",
      metric: "↑ load",
    },
    {
      kicker: "Carbon",
      title: "A double penalty",
      body: "EU ETS now covers shipping. Fuel burned in ice is paid for twice: once at the pump, once in carbon allowances.",
      metric: "EU ETS",
    },
    {
      kicker: "Tools",
      title: "Flying blind",
      body: "Crews navigate on ice charts up to a day old and models that lag hours behind a field that shifts by the minute.",
      metric: "24h old",
    },
  ],
};

export const solution = {
  headline: "A predictive nervous system, not a static chart.",
  subtext:
    "GlaciaNav fuses Physics-Informed Neural Networks with Vision Transformers that read continuous SAR satellite radar. SAR sees through cloud and polar darkness, so the forecast never goes blind.",
  benefits: [
    { title: "Lower fuel burn", note: "Route through least resistance." },
    { title: "Avoid carbon penalties", note: "Cut avoidable EU ETS exposure." },
    { title: "Protect the hull", note: "Steer clear of compression zones." },
  ],
  flagship: {
    title: "Iceberg movement prediction",
    body: "Detect every iceberg in all-weather radar, forecast its drift hours ahead, alert when one enters the planned corridor, and reroute around it automatically.",
  },
  howItWorks: [
    {
      title: "Physics-Informed Neural Networks",
      body: "Navier-Stokes, ice rheology and thermodynamics live inside the model, so forecasts stay physically consistent even where data is sparse.",
    },
    {
      title: "Vision Transformers on SAR imagery",
      body: "A proprietary ViT classifies ridges, leads, floes and compression zones from all-weather radar, day or night, across an entire ice field.",
    },
    {
      title: "Dynamic route optimization",
      body: "Ice thickness, fuel, ETA and carbon cost resolve into one continuously updated path of least resistance, with hull-load estimation and multi-hour ice forecasts.",
    },
  ],
};

export const stage = {
  headline: "Where we are",
  status: "MVP in active development",
  points: [
    "Building the data pipeline: SAR satellite ingestion fused with oceanographic models.",
    "Preparing a closed Baltic Beta with selected early-adopter fleets.",
  ],
};

export const traction = {
  headline: "What we have proven",
  items: [
    {
      kicker: "University of Turku",
      body: "Core technology from 4+ years of academic research and development.",
    },
    {
      kicker: "IEEE ITSC",
      body: "Foundational research peer-reviewed and published at the Intelligent Transportation Systems Conference.",
    },
    {
      kicker: "Industry validation",
      body: "Pressure-tested with fleet managers, ice-navigation specialists and the Icelandic Coast Guard.",
    },
  ],
};

export const market = {
  headline: "The market is large, and the timing is now.",
  whyNow:
    "EU ETS now prices the carbon that ice wastes, so the fuel and emissions GlaciaNav saves are bankable today, not someday.",
  phases: [
    {
      no: "01",
      title: "Baltic early adopters",
      body: "Land the first fleets in the Baltic. ESL Shipping, Finnlines and peers.",
    },
    {
      no: "02",
      title: "Nordic winter fleet",
      body: "Expand to full coverage of the Nordic winter shipping season.",
    },
    {
      no: "03",
      title: "Global winter lanes",
      body: "Gulf of St. Lawrence, the Northern Sea Route and Antarctic supply runs.",
    },
  ],
};

export const businessModel = {
  headline: "How we make money",
  streams: [
    {
      title: "Recurring SaaS",
      body: "Fleet operators subscribe per vessel, billed annually or by voyage.",
    },
    {
      title: "Performance fee",
      body: "An optional cut of the fuel and carbon savings we can prove on the water.",
    },
  ],
  pullQuote: "If the client doesn't save, GlaciaNav doesn't get paid.",
};

export const team = {
  headline: "The team",
  note: "A University of Turku spin-off.",
  members: [
    { name: "Javad Sheikh", role: "ML Scientist", email: "javad.sheikh@glacianav.com" },
    { name: "Nima Emami", role: "ML Scientist", email: "nima.emami@glacianav.com" },
    { name: "Sepehr Seifizarei", role: "ML Scientist", email: "sepehr.seifizarei@glacianav.com" },
    { name: "Wilma Tiainen", role: "Business Developer", email: "wilma.tiainen@glacianav.com" },
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
      title: "Shadow-routing pricing",
      body: "How should we price a shadow-routing pilot that proves savings before go-live?",
    },
  ],
};

export const contact = {
  headline: "Join the Baltic Beta",
  subtext:
    "Partner with us to make winter navigation predictable. Tell us about your fleet and we will be in touch.",
};
