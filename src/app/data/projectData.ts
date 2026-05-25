import keridImage from "../../imports/kerid-aurora.jpg";
import maridaleImage from "../../imports/image-1.png";
import maridaleImage2 from "../../imports/image.png";
import maridaleImage3 from "../../imports/image-2.png";
import maridaleImage4 from "../../imports/IMG_0735.JPG";

const TUNNEL_IMG =
  "https://images.unsplash.com/photo-1687969054028-1bbf7fa070a7?w=1800&h=900&fit=crop&auto=format";

export type Project = {
  id: number;
  slug: string;
  name: string;
  category: string;
  location: string;
  year: string;
  description: string;
  details: string;
  defaultImages: string[];
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    slug: "kerid",
    name: "Kerið — The Crater",
    category: "Extreme Environments",
    location: "Kerið, Iceland",
    year: "2024",
    description:
      "Enhanced lighting installation within Iceland's iconic volcanic crater, carefully integrated to highlight the natural geological drama while respecting the elemental landscape.",
    details:
      "The challenge was to illuminate a site that already possessed extraordinary natural light. We worked with the crater's geometry, using low-level, warm-toned fixtures that trace the water's edge without disrupting the site's primal character.",
    defaultImages: [keridImage as string],
  },
  {
    id: 2,
    slug: "raufarhols",
    name: "Raufarhólshellir",
    category: "Extreme Environments",
    location: "Reykjanes, Iceland",
    year: "2024",
    description:
      "A lighting system designed for one of Iceland's longest and most spectacular lava tubes, revealing the raw volcanic textures while maintaining the cave's primordial atmosphere.",
    details:
      "We designed fixtures that could withstand extreme humidity and temperature variations inside the tunnel, while casting light that reveals rather than intrudes — tracing the lava flow lines and mineral deposits with quiet precision.",
    defaultImages: [TUNNEL_IMG],
  },
  {
    id: 3,
    slug: "maridalen",
    name: "Maridalen",
    category: "Residential",
    location: "Maridalen, Norway",
    year: "2023",
    description:
      "A private residence where light follows the rhythm of Nordic living — warm, calm, and deeply integrated into the daily experience of the home.",
    details:
      "Working closely with the architect and the family, we designed a layered lighting scheme that transitions from bright functional light during the morning hours to a warm ambient glow through the long Nordic evenings.",
    defaultImages: [
      maridaleImage as string,
      maridaleImage2 as string,
      maridaleImage3 as string,
      maridaleImage4 as string,
    ],
  },
];

// ── localStorage helpers ──────────────────────────────────────────────────────

const coverKey = (id: number) => `norr_cover_${id}`;
const imagesKey = (id: number) => `norr_images_${id}`;

export function getCoverImage(project: Project): string {
  return localStorage.getItem(coverKey(project.id)) ?? project.defaultImages[0];
}

export function setCoverImage(projectId: number, src: string | null) {
  if (src) localStorage.setItem(coverKey(projectId), src);
  else localStorage.removeItem(coverKey(projectId));
}

export function getUploadedImages(projectId: number): string[] {
  try {
    const raw = localStorage.getItem(imagesKey(projectId));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function setUploadedImages(projectId: number, images: string[]) {
  localStorage.setItem(imagesKey(projectId), JSON.stringify(images));
}

/** All images for a project: defaults first, then any uploads */
export function getAllImages(project: Project): string[] {
  return [...project.defaultImages, ...getUploadedImages(project.id)];
}

export function findBySlug(slug: string): Project | undefined {
  return DEFAULT_PROJECTS.find((p) => p.slug === slug);
}
