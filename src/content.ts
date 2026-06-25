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
  primaryCta: "Contact us",
  secondaryCta: "How it works",
};

export const problem = {
  headline: "Every winter, ships sail blind.",
  subtext:
    "In ice, the wrong route burns fuel, triggers carbon penalties and risks the hull, while the tools on the bridge lag hours behind a field that shifts by the minute.",
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
      title: "Flying blind",
      body: "Static charts age by the hour and lagging models miss fast ice shifts, so captains commit to routes on information that is already wrong.",
      metric: "Reactive",
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
  subtext:
    "From a four-year research program to a vessel-ready product, in clear stages.",
  milestones: [
    {
      status: "Done",
      tone: "done" as const,
      title: "Research",
      body: "4+ years at the University of Turku. The core PINN and Vision Transformer models, peer-reviewed and published at IEEE ITSC.",
    },
    {
      status: "In progress",
      tone: "active" as const,
      title: "MVP build",
      body: "SAR satellite ingestion fused with oceanographic models into one live forecasting and routing pipeline.",
    },
    {
      status: "Next",
      tone: "next" as const,
      title: "Baltic Beta",
      body: "A closed pilot with selected early-adopter fleets, validating savings on real winter routes before commercial launch.",
    },
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
  subtext:
    "Two revenue streams, both built around the only number a fleet cares about: provable savings.",
  streams: [
    {
      tag: "Recurring",
      title: "SaaS subscription",
      body: "Fleet operators license GlaciaNav per vessel for live forecasting, routing and iceberg alerts.",
      points: [
        "Per-vessel licence",
        "Billed annually or per voyage",
        "Scales with the fleet",
      ],
    },
    {
      tag: "Aligned",
      title: "Performance fee",
      body: "An optional share of the fuel and carbon savings we can prove against each vessel's own baseline.",
      points: [
        "Percentage of proven savings",
        "Measured against a real baseline",
        "Charged only when we deliver",
      ],
    },
  ],
  pullQuote: "If the client doesn't save, GlaciaNav doesn't get paid.",
};

export const team = {
  headline: "The team",
  note: "A University of Turku spin-off building deep-tech for the sea.",
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
  headline: "Contact us",
  subtext:
    "Partner with us to make winter navigation predictable. Tell us about your fleet and we will be in touch.",
};
