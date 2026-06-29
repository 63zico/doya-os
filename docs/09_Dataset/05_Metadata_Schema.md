# Metadata Schema

## Purpose

This document defines the metadata schema for DOYA restaurant datasets.

Metadata makes images searchable, auditable, multilingual, brand-aware, store-aware, and usable for versioned benchmarks.

## Problem

Images without metadata cannot support reliable AI evaluation.

The same photo may mean different things depending on brand, store, zone, business date, angle, lighting, device, label, reviewer, and privacy state. Without a structured schema, datasets cannot scale to 100,000+ images or multiple brands.

## Solution

Store one metadata record for every image.

Metadata records must include:

- Organization, brand, and store scope.
- Image identity and storage location.
- Zone and workflow context.
- Label and issue taxonomy.
- Reviewer state.
- Multilingual notes.
- Privacy and retention status.
- Dataset version membership.
- Hashes and provenance.

## User

This document is for data engineers, backend engineers, AI engineers, privacy reviewers, and AI coding agents.

## Flow

1. Image is collected.
2. System creates initial metadata.
3. Reviewer adds label and issues.
4. Quality control validates required fields.
5. Privacy owner confirms retention status.
6. Dataset release references metadata IDs.

## Architecture

### JSON schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "DOYA Restaurant Image Metadata",
  "type": "object",
  "required": [
    "image_id",
    "organization_id",
    "brand_id",
    "store_id",
    "workflow",
    "zone",
    "storage",
    "capture",
    "label",
    "privacy",
    "review",
    "language",
    "created_at"
  ],
  "properties": {
    "image_id": { "type": "string", "format": "uuid" },
    "organization_id": { "type": "string" },
    "brand_id": { "type": "string" },
    "store_id": { "type": "string" },
    "workflow": {
      "type": "string",
      "enum": ["ai_closing", "inventory", "sop", "other"]
    },
    "zone": {
      "type": "string",
      "examples": ["kitchen_floor_drain", "refrigerator", "stove_grease", "hall_floor", "counter_pos"]
    },
    "storage": {
      "type": "object",
      "required": ["uri", "filename", "content_type", "sha256", "byte_size"],
      "properties": {
        "uri": { "type": "string" },
        "filename": { "type": "string" },
        "content_type": { "type": "string" },
        "sha256": { "type": "string" },
        "byte_size": { "type": "integer", "minimum": 1 },
        "width": { "type": "integer" },
        "height": { "type": "integer" }
      }
    },
    "capture": {
      "type": "object",
      "required": ["business_date", "captured_at", "angle", "lighting", "device_type"],
      "properties": {
        "business_date": { "type": "string", "format": "date" },
        "captured_at": { "type": "string", "format": "date-time" },
        "angle": { "type": "string" },
        "lighting": { "type": "string", "enum": ["bright", "normal", "dim", "mixed", "unknown"] },
        "device_type": { "type": "string" },
        "collector_role": { "type": "string" }
      }
    },
    "label": {
      "type": "object",
      "required": ["status", "issues", "severity"],
      "properties": {
        "status": { "type": "string", "enum": ["PASS", "FAIL", "HUMAN_REVIEW", "REJECTED"] },
        "issues": { "type": "array", "items": { "type": "string" } },
        "severity": { "type": "string", "enum": ["none", "low", "medium", "high", "critical"] },
        "expected_score_range": {
          "type": "array",
          "minItems": 2,
          "maxItems": 2,
          "items": { "type": "integer", "minimum": 0, "maximum": 100 }
        }
      }
    },
    "review": {
      "type": "object",
      "required": ["state", "reviewer_count"],
      "properties": {
        "state": { "type": "string", "enum": ["pending", "verified", "disputed", "rejected"] },
        "reviewer_count": { "type": "integer", "minimum": 0 },
        "reviewer_ids": { "type": "array", "items": { "type": "string" } },
        "adjudicator_id": { "type": "string" },
        "reviewed_at": { "type": "string", "format": "date-time" }
      }
    },
    "language": {
      "type": "object",
      "required": ["primary"],
      "properties": {
        "primary": { "type": "string", "examples": ["en", "ko", "vi"] },
        "notes": {
          "type": "object",
          "additionalProperties": { "type": "string" }
        }
      }
    },
    "privacy": {
      "type": "object",
      "required": ["contains_person", "contains_private_data", "retention_class", "consent_status"],
      "properties": {
        "contains_person": { "type": "boolean" },
        "contains_private_data": { "type": "boolean" },
        "redaction_required": { "type": "boolean" },
        "retention_class": { "type": "string", "enum": ["short_term", "evaluation", "benchmark", "delete"] },
        "consent_status": { "type": "string", "enum": ["not_required", "granted", "restricted", "unknown"] }
      }
    },
    "dataset": {
      "type": "object",
      "properties": {
        "split": { "type": "string", "enum": ["train", "validation", "benchmark", "hard_example", "prompt_example", "unassigned"] },
        "versions": { "type": "array", "items": { "type": "string" } },
        "hard_example_tags": { "type": "array", "items": { "type": "string" } }
      }
    },
    "created_at": { "type": "string", "format": "date-time" },
    "updated_at": { "type": "string", "format": "date-time" }
  }
}
```

### Multilingual metadata

Use `language.notes` for localized notes:

```json
{
  "primary": "vi",
  "notes": {
    "vi": "Sàn còn vệt nước gần lối đi chính.",
    "en": "Floor still has water streaks near the main walkway.",
    "ko": "주요 동선 근처 바닥에 물자국이 남아 있음."
  }
}
```

## Future Extension

Future schema versions may add bounding boxes, polygon masks, OCR text, redaction metadata, model prediction history, and reviewer calibration scores.

Schema changes must be versioned and backward compatible where possible.

## Related Documents

- [Directory Structure](./02_Directory_Structure.md)
- [Data Governance](./13_Data_Governance.md)
- [Dataset Versioning](./11_Dataset_Versioning.md)
