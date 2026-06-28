import {
  AlertTriangle,
  BarChart3,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  Home,
  PackageSearch,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StatusTone = "success" | "warning" | "danger" | "ai" | "neutral";

export type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
  tone: StatusTone;
};

export type ClosingTask = {
  label: string;
  status: "PASS" | "FAIL" | "HUMAN_REVIEW" | "PENDING";
  detail: string;
};

export type AlertItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  severity: "critical" | "warning" | "info";
  source: "AI Closing" | "Inventory" | "Bonus" | "SOP";
};

export type NavItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  count?: number;
};

export const dashboardData = {
  store: {
    name: "DOYA Jjambbong HCM",
    businessDate: "2026-06-28",
    role: "Owner view",
    location: "Ho Chi Minh City",
    lastUpdated: "10:16 AM",
  },
  navigation: [
    { label: "Dashboard", icon: Home, active: true },
    { label: "AI Manager", icon: Bot, count: 3 },
    { label: "AI Closing", icon: ClipboardCheck, count: 2 },
    { label: "Inventory", icon: PackageSearch, count: 4 },
    { label: "Bonus", icon: Gauge },
    { label: "SOP Library", icon: ShieldCheck },
    { label: "Settings", icon: Settings },
  ] satisfies NavItem[],
  storeHealth: {
    title: "Store Health",
    status: "Attention required",
    score: 82,
    trend: "+4 from yesterday",
    summary:
      "Service is stable, but closing review and noodle stock need manager attention before end of day.",
    metrics: [
      {
        label: "Open actions",
        value: "4",
        detail: "2 closing, 2 inventory",
        tone: "warning",
      },
      {
        label: "Data freshness",
        value: "8m",
        detail: "All core signals current",
        tone: "success",
      },
      {
        label: "Human review",
        value: "2",
        detail: "Manager queue",
        tone: "ai",
      },
    ] satisfies DashboardMetric[],
  },
  closing: {
    title: "Today's Closing",
    status: "Human review",
    completion: 67,
    summary:
      "Kitchen refrigerator and hall floor evidence need review. All other closing categories are on track.",
    tasks: [
      {
        label: "Kitchen floor / drain",
        status: "PASS",
        detail: "AI inspection passed at 9:42 PM",
      },
      {
        label: "Kitchen refrigerator",
        status: "HUMAN_REVIEW",
        detail: "Photo is dim; manager review required",
      },
      {
        label: "Stove grease",
        status: "PASS",
        detail: "AI inspection passed at 9:45 PM",
      },
      {
        label: "Hall floor",
        status: "FAIL",
        detail: "Re-cleaning assigned",
      },
    ] satisfies ClosingTask[],
  },
  inventory: {
    title: "Inventory Risk",
    status: "Warning",
    riskLevel: "Medium",
    projectedRunout: "1.8 days",
    summary:
      "Fresh noodles are below reorder threshold after today's waste and inbound stock entries.",
    items: [
      {
        label: "Fresh noodles",
        value: "1.8 days",
        detail: "Below threshold",
        tone: "warning",
      },
      {
        label: "Pork broth base",
        value: "3.6 days",
        detail: "Normal burn rate",
        tone: "success",
      },
      {
        label: "Onion",
        value: "Review",
        detail: "Waste variance +18%",
        tone: "ai",
      },
    ] satisfies DashboardMetric[],
  },
  bonus: {
    title: "Bonus Progress",
    status: "Blocked",
    storeLevel: 82,
    cooperationScore: 91,
    unlockStatus: "1 blocker",
    summary:
      "Bonus unlock is blocked until the hall floor closing failure is corrected and confirmed.",
  },
  aiManager: {
    title: "AI Manager Summary",
    status: "Published",
    generatedAt: "10:16 AM",
    confidence: "High",
    summary:
      "The store is operationally stable. Prioritize closing correction, confirm noodle stock, and review waste variance before the end-day summary.",
    recommendations: [
      "Assign hall floor re-cleaning before closing confirmation.",
      "Confirm fresh noodle reorder risk with manager inventory count.",
      "Keep bonus status blocked until failed closing review is resolved.",
    ],
  },
  alerts: [
    {
      id: "alert-001",
      title: "Hall floor failed inspection",
      detail: "AI Closing marked evidence as fail. Manager review and re-cleaning required.",
      time: "9:51 PM",
      severity: "critical",
      source: "AI Closing",
    },
    {
      id: "alert-002",
      title: "Fresh noodles below threshold",
      detail: "Projected stock is 1.8 days after current burn-rate calculation.",
      time: "8:24 PM",
      severity: "warning",
      source: "Inventory",
    },
    {
      id: "alert-003",
      title: "Bonus unlock has one blocker",
      detail: "Store Level is strong, but failed closing blocks unlock.",
      time: "8:02 PM",
      severity: "warning",
      source: "Bonus",
    },
  ] satisfies AlertItem[],
  quickStats: [
    { label: "SOP completion", value: "91%", icon: BarChart3 },
    { label: "AI review rate", value: "2 open", icon: Sparkles },
    { label: "Corrections closed", value: "7 today", icon: CheckCircle2 },
    { label: "Critical alerts", value: "1", icon: AlertTriangle },
  ],
};
