# DESIGN.md: Enterprise AI SaaS Marketing Site (Competera-style theme)

> Version 2.0 · Reference: https://competera.ai/ (AI retail price optimization software)
> Audience: a coding/design agent building a marketing site in this visual and structural theme.

## 0. How to Use This File

**Authority order** (when two rules conflict, the higher one wins):
1. Section 1 (Design Intent) and Section 16 (Hard Rules)
2. Tokens (Sections 4-8, 10) are **canonical for this project**
3. Component specs (Section 9)
4. Everything else

**Tags**
- **[OBSERVED]**: taken from the reference site's structure or content.
- **[DEFINED]**: a design decision made by this document. It is final and the agent must implement it exactly. It is not a claim about the reference site's CSS.

Token values in this file are **[DEFINED]**. The project does not need to match the reference site's CSS byte for byte. To pixel-match the reference, run the extractor in Section 20 and override values in `tokens.css` only. Never override them in components.

**Agent rule:** when in doubt, choose clarity, whitespace and evidence over decoration.

---

## 1. Design Intent

An **enterprise B2B AI platform** site. It must feel:

- **Trustworthy and credible**: certification badges, review scores, named customers, analyst recognition. [OBSERVED]
- **Data-driven and precise**: large numeric proof points (95%+, 40%, 30%, 80%, 2.9M). [OBSERVED]
- **Calm and professional**, never playful. AI is framed as "intelligence + human-in-the-loop", not magic. [OBSERVED]
- **Clean and spacious**, with product UI screenshots as the hero visual rather than abstract illustration. [OBSERVED]

**Design principles (use these to settle any ambiguity)**
1. Evidence over decoration. Every claim gets a number, a logo or a screenshot.
2. One accent, used with discipline.
3. Product first. Screenshots outrank illustration.
4. Quiet motion. Motion explains; it never performs.
5. Accessible by default, not as a final pass.

---

## 2. Brand Voice and Copy Rules [OBSERVED]

- Headlines are declarative and outcome-led: "Pricing AI solutions for enterprise retail".
- Sub-headlines explain the mechanism in one or two sentences.
- Preferred verbs: understand, predict, deliver, simulate, uncover, optimize, forecast.
- Always quantify: "50% faster", "95%+ accuracy", "99% data quality".
- Vocabulary: elasticity, demand drivers, scenario planning, margin, revenue, SKU-level, omnichannel, human-in-the-loop, enterprise-grade.
- CTA labels: "Request a demo", "Talk to an expert", "See platform in action", "Read more →", "Explore".
- **Avoid:** hype ("revolutionary", "magic"), emojis, exclamation marks, slang.
- **Spelling: US English everywhere** ("optimization", "personalization"). **[DEFINED]**
- Headings: sentence case. Eyebrows and menu group labels: uppercase via CSS `text-transform`, not typed in caps.
- Numbers: use numerals for stats ("95%", "2.9M"); thin space before units ("40 %" is not used; write "40%").
- Do not copy the reference site's text, logos or imagery verbatim. Write original copy in this voice.

**Copy length limits**
| Element | Max |
|---|---|
| H1 | 12 words |
| H2 | 14 words |
| H3 | 8 words |
| Hero supporting copy | 30 words |
| Card description | 20 words |
| Button label | 4 words |

---

## 3. Page Architecture (17 sections, in order) [OBSERVED]

| # | Section | Component | Background |
|---|---|---|---|
| 1 | Announcement bar | `AnnouncementBar` | brand-50 or ink-900 |
| 2 | Sticky header + mega-menu | `Header` | surface |
| 3 | Hero | `Hero` | surface |
| 4 | Feature tabs + product screenshot | `FeatureTabs` | surface-alt |
| 5 | Value-prop block with 3 stat chips | `ValueProps` | surface |
| 6 | Customer logo marquee | `LogoMarquee` | surface |
| 7 | Awards strip | `AwardsStrip` | surface |
| 8 | Split section (text + product image) | `SplitFeature` | surface-alt |
| 9 | Feature grid (5 items) | `FeatureGrid` | surface |
| 10 | Case-study carousel (4 cards) | `CaseStudies` | surface-alt |
| 11 | Numbered process stepper (01-05) | `ProcessStepper` | surface |
| 12 | Security band | `SecurityBand` | surface-alt |
| 13 | Industries grid (8 tiles) | `IndustryGrid` | surface |
| 14 | News / articles (3 cards) | `NewsGrid` | surface-alt |
| 15 | Closing CTA + wide banner | `ClosingCTA` | ink-900 |
| 16 | Recognition badges row | `BadgeRow` | surface |
| 17 | Footer | `Footer` | ink-900 |

Rules:
- Backgrounds alternate `surface` / `surface-alt`. Only sections 15 and 17 are dark, so at most two dark bands per page.
- Exactly one `<h1>` (in Hero). Every other section starts with an `<h2>`.
- Each section is wrapped in `<section aria-labelledby="...">`.

---

## 4. Color System (Competera Electric Green & Obsidian Theme) **[DEFINED]**

Competera is an **obsidian dark-first interface accented by an electric emerald-green signature brand identity** (`#00D06C` / `#05DF72`).

### 4.1 Canonical Theme Tokens (Dark-First Default)

```css
:root {
  /* Competera Signature Brand Green */
  --color-brand-50:  #0D2619;
  --color-brand-100: #113B26;
  --color-brand-400: #34D399;
  --color-brand-500: #10B981;
  --color-brand-600: #00D06C;   /* PRIMARY COMPETERA ELECTRIC GREEN */
  --color-brand-700: #05B860;   /* hover */
  --color-brand-800: #03964E;   /* active */

  /* Neutrals ("ink" - Obsidian dark scale) */
  --color-ink-900: #FFFFFF;
  --color-ink-800: #F3F4F6;
  --color-ink-700: #D1D5DB;
  --color-ink-500: #9CA3AF;
  --color-ink-400: #6B7280;
  --color-ink-300: #374151;
  --color-ink-200: #1F2937;
  --color-ink-100: #111827;

  /* Surfaces - Obsidian dark base */
  --color-surface:         #08090A;
  --color-surface-alt:     #0D110F;
  --color-surface-card:    #131715;
  --color-surface-inverse: #040505;

  /* Semantic */
  --color-success-600: #00D06C;  --color-success-50: #0B2417;
  --color-warning-600: #F59E0B;  --color-warning-50: #291B05;
  --color-danger-600:  #EF4444;  --color-danger-50:  #290B0B;
  --color-info-600:    #3B82F6;  --color-info-50:    #0B1B36;
  --color-rating:      #FFB400;       /* review stars only */

  /* Role aliases (components use ONLY these) */
  --text-heading:   #FFFFFF;
  --text-body:      #D1D5DB;
  --text-muted:     #9CA3AF;
  --text-on-brand:  #000000;          /* High-contrast black on electric green CTA */
  --text-link:      var(--color-brand-600);
  --border-subtle:  #1C2420;
  --border-strong:  #2A3630;
  --bg-page:        var(--color-surface);
  --bg-section-alt: var(--color-surface-alt);
  --bg-card:        var(--color-surface-card);
  --bg-chip:        #111915;
  --focus-ring:     var(--color-brand-600);
}
```

### 4.2 Light Theme Variant (Opt-in toggle)

```css
[data-theme="light"], :root[data-theme="light"] {
  --color-brand-50:  #ECFDF5;
  --color-brand-100: #D1FAE5;
  --color-surface:         #FFFFFF;
  --color-surface-alt:     #F4F9F6;
  --color-surface-card:    #FFFFFF;
  --text-heading:   #0B1220;
  --text-body:      #2B3445;
  --text-muted:     #5B6577;
  --text-on-brand:  #FFFFFF;
  --border-subtle:  #E2E8E4;
  --border-strong:  #CBD5CE;
  --bg-page:        var(--color-surface);
  --bg-section-alt: var(--color-surface-alt);
  --bg-card:        var(--color-surface-card);
  --bg-chip:        var(--color-brand-50);
}
```

### 4.3 Ambient Background Glows & Accent Rules
- Background glow: radial `rgba(0, 208, 108, 0.12)` ambient aurora on obsidian dark `#08090A`.
- Buttons: Primary CTA is solid electric emerald green (`#00D06C`) with bold black text (`#000000`) for high-impact readability. Outline button is dark with 1px border.
- Customer logos: crisp monochrome white with 70% opacity, 100% on hover.

---

## 5. Typography **[DEFINED]**

```css
:root {
  --font-sans: "Inter", "Helvetica Neue", Arial, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}
```

Load with `next/font` (or equivalent), `display: swap`, weights 400/500/600/700, Latin subset, preloaded. Use a metric-compatible fallback to prevent layout shift (CLS < 0.05).

### 5.1 Type scale (fluid)

| Token | Desktop → Mobile | Weight | Line height | Letter spacing | Use |
|---|---|---|---|---|---|
| display | 56 → 36 | 700 | 1.1 | -0.02em | Hero H1 |
| h2 | 40 → 28 | 700 | 1.2 | -0.015em | Section titles |
| h3 | 22 → 18 | 600 | 1.3 | -0.005em | Feature/step titles |
| h4 | 18 → 16 | 600 | 1.4 | 0 | Card sub-titles |
| body-lg | 18 → 17 | 400 | 1.6 | 0 | Hero and intro copy |
| body | 16 | 400 | 1.6 | 0 | Default |
| body-sm | 14 | 400 | 1.5 | 0 | Meta, footers |
| caption | 13 | 400 | 1.5 | 0.01em | Stat captions |
| eyebrow | 12 | 600 | 1.2 | 0.08em, uppercase | Labels, menu groups |
| stat | 64 → 44 | 700 | 1.0 | -0.02em, tabular-nums | Big numbers |
| button | 15 | 600 | 1 | 0.01em | Buttons |

Fluid implementation: `font-size: clamp(2.25rem, 1.6rem + 2.8vw, 3.5rem)` for display (and the equivalent for h2/stat).

### 5.2 Rules
- Max line length 65ch for paragraphs, 20ch for stat captions.
- Numbers in stats, tables and charts use `font-variant-numeric: tabular-nums`.
- Bold the key phrase inside a heading for emphasis (e.g. "**optimal price recommendations at scale.**"). [OBSERVED]
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.
- Links in running text: brand color, underline, offset 3px; hover thickens the underline.
- Respect user zoom: sizes in `rem`, never lock `html` font-size in `px`.

---

## 6. Spacing, Layout and Grid

- **Container:** max-width 1280px (content 1200px), padding-inline 24px (< 768) / 32px (768-1279) / 40px (≥ 1280).
- **Grid:** 12 columns, 24px gutter (16px under 640).
- **Spacing scale (8px base):** `--space-1: 4` · `2: 8` · `3: 12` · `4: 16` · `5: 24` · `6: 32` · `7: 48` · `8: 64` · `9: 96` · `10: 128`.
- **Section padding-block:** 96-128px ≥ 1024, 72px 640-1023, 56px < 640.
- **Heading-to-content gap:** 48px (desktop), 32px (mobile).
- **Breakpoints:** `sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`. Design mobile-first, verify at 360, 390, 768, 1024, 1280, 1536.
- **Split sections:** 5/7 or 6/6 columns, stack under `lg` with text first, media second.
- **Z-index scale:** `base 0` · `sticky-header 40` · `mega-menu 50` · `drawer 60` · `modal 70` · `toast 80` · `skip-link 100`.

---

## 7. Shape, Elevation, Borders

| Token | Value |
|---|---|
| `--radius-sm` | 8px (inputs, small buttons) |
| `--radius-md` | 12px (screenshots, tiles) |
| `--radius-lg` | 16px (cards) |
| `--radius-pill` | 999px (chips, primary CTA optional) |

| Elevation | Shadow (light theme) |
|---|---|
| `--shadow-xs` | `0 1px 2px rgba(11,18,32,0.06)` (resting cards) |
| `--shadow-md` | `0 8px 30px rgba(11,18,32,0.08)` (hover, screenshots) |
| `--shadow-lg` | `0 20px 60px rgba(11,18,32,0.12)` (mega-menu, modal) |

Prefer 1px borders (`--border-subtle`) to heavy shadows. Product screenshots sit on the gradient backdrop (4.4) with 24-48px padding.

---

## 8. Iconography and Imagery

**Icons**
- Library: Lucide (thin stroke), stroke width 1.5px, `currentColor`.
- Size scale: **16** (inline/links) · **20** (buttons, inputs) · **24** (nav, chips) · **32** (feature cards) · **40** (feature grid hero icons) · **48** (mega-menu item icons).
- Decorative icons: `aria-hidden="true"`. Meaningful icons: `aria-label` or adjacent text.
- Arrow glyph "→" in text links is an icon, not a character, so it can animate.

**Imagery**
- Product UI screenshots are the hero visual: realistic dashboards with charts, tables and price-recommendation chips. Cropped cleanly, `--radius-md`, `--shadow-md`.
- Provide light and dark variants of each screenshot (`<picture>` with `prefers-color-scheme` source).
- Customer logos: SVG, monochrome, height 28-36px, ≥ 24px clear space.
- Certification and award badges: natural size, never recolored.
- No stock photography of people at laptops, no 3D blobs. Illustrations are minimal and diagram-like.
- Image delivery: AVIF/WebP, `next/image`, explicit width and height, `priority` only for the hero screenshot, lazy-load everything else. Alt text is required (logos: company name; decorative: `alt=""`).
- Aspect ratios: hero screenshot 1040:558, split image 597:617, closing banner 1200:520, promo card 339:180, OG image 1200:630.

---

## 9. Components

For every interactive component, all states below are required: **default, hover, focus-visible, active, disabled, loading** (where relevant).

### 9.1 Announcement bar [OBSERVED]
- 40px tall, `brand-50` background with `ink-900` text (or `ink-900` with white text), centered 14px text, bold lead phrase, link with trailing arrow.
- Not dismissible. Wraps to two lines on mobile (height auto, padding 8px).

### 9.2 Header and mega-menu [OBSERVED]
- Sticky, 72px (64px mobile), `bg-page`, 1px bottom border that fades in after 8px of scroll, backdrop blur 8px on 90% opacity background.
- Left: logo (≈130×22 SVG, links home, `aria-label="Home"`). Center: nav (Products, Solutions, Resources, Customers, Company). Right: text link "Pricing" + primary button.
- **Mega-panel:** opens on hover (120ms intent delay) and on click/Enter/Space. Layout: 3-4 columns plus a promo card (339×180 image + CTA).
  - Group headings: eyebrow style (uppercase), with "See more →" beside each.
  - Items: 48px icon + bold title + one-line description; hover = `brand-50` background, radius 12px.
  - Closes on Esc, outside click, focus leaving the panel. Focus returns to the trigger.
  - Implement with Radix `NavigationMenu`. Panel animates in 180ms (opacity + 8px translate-y).
- **Mobile (< 1024):** hamburger opens a full-height drawer with accordion groups, focus trap, body scroll lock, and a close button. First focusable element in the page is a "Skip to content" link. [OBSERVED]

### 9.3 Buttons

| Variant | Default | Hover | Active | Focus-visible | Disabled | Loading |
|---|---|---|---|---|---|---|
| Primary | bg brand-600, white text | bg brand-700, lift -1px | bg brand-800 | 2px ring `--focus-ring`, offset 2px | bg ink-200, text ink-400, no pointer | spinner replaces label, width locked, `aria-busy` |
| Secondary | transparent, 1px `--border-strong`, heading-color text | bg `--bg-section-alt`, border ink-500 | bg ink-100 | same ring | 50% opacity | same |
| Ghost with play icon | like secondary + 20px play icon left | icon scales 1.08 | n/a | same ring | n/a | n/a |
| Text link | brand text + arrow icon | underline; arrow nudges 4px right | brand-800 | same ring | muted | n/a |

Sizes: **lg** 52px (hero), **md** 48px (default), **sm** 40px (header, cards); horizontal padding 24px (md); minimum touch target 44×44px. Label 15px / 600; uppercase only on the hero primary CTA.

### 9.4 Form controls (new)
Inputs, textarea, select, checkbox, radio, switch. Used in demo-request forms and newsletter signup.
- **Text input:** 48px tall, `--radius-sm`, 1px `--border-strong`, `bg-card`, text `--text-heading`, placeholder `--color-ink-400` (decorative only; never a replacement for a label).
- **Label:** above the field, 14px / 600. Optional hint below in `body-sm` muted. Required fields marked with "(required)" text, not just an asterisk.
- **States:** hover = border ink-500; focus = 2px `--focus-ring` border plus 3px `brand-100` halo; error = border `danger-600`, icon, message in `danger-600` below, `aria-invalid="true"` and `aria-describedby`; success = border `success-600` and check icon; disabled = `ink-100` fill.
- **Checkbox/radio:** 20px, `--radius-sm` / full radius, checked = brand-600 fill with white glyph; hit area 44px including label.
- **Switch:** 44×24, thumb 20px, 150ms slide.
- **Form layout:** single column, 16px between fields, 24px before submit; the submit is a primary `lg` button. Inline validation on blur, summary of errors on submit (focus moves to the summary).
- **Newsletter:** one input + button on a single row ≥ 640, stacked below.
- Success state: replace the form with a confirmation block (check icon, H3, sentence) and move focus to it.

### 9.5 Review badge row [OBSERVED]
Platform logo + numeric score + star icon, inline, muted, preceded by "Trusted by 50+ retailers across the globe". Stars are `--color-rating`; the numeric score is always visible as text. Wraps into 2-3 per row on mobile.

### 9.6 Feature tabs + screenshot [OBSERVED]
- `role="tablist"`, arrow keys move between tabs, Home/End jump to first/last, Enter/Space activate.
- Tab list: horizontally scrollable on mobile with edge-fade masks and scroll snapping. Active tab: brand-600 text, 2px bottom indicator that slides between tabs (200ms).
- Panel: one large screenshot, cross-fade 300-400ms. Preload the adjacent screenshots on idle.
- Optional auto-advance every 8s that **stops permanently on any user interaction** and is disabled under reduced motion.

### 9.7 Stat chip (value-prop) [OBSERVED]
Icon or numeral + two-line bold label on a `--bg-chip` surface, `--radius-md`, padding 20px. 3-up row ≥ 768, stacked below.

### 9.8 Logo marquee [OBSERVED]
- Duplicated track for a seamless loop, linear, ~40s per loop, pauses on hover and on focus-within.
- Logos grayscale at 60% opacity; color and 100% opacity on hover. Each links to a case study with `aria-label="<Company> case study"`.
- The track is `aria-hidden` on the duplicate copy. Under `prefers-reduced-motion`, render a static wrapped grid.
- Edge fade masks (48px) on both sides.

### 9.9 Awards strip [OBSERVED]
Four text-link items separated by dividers. Each: eyebrow label + title + arrow. Wraps 2×2 on mobile.

### 9.10 Split section [OBSERVED]
Text column: eyebrow, H2, paragraph, 2-3 bullets with check icons, CTA. Media column: product image with the gradient backdrop. `reverse` prop swaps sides ≥ `lg`.

### 9.11 Feature card with line icon [OBSERVED]
32-40px line icon, H3, one-line description. No border by default; hover shows `--border-subtle` and a `brand-50` icon plate. Grid: 1 col (< 640), 2 (640-1023), 3 (≥ 1024; 5 items render 3+2 centered).

### 9.12 Case-study card [OBSERVED]
- Structure: eyebrow industry → customer name (H3) → two stats (`stat` token + caption) → one-line outcome → "Read more →".
- Surface: `bg-card`, `--radius-lg`, 1px `--border-subtle`, padding 28px.
- Hover: lift -4px, `--shadow-md`, 200ms. Whole card is one link (stretched link pattern).
- Layout: Embla carousel < 1024 with dots and prev/next buttons (44px); 4-up row or 2×2 grid ≥ 1024.

### 9.13 Numbered stepper [OBSERVED]
- Large numerals "01"-"05" in `brand-100` (48-64px), H3, paragraph.
- Desktop: sticky left column with the step list, right column with the matching visual; active step determined by IntersectionObserver. Mobile: a vertical list with a connecting line, no sticky behavior.
- Active step: heading color, 3px brand left border. Inactive: muted text.
- Steps are keyboard reachable and their visuals have text alternatives.

### 9.14 Security band [OBSERVED]
Badge image left (≈160px), H2 + paragraph + "Read more →" right, on `surface-alt`. Stacked and centered on mobile.

### 9.15 Industry tile [OBSERVED]
Title + "See more →", optional 32px icon. Grid 4×2 ≥ 1024, 2×4 ≥ 640, 1 col below. Hover: lift -2px, `brand-50` background, arrow nudge. Whole tile is a link.

### 9.16 Article/news card [OBSERVED]
Type label (Article / News, as an eyebrow), title (H3, 2 lines max, ellipsis), excerpt (3 lines max), meta (date, read time), optional 16:9 cover. Hover: title underlines.

### 9.17 Closing CTA [OBSERVED]
Dark band (`--color-surface-inverse`), H2 white, paragraph `#C9D0DD`, primary button "Talk to an expert", optional secondary outline button (white border/text), wide banner image 1200×520 beneath with `--radius-lg` and a glow behind it.

### 9.18 Recognition badge row [OBSERVED]
Six badges, equal height 64-80px, evenly spaced, wrap 3×2 on mobile. Never recolored; provide dark-surface variants if the row sits on a dark background.

### 9.19 Footer [OBSERVED]
Dark ink background. Five link columns (Product, Solutions, Resources, Company, Contact), email link, social icons (Facebook, LinkedIn, X; 44px targets, `aria-label` each), community banner (~190×67), legal row (ISO badge, Privacy, License, Terms), muted copyright. Columns collapse to accordions < 768 (2-col grid at 640-767).

### 9.20 Feedback and system UI (new)
- **Toast:** bottom-right (bottom-center on mobile), 360px max, `role="status"` (errors `role="alert"`), auto-dismiss 5s, pause on hover, close button.
- **Modal / demo dialog:** Radix Dialog, focus trap, Esc closes, overlay `rgba(11,18,32,0.6)`, panel `--radius-lg` and `--shadow-lg`, max-width 560px, scroll inside the panel.
- **Cookie/consent banner:** bottom bar, does not cover the primary CTA on mobile (max 30% height), equal-weight "Accept" and "Reject" buttons.
- **Skeleton loader:** `ink-100` blocks, 1.2s shimmer (disabled under reduced motion), matches final layout dimensions to prevent shift.
- **Empty state:** icon (48px), H3, one sentence, one action.
- **Error pages:** 404 and 500 use the same header/footer, H1, one sentence, primary button "Back to home", and a search/contact link.
- **Tooltip:** 200ms delay, `role="tooltip"`, dismissible with Esc, never holds essential information.
- **Breadcrumbs (inner pages):** body-sm, separators are chevron icons, current page is `aria-current="page"`.

---

## 10. Motion

**Tokens**
```css
:root {
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-fast: 150ms;   /* hover, press */
  --dur-base: 220ms;   /* menus, cards */
  --dur-slow: 380ms;   /* tab/screenshot cross-fade */
  --dur-reveal: 500ms; /* scroll reveal */
}
```

| Interaction | Spec |
|---|---|
| Hover/press | `--dur-fast`, `--ease-out`, transform + color only |
| Menu/panel | opacity + translateY(8px), `--dur-base` |
| Tab content | opacity cross-fade, `--dur-slow` |
| Scroll reveal | fade-up 16px, `--dur-reveal`, once per element, stagger 60ms, trigger at 15% visibility |
| Marquee | linear, continuous, pauses on hover |
| Number count-up (stats) | 1.2s ease-out once when in view; final value is in the DOM from the start for no-JS and screen readers |

**Rules**
- Animate only `transform` and `opacity` (never layout properties).
- `prefers-reduced-motion: reduce` disables marquee, reveals, count-up, parallax and auto-advance; state changes become instant. Hover color changes remain.
- No animation may start before first paint of the hero content (LCP protection).
- No autoplaying video with sound; background video (if any) is muted, ≤ 2MB, and paused under reduced motion.

---

## 11. Responsive Behavior Matrix

| Section | < 640 | 640-1023 | ≥ 1024 |
|---|---|---|---|
| Header | hamburger drawer | hamburger drawer | full nav, mega-menu |
| Hero | centered, stacked CTAs, screenshot below | centered, inline CTAs | centered, inline CTAs |
| Feature tabs | scrolling tabs, 100% width image | scrolling tabs | full tab row |
| Value props | stacked chips | 3-up | 3-up |
| Logo marquee | 2 rows static if reduced motion | marquee | marquee |
| Split | stacked | stacked | 2 columns |
| Feature grid | 1 col | 2 col | 3 col |
| Case studies | carousel 1.1 visible | carousel 2 visible | 4-up |
| Stepper | vertical list | vertical list | sticky 2-col |
| Industries | 1 col | 2 col | 4 col |
| News | 1 col | 2 col | 3 col |
| Footer | accordion | 2-col | 5-col |

Rules: no horizontal page scroll at any width ≥ 320px; images never exceed their container; tap targets ≥ 44px; hero H1 never exceeds 4 lines at 360px.

---

## 12. Accessibility (WCAG 2.2 AA)

- "Skip to content" link first in tab order, visible on focus, targets `main#main-content`.
- Landmarks: `header`, `nav` (with `aria-label`), `main`, `footer`.
- Heading order has no skipped levels. One H1.
- Focus: visible on every interactive element, 2px ring with 2px offset, at least 3:1 against adjacent colors. `outline: none` is never used without a replacement.
- Keyboard: mega-menu (Enter/Space open, Esc close, arrows move), tabs (arrows/Home/End), carousel (buttons reachable, slides not focus traps), dialogs (trap and restore focus).
- Touch targets ≥ 44×44px (WCAG 2.2 target size, minimum 24px with spacing).
- Images: meaningful alt text; decorative `alt=""`.
- Color is never the sole signal; star ratings show numbers; errors include icon and text.
- Forms: persistent visible labels, error identification, `autocomplete` attributes, no placeholder-only labels.
- Motion and time: reduced-motion honored; no content flashes more than 3 times per second; moving content longer than 5s has a pause control.
- Language: `<html lang="en">`; text resizes to 200% without loss; reflows at 320px.
- Test with: axe, Lighthouse, keyboard-only pass, NVDA or VoiceOver pass on header, tabs and forms.

---

## 13. SEO, Meta and Analytics

**SEO**
- Title pattern: `<Primary keyword phrase> | <Brand>` (≤ 60 chars). Meta description: one outcome-driven sentence (≤ 155 chars).
- Open Graph image 1200×630 + `twitter:card = summary_large_image`. Canonical URL on every page.
- JSON-LD: `Organization` (home), `BreadcrumbList` (inner pages), `Article` (news), `FAQPage` (where FAQs exist).
- `sitemap.xml`, `robots.txt`, descriptive link text (no "click here").
- URL taxonomy: `/products/...`, `/solutions/by-need/...`, `/solutions/by-industry/...`, `/customers/...`, `/resources/...`, `/company/...`.

**Analytics (privacy-first, consent-gated)**
Event names (snake_case): `cta_click` {label, location}, `demo_form_start`, `demo_form_submit`, `tab_change` {tab}, `case_study_open` {slug}, `menu_open` {group}, `scroll_depth` {25,50,75,100}. No PII in event payloads.

---

## 14. Performance Budgets

| Metric | Budget |
|---|---|
| Lighthouse Performance (mobile) | ≥ 90 |
| Lighthouse Accessibility / Best Practices / SEO | ≥ 95 / ≥ 95 / ≥ 95 |
| LCP | ≤ 2.5s |
| INP | ≤ 200ms |
| CLS | ≤ 0.05 |
| JS shipped on home (gzip) | ≤ 170KB |
| Hero image | ≤ 150KB (AVIF/WebP) |
| Fonts | ≤ 2 families, ≤ 4 files, `font-display: swap` |

Tactics: server components by default, dynamic-import the carousel and below-the-fold sections, `content-visibility: auto` on long sections (with `contain-intrinsic-size`), no layout shift from images or fonts, third-party scripts loaded after consent and after idle.

---

## 15. Tech Stack and Architecture

- **Framework:** Next.js (App Router) + TypeScript (strict).
- **Styling:** Tailwind CSS with tokens mapped in `tailwind.config.ts` from `tokens.css` variables.
- **Primitives:** Radix UI (NavigationMenu, Tabs, Accordion, Dialog, Switch, Tooltip). **Motion:** Framer Motion (reveals only) or CSS. **Carousel:** Embla. **Icons:** Lucide.
- **Forms:** React Hook Form + Zod; server action or API route with rate limiting and honeypot.
- **Content:** typed data in `/content/*.ts` (MDX for articles). Components never contain copy.
- **Testing:** Vitest + Testing Library (units), Playwright (e2e + keyboard flows), axe-core in CI, Lighthouse CI against the budgets in Section 14.

```
/app
  /(marketing)/page.tsx
  /products/[slug]/page.tsx
  /solutions/by-need/[slug]/page.tsx
  /solutions/by-industry/[slug]/page.tsx
  /customers/[slug]/page.tsx
  /resources/...
  /not-found.tsx   /error.tsx
/components
  /layout    AnnouncementBar, Header, MegaMenu, MobileDrawer, Footer
  /sections  Hero, FeatureTabs, ValueProps, LogoMarquee, AwardsStrip, SplitFeature,
             FeatureGrid, CaseStudies, ProcessStepper, SecurityBand,
             IndustryGrid, NewsGrid, ClosingCTA, BadgeRow
  /ui        Button, Input, Select, Checkbox, Switch, Card, Badge, Stat, Eyebrow,
             Container, Tooltip, Toast, Dialog, Skeleton, Breadcrumbs
/content     nav.ts, hero.ts, tabs.ts, caseStudies.ts, steps.ts, industries.ts, news.ts, footer.ts
/styles      tokens.css, globals.css
/public      /logos  /screens  /badges
```

### 15.1 Content schemas (TypeScript)

```ts
export type Cta = { label: string; href: string; variant?: "primary" | "secondary" | "link" };
export type Stat = { value: string; caption: string };
export type CaseStudy = { slug: string; industry: string; customer: string; stats: [Stat, Stat]; summary: string };
export type Step = { id: `0${1|2|3|4|5}`; title: string; body: string; visual?: { src: string; alt: string } };
export type NavGroup = { label: string; items: { title: string; description: string; href: string; icon: string }[]; promo?: { image: string; text: string; href: string } };
export type Tab = { id: string; label: string; screenshot: { light: string; dark: string; alt: string } };
```

### 15.2 Tailwind mapping (excerpt)

```ts
theme: {
  extend: {
    colors: {
      brand: { 50: "var(--color-brand-50)", 600: "var(--color-brand-600)", 700: "var(--color-brand-700)" },
      ink:   { 900: "var(--color-ink-900)", 700: "var(--color-ink-700)", 500: "var(--color-ink-500)" },
      surface: { DEFAULT: "var(--color-surface)", alt: "var(--color-surface-alt)" },
    },
    borderRadius: { sm: "8px", md: "12px", lg: "16px" },
    boxShadow: { xs: "var(--shadow-xs)", md: "var(--shadow-md)", lg: "var(--shadow-lg)" },
    maxWidth: { container: "1280px" },
  },
}
```

---

## 16. Hard Rules (non-negotiable)

1. No hard-coded colors, font sizes, radii or shadows in components; use tokens and role aliases.
2. Exactly one H1 per page; no skipped heading levels.
3. One accent color. No gradients beyond Section 4.4.
4. Animate only `transform` and `opacity`; honor reduced motion.
5. Every interactive element has hover, focus-visible, active and disabled states.
6. Every image has explicit dimensions and meaningful (or empty) alt text.
7. All copy lives in `/content`, never inside components.
8. No horizontal scroll at ≥ 320px; tap targets ≥ 44px.
9. No emojis, hype words or exclamation marks in copy.
10. Use placeholder assets (neutral dashboard mocks, fictional customer names and logos). Never ship real third-party trademarks or the reference site's content.

---

## 17. Agent Build Instructions

1. Scaffold the project; create `tokens.css` and the Tailwind theme from Sections 4-8 and 10 first (light and dark).
2. Build `/ui` primitives (with all states from Section 9), then `/layout`, then `/sections` in the Section 3 order.
3. Populate `/content` with original placeholder copy that follows Section 2.
4. Wire the responsive matrix (Section 11) and keyboard behavior (Section 12) as each component is built, not afterward.
5. Add metadata, JSON-LD, sitemap, and analytics events (Section 13).
6. Run the QA checklist (Section 18). Fix before finishing.

---

## 18. QA Checklist and Definition of Done

**Visual**
- [ ] All 17 sections present, in order, with correct alternating backgrounds
- [ ] Light and dark themes both pass a visual review; no unthemed surfaces
- [ ] Verified at 360, 390, 768, 1024, 1280, 1536 widths
- [ ] Typography matches the scale; no orphaned single-word headline lines

**Behavior**
- [ ] Mega-menu, tabs, carousel, stepper, drawer and dialog work by keyboard and touch
- [ ] Forms show validation, loading, success and error states
- [ ] Marquee pauses on hover/focus; static under reduced motion

**Quality**
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- [ ] axe: zero serious/critical violations; keyboard-only pass complete
- [ ] CLS ≤ 0.05, LCP ≤ 2.5s, INP ≤ 200ms
- [ ] `grep` finds no hex colors or `px` font sizes inside `/components`
- [ ] TypeScript strict passes; unit and e2e tests green

**Done = every box checked, all tokens centralized, all copy in `/content`.**

---

## 19. Do / Don't Quick Reference

| Do | Don't |
|---|---|
| Lead with a number or outcome | Lead with adjectives |
| Show real-looking product UI | Use abstract blobs or stock people photos |
| Use one brand accent | Add secondary accent colors |
| Keep motion subtle and optional | Auto-animate everything |
| Use borders and whitespace | Stack heavy shadows |
| Write US English, sentence case | Mix UK/US spelling or Title Case Headings |
| Keep copy in `/content` | Hard-code strings in JSX |

---

## 20. Optional: Token Extraction (to match the reference exactly)

Open https://competera.ai in Chrome, paste into DevTools Console, then override matching values in `tokens.css` only.

```js
const pick = (sel, props) => {
  const el = document.querySelector(sel); if (!el) return null;
  const s = getComputedStyle(el);
  return Object.fromEntries(props.map(p => [p, s[p]]));
};
console.log({
  body:   pick('body',   ['fontFamily','fontSize','color','backgroundColor','lineHeight']),
  h1:     pick('h1',     ['fontFamily','fontSize','fontWeight','lineHeight','color','letterSpacing']),
  h2:     pick('h2',     ['fontSize','fontWeight','lineHeight','color']),
  h3:     pick('h3',     ['fontSize','fontWeight','lineHeight','color']),
  button: pick('a[href*="signup-form"]', ['backgroundColor','color','borderRadius','padding','fontSize','fontWeight','textTransform']),
  header: pick('header', ['height','backgroundColor','boxShadow','borderBottom']),
  card:   pick('[class*="card"]', ['borderRadius','boxShadow','backgroundColor','padding'])
});
[...document.styleSheets].forEach(s => { try { [...s.cssRules].forEach(r => {
  if (r.selectorText === ':root') console.log(r.cssText); }); } catch(e){} });
```

This step is optional. The tokens in this file are complete and buildable as written.