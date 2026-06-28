# Color System

## Purpose

This document defines the DOYA OS color system.

It gives future UI work a stable palette for surfaces, text, borders, roles, statuses, and AI-related review states.

## Problem

Restaurant operations rely on quick status recognition. If color is decorative, inconsistent, or low contrast, staff may miss required actions and managers may misread risk.

The palette also must avoid becoming a one-note SaaS theme. DOYA OS needs a neutral operational base with restrained semantic color.

## Solution

Use neutral surfaces with semantic accents.

Color should communicate:

- Status.
- Priority.
- Role scope.
- Interactivity.
- Review state.
- Risk.

Color must not be the only signal. Labels, icons, shape, and position must also communicate meaning.

## User

This document is for product designers, frontend engineers, accessibility reviewers, and AI coding agents.

## Flow

1. Choose semantic role for the color.
2. Apply the matching token.
3. Confirm text contrast.
4. Add non-color status cues.
5. Test light and dark mode.

## Architecture

### Core palette

| Token | Purpose | Light value | Dark value |
| --- | --- | --- | --- |
| `color.surface.canvas` | App background | `#F7F8FA` | `#0E1116` |
| `color.surface.base` | Main panel surface | `#FFFFFF` | `#151922` |
| `color.surface.subtle` | Secondary panels | `#F1F3F5` | `#1C222D` |
| `color.text.primary` | Main text | `#111827` | `#F5F7FA` |
| `color.text.secondary` | Supporting text | `#4B5563` | `#AAB2C0` |
| `color.text.muted` | Low-emphasis text | `#6B7280` | `#7F8998` |
| `color.border.default` | Standard boundary | `#D8DEE6` | `#2A3340` |
| `color.border.strong` | Active boundary | `#AEB7C4` | `#465366` |

### Semantic palette

| Token | Purpose | Light value | Dark value |
| --- | --- | --- | --- |
| `color.intent.primary` | Primary action | `#2563EB` | `#5B8CFF` |
| `color.intent.success` | Pass, complete, healthy | `#16803C` | `#43C06D` |
| `color.intent.warning` | Needs attention | `#B7791F` | `#F2B84B` |
| `color.intent.danger` | Fail, critical, destructive | `#C2410C` | `#FF784F` |
| `color.intent.info` | Neutral information | `#0F766E` | `#4CC9BE` |
| `color.intent.ai` | AI review context | `#5B5BD6` | `#8B8CFF` |

### Status mapping

| Status | Color | Required non-color cue |
| --- | --- | --- |
| `PASS` | Success | Check icon and "Pass" label. |
| `FAIL` | Danger | Alert icon and "Fail" label. |
| `HUMAN_REVIEW` | Warning | Review icon and "Needs review" label. |
| `PENDING` | Info or muted | Clock icon and "Pending" label. |
| `BLOCKED` | Danger | Block icon and reason label. |
| `COMPLETE` | Success | Check icon and completion timestamp. |

## Future Extension

Future color work may add brand theming, per-tenant accent colors, chart palettes, and color-blind simulation results.

Brand theming must not override semantic status colors.

## Related Documents

- [Design Principles](./01_Design_Principles.md)
- [Dark Mode](./13_Dark_Mode.md)
- [Accessibility](./14_Accessibility.md)
- [Design Tokens](./15_Design_Tokens.md)
