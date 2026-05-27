import {
  createContext,
  useContext,
  useState,
  useEffect,
  createElement,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { resolveImageArray, resolveImage } from "../lib/storage";
import { DEFAULT_PROJECTS } from "./projectData";

// ── Types ────────────────────────────────────────────────────────────────────

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
  featuredExtremeIds: string[];
  featuredHospitalityIds: string[];
  featuredResidentialIds: string[];
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

// ── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_CONTENT: SiteContent = {
  home: {
    heroLine1: "We shape spaces",
    heroLine2: "through light.",
    heroSubtext:
      "Architectural lighting design from Reykjavík, Iceland. Extreme environments, hospitality, and private residences.",
    services: [
      {
        title: "Extreme Environments",
        desc: "Volcanic terrain, glacial caves, geothermal sites. Light that endures without competing.",
      },
      {
        title: "Commercial & Hospitality",
        desc: "Hotels and public spaces where atmosphere is set before a word is spoken.",
      },
      {
        title: "Residential",
        desc: "Private homes lit around the rhythm of daily life — morning, evening, stillness.",
      },
    ],
    ctaLine1: "Let's create something",
    ctaLine2: "extraordinary.",
    ctaBody:
      "A limited number of projects each year — each one given the full attention it deserves.",
  },
  studio: {
    heroDesc:
      "A small architectural lighting practice based in Reykjavík, Iceland. We work internationally on projects that demand precision, atmosphere, and restraint.",
    aboutHeading: "Built on craft,\ndriven by place.",
    aboutP1:
      "Norrlighting was founded by Ágúst Gunnlaugsson, who trained first as an electrician before studying lighting design. That combination — deep technical knowledge alongside a refined design sensibility — defines how we approach every project.",
    aboutP2:
      "We are a deliberate small practice. We take on a limited number of commissions each year so that every project receives the full attention of the team that designed it. Our work spans extreme natural environments, hospitality, and private residences — united by a shared belief that the best lighting is the kind you feel without noticing.",
    aboutP3:
      "Iceland shapes the way we think about light. The extremes — near-total darkness for months, then continuous daylight — have given us an instinct for atmosphere that is difficult to learn elsewhere.",
    processHeading: "From concept\nto atmosphere.",
    processSteps: [
      {
        title: "Concept phase",
        desc: "We shape the lighting concept early in the architectural process — defining atmosphere, rhythm, contrast, and how the space should feel before technical specifications begin. Light is considered as part of the architecture from the start, not added afterward.",
      },
      {
        title: "Design & specification",
        desc: "Every luminaire, beam angle, position, dimming protocol, and control scene is specified with intent — aligned with the architecture, materials, and desired atmosphere. Technical performance and emotional experience are developed together.",
      },
      {
        title: "Execution & follow-through",
        desc: "We create detailed lighting and control descriptions defining how fixtures are calibrated, dimmed, and programmed across scenes and spaces. This includes scene settings, dimming values, control intent, and how the atmosphere is meant to behave throughout the project. We then follow the execution process closely to ensure the built result reflects the original design intent.",
      },
      {
        title: "Final calibration",
        desc: "Once the space is complete, light is adjusted, focused, dimmed, and fine-tuned within the actual environment. Scenes are refined, contrasts balanced, and atmospheres calibrated until the experience feels coherent, calm, and natural — exactly as envisioned in the original concept.",
      },
    ],
    disciplines: [
      {
        title: "Extreme Environments",
        desc: "Remote and elemental landscapes — geothermal sites, volcanic terrain, glacial caves, and places shaped by weather and time — where light must endure quietly within the environment, not compete with it.",
      },
      {
        title: "Commercial / Hospitality",
        desc: "Hotels, public buildings, offices, and hospitality spaces where light shapes the atmosphere before a single word is spoken. Spaces designed to feel warm, calm, focused, and deeply human.",
      },
      {
        title: "Residential",
        desc: "Private homes where light follows the natural rhythm of living. Slow mornings, quiet evenings, shared meals, and moments of stillness, bringing warmth, calm, and a sense of belonging to everyday life.",
      },
    ],
    awards: [
      { name: "DARC AWARDS", sub: "Architectural", year: "2016", result: "Winner" },
      { name: "DARC AWARDS", sub: "Architectural", year: "2018", result: "Winner" },
      { name: "LIGHTING DESIGN AWARDS", sub: "", year: "2019", result: "Winner" },
      {
        name: "NORDISK LYSPRIS",
        sub: "Nordic Light Prize",
        year: "2020",
        result: "Winner",
      },
      {
        name: "LIT LIGHTING DESIGN AWARDS",
        sub: "",
        year: "2021",
        result: "Winner",
      },
      {
        name: "ÍSLENSKU LÝSINGARVERÐLAUNIN",
        sub: "Icelandic Lighting Award",
        year: "2017",
        result: "Winner",
      },
    ],
    ctaHeading: "Work with us on\nsomething lasting.",
  },
};

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "seed-agust",
    name: "Ágúst Gunnlaugsson",
    role: "Senior Lighting Designer",
    bio: "Trained as an electrician before moving into lighting design. His work bridges technical systems with spatial atmosphere — understanding both the physics and the feeling of light.",
    photo: null,
  },
  {
    id: "seed-kristrun",
    name: "Kristrún Sigfinnsdóttir",
    role: "Senior Lighting Designer",
    bio: "Specializes in the integration of natural and artificial light across hospitality and public environments. Known for calm, restrained schemes that feel inevitable rather than designed.",
    photo: null,
  },
  {
    id: "seed-eyglo",
    name: "Eygló Dógg Böðvarsdóttir",
    role: "Technical Draftsperson",
    bio: "Translates concepts into executable technical drawings with precision and clarity. The bridge between creative intent and constructive reality.",
    photo: null,
  },
  {
    id: "seed-karl",
    name: "Karl Stephen Stock",
    role: "Electrical Engineer",
    bio: "Ensures every lighting system meets rigorous performance standards from concept through installation. His background in industrial electrical systems brings a rare depth to our technical work.",
    photo: null,
  },
  {
    id: "seed-olof",
    name: "Ólöf Kristjánsdóttir",
    role: "Managing Director",
    bio: "Leads operations and client relationships, maintaining project integrity from brief to delivery. Her work ensures that the studio's values are reflected at every stage.",
    photo: null,
  },
];

// ── Utility ──────────────────────────────────────────────────────────────────

export function makeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ── DB ↔ Model converters ────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToProject(row: any): Project {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category ?? "",
    location: row.location ?? "",
    year: row.year ?? "",
    description: row.description ?? "",
    details: row.details ?? "",
    images: row.images ?? [],
    coverIndex: row.cover_index ?? 0,
    createdAt: row.created_at ?? Date.now(),
  };
}

function projectToDb(p: Project) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    location: p.location,
    year: p.year,
    description: p.description,
    details: p.details,
    images: p.images,
    cover_index: p.coverIndex,
    created_at: p.createdAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToTeam(row: any): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role ?? "",
    bio: row.bio ?? "",
    photo: row.photo ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToAward(row: any): Award {
  return {
    id: row.id,
    image: row.image ?? null,
    name: row.name ?? "",
    result: row.result ?? "",
    subtext: row.subtext ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToConfig(row: any): SiteConfig {
  return {
    heroImage: row.hero_image ?? null,
    heroVideo: row.hero_video ?? null,
    featuredProjectIds: row.featured_project_ids ?? [],
    featuredExtremeIds: row.featured_extreme_ids ?? [],
    featuredHospitalityIds: row.featured_hospitality_ids ?? [],
    featuredResidentialIds: row.featured_residential_ids ?? [],
    instagramImages: row.instagram_images ?? [],
  };
}

function mergeContent(stored: Partial<SiteContent>): SiteContent {
  return {
    home: { ...DEFAULT_CONTENT.home, ...(stored.home ?? {}) },
    studio: { ...DEFAULT_CONTENT.studio, ...(stored.studio ?? {}) },
  };
}

// ── Seed helpers ─────────────────────────────────────────────────────────────

function buildSeedProjects(): Project[] {
  return DEFAULT_PROJECTS.map((p, i) => ({
    id: `seed-${p.slug}`,
    slug: p.slug,
    name: p.name,
    category: p.category,
    location: p.location,
    year: p.year,
    description: p.description,
    details: p.details,
    images: p.defaultImages,
    coverIndex: 0,
    createdAt: Date.now() - (10 - i) * 60000,
  }));
}

// ── Context type ─────────────────────────────────────────────────────────────

type DataContextValue = {
  projects: Project[];
  siteConfig: SiteConfig;
  team: TeamMember[];
  siteContent: SiteContent;
  awards: Award[];
  dataReady: boolean;
  // Reads
  getCoverImage: (project: Project) => string;
  findBySlug: (slug: string) => Project | undefined;
  // Projects
  saveProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  createProject: (data: Omit<Project, "id" | "createdAt">) => Promise<Project>;
  // Team
  saveTeamMember: (member: TeamMember) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  createTeamMember: (data: Omit<TeamMember, "id">) => Promise<TeamMember>;
  // Config & content
  updateSiteConfig: (patch: Partial<SiteConfig>) => Promise<void>;
  updateSiteContent: (content: SiteContent) => Promise<void>;
  // Awards
  saveAward: (award: Award) => Promise<void>;
  deleteAward: (id: string) => Promise<void>;
  createAward: (data: Omit<Award, "id">) => Promise<Award>;
};

export const DataContext = createContext<DataContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    heroImage: null,
    heroVideo: null,
    featuredProjectIds: [],
    featuredExtremeIds: [],
    featuredHospitalityIds: [],
    featuredResidentialIds: [],
    instagramImages: [],
  });
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [dataReady, setDataReady] = useState(false);

  // ── Initial load from Supabase ──────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [projRes, teamRes, awardsRes, configRes, contentRes] =
          await Promise.all([
            supabase.from("projects").select("*").order("created_at"),
            supabase.from("team").select("*").order("sort_order"),
            supabase.from("awards").select("*").order("sort_order"),
            supabase.from("site_config").select("*").eq("id", 1).maybeSingle(),
            supabase.from("site_content").select("*").eq("id", 1).maybeSingle(),
          ]);

        // Projects — seed if table is empty
        if (projRes.data && projRes.data.length > 0) {
          setProjects(projRes.data.map(dbToProject));
        } else {
          const seeded = buildSeedProjects();
          const seedRes = await supabase.from("projects").insert(seeded.map(projectToDb));
          if (seedRes.error) console.error("[Norrlighting] projects seed error:", seedRes.error);
          setProjects(seeded);
        }

        // Team — seed if table is empty
        if (teamRes.data && teamRes.data.length > 0) {
          setTeam(teamRes.data.map(dbToTeam));
        } else {
          const withOrder = DEFAULT_TEAM.map((m, i) => ({ ...m, sort_order: i }));
          await supabase.from("team").insert(withOrder);
          setTeam(DEFAULT_TEAM);
        }

        // Awards — start empty, no seeding needed
        if (awardsRes.data) setAwards(awardsRes.data.map(dbToAward));

        // Site config — seed if row doesn't exist
        if (configRes.data) {
          setSiteConfig(dbToConfig(configRes.data));
        } else {
          const defaultCfg = {
            id: 1,
            hero_image: null,
            hero_video: null,
            featured_project_ids: [
              "seed-kerid",
              "seed-raufarhols",
              "seed-maridalen",
            ],
            instagram_images: [],
          };
          await supabase.from("site_config").insert(defaultCfg);
          setSiteConfig(dbToConfig(defaultCfg));
        }

        // Site content — seed if row doesn't exist
        if (contentRes.data) {
          setSiteContent(mergeContent(contentRes.data.data as Partial<SiteContent>));
        } else {
          await supabase.from("site_content").insert({ id: 1, data: DEFAULT_CONTENT });
          setSiteContent(DEFAULT_CONTENT);
        }
      } catch (err) {
        console.error("[Norrlighting] Supabase load failed:", err);
      } finally {
        setDataReady(true);
      }
    }
    load();
  }, []);

  // ── Read helpers ────────────────────────────────────────────────────────
  const getCoverImage = (project: Project): string =>
    project.images[project.coverIndex] ?? project.images[0] ?? "";

  const findBySlug = (slug: string) => projects.find((p) => p.slug === slug);

  // ── Projects ────────────────────────────────────────────────────────────
  const saveProject = async (project: Project): Promise<void> => {
    // Upload any new base64 images to Storage, resolve to public URLs
    const images = await resolveImageArray(
      project.images,
      `projects/${project.id}`
    );
    const resolved = { ...project, images };

    const { error } = await supabase
      .from("projects")
      .upsert(projectToDb(resolved));
    if (error) {
      console.error("[Norrlighting] projects upsert error:", error);
      throw error;
    }

    setProjects((prev) =>
      prev.some((p) => p.id === resolved.id)
        ? prev.map((p) => (p.id === resolved.id ? resolved : p))
        : [...prev, resolved]
    );
  };

  const deleteProject = async (id: string): Promise<void> => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    // Remove from featured if present
    if (siteConfig.featuredProjectIds.includes(id)) {
      await updateSiteConfig({
        featuredProjectIds: siteConfig.featuredProjectIds.filter(
          (fid) => fid !== id
        ),
      });
    }
  };

  const createProject = async (
    data: Omit<Project, "id" | "createdAt">
  ): Promise<Project> => {
    const project: Project = { ...data, id: generateId(), createdAt: Date.now() };
    await saveProject(project);
    return project;
  };

  // ── Team ────────────────────────────────────────────────────────────────
  const saveTeamMember = async (member: TeamMember): Promise<void> => {
    const photo = await resolveImage(member.photo, `team/${member.id}/photo.jpg`);
    const resolved = { ...member, photo };

    const { error } = await supabase.from("team").upsert({
      id: resolved.id,
      name: resolved.name,
      role: resolved.role,
      bio: resolved.bio,
      photo: resolved.photo,
    });
    if (error) throw error;

    setTeam((prev) =>
      prev.some((m) => m.id === resolved.id)
        ? prev.map((m) => (m.id === resolved.id ? resolved : m))
        : [...prev, resolved]
    );
  };

  const deleteTeamMember = async (id: string): Promise<void> => {
    const { error } = await supabase.from("team").delete().eq("id", id);
    if (error) throw error;
    setTeam((prev) => prev.filter((m) => m.id !== id));
  };

  const createTeamMember = async (
    data: Omit<TeamMember, "id">
  ): Promise<TeamMember> => {
    const member: TeamMember = { ...data, id: generateId() };
    await saveTeamMember(member);
    return member;
  };

  // ── Site config ──────────────────────────────────────────────────────────
  const updateSiteConfig = async (patch: Partial<SiteConfig>): Promise<void> => {
    let resolved = { ...patch };

    // Upload hero image if it's a fresh base64
    if (patch.heroImage) {
      resolved.heroImage = await resolveImage(
        patch.heroImage,
        `config/hero-${Date.now()}.jpg`
      );
    }

    // Upload instagram images if any are base64
    if (patch.instagramImages) {
      resolved.instagramImages = await resolveImageArray(
        patch.instagramImages,
        "config/instagram"
      );
    }

    const next: SiteConfig = { ...siteConfig, ...resolved };

    const { error } = await supabase.from("site_config").upsert({
      id: 1,
      hero_image: next.heroImage,
      hero_video: next.heroVideo,
      featured_project_ids: next.featuredProjectIds,
      featured_extreme_ids: next.featuredExtremeIds,
      featured_hospitality_ids: next.featuredHospitalityIds,
      featured_residential_ids: next.featuredResidentialIds,
      instagram_images: next.instagramImages,
    });
    if (error) throw error;

    setSiteConfig(next);
  };

  // ── Site content ─────────────────────────────────────────────────────────
  const updateSiteContent = async (content: SiteContent): Promise<void> => {
    const { error } = await supabase
      .from("site_content")
      .upsert({ id: 1, data: content });
    if (error) throw error;
    setSiteContent(content);
  };

  // ── Awards ──────────────────────────────────────────────────────────────
  const saveAward = async (award: Award): Promise<void> => {
    const { error } = await supabase.from("awards").upsert({
      id: award.id,
      image: award.image,
      name: award.name,
      result: award.result,
      subtext: award.subtext,
    });
    if (error) throw error;
    setAwards((prev) =>
      prev.some((a) => a.id === award.id)
        ? prev.map((a) => (a.id === award.id ? award : a))
        : [...prev, award]
    );
  };

  const deleteAward = async (id: string): Promise<void> => {
    const { error } = await supabase.from("awards").delete().eq("id", id);
    if (error) throw error;
    setAwards((prev) => prev.filter((a) => a.id !== id));
  };

  const createAward = async (data: Omit<Award, "id">): Promise<Award> => {
    const award: Award = { ...data, id: generateId() };
    await saveAward(award);
    return award;
  };

  return createElement(
    DataContext.Provider,
    {
      value: {
        projects,
        siteConfig,
        team,
        siteContent,
        awards,
        dataReady,
        getCoverImage,
        findBySlug,
        saveProject,
        deleteProject,
        createProject,
        saveTeamMember,
        deleteTeamMember,
        createTeamMember,
        updateSiteConfig,
        updateSiteContent,
        saveAward,
        deleteAward,
        createAward,
      },
    },
    children
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
