import type { SupabaseClient } from "@supabase/supabase-js";

export type DashboardStoreSummary = {
  storeId: string;
  businessDate: string;
  closingReviewCount: number;
  inventoryRiskCount: number;
  unreadNotificationCount: number;
  bonusBlocked: boolean;
};

export class SupabaseDashboardRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getStoreSummary(
    storeId: string,
    businessDate: string,
  ): Promise<DashboardStoreSummary> {
    const [
      closingReviews,
      inventoryPredictions,
      notifications,
      bonusSnapshots,
    ] = await Promise.all([
      this.supabase
        .from("closing_photo_submissions")
        .select("id", { count: "exact", head: true })
        .eq("store_id", storeId)
        .eq("business_date", businessDate)
        .in("status", ["fail", "human_review"]),
      this.supabase
        .from("inventory_predictions")
        .select("id", { count: "exact", head: true })
        .eq("store_id", storeId)
        .eq("business_date", businessDate)
        .in("risk_level", ["high", "critical"]),
      this.supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("store_id", storeId)
        .eq("status", "unread"),
      this.supabase
        .from("bonus_pool_snapshots")
        .select("unlock_status")
        .eq("store_id", storeId)
        .order("created_at", { ascending: false })
        .limit(1),
    ]);

    if (closingReviews.error) {
      throw closingReviews.error;
    }

    if (inventoryPredictions.error) {
      throw inventoryPredictions.error;
    }

    if (notifications.error) {
      throw notifications.error;
    }

    if (bonusSnapshots.error) {
      throw bonusSnapshots.error;
    }

    return {
      storeId,
      businessDate,
      closingReviewCount: closingReviews.count ?? 0,
      inventoryRiskCount: inventoryPredictions.count ?? 0,
      unreadNotificationCount: notifications.count ?? 0,
      bonusBlocked: bonusSnapshots.data?.[0]?.unlock_status === "blocked",
    };
  }
}
