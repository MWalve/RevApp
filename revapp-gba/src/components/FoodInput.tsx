'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import debounce from 'lodash/debounce';

interface Nutrient {
  number: string;
  name: string;
  amount: number;
  unitName: string;
}

interface FoodItem {
  fdcId: string;
  description: string;
  brandOwner?: string;
  foodNutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    value: number;
    unitName: string;
  }>;
}

interface DetailedFoodItem {
  fdcId: string;
  description: string;
  brandOwner?: string;
  nutrients: Nutrient[];
  foodNutrients: Array<{
    nutrient: {
      id: number;
      name: string;
      number: string;
      unitName: string;
    };
    amount: number;
  }>;
}

interface FoodLogEntry {
  food_item_id: string;
  portion_size: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes: string;
}

export default function FoodInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<DetailedFoodItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [logEntry, setLogEntry] = useState<FoodLogEntry>({
    food_item_id: '',
    portion_size: '',
    meal_type: 'breakfast',
    notes: ''
  });

  const searchFood = debounce(async (term: string) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.NEXT_PUBLIC_USDA_API_KEY}&query=${encodeURIComponent(term)}&pageSize=10&dataType=Survey (FNDDS)`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch food data');
      }

      const data = await response.json();
      setSearchResults(data.foods || []);
    } catch (err) {
      console.error('Error searching foods:', err);
      setError('Failed to search foods');
    } finally {
      setLoading(false);
    }
  }, 500);

  const getFoodDetails = async (fdcId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${process.env.NEXT_PUBLIC_USDA_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch food details');
      }

      const foodData = await response.json();
      const processedFood: DetailedFoodItem = {
        fdcId: foodData.fdcId,
        description: foodData.description,
        brandOwner: foodData.brandOwner,
        nutrients: [],
        foodNutrients: foodData.foodNutrients || []
      };

      setSelectedFood(processedFood);
      setSearchResults([]); // Clear search results when item is selected
      setSearchTerm(''); // Clear search term
    } catch (err) {
      console.error('Error fetching food details:', err);
      setError('Failed to fetch food details');
    } finally {
      setLoading(false);
    }
  };

  const getNutrientValue = (nutrientName: string): string => {
    if (!selectedFood || !selectedFood.foodNutrients) return 'N/A';

    const nutrient = selectedFood.foodNutrients.find(n => 
      n.nutrient?.name?.toLowerCase().includes(nutrientName.toLowerCase())
    );

    return nutrient 
      ? `${nutrient.amount} ${nutrient.nutrient.unitName}` 
      : 'N/A';
  };

  const categorizeFood = (food: DetailedFoodItem) => {
    const nutrients = food.foodNutrients;
    let categories = [];

    // Get nutrient amounts
    const protein = nutrients.find(n => n.nutrient.name.includes('Protein'))?.amount || 0;
    const fiber = nutrients.find(n => n.nutrient.name.includes('Fiber'))?.amount || 0;
    const sugar = nutrients.find(n => n.nutrient.name.includes('Sugars'))?.amount || 0;

    // Categorize based on nutrient content
    if (protein > 15) categories.push('protein_rich');
    if (fiber > 5) categories.push('fiber_rich');
    if (sugar > 15) categories.push('high_sugar');

    // Check for probiotic/fermented foods
    const probioticTerms = ['yogurt', 'kefir', 'kimchi', 'sauerkraut', 'kombucha', 'fermented'];
    if (probioticTerms.some(term => food.description.toLowerCase().includes(term))) {
      categories.push('probiotic');
    }

    return categories;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFood) return;

    setLoading(true);
    setError(null);

    try {
      // First, save the food item
      const categories = categorizeFood(selectedFood);
      const { data: foodItemData, error: foodItemError } = await supabase
        .from('food_items')
        .insert([
          {
            name: selectedFood.description,
            nutrition_data: {
              fdcId: selectedFood.fdcId,
              nutrients: selectedFood.foodNutrients,
              categories: categories
            }
          }
        ])
        .select()
        .single();

      if (foodItemError) throw foodItemError;

      // Then, create the food log entry
      const { error: logError } = await supabase
        .from('food_logs')
        .insert([
          {
            food_item_id: foodItemData.id,
            portion_size: logEntry.portion_size,
            meal_type: logEntry.meal_type,
            notes: logEntry.notes,
            consumed_at: new Date().toISOString()
          }
        ]);

      if (logError) throw logError;

      setSuccess(true);
      setSelectedFood(null);
      setLogEntry({
        food_item_id: '',
        portion_size: '',
        meal_type: 'breakfast',
        notes: ''
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving food log:', err);
      setError('Failed to save food log');
    } finally {
      setLoading(false);
    }
  };

  const COMMON_NUTRIENTS = [
    { label: 'Protein', name: 'Protein' },
    { label: 'Carbohydrates', name: 'Carbohydrate' },
    { label: 'Fat', name: 'Total lipid (fat)' },
    { label: 'Fiber', name: 'Fiber' },
    { label: 'Sugar', name: 'Sugars' },
    { label: 'Calcium', name: 'Calcium' },
    { label: 'Iron', name: 'Iron' },
    { label: 'Magnesium', name: 'Magnesium' },
    { label: 'Vitamin B12', name: 'Vitamin B-12' },
    { label: 'Vitamin D', name: 'Vitamin D' }
  ];

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold">Log Food</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Food Search */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Search Food
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                searchFood(e.target.value);
              }}
              className="w-full p-2 border rounded-md"
              placeholder="Start typing to search foods..."
            />
            {loading && (
              <div className="absolute right-2 top-2">
                <span className="text-sm text-gray-500">Searching...</span>
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="border rounded-md overflow-hidden mt-2">
              {searchResults.map((food) => (
                <button
                  type="button"
                  key={food.fdcId}
                  onClick={() => getFoodDetails(food.fdcId)}
                  className="w-full p-4 text-left hover:bg-gray-50 border-b last:border-b-0"
                >
                  <div className="font-medium">{food.description}</div>
                  {food.brandOwner && (
                    <div className="text-sm text-gray-500">{food.brandOwner}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Food Details */}
        {selectedFood && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-3">{selectedFood.description}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Macronutrients</h4>
                <div className="space-y-1">
                  {COMMON_NUTRIENTS.slice(0, 5).map(nutrient => (
                    <p key={nutrient.name} className="text-sm">
                      {nutrient.label}: {getNutrientValue(nutrient.name)}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Micronutrients</h4>
                <div className="space-y-1">
                  {COMMON_NUTRIENTS.slice(5).map(nutrient => (
                    <p key={nutrient.name} className="text-sm">
                      {nutrient.label}: {getNutrientValue(nutrient.name)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedFood && (
          <>
            {/* Portion Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Portion Size
              </label>
              <input
                type="text"
                value={logEntry.portion_size}
                onChange={(e) => setLogEntry(prev => ({ ...prev, portion_size: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                placeholder="e.g., 1 cup, 100g"
                required
              />
            </div>

            {/* Meal Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meal Type
              </label>
              <select
                aria-label="Meal Type"
                value={logEntry.meal_type}
                onChange={(e) => setLogEntry(prev => ({ ...prev, meal_type: e.target.value as any }))}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                value={logEntry.notes}
                onChange={(e) => setLogEntry(prev => ({ ...prev, notes: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                rows={3}
                placeholder="Add any notes about this meal..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Food Log'}
            </button>
          </>
        )}
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          Food log saved successfully!
        </div>
      )}
    </div>
  );
}