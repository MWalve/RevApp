/**
 * Mood Service - Data Access Layer for Mood-related operations
 * 
 * This service abstracts Supabase operations for moods,
 * making it easier to test, maintain, and potentially switch databases.
 */

import { supabase } from '@/lib/supabase';

export interface MoodEntry {
  id?: number | string;
  mood?: number;
  note?: string;
  created_at?: string;
}

export interface EnhancedMoodEntry {
  id?: string;
  anxiety_level: number;
  energy_level: number;
  mental_clarity: number;
  digestive_comfort: number;
  overall_mood: number;
  notes?: string;
  time_of_day: 'morning' | 'afternoon' | 'evening' | 'night';
  created_at?: string;
}

export interface Symptom {
  id: string;
  name: string;
  category: string;
  description: string;
}

export class MoodService {
  /**
   * Get all basic moods, sorted by most recent
   */
  static async getBasicMoods(limit: number = 50) {
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  /**
   * Get all enhanced mood assessments with symptoms
   */
  static async getEnhancedMoods(limit: number = 50) {
    const { data, error } = await supabase
      .from('enhanced_mood_assessments')
      .select(`
        *,
        mood_symptoms (
          symptoms (
            name,
            category
          ),
          intensity
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  /**
   * Create a basic mood entry
   */
  static async createBasicMood(mood: number, note?: string) {
    const { data, error } = await supabase
      .from('moods')
      .insert([{
        mood,
        note: note || '',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create an enhanced mood assessment
   */
  static async createEnhancedMood(
    assessment: EnhancedMoodEntry,
    symptomIds: string[] = []
  ) {
    // Insert mood assessment
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('enhanced_mood_assessments')
      .insert([{
        anxiety_level: assessment.anxiety_level,
        energy_level: assessment.energy_level,
        mental_clarity: assessment.mental_clarity,
        digestive_comfort: assessment.digestive_comfort,
        overall_mood: assessment.overall_mood,
        notes: assessment.notes,
        time_of_day: assessment.time_of_day,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (assessmentError) throw assessmentError;

    // If symptoms provided, link them
    if (symptomIds.length > 0 && assessmentData?.id) {
      const symptomInserts = symptomIds.map(symptomId => ({
        mood_assessment_id: assessmentData.id,
        symptom_id: symptomId,
        intensity: 3 // Default intensity
      }));

      const { error: symptomsError } = await supabase
        .from('mood_symptoms')
        .insert(symptomInserts);

      if (symptomsError) throw symptomsError;
    }

    return assessmentData;
  }

  /**
   * Get all available symptoms
   */
  static async getSymptoms() {
    const { data, error } = await supabase
      .from('symptoms')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return data as Symptom[];
  }

  /**
   * Get mood statistics for a date range
   */
  static async getMoodStats(startDate: Date, endDate: Date) {
    const { data, error } = await supabase
      .from('enhanced_mood_assessments')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Calculate averages
    if (!data || data.length === 0) {
      return {
        count: 0,
        averages: {
          anxiety: 0,
          energy: 0,
          clarity: 0,
          digestion: 0,
          mood: 0
        }
      };
    }

    const averages = {
      anxiety: data.reduce((sum, m) => sum + m.anxiety_level, 0) / data.length,
      energy: data.reduce((sum, m) => sum + m.energy_level, 0) / data.length,
      clarity: data.reduce((sum, m) => sum + m.mental_clarity, 0) / data.length,
      digestion: data.reduce((sum, m) => sum + m.digestive_comfort, 0) / data.length,
      mood: data.reduce((sum, m) => sum + m.overall_mood, 0) / data.length
    };

    return {
      count: data.length,
      averages,
      entries: data
    };
  }

  /**
   * Delete a mood entry (basic or enhanced)
   */
  static async deleteMood(id: string | number, type: 'basic' | 'enhanced' = 'enhanced') {
    const table = type === 'basic' ? 'moods' : 'enhanced_mood_assessments';
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

