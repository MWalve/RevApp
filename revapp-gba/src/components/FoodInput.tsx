'use client';

import { use, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { StringLiteral } from 'typescript';

interface FoodCategory {
    id: string;
    name: string;
    description: string;
    gut_health_impact: 'positive' | 'negative' | 'neutral';
}

interface FoodItems {
    id: string;
    name: string;
    categort_id: string;
}

interface FoodLog {
    food_item_id: string;
    portion_size: string;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    notes: string;
}

export default function FoodInput() {
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItems[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [foodLog, setFoodLog] = useState<FoodLog>({
    food_item_id: '',
    portion_size: '',
    meal_type: 'breakfast',
    notes: ''
  });

  const [newFoodItem, setNewFoodItem] = useState({
    name: '',
    category_id: '',
  });

  useEffect(() => {
    fetchCategories();
    //fetchFoodItems();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase
        .from('food_categories')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching cactegories:', error.message);
      return;
    }

    setCategories(data || []);
  }

  async function fetchFoodItems() {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching food items:', error);
      return;
    }

    setFoodItems(data || []);
  }

  async function handleAddNewFood(e: React.FormEvent) {
    e.preventDefault();
    if (!newFoodItem.name || !newFoodItem.category_id) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('food_items')
        .insert([newFoodItem])
        .select()
        .single();

      if (error) throw error;

      setFoodItems([...foodItems, data]);
      setNewFoodItem({ name: '', category_id: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error adding food item:', err);
      setError('Failed to add food item');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitLog(e: React.FormEvent) {
    e.preventDefault();
    if (!foodLog.food_item_id || !foodLog.portion_size) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('food_logs')
        .insert([{
          ...foodLog,
          consumed_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setFoodLog({
        food_item_id: '',
        portion_size: '',
        meal_type: 'breakfast',
        notes: ''
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error logging food:', err);
      setError('Failed to save food log');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Food Item</h2>
        <form onSubmit={handleAddNewFood} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Food Name</label>
            <input
              type="text"
              value={newFoodItem.name}
              onChange={(e) => setNewFoodItem(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter food name"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              value={newFoodItem.category_id}
              onChange={(e) => setNewFoodItem(prev => ({ ...prev, category_id: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.gut_health_impact})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Food Item'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Log Food Entry</h2>
        <form onSubmit={handleSubmitLog} className="space-y-4">
          <div>
            <label htmlFor="foodItem" className="block text-sm font-medium text-gray-700">Food Item</label>
            <select
              id="foodItem"
              value={foodLog.food_item_id}
              onChange={(e) => setFoodLog(prev => ({ ...prev, food_item_id: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a food item</option>
              {foodItems.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Portion Size</label>
            <input
              type="text"
              value={foodLog.portion_size}
              onChange={(e) => setFoodLog(prev => ({ ...prev, portion_size: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., 1 cup, 100g"
            />
          </div>

          <div>
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700">Meal Type</label>
            <select
              id='mealType'
              value={foodLog.meal_type}
              onChange={(e) => setFoodLog(prev => ({ ...prev, meal_type: e.target.value as any }))}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={foodLog.notes}
              onChange={(e) => setFoodLog(prev => ({ ...prev, notes: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              placeholder="Add any additional notes about this meal"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Log Food'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          Successfully saved!
        </div>
      )}
    </div>
  );
}

