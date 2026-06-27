# Philosophy

## Purpose

This document defines the operating philosophy behind DOYA OS.

The philosophy explains how the platform should think about restaurant work, AI assistance, human judgment, data, and system design.

## Problem

Restaurant operations are practical, time-sensitive, and context-heavy. Software that ignores this reality becomes difficult to trust.

Common failure modes include:

- Dashboards that display metrics without next actions.
- AI recommendations that do not show evidence.
- Workflows that assume ideal data quality.
- Interfaces that require managers to interpret too much during busy periods.
- Systems that optimize for automation before they understand the work.

DOYA OS needs a philosophy that prevents these patterns from becoming default behavior.

## Solution

DOYA OS should be built around five beliefs.

### Operations are the product

The product is not the dashboard, model, database, or interface. The product is the restaurant operating behavior that the system makes easier, clearer, and more consistent.

### AI assists accountable humans

AI may summarize, detect, recommend, draft, classify, forecast, and explain. It must not become the hidden owner of important restaurant decisions.

Material operational changes require a visible human owner, review path, and audit trail.

### Context is more valuable than output

An answer is useful only when the system knows the relevant location, business date, role, workflow, constraint, and operating history.

DOYA OS should invest in structured context before advanced automation.

### Clarity beats cleverness

Restaurant teams need systems that are understandable during real work. Interfaces, workflows, and AI behavior should be direct, inspectable, and predictable.

### The system must improve through use

Every decision, exception, correction, and outcome can become operating knowledge. DOYA OS should preserve that knowledge in ways that improve future workflows.

## User

This philosophy is for:

- Product managers defining what should be built.
- Designers translating workflows into interfaces.
- Engineers designing services and data models.
- AI contributors defining agent behavior.
- Operators validating whether the product matches restaurant reality.
- Reviewers evaluating whether a change fits the platform.

## Flow

Apply the philosophy during product and technical decisions:

1. Start with the restaurant workflow.
2. Identify who is accountable for the decision or action.
3. Identify the context required to make that decision well.
4. Decide what the system can safely automate, assist, or surface.
5. Make the evidence and review path visible.
6. Record outcomes so the workflow can improve.

When tradeoffs appear, prefer operational clarity over technical novelty.

## Architecture

The philosophy affects architecture in these ways:

- Database models should preserve operational context, not only analytics dimensions.
- Backend workflows should encode review, ownership, and state transitions.
- Frontend surfaces should show status, evidence, and next action together.
- AI systems should expose inputs, confidence boundaries, and escalation paths.
- API contracts should keep business meaning intact across systems.
- Prompt documents should define behavior in terms of role, context, and authority.
- Tests should include realistic restaurant scenarios and failure states.

## Future Extension

This philosophy should be revisited when DOYA OS adds new types of AI autonomy, multi-location control, financial workflows, or supplier integrations.

Future updates should clarify how much authority the system may take in each domain and what evidence is required for automation.

## Related Documents

- [Vision Bible](./README.md)
- [Mission](./01_Mission.md)
- [Vision](./02_Vision.md)
- [Core Principles](./04_Core_Principles.md)
- [Non-Goals](./07_Non_Goals.md)
- [Documentation Style Guide](../STYLE_GUIDE.md)
