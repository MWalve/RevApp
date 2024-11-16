'use client';

import { useState } from 'react';
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

export default function FoodSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<DetailedFoodItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFood = debounce(async (term: string) => {
    if (!term) {
      setResults([]);
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
      setResults(data.foods || []);
    } catch (err) {
      console.error('Error searching foods:', err);
      setError(err instanceof Error ? err.message : 'Failed to search foods');
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
      
      // Process the food data to ensure consistent structure
      const processedFood: DetailedFoodItem = {
        fdcId: foodData.fdcId,
        description: foodData.description,
        brandOwner: foodData.brandOwner,
        nutrients: [],
        foodNutrients: foodData.foodNutrients || []
      };

      setSelectedFood(processedFood);
      console.log('Processed food data:', processedFood); // For debugging
    } catch (err) {
      console.error('Error fetching food details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch food details');
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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Search Foods</h2>
        
        {/* Search Input */}
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

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            {results.map((food) => (
              <button
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

        {/* Selected Food Details */}
        {selectedFood && (
          <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">{selectedFood.description}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Macronutrients</h4>
                <div className="text-sm space-y-1">
                  {COMMON_NUTRIENTS.slice(0, 5).map(nutrient => (
                    <p key={nutrient.name}>
                      {nutrient.label}: {getNutrientValue(nutrient.name)}
                    </p>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Micronutrients</h4>
                <div className="text-sm space-y-1">
                  {COMMON_NUTRIENTS.slice(5).map(nutrient => (
                    <p key={nutrient.name}>
                      {nutrient.label}: {getNutrientValue(nutrient.name)}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Debug Information */}
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-500">Available Nutrients:</h4>
              <div className="text-xs text-gray-500 mt-2">
                {selectedFood.foodNutrients.map((n, i) => (
                  <div key={i}>{n.nutrient?.name}: {n.amount} {n.nutrient?.unitName}</div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={() => {
                console.log('Saving food:', selectedFood);
              }}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Save Food Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}