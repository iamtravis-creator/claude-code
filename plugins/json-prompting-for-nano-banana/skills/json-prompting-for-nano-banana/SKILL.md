---
name: json-prompting-for-nano-banana
description: This skill should be used when the user wants to "create a JSON schema for image generation", "generate a marketing image spec", "build a UI mockup schema", "create a diagram spec", "generate a data visualization schema", "design a social media graphic", or needs structured JSON prompts for Nano Banana Pro (Gemini 3 Pro Image). Use when the user wants reproducible, iterable image generation with precise control over elements, or wants to convert natural language descriptions into structured JSON specs.
version: 1.0.0
---

# JSON Prompting for Nano Banana Pro

Transform natural language descriptions into structured JSON schemas for precise, reproducible image generation with Nano Banana Pro (Gemini 3 Pro Image).

## Core Concept: Handles

Every important element gets a stable identifier (handle). Handles enable:

- **Scoped edits** — change only the background without affecting other elements
- **Camera moves** — same scene, different perspective
- **Themed variants** — same structure, different visual styling
- **A/B testing** — compare two versions differing by exactly one variable

## The Five Schema Types

| Schema | Root Key | Use For |
|---|---|---|
| Marketing Image | `marketing_image` | Product shots, hero images, brand photography, advertising |
| UI/UX | `ui_builder` | App screens, dashboards, websites, interface mockups |
| Diagram | `diagram_spec` | Flowcharts, architecture diagrams, process maps |
| Data Visualization | `data_viz` | Charts, graphs, statistical graphics with exact values |
| Social Media Graphic | `social_graphic` | Platform-specific social content with text overlays |

## Translator Workflow

### Step 1: Classify Intent

Determine the target schema:

| User talks about... | Schema |
|---|---|
| Product shots, hero images, brand photography | `marketing_image` |
| Screens, buttons, dashboards, apps, navigation | `ui_builder` |
| Flows, processes, systems, nodes, boxes-and-arrows | `diagram_spec` |
| Charts, graphs, data, statistics, metrics, numbers | `data_viz` |
| Instagram, Twitter, LinkedIn, social posts, thumbnails | `social_graphic` |

If ambiguous, ask 1-2 short clarifying questions before generating.

### Step 2: Gather Requirements

**Marketing Images:** subject (product type, name, size), props (foreground/midground/background), environment (surface, background, mood), camera angle and framing, lighting direction and intensity, brand constraints.

**UI/UX:** platform (web/mobile/desktop), number of screens and their roles, layout areas, key components, color scheme or brand guidelines.

**Diagrams:** diagram type, key nodes/steps, connections and labels, groupings or lanes, flow direction.

**Data Visualizations:** chart type, data series with actual values, axis labels and ranges, annotations or callouts, whether exact numbers must appear.

**Social Graphics:** target platform (determines dimensions), background style, text content (headline, subhead, CTA), brand elements, visual style/mood.

### Step 3: Generate JSON

Build a complete JSON object with the appropriate root key. Ensure:
- All IDs are unique within the document
- All cross-references between objects are valid
- Required fields are filled
- Output is valid JSON (no comments, no trailing commas)

### Step 4: Provide Next Steps

After outputting the JSON, tell the user:
1. Review the JSON to ensure it captures the intent
2. Copy the entire JSON block
3. Open Nano Banana Pro (Gemini app with "Thinking" model, or Google AI Studio)
4. Paste with instruction: `"Render this specification as a high-fidelity image"`
5. Iterate by modifying specific fields and re-rendering

## Common Values Reference

**Camera angles:** `front`, `three_quarter_front`, `three_quarter_back`, `side`, `top_down`, `low_angle`, `overhead`

**Framing:** `extreme_close_up`, `close_up`, `medium_close`, `medium`, `medium_wide`, `wide`

**Lighting intensity:** `very_low`, `low`, `medium`, `high`, `very_high`

**Lighting direction:** `left`, `right`, `front`, `back`, `top`, `three_quarter_left`, `three_quarter_right`

**Surface materials:** `glossy`, `matte`, `marble`, `wood`, `concrete`, `fabric`, `metal`, `glass`

**UI fidelity:** `wireframe`, `low-fi`, `mid-fi`, `hi-fi`

**UI platforms:** `web`, `mobile`, `tablet`, `desktop`

**Diagram types:** `flowchart`, `architecture`, `sequence`, `swimlane`, `mindmap`, `org_chart`

**Node roles:** `start`, `end`, `process`, `decision`, `database`, `actor`, `note`

**Chart types:** `bar`, `horizontal_bar`, `line`, `area`, `pie`, `donut`, `scatter`, `bubble`, `treemap`, `heatmap`, `radar`

**Social platforms:** `instagram_post` (1080×1080), `instagram_story` (1080×1920), `twitter_card` (1200×675), `linkedin_post` (1200×627), `youtube_thumbnail` (1280×720), `facebook_post` (1200×630)

**Text positions:** `top_left`, `top_center`, `top_right`, `center_left`, `center`, `center_right`, `bottom_left`, `bottom_center`, `bottom_right`

## Iteration Patterns

Once the user has a base JSON spec, guide scoped changes:

- **Lighting only (Marketing):** Modify only the `lighting` section
- **Camera angle only (Marketing):** Modify only `camera.angle` and optionally `camera.focal_length_mm`
- **Theme swap (UI):** Swap token colors, keep layout and components unchanged
- **Add a component (UI):** Add to `components` array with valid `screen_id` and `container_id`
- **Update data values (Data Viz):** Modify `data_series[].data_points` values only
- **Change chart type (Data Viz):** Swap `chart_type` while preserving data and axes
- **Platform resize (Social):** Change `platform` value; text layer positions may need tweaking
- **Color scheme swap (Social):** Modify `background.gradient.colors` and corresponding text colors

## Additional Resources

### Reference Files

- **`references/schema-types.md`** — Detailed field descriptions for all five schema types
- **`references/schema-examples.md`** — Complete, copy-ready JSON examples for all five schemas
