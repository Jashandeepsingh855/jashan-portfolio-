# Jashandeep Singh — Modern Cinematic Portfolio & Dynamic Studio CMS

A cinematic portfolio website for **Jashandeep Singh** (Lead Video Editor & Filmmaker) built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and a **Dynamic Admin CMS Portal**.

Generated based on the **Google Stitch** design system (`Minimalist Video Portfolio`) using the Stitch MCP integration.

---

## 🚀 Live Local Demo

The application is currently running at:
- **Public Portfolio:** [http://localhost:3001](http://localhost:3001)
- **Admin Portal:** [http://localhost:3001/admin](http://localhost:3001/admin)

> **Admin Access Credentials:**
> - **Default Password:** `admin123`
> *(Can be changed anytime inside the Admin Portal under Settings & Security)*

---

## 🎬 Core Features

### 1. Public Cinematic Portfolio (`/`)
- **Hero & Master Showreel Player:**
  - Live editorial HUD status bar (`SUITE: RESOLVE STUDIO 19`, `TIMELINE: 24.000 FPS`, `REC` pulse).
  - Bold typography: *"I EDIT. I SHAPE. I TELL STORIES."*
  - Interactive showreel video trigger with timecode, ACEScc badges, and format information.
- **Dynamic "My Work" Section (`#work`):**
  - Category filter pills (*All Works, Commercial Films, Healthcare & Hospital, Creator Content, Documentary, Motion Graphics*).
  - Asymmetric editorial grid (8-column wide featured cards & 4-column compact cards).
  - High-res video stills, duration badges, aspect ratio tags, and metadata.
  - **Cinematic Video Lightbox Modal:** Instant playback for YouTube embeds, Vimeo embeds, and direct MP4/WebM video uploads.
- **Capabilities & Services (`#services`):**
  - Commercial Editing, YouTube Storytelling, Vertical Social Content, Healthcare Films, Motion Graphics, and DaVinci Color Grading.
- **About & Technical Pipeline (`#about`):**
  - Editorial bio, Jashandeep's studio portrait, key metrics (*7+ Years, 150+ Projects, 12M+ Views, 94% Repeat Rate*), certified hardware & software pipeline.
- **5-Stage Workflow (`#process`):**
  - Step-by-step transparent workflow: *Discover → Plan → Edit → Refine → Deliver*.
- **Client Reviews (`#testimonials`):**
  - Verified director & producer testimonials with 5-star ratings.
- **Project Commission Form (`#contact`):**
  - Interactive project inquiry brief form with live submission directly to the Admin Inbox.
  - Direct email, phone, location, and discovery call booking links.

---

### 2. Admin Studio Portal (`/admin`)
- **Password-Protected & Authenticated:** Secure session-based authentication with token verification.
- **Tabs & Capabilities:**
  1. **My Work Manager:** Add, edit, reorder, or delete projects. Configure video links, duration, format badges, and toggle 8-col featured view.
  2. **Hero & Showreel Settings:** Edit headlines, showreel video URL, cover stills, and live status badges.
  3. **Capabilities & Services:** Manage service cards, deliverables, and specialty tags.
  4. **About & Studio Skills:** Update bio story, portrait URL, experience counters, and software skills.
  5. **5-Stage Workflow:** Modify stage titles, descriptions, and turnaround horizons.
  6. **Testimonials:** Add or edit director reviews and quotes.
  7. **Client Inquiries Inbox:** Read briefs submitted by clients through the portfolio contact form, with timestamp, budget, and direct reply button.
  8. **Media & Asset Uploader:** Directly upload thumbnail images or video clips to `/uploads/`.
  9. **Site Settings & Password:** Update contact channels, social profiles, change admin password, and one-click "Reset to Default Stitch Design".

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom Stitch theme tokens (`#FF3815` accent, `#0B0F17` dark, `#F8FAFC` surface)
- **Typography:** *Plus Jakarta Sans* & *JetBrains Mono*
- **Icons:** Lucide React & Google Material Symbols
- **Data Persistence:** Self-contained JSON database (`data/content.json` & `data/content.default.json`) with zero external database dependencies.
- **MCP Integration:** Google Stitch MCP server connected for design synchronization.

---

## 🏃 Commands

```bash
# Start development server
npm run dev

# Build production bundle
npm run build

# Start production server
npm run start
```
