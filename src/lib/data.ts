import defaultData from "../../data/content.default.json";
import {
  createSupabasePublicClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export type AspectRatioType = "16:9" | "9:16" | "16:10";
export type InquiryStatus = "new" | "reviewing" | "replied" | "archived";

export interface Project {
  id: string;
  title: string;
  category: string;
  client: string;
  year: string;
  duration: string;
  format: string;
  aspectRatio: AspectRatioType;
  description: string;
  thumbnail: string;
  videoUrl: string;
  featured: boolean;
  tags: string[];
  views: string;
  order: number;
  createdAt?: string;
}

export interface Service {
  id: string;
  number: string;
  badge: string;
  title: string;
  description: string;
  deliverables: string[];
  turnaround: string;
  image?: string;
}

export interface HeroMetric {
  value: string;
  label: string;
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

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
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
  status: InquiryStatus;
}

export interface SiteSettings {
  name: string;
  wordmark: string;
  role: string;
  year: string;
  availabilityStatus: string;
  availabilitySubtext: string;
  specialties: string;
  suite: string;
  timelineFps: string;
  email: string;
  phone: string;
  location: string;
  calendarLink: string;
  socials: {
    youtube?: string;
    youtubeHandle?: string;
    instagram?: string;
    instagramHandle?: string;
    linkedin?: string;
    linkedinHandle?: string;
    behance?: string;
    behanceHandle?: string;
    x?: string;
    xHandle?: string;
    vimeo?: string;
  };
  footerNote: string;
}

export interface HeroContent {
  badge: string;
  headline: string;
  headlineLine1: string;
  headlineHighlight: string;
  headlineLine3: string;
  description: string;
  portraitImage: string;
  portraitStatLabel: string;
  portraitStatValue: string;
  portraitStatBadge: string;
  showreelTitle: string;
  showreelSubtitle: string;
  showreelFormat: string;
  showreelTc: string;
  showreelColorspace: string;
  showreelVideoUrl: string;
  showreelCoverImage: string;
  metrics: HeroMetric[];
  hardwarePipeline: string[];
}

export interface AboutContent {
  badge: string;
  heading: string;
  subheading: string;
  portraitImage: string;
  bio: string[];
  stats: AboutStat[];
  softwareSkills: SoftwareSkill[];
}

export interface ProcessContent {
  badge: string;
  heading: string;
  description: string;
  experiences: ExperienceItem[];
  steps: ProcessStep[];
}

export interface PortfolioSettingsPayload {
  siteSettings: SiteSettings;
  hero: HeroContent;
  categories: string[];
  services: Service[];
  about: AboutContent;
  process: ProcessContent;
  testimonials: Testimonial[];
}

export interface PublicSiteContent extends PortfolioSettingsPayload {
  projects: Project[];
}

export interface SiteContent extends PublicSiteContent {
  inquiries: Inquiry[];
}

interface DbProjectRow {
  id: string;
  title: string;
  category: string;
  portfolio_group?: string | null;
  duration?: string | null;
  thumbnail?: string | null;
  video?: string | null;
  client?: string | null;
  description?: string | null;
  display_order?: number | null;
  is_featured?: boolean | null;
  year?: string | null;
  format?: string | null;
  aspect_ratio?: string | null;
  tags?: string[] | null;
  views?: string | null;
  created_at?: string | null;
}

interface DbInquiryRow {
  id: string;
  name: string;
  email: string;
  project_type?: string | null;
  budget?: string | null;
  timeline?: string | null;
  message: string;
  status?: string | null;
  created_at: string;
}

const ALLOWED_DB_CATEGORIES = new Set([
  "Short-Form",
  "Long-Form",
  "Commercial",
  "YouTube",
  "Documentary",
  "Instagram Reels",
  "Motion Graphics",
  "Travel",
]);

export function getDefaultSettingsPayload(): PortfolioSettingsPayload {
  const raw = defaultData as unknown as PublicSiteContent;
  return structuredClone({
    siteSettings: raw.siteSettings,
    hero: raw.hero,
    categories: raw.categories,
    services: raw.services,
    about: raw.about,
    process: raw.process,
    testimonials: raw.testimonials,
  });
}

export function getDefaultProjects(): Project[] {
  const raw = defaultData as unknown as PublicSiteContent;
  return structuredClone(raw.projects).map((proj, index) => ({
    ...proj,
    aspectRatio: normalizeAspectRatio(proj.aspectRatio),
    tags: Array.isArray(proj.tags) ? proj.tags : [],
    order: typeof proj.order === "number" ? proj.order : index + 1,
  }));
}

function normalizeAspectRatio(value?: string | null): AspectRatioType {
  if (value === "9:16" || value === "16:10" || value === "16:9") {
    return value;
  }
  return "16:9";
}

export function normalizeDisplayCategory(category?: string | null): string {
  if (!category) return "Commercial";
  const lower = category.trim().toLowerCase();
  if (lower === "short-form" || lower === "instagram reels" || lower === "reels") {
    return "Short-Form";
  }
  if (lower === "long-form" || lower === "youtube" || lower === "documentary") {
    return "Long-Form";
  }
  if (lower === "commercial" || lower === "brand film" || lower === "brand films") {
    return "Commercial";
  }
  return category;
}

function normalizeDbCategory(category?: string | null): string {
  const trimmed = (category || "Commercial").trim();
  if (ALLOWED_DB_CATEGORIES.has(trimmed)) {
    return trimmed;
  }
  return normalizeDisplayCategory(trimmed);
}

function toPortfolioGroup(category: string): string {
  const normalized = normalizeDisplayCategory(category).toLowerCase();
  if (normalized === "short-form") return "short-form";
  if (normalized === "long-form") return "long-form";
  return "commercial";
}

function normalizeInquiryStatus(status?: string | null): InquiryStatus {
  if (status === "new" || status === "unread") return "new";
  if (status === "reviewing" || status === "read") return "reviewing";
  if (status === "replied") return "replied";
  if (status === "archived") return "archived";
  return "new";
}

export function mapDbProjectToProject(row: DbProjectRow): Project {
  const aspectRatio = normalizeAspectRatio(row.aspect_ratio);
  return {
    id: row.id,
    title: row.title,
    category: normalizeDisplayCategory(row.category),
    client: row.client || "Independent",
    year: row.year || "2025",
    duration: row.duration || "01:30",
    format: row.format || (aspectRatio === "9:16" ? "VERTICAL 9:16" : "4K HDR"),
    aspectRatio,
    description: row.description || "",
    thumbnail: row.thumbnail || "/covers/commercial-pulse.jpg",
    videoUrl: row.video || "",
    featured: Boolean(row.is_featured),
    tags: Array.isArray(row.tags) ? row.tags : [],
    views: row.views || "",
    order: typeof row.display_order === "number" ? row.display_order : 99,
    createdAt: row.created_at || undefined,
  };
}

export function mapProjectToDbPayload(
  project: Partial<Project> & { id?: string },
  fallbackOrder = 1
) {
  const category = normalizeDbCategory(project.category);
  const aspectRatio = normalizeAspectRatio(project.aspectRatio);
  return {
    id:
      project.id?.trim() ||
      `proj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: (project.title || "Untitled Cut").trim(),
    category,
    portfolio_group: toPortfolioGroup(category),
    duration: (project.duration || "01:30").trim(),
    thumbnail: (project.thumbnail || "/covers/commercial-pulse.jpg").trim(),
    video: (project.videoUrl || "").trim(),
    client: (project.client || "Client Studio").trim(),
    description: (project.description || "").trim(),
    display_order:
      typeof project.order === "number" ? project.order : fallbackOrder,
    is_featured: Boolean(project.featured),
    year: (project.year || "2025").trim(),
    format: (
      project.format ||
      (aspectRatio === "9:16" ? "VERTICAL 9:16" : "4K HDR")
    ).trim(),
    aspect_ratio: aspectRatio,
    tags: Array.isArray(project.tags)
      ? project.tags.map((t) => t.trim()).filter(Boolean)
      : [],
    views: (project.views || "").trim(),
  };
}

function mapDbInquiryToInquiry(row: DbInquiryRow): Inquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    projectType: row.project_type || "Commercial",
    budget: row.budget || "TBD",
    timeline: row.timeline || "Flexible",
    message: row.message,
    date: row.created_at,
    status: normalizeInquiryStatus(row.status),
  };
}

function mergeSettingsWithDefaults(
  rawData?: Partial<PortfolioSettingsPayload> | null
): PortfolioSettingsPayload {
  const defaults = getDefaultSettingsPayload();
  if (!rawData) return defaults;

  return {
    siteSettings: {
      ...defaults.siteSettings,
      ...(rawData.siteSettings || {}),
      socials: {
        ...defaults.siteSettings.socials,
        ...(rawData.siteSettings?.socials || {}),
      },
    },
    hero: {
      ...defaults.hero,
      ...(rawData.hero || {}),
      metrics: Array.isArray(rawData.hero?.metrics)
        ? rawData.hero.metrics
        : defaults.hero.metrics,
      hardwarePipeline: Array.isArray(rawData.hero?.hardwarePipeline)
        ? rawData.hero.hardwarePipeline
        : defaults.hero.hardwarePipeline,
    },
    categories:
      Array.isArray(rawData.categories) && rawData.categories.length > 0
        ? rawData.categories
        : defaults.categories,
    services:
      Array.isArray(rawData.services) && rawData.services.length > 0
        ? rawData.services
        : defaults.services,
    about: {
      ...defaults.about,
      ...(rawData.about || {}),
      bio: Array.isArray(rawData.about?.bio)
        ? rawData.about.bio
        : defaults.about.bio,
      stats: Array.isArray(rawData.about?.stats)
        ? rawData.about.stats
        : defaults.about.stats,
      softwareSkills: Array.isArray(rawData.about?.softwareSkills)
        ? rawData.about.softwareSkills
        : defaults.about.softwareSkills,
    },
    process: {
      ...defaults.process,
      ...(rawData.process || {}),
      experiences: Array.isArray(rawData.process?.experiences)
        ? rawData.process.experiences
        : defaults.process.experiences,
      steps: Array.isArray(rawData.process?.steps)
        ? rawData.process.steps
        : defaults.process.steps,
    },
    testimonials:
      Array.isArray(rawData.testimonials) && rawData.testimonials.length > 0
        ? rawData.testimonials
        : defaults.testimonials,
  };
}

export async function getPublicContent(): Promise<PublicSiteContent> {
  try {
    const supabase = createSupabasePublicClient();

    const [{ data: settingsRow }, { data: projectRows }] = await Promise.all([
      supabase
        .from("portfolio_settings")
        .select("data")
        .eq("id", "default")
        .maybeSingle(),
      supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false }),
    ]);

    const settings = mergeSettingsWithDefaults(
      (settingsRow?.data as Partial<PortfolioSettingsPayload> | null) || null
    );

    const projects =
      Array.isArray(projectRows) && projectRows.length > 0
        ? (projectRows as DbProjectRow[]).map(mapDbProjectToProject)
        : getDefaultProjects();

    return {
      ...settings,
      projects,
    };
  } catch (error) {
    console.error("Failed to fetch public content from Supabase:", error);
    return {
      ...getDefaultSettingsPayload(),
      projects: getDefaultProjects(),
    };
  }
}

export async function getFullAdminContent(): Promise<SiteContent> {
  const supabase = await createSupabaseServerClient();

  const [
    { data: settingsRow },
    { data: projectRows },
    { data: inquiryRows, error: inquiryError },
  ] = await Promise.all([
    supabase
      .from("portfolio_settings")
      .select("data")
      .eq("id", "default")
      .maybeSingle(),
    supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const settings = mergeSettingsWithDefaults(
    (settingsRow?.data as Partial<PortfolioSettingsPayload> | null) || null
  );

  const projects = Array.isArray(projectRows)
    ? (projectRows as DbProjectRow[]).map(mapDbProjectToProject)
    : [];

  const inquiries =
    !inquiryError && Array.isArray(inquiryRows)
      ? (inquiryRows as DbInquiryRow[]).map(mapDbInquiryToInquiry)
      : [];

  return {
    ...settings,
    projects: projects.length > 0 ? projects : getDefaultProjects(),
    inquiries,
  };
}

export async function savePortfolioSettings(
  payload: Partial<PortfolioSettingsPayload> & { projects?: Project[] }
) {
  const supabase = await createSupabaseServerClient();
  const merged = mergeSettingsWithDefaults(payload);

  const { error: settingsError } = await supabase
    .from("portfolio_settings")
    .upsert(
      {
        id: "default",
        data: merged,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (settingsError) {
    throw new Error(settingsError.message);
  }

  if (Array.isArray(payload.projects)) {
    const formatted = payload.projects.map((project, index) =>
      mapProjectToDbPayload({ ...project, order: index + 1 }, index + 1)
    );

    if (formatted.length > 0) {
      const { error: upsertError } = await supabase
        .from("projects")
        .upsert(formatted, { onConflict: "id" });

      if (upsertError) {
        throw new Error(upsertError.message);
      }

      const keepIds = new Set(formatted.map((item) => item.id));
      const { data: existingRows } = await supabase
        .from("projects")
        .select("id");

      const toDelete = (existingRows || [])
        .map((r) => r.id as string)
        .filter((id) => !keepIds.has(id));

      if (toDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("projects")
          .delete()
          .in("id", toDelete);

        if (deleteError) {
          throw new Error(deleteError.message);
        }
      }
    }
  }

  return getFullAdminContent();
}

export async function listProjects(): Promise<Project[]> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return getDefaultProjects();
  }

  return (data as DbProjectRow[]).map(mapDbProjectToProject);
}

export async function createProject(input: Partial<Project>): Promise<Project> {
  const supabase = await createSupabaseServerClient();
  const { count } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true });

  const dbPayload = mapProjectToDbPayload(input, (count || 0) + 1);
  const { data, error } = await supabase
    .from("projects")
    .insert(dbPayload)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create project");
  }

  return mapDbProjectToProject(data as DbProjectRow);
}

export async function updateProject(
  id: string,
  patch: Partial<Project>
): Promise<Project> {
  const supabase = await createSupabaseServerClient();
  const { data: existing, error: fetchError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    throw new Error("Project not found");
  }

  const current = mapDbProjectToProject(existing as DbProjectRow);
  const merged = { ...current, ...patch, id };
  const dbPayload = mapProjectToDbPayload(merged, current.order);

  const { data: updated, error: updateError } = await supabase
    .from("projects")
    .update({
      title: dbPayload.title,
      category: dbPayload.category,
      portfolio_group: dbPayload.portfolio_group,
      duration: dbPayload.duration,
      thumbnail: dbPayload.thumbnail,
      video: dbPayload.video,
      client: dbPayload.client,
      description: dbPayload.description,
      display_order: dbPayload.display_order,
      is_featured: dbPayload.is_featured,
      year: dbPayload.year,
      format: dbPayload.format,
      aspect_ratio: dbPayload.aspect_ratio,
      tags: dbPayload.tags,
      views: dbPayload.views,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (updateError || !updated) {
    throw new Error(updateError?.message || "Failed to update project");
  }

  return mapDbProjectToProject(updated as DbProjectRow);
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function listInquiries(): Promise<Inquiry[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    throw new Error(error?.message || "Failed to load inquiries");
  }

  return (data as DbInquiryRow[]).map(mapDbInquiryToInquiry);
}

export async function createInquiry(input: {
  name: string;
  email: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  message: string;
}): Promise<Inquiry> {
  const supabase = createSupabasePublicClient();
  const payload = {
    name: input.name.trim(),
    email: input.email.trim(),
    project_type: (input.projectType || "Commercial").trim(),
    budget: (input.budget || "TBD").trim(),
    timeline: (input.timeline || "Flexible").trim(),
    message: input.message.trim(),
    status: "new" as const,
  };

  const { error } = await supabase.from("inquiries").insert(payload);

  if (error) {
    throw new Error(error.message || "Failed to submit inquiry");
  }

  return {
    id: `inq-${Date.now()}`,
    name: payload.name,
    email: payload.email,
    projectType: payload.project_type,
    budget: payload.budget,
    timeline: payload.timeline,
    message: payload.message,
    date: new Date().toISOString(),
    status: "new",
  };
}

export async function updateInquiry(
  id: string,
  status: InquiryStatus
): Promise<Inquiry> {
  const supabase = await createSupabaseServerClient();
  const normalized = normalizeInquiryStatus(status);

  const { data, error } = await supabase
    .from("inquiries")
    .update({ status: normalized })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to update inquiry");
  }

  return mapDbInquiryToInquiry(data as DbInquiryRow);
}

export async function deleteInquiry(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function resetToDefaultContent(): Promise<SiteContent> {
  const defaultSettings = getDefaultSettingsPayload();
  const defaultProjects = getDefaultProjects();
  return savePortfolioSettings({
    ...defaultSettings,
    projects: defaultProjects,
  });
}
