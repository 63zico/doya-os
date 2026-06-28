# Dark Mode

## Purpose

This document defines dark mode for DOYA OS.

Dark mode should support low-light operations and owner or manager review without reducing status clarity.

## Problem

Dark mode can create contrast problems, muddy status colors, and unclear surfaces when it is created by simply inverting colors.

Restaurant staff may use the product in variable lighting. The system must preserve readability and state recognition.

## Solution

Use token-based dark mode with semantic color mapping.

Dark mode should:

- Preserve contrast.
- Keep semantic status color recognizable.
- Avoid pure black surfaces.
- Avoid saturated glowing accents.
- Maintain visible borders for cards, forms, and review queues.

## User

This document is for designers, frontend engineers, accessibility reviewers, and AI coding agents.

## Flow

1. Apply dark semantic tokens.
2. Check surface layering.
3. Check status colors.
4. Check focus rings and borders.
5. Test forms, dashboards, and evidence views.

## Architecture

### Dark mode components

| Component | Purpose | States | Variants | Spacing | Typography | Interaction | Accessibility | Future extensions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dark Surface | Provides app background and panels. | Base, subtle, raised, disabled. | Canvas, panel, card, drawer. | Same as light mode. | Same type scale. | No interaction by itself. | Contrast with text required. | Tenant theme overlay. |
| Dark Status Badge | Communicates state. | Pass, fail, review, pending, blocked. | Solid, subtle, outline. | Same as status badge. | `text.caption`, semibold. | Same as light mode. | Must pass contrast. | High-contrast mode. |
| Dark Form Control | Captures input. | Empty, focused, filled, error, disabled. | Standard, compact. | Same as form system. | Same as form system. | Focus ring must remain visible. | Error and helper text readable. | Native mobile dark mode. |
| Dark Evidence Viewer | Shows photos or records. | Loading, available, restricted, failed. | Photo, comparison. | Same as evidence card. | Captions readable. | Media controls visible. | Photo area must not obscure status. | Image brightness controls. |

### Surface layering

| Layer | Use |
| --- | --- |
| Canvas | App background. |
| Base | Main content panels. |
| Subtle | Secondary panels and toolbar regions. |
| Raised | Drawers, popovers, menus. |
| Overlay | Modal backdrop and focus state. |

## Future Extension

Future dark mode work may add high-contrast themes, per-device preference rules, and staff-specific night workflow testing.

## Related Documents

- [Color System](./02_Color_System.md)
- [Accessibility](./14_Accessibility.md)
- [Design Tokens](./15_Design_Tokens.md)
