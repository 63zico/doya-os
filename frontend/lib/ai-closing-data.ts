export type AiClosingStatus =
  | "NOT_STARTED"
  | "PHOTO_REQUIRED"
  | "ANALYZING"
  | "PASS"
  | "FAIL"
  | "HUMAN_REVIEW";

export type ClosingArea = "kitchen" | "hall";

export type ClosingZone = {
  id: string;
  area: ClosingArea;
  label: string;
  shortLabel: string;
  instruction: string;
  evidenceHint: string;
  requiredPhotos: number;
  status: AiClosingStatus;
  submissionId: string;
  lastSubmittedAt?: string;
  owner: string;
};

export type AiEvaluationResult = {
  submissionId: string;
  zoneId: string;
  status: Extract<AiClosingStatus, "ANALYZING" | "PASS" | "FAIL" | "HUMAN_REVIEW">;
  score: number;
  confidence: number;
  reason: string;
  requiredAction: string;
  timestamp: string;
  model: string;
  policyVersion: string;
};

export type HumanReviewItem = {
  id: string;
  submissionId: string;
  zoneId: string;
  area: ClosingArea;
  title: string;
  submittedBy: string;
  submittedAt: string;
  reason: string;
  confidence: number;
  requiredAction: string;
};

export type ClosingHistoryItem = {
  id: string;
  date: string;
  role: "Kitchen" | "Hall";
  area: string;
  status: Extract<AiClosingStatus, "PASS" | "FAIL" | "HUMAN_REVIEW">;
  completedAt: string;
  reviewer: string;
};

export const statusLabels: Record<AiClosingStatus, string> = {
  NOT_STARTED: "Not started",
  PHOTO_REQUIRED: "Photo required",
  ANALYZING: "Analyzing",
  PASS: "Pass",
  FAIL: "Fail",
  HUMAN_REVIEW: "Human review",
};

export const statusDescriptions: Record<AiClosingStatus, string> = {
  NOT_STARTED: "Waiting for staff to begin the closing task.",
  PHOTO_REQUIRED: "Evidence is required before AI inspection can run.",
  ANALYZING: "AI inspection is processing the submitted evidence.",
  PASS: "Evidence passed AI inspection and can be recorded.",
  FAIL: "Evidence failed inspection and requires re-cleaning or review.",
  HUMAN_REVIEW: "Manager review is required before this task can close.",
};

export const aiClosingData = {
  businessDate: "2026-06-28",
  storeName: "DOYA Jjambbong HCM",
  overview: {
    completion: 67,
    openReviews: 2,
    failedItems: 1,
    submittedPhotos: 7,
    summary:
      "Kitchen refrigerator evidence needs manager review and hall floor requires re-cleaning before the closing session can be confirmed.",
  },
  zones: [
    {
      id: "kitchen-floor-drain",
      area: "kitchen",
      label: "Floor / Drain",
      shortLabel: "Floor",
      instruction:
        "Show the kitchen floor and drain after cleaning. The drain cover, surrounding tile, and water path must be visible.",
      evidenceHint: "Wide photo with floor, drain cover, and surrounding tile visible.",
      requiredPhotos: 1,
      status: "PASS",
      submissionId: "sub-kitchen-floor-drain",
      lastSubmittedAt: "9:42 PM",
      owner: "Kitchen",
    },
    {
      id: "kitchen-refrigerator",
      area: "kitchen",
      label: "Refrigerator",
      shortLabel: "Fridge",
      instruction:
        "Show refrigerator shelves, containers, labels, and visible spill areas after closing cleanup.",
      evidenceHint: "Open refrigerator photo with shelves and labels visible.",
      requiredPhotos: 1,
      status: "HUMAN_REVIEW",
      submissionId: "sub-kitchen-refrigerator",
      lastSubmittedAt: "9:47 PM",
      owner: "Kitchen",
    },
    {
      id: "kitchen-stove-grease",
      area: "kitchen",
      label: "Stove Grease",
      shortLabel: "Stove",
      instruction:
        "Show stove edges, backsplash, hood-facing surface, and grease collection points after wipe-down.",
      evidenceHint: "Close photo with stove edge and grease collection points visible.",
      requiredPhotos: 1,
      status: "PASS",
      submissionId: "sub-kitchen-stove-grease",
      lastSubmittedAt: "9:45 PM",
      owner: "Kitchen",
    },
    {
      id: "hall-tables-chairs",
      area: "hall",
      label: "Tables / Chairs",
      shortLabel: "Tables",
      instruction:
        "Show table surfaces, chair alignment, and visible under-table floor after hall reset.",
      evidenceHint: "Wide hall photo with table tops and chair rows visible.",
      requiredPhotos: 1,
      status: "PHOTO_REQUIRED",
      submissionId: "sub-hall-tables-chairs",
      owner: "Hall",
    },
    {
      id: "hall-floor",
      area: "hall",
      label: "Floor",
      shortLabel: "Floor",
      instruction:
        "Show the main hall floor after sweeping and mopping, including the highest-traffic walkway.",
      evidenceHint: "Wide floor photo with walkway and table edges visible.",
      requiredPhotos: 1,
      status: "FAIL",
      submissionId: "sub-hall-floor",
      lastSubmittedAt: "9:51 PM",
      owner: "Hall",
    },
    {
      id: "hall-counter-pos",
      area: "hall",
      label: "Counter / POS",
      shortLabel: "Counter",
      instruction:
        "Show counter surface, POS area, receipt printer zone, and customer-facing pickup point after cleanup.",
      evidenceHint: "Counter photo with POS, printer area, and pickup surface visible.",
      requiredPhotos: 1,
      status: "ANALYZING",
      submissionId: "sub-hall-counter-pos",
      lastSubmittedAt: "9:55 PM",
      owner: "Hall",
    },
  ] satisfies ClosingZone[],
  results: [
    {
      submissionId: "sub-kitchen-floor-drain",
      zoneId: "kitchen-floor-drain",
      status: "PASS",
      score: 94,
      confidence: 0.91,
      reason: "Drain cover and surrounding floor are visible. No standing water or debris is detected.",
      requiredAction: "Record pass and continue closing.",
      timestamp: "2026-06-28T21:42:00+07:00",
      model: "vision-primary",
      policyVersion: "closing-kitchen-v1.0",
    },
    {
      submissionId: "sub-kitchen-refrigerator",
      zoneId: "kitchen-refrigerator",
      status: "HUMAN_REVIEW",
      score: 61,
      confidence: 0.58,
      reason: "The refrigerator is visible, but the lower shelf is too dim to confirm cleanliness.",
      requiredAction: "Manager must review evidence or request a clearer resubmission.",
      timestamp: "2026-06-28T21:47:00+07:00",
      model: "vision-primary",
      policyVersion: "closing-kitchen-v1.0",
    },
    {
      submissionId: "sub-kitchen-stove-grease",
      zoneId: "kitchen-stove-grease",
      status: "PASS",
      score: 90,
      confidence: 0.88,
      reason: "The stove edge and grease collection points appear clean and visible.",
      requiredAction: "Record pass and continue closing.",
      timestamp: "2026-06-28T21:45:00+07:00",
      model: "vision-primary",
      policyVersion: "closing-kitchen-v1.0",
    },
    {
      submissionId: "sub-hall-floor",
      zoneId: "hall-floor",
      status: "FAIL",
      score: 42,
      confidence: 0.84,
      reason: "Visible streaking and debris remain near the main walkway.",
      requiredAction: "Re-clean the hall floor and submit a new photo.",
      timestamp: "2026-06-28T21:51:00+07:00",
      model: "vision-primary",
      policyVersion: "closing-hall-v1.0",
    },
    {
      submissionId: "sub-hall-counter-pos",
      zoneId: "hall-counter-pos",
      status: "ANALYZING",
      score: 0,
      confidence: 0,
      reason: "Evidence has been received and is waiting for mock AI evaluation.",
      requiredAction: "Wait for inspection status.",
      timestamp: "2026-06-28T21:55:00+07:00",
      model: "vision-primary",
      policyVersion: "closing-hall-v1.0",
    },
  ] satisfies AiEvaluationResult[],
  reviewQueue: [
    {
      id: "review-kitchen-refrigerator",
      submissionId: "sub-kitchen-refrigerator",
      zoneId: "kitchen-refrigerator",
      area: "kitchen",
      title: "Kitchen refrigerator",
      submittedBy: "Mina Park",
      submittedAt: "9:47 PM",
      reason: "Lower shelf is too dim for the evaluator to confirm cleanliness.",
      confidence: 0.58,
      requiredAction: "Approve as acceptable or reject and request a clearer photo.",
    },
    {
      id: "review-hall-floor",
      submissionId: "sub-hall-floor",
      zoneId: "hall-floor",
      area: "hall",
      title: "Hall floor",
      submittedBy: "Daniel Choi",
      submittedAt: "9:51 PM",
      reason: "AI detected visible streaking and debris in the walkway.",
      confidence: 0.84,
      requiredAction: "Reject and assign re-cleaning unless the evidence is incorrect.",
    },
  ] satisfies HumanReviewItem[],
  history: [
    {
      id: "history-2026-06-27-kitchen",
      date: "2026-06-27",
      role: "Kitchen",
      area: "All kitchen zones",
      status: "PASS",
      completedAt: "10:04 PM",
      reviewer: "AI pass",
    },
    {
      id: "history-2026-06-27-hall",
      date: "2026-06-27",
      role: "Hall",
      area: "All hall zones",
      status: "PASS",
      completedAt: "10:09 PM",
      reviewer: "Manager approved",
    },
    {
      id: "history-2026-06-26-kitchen",
      date: "2026-06-26",
      role: "Kitchen",
      area: "Refrigerator",
      status: "HUMAN_REVIEW",
      completedAt: "10:18 PM",
      reviewer: "Manager approved exception",
    },
    {
      id: "history-2026-06-25-hall",
      date: "2026-06-25",
      role: "Hall",
      area: "Floor",
      status: "FAIL",
      completedAt: "10:31 PM",
      reviewer: "Re-clean completed",
    },
  ] satisfies ClosingHistoryItem[],
};

export function getZonesByArea(area: ClosingArea) {
  return aiClosingData.zones.filter((zone) => zone.area === area);
}

export function getZone(zoneId: string) {
  return aiClosingData.zones.find((zone) => zone.id === zoneId);
}

export function getResult(submissionId: string) {
  return aiClosingData.results.find(
    (result) => result.submissionId === submissionId,
  );
}

export function getResultForZone(zoneId: string) {
  const zone = getZone(zoneId);

  if (!zone) {
    return undefined;
  }

  return getResult(zone.submissionId);
}
