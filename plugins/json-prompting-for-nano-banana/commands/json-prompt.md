---
description: Generate a structured JSON schema for Nano Banana Pro image generation
---

Generate a complete, structured JSON schema for image generation with Nano Banana Pro (Gemini 3 Pro Image).

## Step 1 — Determine the request

If the user provided a description as an argument (e.g., `/json-prompt hero shot of a coffee can`), use that description directly and skip asking. Otherwise, ask:

> "What do you want to create? Describe your image, screen, diagram, chart, or graphic."

## Step 2 — Classify the schema type

Map the request to exactly one of these five types:

| Type | Best for |
|---|---|
| `marketing_image` | Product shots, hero images, brand photography, lifestyle photos |
| `ui_builder` | App screens, dashboards, websites, UI mockups |
| `diagram_spec` | Flowcharts, architecture diagrams, swimlane diagrams, process maps |
| `data_viz` | Charts and graphs that must display exact numeric data values |
| `social_graphic` | Platform-specific social content (Instagram, Twitter/X, LinkedIn, YouTube, Facebook) |

If the type is ambiguous, ask 1–2 short clarifying questions before proceeding. Do not ask more than 2.

## Step 3 — Gather requirements

Ask only the targeted questions for the classified schema type. Do not ask questions from other types.

### marketing_image
- What is the product type and name?
- Is there a specific variant, flavor, or SKU?
- What surface and background should the product rest on or appear against?
- Any props, garnishes, or accessories in the scene?
- What camera angle? (overhead, eye-level, 3/4, etc.)
- What lighting mood? (studio, moody, golden hour, high-key, etc.)
- Any brand constraints (colors, logo placement, do-not-cross zones)?

### ui_builder
- What platform? (web, iOS, Android, desktop)
- Which screens or states are needed?
- What layout areas should be present? (nav bar, sidebar, content area, footer, etc.)
- What are the key interactive components? (buttons, cards, tables, forms, etc.)
- What color scheme or design theme should be used?

### diagram_spec
- What type of diagram? (flowchart, architecture, swimlane, entity-relationship, sequence, etc.)
- List each node/step and its role or label.
- Describe the connections between nodes (what leads to what, and any conditions on edges).
- What flow direction? (top-to-bottom, left-to-right, etc.)

### data_viz
- What chart type? (bar, line, pie, scatter, heatmap, etc.)
- Provide the data series with their actual numeric values and series names.
- What are the axis labels and units?
- Must exact numeric values be annotated directly on the chart?

### social_graphic
- Which target platform? (Instagram post, Instagram Story, Twitter/X post, LinkedIn post, YouTube thumbnail, Facebook cover, etc.)
- What background style? (solid color, gradient, photographic image, illustrated, etc.)
- What text content? (headline, subheadline, call-to-action)
- Any brand elements to include? (logo, brand colors, handle/username)

## Step 4 — Generate the JSON schema

Using the gathered information, produce a complete JSON schema. Follow these rules:

1. **Every significant element must have a stable `id` field** (the "handles" concept). This lets the user request scoped edits later, e.g., "change only `lighting_rig`" or "update `cta_button` text".
2. All required fields for the chosen type must be present and filled with real values — no placeholder text like `"TBD"` or `"your value here"`.
3. Use snake_case for all keys.
4. Nest logically: top-level metadata, then a `spec` object containing the type-specific structure.

### Schema skeletons (expand with all gathered details)

**marketing_image**
```json
{
  "schema_version": "1.0",
  "type": "marketing_image",
  "id": "root",
  "metadata": {
    "id": "metadata",
    "product_name": "",
    "variant": "",
    "intended_use": ""
  },
  "spec": {
    "id": "spec",
    "subject": {
      "id": "subject",
      "product_type": "",
      "packaging": "",
      "variant": ""
    },
    "scene": {
      "id": "scene",
      "surface": "",
      "background": "",
      "props": []
    },
    "camera": {
      "id": "camera",
      "angle": "",
      "focal_length": "",
      "depth_of_field": ""
    },
    "lighting_rig": {
      "id": "lighting_rig",
      "mood": "",
      "key_light": "",
      "fill_light": "",
      "rim_light": ""
    },
    "brand_constraints": {
      "id": "brand_constraints",
      "primary_colors": [],
      "logo_placement": "",
      "exclusion_zones": []
    },
    "output": {
      "id": "output",
      "aspect_ratio": "",
      "resolution": "",
      "format": ""
    }
  }
}
```

**ui_builder**
```json
{
  "schema_version": "1.0",
  "type": "ui_builder",
  "id": "root",
  "metadata": {
    "id": "metadata",
    "platform": "",
    "app_name": "",
    "screen_name": ""
  },
  "spec": {
    "id": "spec",
    "canvas": {
      "id": "canvas",
      "width_px": 0,
      "height_px": 0,
      "theme": "",
      "primary_color": "",
      "background_color": ""
    },
    "layout": {
      "id": "layout",
      "regions": []
    },
    "components": []
  }
}
```

**diagram_spec**
```json
{
  "schema_version": "1.0",
  "type": "diagram_spec",
  "id": "root",
  "metadata": {
    "id": "metadata",
    "title": "",
    "diagram_type": "",
    "flow_direction": ""
  },
  "spec": {
    "id": "spec",
    "nodes": [],
    "edges": [],
    "style": {
      "id": "style",
      "node_shape": "",
      "color_scheme": "",
      "font": ""
    }
  }
}
```

**data_viz**
```json
{
  "schema_version": "1.0",
  "type": "data_viz",
  "id": "root",
  "metadata": {
    "id": "metadata",
    "title": "",
    "chart_type": ""
  },
  "spec": {
    "id": "spec",
    "axes": {
      "id": "axes",
      "x": { "id": "x_axis", "label": "", "unit": "" },
      "y": { "id": "y_axis", "label": "", "unit": "" }
    },
    "series": [],
    "annotations": {
      "id": "annotations",
      "show_data_labels": false,
      "show_legend": true
    },
    "style": {
      "id": "style",
      "color_palette": [],
      "background_color": "",
      "grid_lines": true
    }
  }
}
```

**social_graphic**
```json
{
  "schema_version": "1.0",
  "type": "social_graphic",
  "id": "root",
  "metadata": {
    "id": "metadata",
    "platform": "",
    "format": ""
  },
  "spec": {
    "id": "spec",
    "canvas": {
      "id": "canvas",
      "width_px": 0,
      "height_px": 0
    },
    "background": {
      "id": "background",
      "style": "",
      "colors": [],
      "image_description": ""
    },
    "text_layers": [],
    "brand_elements": {
      "id": "brand_elements",
      "logo": { "id": "logo", "placement": "", "size_percent": 0 },
      "handle": "",
      "brand_colors": []
    }
  }
}
```

Fill in every field with the values from Step 3 before outputting.

## Step 5 — Output the schema

Present the completed JSON in a fenced code block:

```json
{ ... }
```

Then tell the user:

> Copy this JSON and paste it into Nano Banana Pro (Gemini app with Thinking model, or Google AI Studio) with the instruction: **Render this specification as a high-fidelity image**

## Step 6 — Offer to iterate

Ask:

> Want to change anything? Describe what to adjust and I'll update just that section. You can reference elements by their `id` (for example, "change `lighting_rig` to golden hour" or "update `cta_button` text to 'Shop Now'").

When the user requests a scoped edit, return only the updated JSON with the changed fields — do not ask all the setup questions again.
