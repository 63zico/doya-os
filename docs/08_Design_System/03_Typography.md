# Typography

## Purpose

This document defines typography for DOYA OS.

Typography controls hierarchy, readability, density, and scan speed across staff tasks, manager queues, owner dashboards, and settings.

## Problem

Restaurant operations require fast reading under pressure. Oversized marketing typography wastes space, while cramped type makes task execution and review risky.

DOYA OS needs typography that supports both mobile execution and dense management views.

## Solution

Use a system sans-serif stack with compact, readable hierarchy.

Typography should:

- Keep staff actions clear.
- Keep manager data scannable.
- Keep owner summaries calm.
- Use tabular numbers for metrics, counts, times, percentages, quantities, and statuses.
- Avoid decorative type.

## User

This document is for designers, frontend engineers, QA reviewers, and AI coding agents.

## Flow

1. Identify the surface type.
2. Choose the role density.
3. Apply the matching type token.
4. Check wrapping and truncation.
5. Test mobile and desktop sizes.

## Architecture

### Font model

| Token | Purpose |
| --- | --- |
| `font.family.sans` | Primary UI and documentation-like interface text. |
| `font.family.mono` | IDs, codes, timestamps when monospace improves scanning. |
| `font.feature.tabular` | Numbers in dashboards, tables, quantities, and badges. |

### Type scale

| Token | Size | Line height | Use |
| --- | --- | --- | --- |
| `text.display` | 32 | 40 | Rare owner overview headings only. |
| `text.title` | 24 | 32 | Page title. |
| `text.section` | 18 | 26 | Section heading. |
| `text.cardTitle` | 15 | 22 | Card and panel title. |
| `text.body` | 14 | 22 | Standard UI text. |
| `text.bodySmall` | 13 | 20 | Tables, metadata, supporting text. |
| `text.caption` | 12 | 16 | Labels, timestamps, helper text. |
| `text.control` | 14 | 20 | Button and form control text. |

### Weight

| Token | Weight | Use |
| --- | --- | --- |
| `font.weight.regular` | 400 | Standard body. |
| `font.weight.medium` | 500 | Labels, tabs, navigation. |
| `font.weight.semibold` | 600 | Card titles, important states. |
| `font.weight.bold` | 700 | Rare emphasis only. |

## Future Extension

Future typography work may add Korean and Vietnamese localization rules, numeric formatting rules by locale, and compact density variants for multi-store owner dashboards.

## Related Documents

- [Design Principles](./01_Design_Principles.md)
- [Mobile First](./10_Mobile_First.md)
- [Accessibility](./14_Accessibility.md)
- [Design Tokens](./15_Design_Tokens.md)
