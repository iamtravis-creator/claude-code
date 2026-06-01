# JSON Prompting for Nano Banana

A structured prompting plugin for Nano Banana Pro (Gemini 3 Pro Image) that converts natural language descriptions into precise, reproducible JSON specifications for AI image generation.

## Overview

Instead of writing free-form prose prompts that produce unpredictable and difficult-to-iterate results, this plugin lets you describe what you want in plain language and generates a structured JSON spec that gives you precise, reproducible control over every element of the generated image. Paste the output directly into Nano Banana Pro and get consistent, high-fidelity results you can refine field by field rather than rewriting your prompt from scratch.

## Philosophy

Free-form prose prompts are hard to control and impossible to maintain. When you write "a product shot of a lime seltzer can on a bed of ice with warm lighting and a dark background," you get something different every time. Change one word and everything shifts.

Structured JSON prompting solves this by giving every visual element a stable handle — a named, addressable field you can update independently:

- **Reproducibility**: the same spec produces the same result every time
- **Scoped edits**: handles let you say "change only the lighting" without touching anything else
- **Iteration speed**: modify one field, re-render; no need to rewrite the whole prompt
- **Brand consistency**: lock your brand elements and allow style variation around them

## Command: `/json-prompt`

Generates a complete, ready-to-use JSON specification from a natural language description.

**Usage:**
```
/json-prompt hero shot of a lime seltzer can on ice
```

Or start with no arguments to be guided interactively:
```
/json-prompt
```

The command asks a small set of clarifying questions — schema type, dimensions, brand constraints, mood — then outputs a complete JSON spec ready to paste into Nano Banana Pro. Once you have the spec, open Nano Banana Pro (the Gemini app with the Thinking model, or Google AI Studio) and paste it with:

> "Render this specification as a high-fidelity image."

## Schema Types

| Schema | Root Key | Best For |
|---|---|---|
| Marketing Image | `marketing_image` | Product shots, hero images, brand photography, ads |
| UI/UX | `ui_builder` | App screens, dashboards, websites, mockups |
| Diagram | `diagram_spec` | Flowcharts, architecture diagrams, process maps |
| Data Visualization | `data_viz` | Charts and graphs with exact numeric values |
| Social Media Graphic | `social_graphic` | Instagram, Twitter, LinkedIn, YouTube thumbnails |

### Social Media Graphic Platforms

The `social_graphic` schema supports the following platform presets with built-in dimensions:

| Platform | Dimensions |
|---|---|
| `instagram_post` | 1080 × 1080 |
| `instagram_story` | 1080 × 1920 |
| `twitter_card` | 1200 × 675 |
| `linkedin_post` | 1200 × 627 |
| `youtube_thumbnail` | 1280 × 720 |
| `facebook_post` | 1200 × 630 |

## Agents

### `schema-refiner`

**Purpose**: Makes surgical edits to an existing JSON spec based on plain-language change requests.

**When to use**: After you have a generated spec and want to iterate without regenerating from scratch.

**How to use**: Share your existing spec and describe what you want changed:

- "Change only the lighting to warm golden hour"
- "Swap the background to dark mode"
- "Update the revenue figures to Q2 actuals"
- "Lock the logo position and vary the background color"

The `schema-refiner` agent modifies only the specific fields you asked about and respects any elements marked as locked in the spec. Everything else stays exactly as it was.

## How to Use This Plugin

1. Install the plugin with Claude Code
2. Run `/json-prompt` with a description, or describe what you want in chat
3. Answer any clarifying questions about schema type, dimensions, and style
4. Copy the generated JSON spec
5. Open Nano Banana Pro (Gemini app with Thinking model enabled, or Google AI Studio)
6. Paste the spec with the prompt: "Render this specification as a high-fidelity image"
7. Iterate using the `schema-refiner` agent — describe what to change, get an updated spec, re-render

## When to Use This Plugin

**Use for:**
- Product and marketing images where brand consistency matters
- Any image you will need to render more than once
- Scenes with multiple distinct elements you want to control independently
- Social graphics where you need exact platform dimensions
- Data visualizations where numeric precision is required

**Don't use for:**
- One-off images with no iteration planned
- Purely abstract or purely artistic images with no structural elements
- Cases where full creative randomness is the goal

## Author

Travis Studios (travis.m.studios@gmail.com)

## Version

1.0.0
