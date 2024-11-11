'use client';

import { useEffect, useState } from 'react';
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
