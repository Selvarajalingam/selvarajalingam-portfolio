# MASTER PROMPT — Build the Selvarajalingam Portfolio

Act as a senior product designer, creative director, full-stack engineer, accessibility specialist, SEO engineer and technical project lead. Read all repository instruction documents before implementation. `AGENTS.md` truth and safety rules take priority.

## Goal and audience
Create a premium, approachable personal brand website for recruiters, clients/business owners, collaborators, students and technical visitors. Communicate Technology Educator, Software Developer and Product Builder. Tell a genuine story of continuous learning, practical teaching, independent software development and product thinking. It must feel like a carefully designed digital product, not a generic developer template.

## Brand
- Professional name: **Selvarajalingam**
- Wordmark: `selva.`
- Never use “Selvarajalingam (Selva)”.
- Tagline: `teach. build. create. innovate.`
- Hero: “I teach technology, build software, and turn ideas into digital products.”
- Supporting identity: `Technology Educator · Software Developer · Product Builder`
- Voice: English, friendly, authentic, confident but not boastful.

## Visual direction
Hybrid premium minimalism + editorial storytelling + restrained cinematic effects. Dark default with complete light theme. Starting palette: ink `#090909`, paper `#F4F2EE`, silver `#92929A`, violet `#A78BFA`. Bold modern sans-serif display typography, clean body text, generous whitespace, asymmetric editorial grids.
Desktop hero may use an original metallic/violet abstract sculpture via React Three Fiber/Three.js. Do not use unlicensed models. Lazy-load it and provide CSS/SVG/static fallbacks. Temporary portrait, if used, must be clearly fictional and replaceable; never imply it depicts Selvarajalingam. Generated product mockups must be labelled illustrative. No audio.

## Intro and motion
Optional first-visit intro: stroke-drawn `selva.` resolves to wordmark; sculptural form appears; transition reveals hero; headline, supporting copy and CTAs animate in. Persist first-visit state, include skip and replay, respect reduced motion, never block content, simplify on mobile/low-power devices.

## Homepage order
1 Hero
2 Quick Introduction
3 Featured Work
4 What I Do
5 My Journey
6 Impact & Experience
7 Technical Skills
8 AWS & Cloud Knowledge Showcase
9 Business & Ventures
10 The Lab teaser/empty-state-safe
11 Let's Connect

Featured project order: Research Hub, Alumni Portal, Hearth, WaterBuddy.

## Navigation and routes
Desktop fixed minimal nav: Home, About, Work, The Lab, Ventures, Services, Experience, Contact. Add small Resume action, theme switcher and Let's Connect CTA without clutter. Mobile uses accessible full-screen overlay.
Routes: `/`, `/about`, `/work`, `/work/[slug]`, `/lab`, `/lab/[slug]`, `/ventures`, `/ventures/[slug]`, `/services`, `/experience`, `/connect`, `/privacy`.

## Work
Ten projects: four flagship (Research Hub, Alumni Portal, Hearth, WaterBuddy) and six secondary (Career Crafter, Full-stack Todo, DuoChat, Sentiment Analysis, Phishing Detection, Diwali Sales Analysis).
Categories: Full-stack Development, Java Development, AI & Machine Learning, Data Analytics, Desktop Applications. Add technology filters. Default featured-first; optional sorting by category, technology and recently updated. No comparison feature.
Flagship case studies: overview; problem; goals; role; features; UX; architecture; engineering challenges; testing/deployment; real usage/outcomes; visuals/demos; lessons/next steps. Include verified architecture diagrams. Secondary pages use a compact template.

## Lab
Categories: AI & Machine Learning; Product Prototypes; UI/UX & Design Experiments; Developer Tools & Automation; Cloud & Technology Experiments; Creative & Interactive Experiments.
Statuses: Exploring, Building, Experiment Complete. Visual cards + detail pages. Current progress snapshot and optional timeline; selective transparency. **No named Lab experiments have been confirmed. Launch with an honest empty state. Never invent entries.**

## Ventures
Company association: Gencanyon Technologies (OPC) Pvt. Ltd. User's confirmed role: **Product & Technology Lead | Business & Product Development Lead**. Do not call user founder/owner.
- CloudApex — https://cloudapex.in/
- BigIntellects — https://bigintellects.com/
- CanyonInk — https://canyonink.in/
- Chennai Buyers — no website yet; show “Website coming soon” and enquiry CTA to `/connect`.
All four are confirmed Live & Active. User contributed across strategy, UI/UX, software, branding, marketing, operations and product management. Do not invent performance metrics. Preserve official logos/colours when assets arrive.

## Services
Development: websites, full-stack applications, Java/Spring Boot backend, AI integrations.
Product & Design: MVP/startup prototypes (Vibe Coding), UI/UX, Figma prototyping.
Education: technical training, corporate workshops, mentoring and project guidance.
Use accordions. No pricing.

## About and Experience
Education: Rathinam Technical Campus; undergraduate Engineering in AI & Data Science; graduated 2024. HTML/CSS/JavaScript Udemy course completed. Python, Java and C through self-directed learning. AWS Developer Associate currently pursuing.
Career story: self-directed learning; Java Full Stack placement offer put on hold due to company financial situation; Technical Trainer at Rathinam Global Deemed to be University, School of Quantum Science, Computing and AI, starting 7 Oct 2024; continued building software alongside teaching. Phrase placement story neutrally.
Philosophy: “Technology is not just about writing code. It is about learning continuously, solving problems, building meaningful things, and sharing knowledge that helps others do the same.”
Beyond the Code: football (Arsenal, Barcelona, Bayern Munich, AC Milan), Japanese culture/language learning, video editing, UI/UX and graphic design.
Impact figures are user-reported and require verification: 200+ students, 50+ workshops/sessions, 20+ events, 100+ student projects.
Skills use seven categories: Programming Languages; Frontend Development; Backend Development; Databases & Storage; AI, Machine Learning & Data Science; Cloud, DevOps & Infrastructure; Design, Development Tools & Workflow. No proficiency percentage bars. Distinguish confident skills from Java/Spring Boot, which the user is actively strengthening.

## Resume
Online preview plus view/download PDF. Temporary file must be labelled “Sample Resume — Updating”; no invented qualifications. Make replaceable via content/config without component changes.

## Contact
`/connect`; fields: name, email, optional phone, subject (Project Enquiry, Freelance Work, Training, Collaboration, Other), message.
Send through server-side Resend:
- To `selvarajalingam.dev@gmail.com`
- From `noreply@gencanyon.com`
- Reply-To visitor email
`gencanyon.com` must be verified in Resend before production; do not assume it is. API key only in Vercel env vars.
Send owner notification and visitor acknowledgement. No DB storage. Use validation, honeypot, rate limiting and risk-based CAPTCHA. Show accessible success/error states.
Privacy acknowledgement: “By submitting this form, you acknowledge our Privacy Policy.” Link to `/privacy`, no checkbox.
Contact copy: “Whether you're building something exciting, exploring an idea, or looking to collaborate — I'd love to hear from you.”
Availability copy: “Open to freelance projects, development opportunities, training and meaningful collaborations.” No permanent availability badge.

## Social and knowledge
Primary social: LinkedIn and GitHub. Secondary: YouTube, Instagram, Medium, Reddit. Exact URLs except GitHub are pending; use placeholders internally, never invent.
GitHub: https://github.com/Selvarajalingam. Show curated repos plus selected public data with cache/fallback. No fake stats.
AWS/cloud showcase: curated YouTube videos, technical posts, tutorials and resources. Manual curation is authoritative; optionally retrieve selected public YouTube metadata where practical. No content links supplied yet; don't invent entries.

## SEO/privacy
SEO title: `Selvarajalingam | Technology Educator, Software Developer & Product Builder`
Description: `Meet Selvarajalingam, a Technology Educator, Software Developer and Product Builder. Explore full-stack applications, real-world software projects, AI experiments, technical education and digital products.`
OG image: cinematic black, `selva.`, professional title, restrained violet 3D artwork, tagline.
Add per-route metadata, canonical, sitemap, robots, Open Graph, accurate structured data and semantic HTML.
Privacy page reflects actual data collection. Vercel Web Analytics first. GA4 optional later; add consent manager if required by enabled tracking. Avoid unnecessary cookie banner. English launch, multilingual-ready.

## Technical and delivery
Next.js App Router, strict TypeScript, Tailwind, Vercel, GitHub public repo `Selvarajalingam/selvarajalingam-portfolio`, branch `main`, target `selvarajalingam.vercel.app` subject to availability. JSON structured content + MDX long-form. No always-on VPS.
Follow phased roadmap. Build complete site in phases and publish only after quality/content checks. Engineering-grade quality: tests, Playwright, WCAG 2.2 AA target, performance budgets, SEO/security checks, production build. Provide complete owner handover.
Start by inspecting repo, proposing Phase 0/1 tasks, then implement. Do not generate fake content to fill empty areas.
