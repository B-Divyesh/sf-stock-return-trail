# Stock Return Trail — visual thesis

## Direction

**Topographic cartography for stock that finds its way home.** The interface treats every movement as a plotted route between a permanent store and a temporary job. Contour lines, coordinate-like labels, survey marks, and a bright route thread make provenance visible without turning the product into a map app. It suits field teams because it borrows the quiet, durable language of site plans and field notebooks.

This is a single-mode, warm-light utility. The pale map ground stays readable outdoors, while the ink and route colors keep at least 4.5:1 text contrast. A separate dark theme would weaken the paper-map metaphor; installed-app chrome is explicitly painted.

## Tokens

- `--paper: #F3F0E5` — field-map background
- `--paper-deep: #E7E1D0` — inset work areas
- `--ink: #173C35` — primary text, 10.1:1 on paper
- `--muted: #52645E` — secondary text, 5.4:1 on paper
- `--route: #C8482D` — route line and primary action
- `--route-dark: #91331F` — pressed state and text links
- `--route-ink: #FFFFFF` — action contrast
- `--water: #2E6F73` — secondary action and focus ring
- `--success: #2F6A48`; `--warning: #8B5B10`; `--danger: #A42D2D`
- `--line: rgba(23, 60, 53, .22)` — dividers and contour lines

## Type and spacing

Display type is the self-hosted serif **Bitter** at 650–800 for the feel of a printed survey title. Body and data use the self-hosted sans **Atkinson Hyperlegible**, chosen for quick reading in motion and clear number shapes. Both are stored as WOFF2 subsets with `font-display: swap`.

Spacing follows an 8 px field grid: 4, 8, 16, 24, 32, 48, 72, 96. Controls are at least 48 px high. Most copy stays within 66 characters. Item quantities use tabular figures.

## Shape and interaction grammar

- Sections meet at offset contour boundaries instead of generic rounded-card grids.
- Cards are reserved for independent jobs and stock lines. Their clipped top-right corner resembles a map sheet.
- A route thread connects origin, job, and return. Status chips include words and marks, never color alone.
- Primary controls are solid route red. Secondary controls are paper buttons with an ink border.
- Focus uses a 3 px water-blue ring with a paper offset.

## Motion

The signature motion is a route line drawing from origin to job when the app or demo opens. UI changes take 180–240 ms and move only with opacity and transforms. No element loops. With `prefers-reduced-motion: reduce`, line drawing and transitions are disabled and end states appear at once.

## Asset plan and provenance

- Hero illustration: an original raster cutaway of a compact field-service kit laid over topographic landforms. It explains dispersed stock and return routes. No text appears inside the art.
- UI contour field: hand-authored CSS/SVG geometry, decorative only.
- Icons and wordmark: hand-authored SVG line work.
- Social preview: composed locally from the generated hero and product typography.

### Generation prompt sheet

Use case: stylized-concept. Asset type: landing hero. Subject: a compact open field-service parts case on an abstract topographic site map, with small organized fittings, cable reels, valves, and hand tools; one coral route thread arcs from the case toward a small green stockroom marker. World: practical field notebook and survey map. Materials: screen-printed paper grain, cut-paper relief, enamel metal, canvas. Light: soft overcast daylight with short shadows. Lens: three-quarter axonometric view, wide horizontal composition, generous quiet paper space at upper left. Palette: warm limestone paper, deep forest ink, mineral teal, coral route red, muted brass. Negative list: no people, no hands, no logos, no brand marks, no readable text, no numbers, no watermark, no glossy 3D SaaS style, no gradient blobs, no impossible tools.

Generated with the factory image model (`factory-image`) on 2026-08-28 using `/opt/fleet/lib/gen-image.sh`. The output is original project artwork. Source prompt and output are kept under `assets/src/`.

## Responsive decisions

At 390 px, the hero art moves below the first action, facts stack, job tabs become a horizontal scroll strip, and closeout rows become vertical field groups. Desktop keeps the job summary and route map beside the working panel. Nothing essential is hidden.
