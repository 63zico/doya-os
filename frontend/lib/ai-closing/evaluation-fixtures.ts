import type { ClosingArea } from "@/lib/ai-closing-data";
import type {
  ExpectedScoreRange,
  FixtureExpectation,
} from "@/lib/ai-closing/calibration";

export type AiEvaluationFixture = FixtureExpectation & {
  id: string;
  label: string;
  area: ClosingArea;
  zoneId: string;
  image_placeholder: string;
  notes: string;
};

export const aiEvaluationFixtures = [
  {
    id: "kitchen_floor_clean",
    label: "Kitchen floor clean",
    area: "kitchen",
    zoneId: "kitchen-floor-drain",
    image_placeholder: "/fixtures/ai-closing/kitchen_floor_clean.png",
    expected_status: "PASS",
    expected_score_range: [85, 100] as ExpectedScoreRange,
    expected_detected_issues: [],
    notes:
      "Floor and drain area should appear dry, clear, and free of visible debris.",
  },
  {
    id: "kitchen_floor_dirty",
    label: "Kitchen floor dirty",
    area: "kitchen",
    zoneId: "kitchen-floor-drain",
    image_placeholder: "/fixtures/ai-closing/kitchen_floor_dirty.png",
    expected_status: "FAIL",
    expected_score_range: [0, 55] as ExpectedScoreRange,
    expected_detected_issues: ["visible debris", "wet floor residue"],
    notes:
      "A dirty kitchen floor is a high-risk false-pass fixture because staff can correct it before closing.",
  },
  {
    id: "refrigerator_clean",
    label: "Refrigerator clean",
    area: "kitchen",
    zoneId: "kitchen-refrigerator",
    image_placeholder: "/fixtures/ai-closing/refrigerator_clean.png",
    expected_status: "PASS",
    expected_score_range: [82, 100] as ExpectedScoreRange,
    expected_detected_issues: [],
    notes:
      "Shelves should be visible, organized, and free of spills or unlabeled residue.",
  },
  {
    id: "refrigerator_dirty",
    label: "Refrigerator dirty",
    area: "kitchen",
    zoneId: "kitchen-refrigerator",
    image_placeholder: "/fixtures/ai-closing/refrigerator_dirty.png",
    expected_status: "FAIL",
    expected_score_range: [0, 55] as ExpectedScoreRange,
    expected_detected_issues: ["spill", "disorganized shelf"],
    notes:
      "Dirty refrigerator evidence should trigger fail or human review, never an automatic pass.",
  },
  {
    id: "stove_clean",
    label: "Stove clean",
    area: "kitchen",
    zoneId: "kitchen-stove-grease",
    image_placeholder: "/fixtures/ai-closing/stove_clean.png",
    expected_status: "PASS",
    expected_score_range: [85, 100] as ExpectedScoreRange,
    expected_detected_issues: [],
    notes:
      "Stove edge and grease collection points should appear wiped down and visible.",
  },
  {
    id: "stove_greasy",
    label: "Stove greasy",
    area: "kitchen",
    zoneId: "kitchen-stove-grease",
    image_placeholder: "/fixtures/ai-closing/stove_greasy.png",
    expected_status: "FAIL",
    expected_score_range: [0, 50] as ExpectedScoreRange,
    expected_detected_issues: ["grease residue", "unclean stove edge"],
    notes:
      "Grease is food-safety relevant and must be treated as a severe issue.",
  },
  {
    id: "hall_tables_aligned",
    label: "Hall tables aligned",
    area: "hall",
    zoneId: "hall-tables-chairs",
    image_placeholder: "/fixtures/ai-closing/hall_tables_aligned.png",
    expected_status: "PASS",
    expected_score_range: [80, 100] as ExpectedScoreRange,
    expected_detected_issues: [],
    notes:
      "Tables and chairs should be aligned with clear floor visibility after reset.",
  },
  {
    id: "hall_tables_messy",
    label: "Hall tables messy",
    area: "hall",
    zoneId: "hall-tables-chairs",
    image_placeholder: "/fixtures/ai-closing/hall_tables_messy.png",
    expected_status: "FAIL",
    expected_score_range: [0, 55] as ExpectedScoreRange,
    expected_detected_issues: ["misaligned chairs", "messy table area"],
    notes:
      "Messy hall reset should not block food safety, but it should fail closing quality.",
  },
  {
    id: "counter_clean",
    label: "Counter clean",
    area: "hall",
    zoneId: "hall-counter-pos",
    image_placeholder: "/fixtures/ai-closing/counter_clean.png",
    expected_status: "PASS",
    expected_score_range: [82, 100] as ExpectedScoreRange,
    expected_detected_issues: [],
    notes:
      "Counter, POS, receipt printer area, and pickup surface should be clear.",
  },
  {
    id: "counter_messy",
    label: "Counter messy",
    area: "hall",
    zoneId: "hall-counter-pos",
    image_placeholder: "/fixtures/ai-closing/counter_messy.png",
    expected_status: "FAIL",
    expected_score_range: [0, 55] as ExpectedScoreRange,
    expected_detected_issues: ["counter clutter", "unclean POS area"],
    notes:
      "Counter clutter can affect opening readiness and should fail or route to review.",
  },
] satisfies AiEvaluationFixture[];

export function getAiEvaluationFixture(fixtureId: string) {
  return aiEvaluationFixtures.find((fixture) => fixture.id === fixtureId);
}
