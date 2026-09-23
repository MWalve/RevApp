/**
 * Food Service - Data Access Layer for Food-related operations
 */

import { supabase } from '@/lib/supabase';

export interface FoodItem {
  id?: string;
  name: string;
  nutrition_data?: {
    fdcId?: string;
    nutrients?: any[];
    categories?: string[];
  };
  created_at?: string;
}

export interface FoodLog {
  id?: string;
  food_item_id: string;
  portion_size: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes?: string;
  consumed_at?: string;
  created_at?: string;
}

export interface FoodLogWithItem extends FoodLog {
  food_item?: FoodItem;
}

export class FoodService {
  /**
   * Get all food logs with their food items
   */
  static async getFoodLogs(limit: number = 50): Promise<FoodLogWithItem[]> {
    const { data, error } = await supabase
      .from('food_logs')
      .select(`
        *,
        food_item:food_items (*)
      `)
      .order('consumed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as FoodLogWithItem[];
  }

  /**
   * Create a food item
   */
  static async createFoodItem(foodItem: FoodItem) {
    const { data, error } = await supabase
      .from('food_items')
      .insert([{
        name: foodItem.name,
        nutrition_data: foodItem.nutrition_data || {}
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create a food log entry
   */
  static async createFoodLog(
    foodItemId: string,
    portionSize: string,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    notes?: string,
    consumedAt?: Date
  ) {
    const { data, error } = await supabase
      .from('food_logs')
      .insert([{
        food_item_id: foodItemId,
        portion_size: portionSize,
        meal_type: mealType,
        notes: notes || '',
        consumed_at: consumedAt ? consumedAt.toISOString() : new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create food item and log in one transaction-like operation
   */
  static async createFoodItemAndLog(
    foodItem: FoodItem,
    portionSize: string,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    notes?: string
  ) {
    // Create food item first
    const createdFoodItem = await this.createFoodItem(foodItem);

    // Then create log
    const createdLog = await this.createFoodLog(
      createdFoodItem.id,
      portionSize,
      mealType,
      notes
    );

    return {
      foodItem: createdFoodItem,
      foodLog: createdLog
    };
  }

  /**
   * Get food logs for a specific date range
   */
  static async getFoodLogsByDateRange(startDate: Date, endDate: Date) {
    const { data, error } = await supabase
      .from('food_logs')
      .select(`
        *,
        food_item:food_items (*)
      `)
      .gte('consumed_at', startDate.toISOString())
      .lte('consumed_at', endDate.toISOString())
      .order('consumed_at', { ascending: false });

    if (error) throw error;
    return data as FoodLogWithItem[];
  }

  /**
   * Get foods by category
   */
  static async getFoodsByCategory(category: string) {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .contains('nutrition_data->categories', [category]);

    if (error) throw error;
    return data;
  }

  /**
   * Search food items by name
   */
  static async searchFoodItems(searchTerm: string, limit: number = 20) {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .limit(limit);

    if (error) throw error;
    return data;
  }

  /**
   * Delete a food log entry
   */
  static async deleteFoodLog(id: string) {
    const { error } = await supabase
      .from('food_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Get food intake summary for today
   */
  static async getTodaySummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const logs = await this.getFoodLogsByDateRange(today, tomorrow);

    return {
      totalMeals: logs.length,
      byMealType: {
        breakfast: logs.filter(l => l.meal_type === 'breakfast').length,
        lunch: logs.filter(l => l.meal_type === 'lunch').length,
        dinner: logs.filter(l => l.meal_type === 'dinner').length,
        snack: logs.filter(l => l.meal_type === 'snack').length
      },
      logs
    };
  }
}

