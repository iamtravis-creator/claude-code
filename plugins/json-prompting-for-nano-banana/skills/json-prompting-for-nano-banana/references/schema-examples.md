# Complete JSON Schema Examples

Five copy-ready examples — one per schema type — for use with Nano Banana Pro.

---

## Example 1: Marketing Image (Aurora Lime Hero Can Shot)

```json
{
  "marketing_image": {
    "meta": {
      "spec_version": "1.0.0",
      "title": "Aurora Lime Hero Can Shot",
      "campaign": "aurora_lime_launch",
      "brand_name": "Aurora Lime",
      "usage_context": "web"
    },
    "subject": {
      "type": "product_can",
      "name": "Aurora Lime Seltzer",
      "variant": "Original Lime",
      "physical_properties": {
        "volume_oz": 12,
        "dimensions": "standard 12oz beverage can",
        "finish": "matte"
      }
    },
    "props": {
      "foreground": [
        {
          "type": "lime_slice",
          "count": 3,
          "position": "front_left",
          "notes": "fresh lime slices, visible pulp and rind"
        }
      ],
      "midground": [
        {
          "type": "ice_cube",
          "count": 12,
          "position": "around_base",
          "notes": "partially melted, small reflections"
        }
      ],
      "background": []
    },
    "environment": {
      "surface": {
        "material": "glossy",
        "reflection_strength": 0.7
      },
      "background": {
        "color": "#003b47",
        "texture": "smooth",
        "effect": "bokeh_soft"
      },
      "atmosphere": {
        "mood": "refreshing, premium, night-time bar feel",
        "keywords": ["sparkling", "cool", "luminous", "evening"]
      }
    },
    "camera": {
      "angle": "three_quarter_front",
      "framing": "medium_close",
      "focal_length_mm": 50,
      "depth_of_field": "medium"
    },
    "lighting": {
      "key_light_direction": "right",
      "key_light_intensity": "high",
      "fill_light_direction": "left",
      "fill_light_intensity": "low",
      "rim_light": false,
      "color_temperature": "neutral"
    },
    "brand": {
      "logo_asset": "aurora_lime_logo.png",
      "primary_colors": ["#00ffc2", "#003b47"],
      "must_match_assets": ["aurora_lime_logo.png"],
      "forbidden_changes": [
        "do_not_change_logo",
        "do_not_change_brand_name"
      ]
    },
    "controls": {
      "lock_subject_geometry": true,
      "lock_logo_and_label": true,
      "allow_background_variation": false,
      "allow_prop_relayout": "small_only"
    }
  }
}
```

---

## Example 2: UI/UX (Acme Analytics Dashboard)

```json
{
  "ui_builder": {
    "meta": {
      "spec_version": "1.0.0",
      "name": "Acme Analytics Dashboard",
      "description": "Marketing analytics dashboard",
      "author": "",
      "tags": ["analytics", "marketing", "dashboard"]
    },
    "app": {
      "platform": "web",
      "fidelity": "hi-fi",
      "viewport": {
        "width": 1440,
        "height": 900
      },
      "theme": "light"
    },
    "tokens": {
      "color": {
        "primary": "#2563EB",
        "background": "#F9FAFB",
        "surface": "#FFFFFF",
        "accent": "#10B981"
      },
      "typography": {
        "font_family": "system_sans",
        "headline_size": 20,
        "body_size": 14
      },
      "radius": {
        "sm": 4,
        "md": 8,
        "lg": 12
      },
      "spacing_scale": [0, 4, 8, 12, 16, 24, 32]
    },
    "screens": [
      {
        "id": "screen_dashboard",
        "name": "Dashboard",
        "role": "primary",
        "layout": {
          "containers": [
            {
              "id": "container_top_nav",
              "type": "stack",
              "subtype": "horizontal",
              "region": "top_nav",
              "children": ["comp_logo", "comp_avatar"]
            },
            {
              "id": "container_sidebar",
              "type": "stack",
              "subtype": "vertical",
              "region": "sidebar",
              "children": ["comp_nav_list"]
            },
            {
              "id": "container_content",
              "type": "grid",
              "subtype": "column",
              "region": "main_content",
              "children": ["comp_kpi_grid", "comp_traffic_chart", "comp_campaigns_table"]
            }
          ]
        }
      }
    ],
    "components": [
      {
        "id": "comp_logo",
        "screen_id": "screen_dashboard",
        "container_id": "container_top_nav",
        "component_type": "logo",
        "props": {"text": "Acme Analytics"},
        "data_binding": null
      },
      {
        "id": "comp_nav_list",
        "screen_id": "screen_dashboard",
        "container_id": "container_sidebar",
        "component_type": "nav_list",
        "props": {
          "items": [
            {"label": "Overview", "icon": "home", "active": true},
            {"label": "Channels", "icon": "bar_chart"},
            {"label": "Settings", "icon": "gear"}
          ]
        },
        "data_binding": null
      },
      {
        "id": "comp_kpi_grid",
        "screen_id": "screen_dashboard",
        "container_id": "container_content",
        "component_type": "kpi_grid",
        "props": {
          "columns": 3,
          "cards": [
            {"label": "Sessions", "value": "124,983"},
            {"label": "Signups", "value": "3,942"},
            {"label": "Conversion", "value": "3.2%"}
          ]
        },
        "data_binding": null
      },
      {
        "id": "comp_traffic_chart",
        "screen_id": "screen_dashboard",
        "container_id": "container_content",
        "component_type": "line_chart",
        "props": {"title": "Daily Traffic (Last 30 Days)"},
        "data_binding": null
      },
      {
        "id": "comp_campaigns_table",
        "screen_id": "screen_dashboard",
        "container_id": "container_content",
        "component_type": "data_table",
        "props": {
          "title": "Active Campaigns",
          "columns": ["Campaign", "Spend", "Clicks", "CPC"]
        },
        "data_binding": null
      }
    ],
    "constraints": {
      "layout_lock": true,
      "theme_lock": false,
      "content_lock": false
    }
  }
}
```

---

## Example 3: Diagram (User Signup Flowchart)

```json
{
  "diagram_spec": {
    "meta": {
      "spec_version": "1.0.0",
      "title": "User Signup Flow",
      "description": "End-to-end signup process",
      "author": "",
      "tags": ["signup", "user-flow"]
    },
    "canvas": {
      "width": 1920,
      "height": 600,
      "unit": "px",
      "direction": "left_to_right"
    },
    "semantics": {
      "diagram_type": "flowchart",
      "primary_relationship": "control_flow",
      "swimlanes": []
    },
    "nodes": [
      {
        "id": "node_start",
        "label": "Start",
        "role": "start",
        "lane": null,
        "group_id": null,
        "position": {"x": 50, "y": 260},
        "size": {"width": 80, "height": 80},
        "style": {
          "shape": "ellipse",
          "fill_color": "#10B981",
          "border_color": "#059669"
        },
        "data": {}
      },
      {
        "id": "node_landing",
        "label": "Visit Landing Page",
        "role": "process",
        "lane": null,
        "group_id": null,
        "position": {"x": 200, "y": 250},
        "size": {"width": 180, "height": 100},
        "style": {
          "shape": "rectangle",
          "fill_color": "#FFFFFF",
          "border_color": "#111827"
        },
        "data": {}
      },
      {
        "id": "node_signup_form",
        "label": "Complete Signup Form",
        "role": "process",
        "lane": null,
        "group_id": null,
        "position": {"x": 450, "y": 250},
        "size": {"width": 180, "height": 100},
        "style": {
          "shape": "rectangle",
          "fill_color": "#FFFFFF",
          "border_color": "#111827"
        },
        "data": {}
      },
      {
        "id": "node_email_valid",
        "label": "Email Valid?",
        "role": "decision",
        "lane": null,
        "group_id": null,
        "position": {"x": 700, "y": 250},
        "size": {"width": 120, "height": 100},
        "style": {
          "shape": "diamond",
          "fill_color": "#FEF3C7",
          "border_color": "#D97706"
        },
        "data": {}
      },
      {
        "id": "node_send_verification",
        "label": "Send Verification Email",
        "role": "process",
        "lane": null,
        "group_id": null,
        "position": {"x": 900, "y": 250},
        "size": {"width": 180, "height": 100},
        "style": {
          "shape": "rectangle",
          "fill_color": "#FFFFFF",
          "border_color": "#111827"
        },
        "data": {}
      },
      {
        "id": "node_activate",
        "label": "Activate Account",
        "role": "process",
        "lane": null,
        "group_id": null,
        "position": {"x": 1150, "y": 250},
        "size": {"width": 180, "height": 100},
        "style": {
          "shape": "rectangle",
          "fill_color": "#D1FAE5",
          "border_color": "#059669"
        },
        "data": {}
      },
      {
        "id": "node_end",
        "label": "End",
        "role": "end",
        "lane": null,
        "group_id": null,
        "position": {"x": 1400, "y": 260},
        "size": {"width": 80, "height": 80},
        "style": {
          "shape": "ellipse",
          "fill_color": "#111827",
          "border_color": "#111827"
        },
        "data": {}
      }
    ],
    "edges": [
      {"id": "edge_1", "from": "node_start", "to": "node_landing", "label": "", "style": {"line_type": "straight", "arrowhead": "standard"}},
      {"id": "edge_2", "from": "node_landing", "to": "node_signup_form", "label": "", "style": {"line_type": "straight", "arrowhead": "standard"}},
      {"id": "edge_3", "from": "node_signup_form", "to": "node_email_valid", "label": "", "style": {"line_type": "straight", "arrowhead": "standard"}},
      {"id": "edge_4", "from": "node_email_valid", "to": "node_send_verification", "label": "Yes", "style": {"line_type": "straight", "arrowhead": "standard"}},
      {"id": "edge_5", "from": "node_email_valid", "to": "node_signup_form", "label": "No", "style": {"line_type": "orthogonal", "arrowhead": "standard"}},
      {"id": "edge_6", "from": "node_send_verification", "to": "node_activate", "label": "", "style": {"line_type": "straight", "arrowhead": "standard"}},
      {"id": "edge_7", "from": "node_activate", "to": "node_end", "label": "", "style": {"line_type": "straight", "arrowhead": "standard"}}
    ],
    "groups": [],
    "legend": {
      "items": [
        {"label": "Process", "shape": "rectangle", "fill_color": "#FFFFFF"},
        {"label": "Decision", "shape": "diamond", "fill_color": "#FEF3C7"},
        {"label": "Success", "shape": "rectangle", "fill_color": "#D1FAE5"}
      ]
    },
    "constraints": {
      "layout_lock": false,
      "allow_auto_routing": true
    }
  }
}
```

---

## Example 4: Data Visualization (Q4 Revenue by Region)

```json
{
  "data_viz": {
    "meta": {
      "spec_version": "1.0.0",
      "title": "Q4 2024 Revenue by Region",
      "description": "Bar chart comparing regional revenue performance",
      "author": "Finance Team"
    },
    "chart_type": "bar",
    "orientation": "vertical",
    "canvas": {
      "width": 1200,
      "height": 800,
      "background_color": "#FFFFFF"
    },
    "data_series": [
      {
        "id": "revenue_q4",
        "label": "Q4 2024 Revenue",
        "color": "#2563EB",
        "data_points": [
          {"label": "North America", "value": 4250000},
          {"label": "Europe", "value": 3180000},
          {"label": "Asia Pacific", "value": 2890000},
          {"label": "Latin America", "value": 1420000},
          {"label": "Middle East", "value": 890000}
        ]
      },
      {
        "id": "revenue_q3",
        "label": "Q3 2024 Revenue",
        "color": "#93C5FD",
        "data_points": [
          {"label": "North America", "value": 3950000},
          {"label": "Europe", "value": 2980000},
          {"label": "Asia Pacific", "value": 2650000},
          {"label": "Latin America", "value": 1280000},
          {"label": "Middle East", "value": 750000}
        ]
      }
    ],
    "axes": {
      "x_axis": {
        "label": "Region",
        "show_gridlines": false
      },
      "y_axis": {
        "label": "Revenue (USD)",
        "min": 0,
        "max": 5000000,
        "format": "currency_millions",
        "show_gridlines": true,
        "gridline_color": "#E5E7EB"
      }
    },
    "annotations": [
      {
        "type": "data_label",
        "show": true,
        "position": "above",
        "format": "$X.XM"
      },
      {
        "type": "callout",
        "target_series": "revenue_q4",
        "target_point": "North America",
        "text": "+7.6% vs Q3",
        "style": "badge_green"
      }
    ],
    "legend": {
      "position": "top_right",
      "orientation": "horizontal"
    },
    "style": {
      "font_family": "Inter",
      "title_size": 24,
      "label_size": 12,
      "bar_width": 0.35,
      "bar_gap": 0.1,
      "corner_radius": 4
    },
    "constraints": {
      "data_lock": true,
      "exact_values": [4250000, 3180000, 2890000, 1420000, 890000],
      "allow_style_changes": true
    }
  }
}
```

---

## Example 5: Social Media Graphic (Instagram Product Launch)

```json
{
  "social_graphic": {
    "meta": {
      "spec_version": "1.0.0",
      "title": "Product Launch Announcement",
      "campaign": "spring_2025_launch",
      "brand_name": "Acme Tech"
    },
    "platform": "instagram_post",
    "dimensions": {
      "width": 1080,
      "height": 1080,
      "unit": "px"
    },
    "background": {
      "type": "gradient",
      "gradient": {
        "direction": "diagonal_bottom_right",
        "colors": ["#1E3A8A", "#7C3AED", "#EC4899"]
      },
      "overlay": {
        "type": "noise",
        "opacity": 0.05
      }
    },
    "text_layers": [
      {
        "id": "headline",
        "content": "Introducing AcmePod Pro",
        "position": "center",
        "offset_y": -120,
        "style": {
          "font_family": "Montserrat",
          "font_weight": "bold",
          "font_size": 64,
          "color": "#FFFFFF",
          "text_align": "center",
          "max_width": 900,
          "line_height": 1.1
        }
      },
      {
        "id": "subhead",
        "content": "Sound reimagined. Silence perfected.",
        "position": "center",
        "offset_y": 0,
        "style": {
          "font_family": "Montserrat",
          "font_weight": "medium",
          "font_size": 28,
          "color": "#E0E7FF",
          "text_align": "center",
          "max_width": 800
        }
      },
      {
        "id": "cta",
        "content": "Available March 15 →",
        "position": "bottom_center",
        "offset_y": -80,
        "style": {
          "font_family": "Montserrat",
          "font_weight": "semibold",
          "font_size": 22,
          "color": "#FFFFFF",
          "background_color": "rgba(255,255,255,0.15)",
          "padding": "12px 24px",
          "border_radius": 24,
          "text_align": "center"
        }
      }
    ],
    "visual_elements": [
      {
        "id": "product_image",
        "type": "image_placeholder",
        "position": "center",
        "offset_y": 100,
        "size": {"width": 400, "height": 400},
        "description": "AcmePod Pro earbuds in floating arrangement",
        "effects": ["drop_shadow", "subtle_glow"]
      }
    ],
    "brand": {
      "logo": {
        "asset": "acme_logo_white.png",
        "position": "top_center",
        "offset_y": 60,
        "size": {"width": 120, "height": 40}
      },
      "primary_colors": ["#1E3A8A", "#7C3AED"],
      "fonts": ["Montserrat"]
    },
    "style": {
      "mood": "premium",
      "keywords": ["modern", "sleek", "bold", "tech"]
    },
    "constraints": {
      "lock_text_content": true,
      "lock_brand_elements": true,
      "allow_color_variation": false,
      "allow_layout_adjustment": "minor"
    }
  }
}
```
