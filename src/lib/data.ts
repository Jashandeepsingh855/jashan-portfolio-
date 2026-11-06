import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "content.json");
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
    if (!fs.existsSync(DATA_FILE)) {
      if (fs.existsSync(DEFAULT_DATA_FILE)) {
        fs.copyFileSync(DEFAULT_DATA_FILE, DATA_FILE);
      }
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading content.json:", error);
    if (fs.existsSync(DEFAULT_DATA_FILE)) {
      const raw = fs.readFileSync(DEFAULT_DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
    throw error;
  }
}

export function saveContent(data: SiteContent): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tempPath = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempPath, DATA_FILE);
}

export function resetToDefault(): SiteContent {
  if (fs.existsSync(DEFAULT_DATA_FILE)) {
    const raw = fs.readFileSync(DEFAULT_DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    saveContent(parsed);
    return parsed;
  }
  throw new Error("Default data file not found");
}

export function getPublicContent(): Omit<SiteContent, "admin"> {
  const content = getContent();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { admin, inquiries, ...rest } = content;
  return rest as Omit<SiteContent, "admin">;
}
