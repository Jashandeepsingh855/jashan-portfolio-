import fs from "fs";
import path from "path";
import defaultData from "../../data/content.default.json";

// In Vercel serverless environments, root is read-only, so /tmp is used for runtime persistence
const IS_VERCEL = process.env.VERCEL === "1";
const DATA_FILE = IS_VERCEL
  ? path.join("/tmp", "content.json")
  : path.join(process.cwd(), "data", "content.json");
const DEFAULT_DATA_FILE = path.join(process.cwd(), "data", "content.default.json");

export interface Project {
  id: string;
  title: string;
  category: string;
  client: string;
  year: string;
  duration: string;
  format: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  featured: boolean;
  caseStudyUrl?: string;
  tags: string[];
  order: number;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  badge: string;
}

export interface AboutStat {
  label: string;
  value: string;
  detail: string;
}

export interface SoftwareSkill {
  name: string;
  level: string;
  category: string;
}

export interface ProcessStep {
  stage: string;
  title: string;
  description: string;
  duration: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  quote: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  date: string;
  status: "unread" | "read" | "archived";
}

export interface SiteContent {
  siteSettings: {
    name: string;
    role: string;
    year: string;
    availabilityStatus: string;
    specialties: string;
    suite: string;
    timelineFps: string;
    email: string;
    phone: string;
    location: string;
    calendarLink: string;
    socials: {
      instagram?: string;
      youtube?: string;
      vimeo?: string;
      linkedin?: string;
      x?: string;
      behance?: string;
    };
    footerNote: string;
  };
  hero: {
    badge: string;
    headlineLine1: string;
    headlineHighlight: string;
    headlineLine3: string;
    description: string;
    showreelTitle: string;
    showreelFormat: string;
    showreelTc: string;
    showreelColorspace: string;
    showreelVideoUrl: string;
    showreelCoverImage: string;
    hardwarePipeline: string[];
  };
  categories: string[];
  projects: Project[];
  services: Service[];
  about: {
    badge: string;
    heading: string;
    subheading: string;
    portraitImage: string;
    bio: string[];
    stats: AboutStat[];
    softwareSkills: SoftwareSkill[];
  };
  process: {
    badge: string;
    heading: string;
    description: string;
    steps: ProcessStep[];
  };
  testimonials: Testimonial[];
  inquiries: Inquiry[];
  admin?: {
    password?: string;
    sessionToken?: string;
  };
}

export function getContent(): SiteContent {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
    if (fs.existsSync(DEFAULT_DATA_FILE)) {
      const raw = fs.readFileSync(DEFAULT_DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (error) {
    console.error("Error reading content file, using bundled default:", error);
  }
  // Safe in-memory fallback always guaranteed
  return defaultData as unknown as SiteContent;
}

export function saveContent(data: SiteContent): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempPath = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, DATA_FILE);
  } catch (error) {
    console.error("Warning: Could not save content to disk:", error);
  }
}

export function resetToDefault(): SiteContent {
  const content = defaultData as unknown as SiteContent;
  saveContent(content);
  return content;
}

export function getPublicContent(): Omit<SiteContent, "admin"> {
  const content = getContent();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { admin, inquiries, ...rest } = content;
  return rest as Omit<SiteContent, "admin">;
}
