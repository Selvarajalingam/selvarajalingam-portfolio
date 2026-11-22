# Design System

## Brand
Professional name `Selvarajalingam`; wordmark `selva.`; tagline `teach. build. create. innovate.`; identity `Technology Educator · Software Developer · Product Builder`.

## Visual principles
Premium editorial minimalism, cinematic restraint, readable hierarchy, original abstract forms, responsive content-first layouts, purposeful interactions.

## Starting colours
- Ink `#090909`
- Paper `#F4F2EE`
- Silver `#92929A`
- Soft violet `#A78BFA`

Create semantic dark/light tokens for background, surfaces, text, borders, accent, focus, success, warning, error, overlay and shadows. Meet contrast requirements; never use colour alone for status.

Interactive control boundaries use a separate `--control-border` token: dark `#76727d`, light `#817b89`. Keep decorative section dividers on `--border`. The control token must maintain at least 3:1 contrast against its adjacent surface in both themes. At widths up to 380px the header places the menu on a second row so enlarged text and prescribed text spacing keep every control visible.

## Typography
Bold modern sans-serif display, readable modern sans-serif body, occasional editorial accent only when useful. Fluid `clamp()` sizing, comfortable line lengths, self-hosted licensed fonts or system fallback.

## Layout
Spacious editorial grid, asymmetric featured work selectively, consistent spacing, readable max-width, deliberate mobile composition.

## Components
SiteHeader, MobileNavigation, ThemeToggle, IntroSequence, Hero, SectionHeading, buttons/links, ProjectCard, ProjectFilter, TechnologyTag, CaseStudyHeader/Section, ArchitectureDiagram, Gallery/Lightbox, Timeline, MetricCard, SkillCategory, TechnologyCard, VentureCard, ServiceAccordion, LabCard, StatusBadge, ProgressSnapshot/Timeline, SocialLink, ResumePreview, ContactForm, Footer, ScrollProgress, BackToTop.

All controls need keyboard focus, accessible names, visible states and touch-friendly targets.

## Motion
Short fades/slides/mask reveals. Reduced motion removes non-essential animation. No scroll hijacking, forced snap, long delays or distracting perpetual motion.

## Cursor and 3D
Optional branded cursor only in selected desktop visual areas; never globally replace native cursor. Disable on touch/reduced motion. 3D desktop sculpture must be lazy-loaded and have static CSS/SVG fallback. No drag/rotate required.

## Galleries
Keyboard/touch accessible lightbox, captions, alt text, focus management, close control. Hover must not be required to reveal content.

## Themes
Dark default; fully designed light mode; persist preference; avoid theme flash; respect system preference sensibly.
