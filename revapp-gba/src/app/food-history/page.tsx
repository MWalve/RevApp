'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { supabase } from '../../lib/supabase';

interface FoodLogEntry {
  id: string;
  food_item: {
    name: string;
    category: {
      name: string;
      gut_health_impact: string;
    }
  };
  portion_size: string;
  meal_type: string;
  consumed_at: string;
  notes: string;
}

export default function FoodHistoryPage() {
  const [foodLogs, setFoodLogs] = useState<FoodLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoodHistory();
  }, []);

  async function fetchFoodHistory() {
    try {
      const { data, error } = await supabase
        .from('food_logs')
        .select(`
          *,
          food_item:food_item_id (
            name,
            category:category_id (
              name,
              gut_health_impact
            )
          )
        `)
        .order('consumed_at', { ascending: false });

      if (error) throw error;
      setFoodLogs(data || []);
    } catch (err) {
      console.error('Error fetching food history:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Food History</h1>
        
        {loading ? (
          <div className="text-center">Loading food history...</div>
        ) : (
          <div className="space-y-4">
            {foodLogs.map((log) => (
              <div key={log.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {log.food_item.name}
                    </h3>
                    <div className="space-y-1 mt-2 text-sm text-gray-600">
                      <p>Category: {log.food_item.category.name}</p>
                      <p>Portion: {log.portion_size}</p>
                      <p>Meal: {log.meal_type}</p>
                      {log.notes && <p>Notes: {log.notes}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                      log.food_item.category.gut_health_impact === 'positive'
                        ? 'bg-green-100 text-green-800'
                        : log.food_item.category.gut_health_impact === 'negative'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {log.food_item.category.gut_health_impact}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(log.consumed_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}