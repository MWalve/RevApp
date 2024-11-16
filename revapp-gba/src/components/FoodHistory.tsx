'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface FoodLog {
  id: string;
  food_item_id: string;
  portion_size: string;
  meal_type: string;
  consumed_at: string;
  notes: string;
}

interface FoodItem {
  id: string;
  name: string;
  nutrition_data?: {
    nutrients?: any[];
    categories?: string[];
  };
}

export default function FoodHistory() {
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [foodItems, setFoodItems] = useState<{ [key: string]: FoodItem }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFoodHistory();
  }, []);

  const fetchFoodHistory = async () => {
    setLoading(true);
    setError(null);
    console.log('Starting to fetch food history...');

    try {
      // First fetch food logs
      const { data: logsData, error: logsError } = await supabase
        .from('food_logs')
        .select('*')
        .order('consumed_at', { ascending: false });

      if (logsError) throw logsError;
      console.log('Food logs fetched:', logsData);

      if (logsData && logsData.length > 0) {
        // Get unique food item IDs
        const foodItemIds = Array.from(new Set(logsData.map(log => log.food_item_id)));
        
        // Fetch food items
        const { data: itemsData, error: itemsError } = await supabase
          .from('food_items')
          .select('*')
          .in('id', foodItemIds);

        if (itemsError) throw itemsError;
        console.log('Food items fetched:', itemsData);

        // Create a map of food items
        const foodItemsMap = (itemsData || []).reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {} as { [key: string]: FoodItem });

        setFoodItems(foodItemsMap);
        setFoodLogs(logsData);
      } else {
        setFoodLogs([]);
      }
    } catch (err) {
      console.error('Error fetching food history:', err);
      setError('Failed to load food history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-center py-4">
          Loading food history...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="font-bold">Error loading food history:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {foodLogs.map((log) => {
          const foodItem = foodItems[log.food_item_id];
          return (
            <div key={log.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">
                    {foodItem?.name || 'Unknown Food Item'}
                  </h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Portion: {log.portion_size}</p>
                    <p>Meal: {log.meal_type.charAt(0).toUpperCase() + log.meal_type.slice(1)}</p>
                    {log.notes && <p>Notes: {log.notes}</p>}
                  </div>

                  {foodItem?.nutrition_data && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {foodItem.nutrition_data.categories && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Categories</h4>
                          <div className="flex flex-wrap gap-1">
                            {foodItem.nutrition_data.categories.map((category, index) => (
                              <span 
                                key={index}
                                className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                              >
                                {category.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(log.consumed_at).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}

        {!loading && foodLogs.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No food logs found.
          </div>
        )}
      </div>

      {/* Debug Information */}
      <div className="mt-8 p-4 bg-gray-100 rounded-md text-sm">
        <h3 className="font-bold mb-2">Debug Information:</h3>
        <pre className="overflow-auto">
          {JSON.stringify({
            totalLogs: foodLogs.length,
            totalFoodItems: Object.keys(foodItems).length,
            loading,
            error
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}