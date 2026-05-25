import { createContext, useContext, useState, createElement, type ReactNode } from "react";
import { DEFAULT_PROJECTS } from "./projectData";

export type Project = {
  id: string;
  slug: string;
  name: string;
  category: string;
  location: string;
  year: string;
  description: string;
  details: string;
  images: string[];
  coverIndex: number;
  createdAt: number;
};

export type SiteConfig = {
  heroImage: string | null;
  heroVideo: string | null;
  featuredProjectIds: string[];
  instagramImages: string[];
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
};

export type Award = {
  id: string;
  image: string | null;
  name: string;
  result: string;
  subtext: string;
};

export type SiteContent = {
  home: {
    heroLine1: string;
    heroLine2: string;
    heroSubtext: string;
    services: Array<{ title: string; desc: string }>;
    ctaLine1: string;
    ctaLine2: string;
    ctaBody: string;
  };
  studio: {
    heroDesc: string;
    aboutHeading: string;
    aboutP1: string;
    aboutP2: string;
    aboutP3: string;
    processHeading: string;
    processSteps: Array<{ title: string; desc: string }>;
    disciplines: Array<{ title: string; desc: string }>;
    awards: Array<{ name: string; sub: string; year: string; result: string }>;
    ctaHeading: string;
  };
};

const PROJECTS_KEY = "norr_projects_v2";
const CONFIG_KEY = "norr_site_config";
const TEAM_KEY = "norr_team_v1";
const CONTENT_KEY = "norr_site_content_v1";
const AWARDS_KEY = "norr_awards_v1";

const DEFAULT_TEAM: TeamMember[] = [
  { id: "seed-agust", name: "Ágúst Gunnlaugsson", role: "Senior Lighting Designer", bio: "Trained as an electrician before moving into lighting design. His work bridges technical systems with spatial atmosphere — understanding both the physics and the feeling of light.", photo: null },
  { id: "seed-kristrun", name: "Kristrún Sigfinnsdóttir", role: "Senior Lighting Designer", bio: "Specializes in the integration of natural and artificial light across hospitality and public environments. Known for calm, restrained schemes that feel inevitable rather than designed.", photo: null },
  { id: "seed-eyglo", name: "Eygló Dógg Böðvarsdóttir", role: "Technical Draftsperson", bio: "Translates concepts into executable technical drawings with precision and clarity. The bridge between creative intent and constructive reality.", photo: null },
  { id: "seed-karl", name: "Karl Stephen Stock", role: "Electrical Engineer", bio: "Ensures every lighting system meets rigorous performance standards from concept through installation. His background in industrial electrical systems brings a rare depth to our technical work.", photo: null },
  { id: "seed-olof", name: "Ólöf Kristjánsdóttir", role: "Managing Director", bio: "Leads operations and client relationships, maintaining project integrity from brief to delivery. Her work ensures that the studio's values are reflected at every stage.", photo: null },
];

export const DEFAULT_CONTENT: SiteContent = {
  home: {
    heroLine1: "We shape spaces",
    heroLine2: "through light.",
    heroSubtext: "Architectural lighting design from Reykjavík, Iceland. Extreme environments, hospitality, and private residences.",
    services: [
      { title: "Extreme Environments", desc: "Volcanic terrain, glacial caves, geothermal sites. Light that endures without competing." },
      { title: "Commercial & Hospitality", desc: "Hotels and public spaces where atmosphere is set before a word is spoken." },
      { title: "Residential", desc: "Private homes lit around the rhythm of daily life — morning, evening, stillness." },
    ],
    ctaLine1: "Let's create something",
    ctaLine2: "extraordinary.",
    ctaBody: "A limited number of projects each year — each one given the full attention it deserves.",
  },
  studio: {
    heroDesc: "A small architectural lighting practice based in Reykjavík, Iceland. We work internationally on projects that demand precision, atmosphere, and restraint.",
    aboutHeading: "Built on craft,\ndriven by place.",
    aboutP1: "Norrlighting was founded by Ágúst Gunnlaugsson, who trained first as an electrician before studying lighting design. That combination — deep technical knowledge alongside a refined design sensibility — defines how we approach every project.",
    aboutP2: "We are a deliberate small practice. We take on a limited number of commissions each year so that every project receives the full attention of the team that designed it. Our work spans extreme natural environments, hospitality, and private residences — united by a shared belief that the best lighting is the kind you feel without noticing.",
    aboutP3: "Iceland shapes the way we think about light. The extremes — near-total darkness for months, then continuous daylight — have given us an instinct for atmosphere that is difficult to learn elsewhere.",
    processHeading: "From concept\nto atmosphere.",
    processSteps: [
      { title: "Concept phase", desc: "We shape the lighting concept early in the architectural process — defining atmosphere, rhythm, contrast, and how the space should feel before technical specifications begin. Light is considered as part of the architecture from the start, not added afterward." },
      { title: "Design & specification", desc: "Every luminaire, beam angle, position, dimming protocol, and control scene is specified with intent — aligned with the architecture, materials, and desired atmosphere. Technical performance and emotional experience are developed together." },
      { title: "Execution & follow-through", desc: "We create detailed lighting and control descriptions defining how fixtures are calibrated, dimmed, and programmed across scenes and spaces. This includes scene settings, dimming values, control intent, and how the atmosphere is meant to behave throughout the project. We then follow the execution process closely to ensure the built result reflects the original design intent." },
      { title: "Final calibration", desc: "Once the space is complete, light is adjusted, focused, dimmed, and fine-tuned within the actual environment. Scenes are refined, contrasts balanced, and atmospheres calibrated until the experience feels coherent, calm, and natural — exactly as envisioned in the original concept." },
    ],
    disciplines: [
      { title: "Extreme Environments", desc: "Remote and elemental landscapes — geothermal sites, volcanic terrain, glacial caves, and places shaped by weather and time — where light must endure quietly within the environment, not compete with it." },
      { title: "Commercial / Hospitality", desc: "Hotels, public buildings, offices, and hospitality spaces where light shapes the atmosphere before a single word is spoken. Spaces designed to feel warm, calm, focused, and deeply human." },
      { title: "Residential", desc: "Private homes where light follows the natural rhythm of living. Slow mornings, quiet evenings, shared meals, and moments of stillness, bringing warmth, calm, and a sense of belonging to everyday life." },
    ],
    awards: [
      { name: "DARC AWARDS", sub: "Architectural", year: "2016", result: "Winner" },
      { name: "DARC AWARDS", sub: "Architectural", year: "2018", result: "Winner" },
      { name: "LIGHTING DESIGN AWARDS", sub: "", year: "2019", result: "Shortlisted" },
      { name: "NORDISK LYSPRIS", sub: "Nordic Light Prize", year: "2020", result: "Finalist" },
      { name: "LIT LIGHTING DESIGN AWARDS", sub: "", year: "2021", result: "Winner" },
      { name: "ÍSLENSKU LÝSINGARVERÐLAUNIN", sub: "Icelandic Lighting Award", year: "2017", result: "Winner" },
    ],
    ctaHeading: "Work with us on\nsomething lasting.",
  },
};

function loadAwards(): Award[] {
  try {
    const raw = localStorage.getItem(AWARDS_KEY);
    if (raw) return JSON.parse(raw) as Award[];
  } catch {}
  return [];
}

function loadContent(): SiteContent {
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Partial<SiteContent>;
      return {
        home: { ...DEFAULT_CONTENT.home, ...stored.home },
        studio: { ...DEFAULT_CONTENT.studio, ...stored.studio },
      };
    }
  } catch {}
  return DEFAULT_CONTENT;
}

function loadTeam(): TeamMember[] {
  try {
    const raw = localStorage.getItem(TEAM_KEY);
    if (raw) return JSON.parse(raw) as TeamMember[];
  } catch {}
  localStorage.setItem(TEAM_KEY, JSON.stringify(DEFAULT_TEAM));
  return DEFAULT_TEAM;
}

export function makeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function seedProjects(): Project[] {
  return DEFAULT_PROJECTS.map((p, i) => {
    const images = [...p.defaultImages];
    let coverIndex = 0;

    // Migrate old uploaded images from previous storage schema
    try {
      const raw = localStorage.getItem(`norr_images_${p.id}`);
      if (raw) {
        const uploaded = JSON.parse(raw) as string[];
        images.push(...uploaded);
      }
    } catch {}

    // Migrate old custom cover selection
    const oldCover = localStorage.getItem(`norr_cover_${p.id}`);
    if (oldCover) {
      const idx = images.indexOf(oldCover);
      if (idx >= 0) {
        coverIndex = idx;
      } else {
        images.push(oldCover);
        coverIndex = images.length - 1;
      }
    }

    return {
      id: `seed-${p.slug}`,
      slug: p.slug,
      name: p.name,
      category: p.category,
      location: p.location,
      year: p.year,
      description: p.description,
      details: p.details,
      images,
      coverIndex,
      createdAt: Date.now() - (10 - i) * 60000,
    };
  });
}

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (raw) return JSON.parse(raw) as Project[];
  } catch {}
  const seeded = seedProjects();
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(seeded));
  return seeded;
}

function loadSiteConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) return JSON.parse(raw) as SiteConfig;
  } catch {}
  const projects = loadProjects();
  const config: SiteConfig = {
    heroImage: localStorage.getItem("norr_hero_image") ?? null,
    heroVideo: null,
    featuredProjectIds: projects.slice(0, 3).map((p) => p.id),
    instagramImages: [],
  };
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  return config;
}

type DataContextValue = {
  projects: Project[];
  siteConfig: SiteConfig;
  team: TeamMember[];
  siteContent: SiteContent;
  awards: Award[];
  saveAward: (award: Award) => void;
  deleteAward: (id: string) => void;
  createAward: (data: Omit<Award, "id">) => Award;
  saveProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  updateSiteConfig: (patch: Partial<SiteConfig>) => void;
  getCoverImage: (project: Project) => string;
  findBySlug: (slug: string) => Project | undefined;
  createProject: (data: Omit<Project, "id" | "createdAt">) => Project;
  saveTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: string) => void;
  createTeamMember: (data: Omit<TeamMember, "id">) => TeamMember;
  updateSiteContent: (content: SiteContent) => void;
};

export const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(loadSiteConfig);
  const [team, setTeam] = useState<TeamMember[]>(loadTeam);
  const [siteContent, setSiteContent] = useState<SiteContent>(loadContent);
  const [awards, setAwards] = useState<Award[]>(loadAwards);

  const saveProject = (project: Project) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === project.id);
      const next = exists
        ? prev.map((p) => (p.id === project.id ? project : p))
        : [...prev, project];
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));
      return next;
    });
    setSiteConfig((prev) => {
      if (!prev.featuredProjectIds.includes(id)) return prev;
      const next = {
        ...prev,
        featuredProjectIds: prev.featuredProjectIds.filter((fid) => fid !== id),
      };
      localStorage.setItem(CONFIG_KEY, JSON.stringify(next));
      return next;
    });
  };

  const updateSiteConfig = (patch: Partial<SiteConfig>) => {
    setSiteConfig((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(CONFIG_KEY, JSON.stringify(next));
      return next;
    });
  };

  const getCoverImage = (project: Project): string =>
    project.images[project.coverIndex] ?? project.images[0] ?? "";

  const findBySlug = (slug: string) => projects.find((p) => p.slug === slug);

  const createProject = (data: Omit<Project, "id" | "createdAt">): Project => {
    const project: Project = { ...data, id: generateId(), createdAt: Date.now() };
    saveProject(project);
    return project;
  };

  const saveTeamMember = (member: TeamMember) => {
    setTeam((prev) => {
      const exists = prev.some((m) => m.id === member.id);
      const next = exists ? prev.map((m) => (m.id === member.id ? member : m)) : [...prev, member];
      localStorage.setItem(TEAM_KEY, JSON.stringify(next));
      return next;
    });
  };

  const deleteTeamMember = (id: string) => {
    setTeam((prev) => {
      const next = prev.filter((m) => m.id !== id);
      localStorage.setItem(TEAM_KEY, JSON.stringify(next));
      return next;
    });
  };

  const createTeamMember = (data: Omit<TeamMember, "id">): TeamMember => {
    const member: TeamMember = { ...data, id: generateId() };
    saveTeamMember(member);
    return member;
  };

  const updateSiteContent = (content: SiteContent) => {
    setSiteContent(content);
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  };

  const saveAward = (award: Award) => {
    setAwards((prev) => {
      const exists = prev.some((a) => a.id === award.id);
      const next = exists ? prev.map((a) => (a.id === award.id ? award : a)) : [...prev, award];
      localStorage.setItem(AWARDS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const deleteAward = (id: string) => {
    setAwards((prev) => {
      const next = prev.filter((a) => a.id !== id);
      localStorage.setItem(AWARDS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const createAward = (data: Omit<Award, "id">): Award => {
    const award: Award = { ...data, id: generateId() };
    saveAward(award);
    return award;
  };

  return createElement(DataContext.Provider, {
    value: {
      projects,
      siteConfig,
      team,
      siteContent,
      awards,
      saveProject,
      deleteProject,
      updateSiteConfig,
      getCoverImage,
      findBySlug,
      createProject,
      saveTeamMember,
      deleteTeamMember,
      createTeamMember,
      updateSiteContent,
      saveAward,
      deleteAward,
      createAward,
    },
  }, children);
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
