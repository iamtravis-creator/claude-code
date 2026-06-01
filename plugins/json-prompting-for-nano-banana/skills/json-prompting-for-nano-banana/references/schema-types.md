# Schema Type Field Reference

Detailed field descriptions for all five JSON schema types used with Nano Banana Pro.

---

## 1. Marketing Image (`marketing_image`)

For product shots, hero images, brand photography, and advertising visuals.

### `meta`
- `spec_version` — Schema version (use `"1.0.0"`)
- `title` — Human-readable title for this spec
- `campaign` — Campaign or project identifier (slug format)
- `brand_name` — Brand or product name
- `usage_context` — Intended use: `"web"`, `"print"`, `"social"`, `"billboard"`

### `subject`
- `type` — Product category: `"product_can"`, `"product_bottle"`, `"product_box"`, `"device"`, etc.
- `name` — Full product name
- `variant` — Product variant/flavor/color
- `physical_properties.volume_oz` — Volume in fluid ounces (beverages)
- `physical_properties.dimensions` — Descriptive size (e.g., `"standard 12oz beverage can"`)
- `physical_properties.finish` — Surface finish: `"matte"`, `"glossy"`, `"metallic"`, `"frosted"`

### `props`
- `foreground[]` — Objects closest to camera (lime slices, garnishes, accessories)
- `midground[]` — Objects at product level (ice cubes, supporting props)
- `background[]` — Distant background elements
- Each prop: `type`, `count`, `position`, `notes`

### `environment`
- `surface.material` — Table/surface: `"glossy"`, `"matte"`, `"marble"`, `"wood"`, `"metal"`, `"glass"`
- `surface.reflection_strength` — 0.0 (no reflection) to 1.0 (mirror)
- `background.color` — Hex color value
- `background.texture` — `"smooth"`, `"gradient"`, `"pattern"`, `"bokeh_soft"`
- `atmosphere.mood` — Free-text mood description
- `atmosphere.keywords[]` — Mood keywords array

### `camera`
- `angle` — See common values in SKILL.md
- `framing` — See common values in SKILL.md
- `focal_length_mm` — Lens focal length (35 = wide, 50 = natural, 85–135 = portrait/product)
- `depth_of_field` — `"shallow"`, `"medium"`, `"deep"`

### `lighting`
- `key_light_direction` — Primary light direction
- `key_light_intensity` — Primary light intensity
- `fill_light_direction` — Fill/secondary light direction
- `fill_light_intensity` — Fill light intensity
- `rim_light` — Boolean; adds edge separation from background
- `color_temperature` — `"warm"`, `"neutral"`, `"cool"`

### `brand`
- `logo_asset` — Logo filename reference
- `primary_colors[]` — Array of hex values
- `must_match_assets[]` — Assets that must appear exactly
- `forbidden_changes[]` — Array of constraints (e.g., `"do_not_change_logo"`)

### `controls`
- `lock_subject_geometry` — Boolean; freeze product shape/size
- `lock_logo_and_label` — Boolean; freeze branding elements
- `allow_background_variation` — Boolean
- `allow_prop_relayout` — `"none"`, `"small_only"`, `"full"`

---

## 2. UI/UX (`ui_builder`)

For app screens, dashboards, websites, and interface mockups.

### `app`
- `platform` — `"web"`, `"mobile"`, `"tablet"`, `"desktop"`
- `fidelity` — `"wireframe"`, `"low-fi"`, `"mid-fi"`, `"hi-fi"`
- `viewport.width` / `viewport.height` — Pixel dimensions
- `theme` — `"light"`, `"dark"`, `"system"`

### `tokens`
- `color.primary` — Primary brand color (hex)
- `color.background` — Page/app background (hex)
- `color.surface` — Card/panel background (hex)
- `color.accent` — Accent/highlight color (hex)
- `typography.font_family` — Font: `"system_sans"`, `"system_serif"`, or named font
- `typography.headline_size` — Heading font size (px)
- `typography.body_size` — Body font size (px)
- `radius.sm/md/lg` — Border radius values (px)
- `spacing_scale[]` — Array of spacing values (px)

### `screens[]`
- `id` — Unique screen identifier
- `name` — Human-readable screen name
- `role` — `"primary"`, `"secondary"`, `"modal"`, `"onboarding"`
- `layout.containers[]` — Layout regions (see below)

### `containers[]`
- `id` — Unique container identifier
- `type` — `"stack"`, `"grid"`, `"absolute"`
- `subtype` — `"horizontal"`, `"vertical"`, `"column"`, `"row"`
- `region` — Named region: `"top_nav"`, `"sidebar"`, `"main_content"`, `"footer"`
- `children[]` — Array of component IDs placed in this container

### `components[]`
- `id` — Unique component identifier
- `screen_id` — Parent screen reference
- `container_id` — Parent container reference
- `component_type` — Element type: `"logo"`, `"nav_list"`, `"kpi_grid"`, `"line_chart"`, `"data_table"`, `"card"`, `"button"`, `"form"`, `"avatar"`, `"badge"`, etc.
- `props` — Component-specific properties (labels, values, columns, items)
- `data_binding` — Null for mockups; data source path for wired components

### `constraints`
- `layout_lock` — Boolean; prevent layout restructuring
- `theme_lock` — Boolean; prevent color/token changes
- `content_lock` — Boolean; prevent copy/label changes

---

## 3. Diagram (`diagram_spec`)

For flowcharts, architecture diagrams, process maps, and system visualizations.

### `canvas`
- `width` / `height` — Canvas dimensions (px)
- `unit` — `"px"`, `"mm"`, `"in"`
- `direction` — `"left_to_right"`, `"top_to_bottom"`, `"right_to_left"`, `"bottom_to_top"`

### `semantics`
- `diagram_type` — `"flowchart"`, `"architecture"`, `"sequence"`, `"swimlane"`, `"mindmap"`, `"org_chart"`
- `primary_relationship` — `"control_flow"`, `"data_flow"`, `"hierarchy"`, `"sequence"`
- `swimlanes[]` — Lane definitions for swimlane diagrams (id, label, color)

### `nodes[]`
- `id` — Unique node identifier
- `label` — Display text
- `role` — `"start"`, `"end"`, `"process"`, `"decision"`, `"database"`, `"actor"`, `"note"`
- `lane` — Swimlane ID (null if not using lanes)
- `group_id` — Group/cluster ID (null if not grouped)
- `position.x` / `position.y` — Canvas coordinates
- `size.width` / `size.height` — Node dimensions
- `style.shape` — `"rectangle"`, `"diamond"`, `"ellipse"`, `"parallelogram"`, `"cylinder"`
- `style.fill_color` / `style.border_color` — Hex values
- `data` — Arbitrary metadata object

### `edges[]`
- `id` — Unique edge identifier
- `from` — Source node ID
- `to` — Target node ID
- `label` — Edge label text (empty string for unlabeled)
- `style.line_type` — `"straight"`, `"orthogonal"`, `"curved"`
- `style.arrowhead` — `"standard"`, `"open"`, `"none"`, `"diamond"`, `"circle"`

### `groups[]`
- `id` — Group identifier
- `label` — Group label
- `node_ids[]` — Array of node IDs in this group
- `style` — Background color, border style

### `constraints`
- `layout_lock` — Boolean; freeze node positions
- `allow_auto_routing` — Boolean; allow edge path recalculation

---

## 4. Data Visualization (`data_viz`)

For charts and graphs where numerical accuracy is critical.

### `chart_type`
Values: `"bar"`, `"horizontal_bar"`, `"line"`, `"area"`, `"pie"`, `"donut"`, `"scatter"`, `"bubble"`, `"treemap"`, `"heatmap"`, `"radar"`

### `orientation`
`"vertical"` or `"horizontal"` (applies to bar charts)

### `canvas`
- `width` / `height` — Pixel dimensions
- `background_color` — Hex value

### `data_series[]`
- `id` — Series identifier
- `label` — Legend label
- `color` — Hex color for this series
- `data_points[]` — Array of `{label, value}` objects

### `axes`
- `x_axis.label` — Axis title
- `x_axis.show_gridlines` — Boolean
- `y_axis.label` — Axis title
- `y_axis.min` / `y_axis.max` — Axis range
- `y_axis.format` — `"number"`, `"currency"`, `"currency_millions"`, `"percentage"`
- `y_axis.show_gridlines` — Boolean
- `y_axis.gridline_color` — Hex value

### `annotations[]`
- `type` — `"data_label"`, `"callout"`, `"trend_line"`, `"reference_line"`, `"highlight"`
- `show` — Boolean
- `position` — `"above"`, `"below"`, `"inside"`, `"outside"`
- `format` — Display format string (e.g., `"$X.XM"`, `"X%"`)
- `target_series` / `target_point` — For callouts: which series and data point
- `text` — Callout text
- `style` — `"badge_green"`, `"badge_red"`, `"arrow"`, `"box"`

### `legend`
- `position` — `"top_right"`, `"top_left"`, `"bottom_center"`, `"right"`, `"none"`
- `orientation` — `"horizontal"`, `"vertical"`

### `style`
- `font_family` — Font name
- `title_size` / `label_size` — Font sizes (px)
- `bar_width` — Bar width as fraction of available space (0.0–1.0)
- `bar_gap` — Gap between grouped bars (0.0–1.0)
- `corner_radius` — Bar corner radius (px)

### `constraints`
- `data_lock` — Boolean; exact values must appear
- `exact_values[]` — Array of values that cannot change
- `allow_style_changes` — Boolean

---

## 5. Social Media Graphic (`social_graphic`)

For platform-specific social content with text overlays and brand elements.

### `platform`
Sets auto-dimensions: `"instagram_post"` (1080×1080), `"instagram_story"` (1080×1920), `"twitter_card"` (1200×675), `"linkedin_post"` (1200×627), `"youtube_thumbnail"` (1280×720), `"facebook_post"` (1200×630)

### `background`
- `type` — `"solid"`, `"gradient"`, `"image"`, `"pattern"`
- `color` — Hex value (for solid type)
- `gradient.direction` — `"diagonal_bottom_right"`, `"horizontal"`, `"vertical"`, `"radial"`
- `gradient.colors[]` — Array of hex values (start to end)
- `overlay.type` — `"noise"`, `"vignette"`, `"none"`
- `overlay.opacity` — 0.0–1.0

### `text_layers[]`
- `id` — Layer identifier
- `content` — Text string
- `position` — Named position (see common values in SKILL.md)
- `offset_y` — Vertical pixel offset from named position
- `style.font_family` / `style.font_weight` / `style.font_size` — Typography
- `style.color` — Hex or rgba text color
- `style.text_align` — `"left"`, `"center"`, `"right"`
- `style.max_width` — Max text width (px)
- `style.line_height` — Line height multiplier
- `style.background_color` — Optional pill/badge background (rgba or hex)
- `style.padding` — CSS-style padding string
- `style.border_radius` — Corner radius (px)

### `visual_elements[]`
- `id` — Element identifier
- `type` — `"image_placeholder"`, `"icon"`, `"shape"`, `"divider"`
- `position` — Named position
- `offset_y` — Vertical pixel offset
- `size.width` / `size.height` — Element dimensions
- `description` — Description for image placeholders
- `effects[]` — `"drop_shadow"`, `"subtle_glow"`, `"blur"`, `"outline"`

### `brand`
- `logo.asset` — Logo filename
- `logo.position` — Named position
- `logo.offset_y` — Vertical offset
- `logo.size.width` / `logo.size.height` — Logo dimensions
- `primary_colors[]` — Array of hex values
- `fonts[]` — Array of font names

### `constraints`
- `lock_text_content` — Boolean; prevent copy changes
- `lock_brand_elements` — Boolean; prevent logo/color changes
- `allow_color_variation` — Boolean
- `allow_layout_adjustment` — `"none"`, `"minor"`, `"full"`
