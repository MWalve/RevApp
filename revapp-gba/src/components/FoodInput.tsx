'use client';

import { use, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { StringLiteral } from 'typescript';

interface FoodCategory {
    id: String;
    name: string;
    description: string;
    gut_health_impace: 'positive' | 'negative' | 'neutral';
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
  //const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
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
}

