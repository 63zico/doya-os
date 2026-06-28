# Animation

## Purpose

This document defines motion and animation for DOYA OS.

Animation should clarify state changes, not decorate the interface.

## Problem

Excessive motion slows operational software and can distract staff during service. No motion can make state changes feel abrupt or unclear.

DOYA OS needs restrained motion that supports task confidence, review transitions, and error recovery.

## Solution

Use short, functional motion.

Motion is allowed for:

- Loading and saving state.
- Panel entrance and exit.
- Status transition.
- Error reveal.
- Confirmation feedback.

Motion is not allowed as background decoration or marketing-style flourish.

## User

This document is for designers, frontend engineers, accessibility reviewers, and AI coding agents.

## Flow

1. Identify the state change.
2. Decide whether motion clarifies it.
3. Choose duration and easing.
4. Respect reduced motion preference.
5. Test that the interface remains usable without animation.

## Architecture

### Motion components

| Component | Purpose | States | Variants | Spacing | Typography | Interaction | Accessibility | Future extensions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Loading Indicator | Shows pending work. | Loading, retrying, stalled. | Inline, button, page. | 8 gap from label. | Matches parent text. | Avoid blocking unless required. | Announce loading state. | Skeleton variants. |
| Status Transition | Confirms workflow state change. | Pass, fail, review, complete. | Badge, row, card. | No layout shift. | Existing status typography. | Short transition after save. | Must be perceivable without motion. | Review timeline animation. |
| Drawer Motion | Shows contextual detail. | Opening, open, closing. | Mobile sheet, desktop drawer. | Uses layout spacing. | Existing panel type. | Escape and close button supported. | Respect reduced motion. | Split panel transitions. |
| Error Reveal | Displays validation or submission failure. | Inline, blocking. | Field, form, page. | 4 to 8 gap from affected control. | `text.caption` for field error. | Focus moves to first blocking issue. | Screen readers receive error text. | Error summary pattern. |

### Timing

| Token | Duration | Use |
| --- | --- | --- |
| `motion.fast` | 120ms | Button and small status feedback. |
| `motion.base` | 180ms | Drawer and panel transitions. |
| `motion.slow` | 240ms | Page-level skeleton reveal only. |

## Future Extension

Future motion work may add native mobile transition rules, offline sync feedback, and motion QA for low-performance devices.

## Related Documents

- [Mobile First](./10_Mobile_First.md)
- [Accessibility](./14_Accessibility.md)
- [Design Tokens](./15_Design_Tokens.md)
