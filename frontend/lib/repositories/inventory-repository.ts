import type { SupabaseClient } from "@supabase/supabase-js";

export type CreateDailyWeightInput = {
  organizationId: string;
  storeId: string;
  inventoryItemId: string;
  businessDate: string;
  weight: number;
  unit: string;
  recordedBy?: string;
};

export class SupabaseInventoryRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async listItems(storeId: string) {
    const { data, error } = await this.supabase
      .from("inventory_items")
      .select("*")
      .eq("store_id", storeId)
      .is("deleted_at", null)
      .order("name");

    if (error) {
      throw error;
    }

    return data;
  }

  async recordDailyWeight(input: CreateDailyWeightInput) {
    const { data, error } = await this.supabase
      .from("inventory_daily_weights")
      .upsert(
        {
          organization_id: input.organizationId,
          store_id: input.storeId,
          inventory_item_id: input.inventoryItemId,
          business_date: input.businessDate,
          weight: input.weight,
          unit: input.unit,
          recorded_by: input.recordedBy,
        },
        { onConflict: "store_id,inventory_item_id,business_date" },
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}
