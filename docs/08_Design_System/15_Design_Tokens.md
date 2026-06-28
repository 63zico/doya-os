# Design Tokens

## Purpose

This document defines the design token model for DOYA OS.

Tokens give designers and future implementers stable names for color, typography, spacing, radius, border, elevation, motion, and state.

## Problem

Without tokens, DOYA OS design decisions become scattered across screens and future code. That makes light mode, dark mode, accessibility, and component consistency harder to maintain.

The system needs names before implementation values become permanent.

## Solution

Use semantic tokens, not raw visual choices.

Tokens should describe purpose:

- `color.intent.success`
- `space.4`
- `radius.card`
- `text.body`
- `motion.fast`

They should not describe one-off screen details.

## User

This document is for product designers, frontend engineers, design system maintainers, and AI coding agents.

## Flow

1. Define semantic purpose.
2. Assign token name.
3. Map light and dark values where relevant.
4. Use token in component documentation.
5. Update token contract before implementation changes.

## Architecture

### Color tokens

| Token | Purpose |
| --- | --- |
| `color.surface.canvas` | App background. |
| `color.surface.base` | Main content surface. |
| `color.surface.subtle` | Secondary surface. |
| `color.text.primary` | Main readable text. |
| `color.text.secondary` | Supporting text. |
| `color.text.muted` | Low-emphasis metadata. |
| `color.border.default` | Standard boundary. |
| `color.intent.primary` | Primary action. |
| `color.intent.success` | Pass or complete. |
| `color.intent.warning` | Needs attention or review. |
| `color.intent.danger` | Fail or destructive. |
| `color.intent.ai` | AI-generated or AI-review context. |

### Typography tokens

| Token | Purpose |
| --- | --- |
| `font.family.sans` | Primary UI text. |
| `font.family.mono` | IDs, codes, timestamps. |
| `text.display` | Rare owner overview heading. |
| `text.title` | Page title. |
| `text.section` | Section title. |
| `text.cardTitle` | Card title. |
| `text.body` | Main body. |
| `text.bodySmall` | Dense body. |
| `text.caption` | Metadata, labels, helper text. |
| `text.control` | Button and control labels. |

### Spacing tokens

| Token | Value | Purpose |
| --- | --- | --- |
| `space.1` | 4 | Tight details. |
| `space.2` | 8 | Control gaps. |
| `space.3` | 12 | Compact component spacing. |
| `space.4` | 16 | Standard component padding. |
| `space.5` | 20 | Panel spacing. |
| `space.6` | 24 | Section spacing. |
| `space.8` | 32 | Large layout separation. |

### Radius tokens

| Token | Value | Purpose |
| --- | --- | --- |
| `radius.control` | 6 | Buttons, inputs, compact controls. |
| `radius.card` | 8 | Standard cards and panels. |
| `radius.badge` | Full | Badges and pills only. |

### Border and elevation tokens

| Token | Purpose |
| --- | --- |
| `border.default` | Standard card and form boundary. |
| `border.strong` | Active or focused boundary. |
| `elevation.none` | Default flat surfaces. |
| `elevation.overlay` | Drawers, popovers, menus. |
| `elevation.modal` | Blocking overlays only. |

### Motion tokens

| Token | Duration | Purpose |
| --- | --- | --- |
| `motion.fast` | 120ms | Small feedback. |
| `motion.base` | 180ms | Panels and drawers. |
| `motion.slow` | 240ms | Page-level skeleton reveal. |

### State tokens

| Token | Meaning |
| --- | --- |
| `state.pass` | AI or human-approved pass state. |
| `state.fail` | Failed state requiring correction or review. |
| `state.humanReview` | Human review required. |
| `state.pending` | Awaiting system or user action. |
| `state.blocked` | Cannot proceed until issue is resolved. |
| `state.complete` | Workflow is complete. |

## Future Extension

Future token work may add implementation mapping, Figma variables, platform-specific token exports, localization-aware typography, and tenant theme overlays.

## Related Documents

- [Color System](./02_Color_System.md)
- [Typography](./03_Typography.md)
- [Grid System](./04_Grid_System.md)
- [Dark Mode](./13_Dark_Mode.md)
- [Accessibility](./14_Accessibility.md)
