# Icons

## Purpose

This document defines icon usage for DOYA OS.

Icons improve scan speed, especially for status, navigation, and compact actions.

## Problem

Icons can become ambiguous when they are decorative, inconsistent, or not paired with text where meaning matters.

In operational workflows, icons must reinforce status and action, not replace critical labels.

## Solution

Use a consistent outline icon style with restrained weight and clear labels.

Icons are required for:

- Navigation.
- Status badges.
- Common commands.
- Review and evidence actions.
- Alerts and notifications.

## User

This document is for designers, frontend engineers, accessibility reviewers, and AI coding agents.

## Flow

1. Choose icon by semantic meaning.
2. Pair with visible text where meaning is critical.
3. Add accessible name for icon-only controls.
4. Confirm the icon remains clear at 16px and 20px.

## Architecture

### Icon components

| Component | Purpose | States | Variants | Spacing | Typography | Interaction | Accessibility | Future extensions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Navigation Icon | Helps module scanning. | Default, active, alert, disabled. | Dashboard, AI Manager, Closing, Inventory, Bonus, SOP, Settings. | 8 gap to label. | Label `text.bodySmall`. | Active state changes color and label weight. | Label remains available. | Collapsed nav. |
| Status Icon | Reinforces status. | Pass, fail, review, pending, blocked. | Badge, row, card. | 4 gap to label. | Uses status label typography. | Non-interactive. | Must not be sole status indicator. | Custom states. |
| Action Icon | Represents command. | Default, hover, pressed, disabled. | View, edit, approve, reject, upload, camera, archive. | Icon button 36 or 44 target. | Tooltip uses `text.caption`. | Icon-only actions require tooltip. | Accessible name required. | Keyboard shortcut hints. |
| AI Icon | Marks AI-generated context. | Generating, ready, review required, failed. | Badge, report, evidence. | 4 to 8 gap. | Label required. | Opens AI detail when actionable. | Must say "AI" in text or accessible name. | Model metadata popover. |

### Icon rules

- Use icons from one consistent outline family.
- Do not mix filled and outline styles casually.
- Use 16px icons for dense data and 20px for navigation.
- Use 24px only for mobile primary task surfaces or empty states.
- Never rely on an icon alone for destructive actions.

## Future Extension

Future icon work may add custom DOYA OS icons for restaurant-specific categories after the core icon system is stable.

## Related Documents

- [Button System](./08_Button_System.md)
- [Component Library](./05_Component_Library.md)
- [Accessibility](./14_Accessibility.md)
