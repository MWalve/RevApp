-- gutSync Database Schema
-- Run this in your Supabase SQL Editor to set up all required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Basic Moods Table (legacy)
CREATE TABLE IF NOT EXISTS moods (
  id SERIAL PRIMARY KEY,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 10),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enhanced Mood Assessments
CREATE TABLE IF NOT EXISTS enhanced_mood_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anxiety_level INTEGER NOT NULL CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
  energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 10),
  mental_clarity INTEGER NOT NULL CHECK (mental_clarity >= 1 AND mental_clarity <= 10),
  digestive_comfort INTEGER NOT NULL CHECK (digestive_comfort >= 1 AND digestive_comfort <= 10),
  overall_mood INTEGER NOT NULL CHECK (overall_mood >= 1 AND overall_mood <= 10),
  notes TEXT,
  time_of_day VARCHAR(20) CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'night')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Symptoms Reference Table
CREATE TABLE IF NOT EXISTS symptoms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Mood-Symptoms Junction Table
CREATE TABLE IF NOT EXISTS mood_symptoms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mood_assessment_id UUID NOT NULL REFERENCES enhanced_mood_assessments(id) ON DELETE CASCADE,
  symptom_id UUID NOT NULL REFERENCES symptoms(id) ON DELETE CASCADE,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mood_assessment_id, symptom_id)
);

-- 5. Food Items Table
CREATE TABLE IF NOT EXISTS food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  nutrition_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Food Logs Table
CREATE TABLE IF NOT EXISTS food_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  food_item_id UUID NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
  portion_size VARCHAR(100),
  meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  notes TEXT,
  consumed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default symptoms
INSERT INTO symptoms (name, category, description) VALUES
  ('Bloating', 'digestive', 'Feeling of fullness or swelling in abdomen'),
  ('Nausea', 'digestive', 'Feeling of sickness with urge to vomit'),
  ('Stomach Pain', 'digestive', 'Abdominal discomfort or pain'),
  ('Constipation', 'digestive', 'Difficulty passing stools'),
  ('Diarrhea', 'digestive', 'Loose or watery stools'),
  ('Headache', 'physical', 'Pain in head or neck region'),
  ('Fatigue', 'physical', 'Extreme tiredness or lack of energy'),
  ('Brain Fog', 'cognitive', 'Difficulty concentrating or thinking clearly'),
  ('Anxiety', 'mental', 'Feeling of worry or unease'),
  ('Irritability', 'mental', 'Easily annoyed or angered'),
  ('Low Mood', 'mental', 'Feeling sad or down'),
  ('Restlessness', 'physical', 'Unable to rest or relax')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mood_assessments_created_at ON enhanced_mood_assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_food_logs_consumed_at ON food_logs(consumed_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_symptoms_mood_id ON mood_symptoms(mood_assessment_id);
CREATE INDEX IF NOT EXISTS idx_food_logs_food_item_id ON food_logs(food_item_id);

-- Enable Row Level Security (RLS) - Important for multi-user!
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhanced_mood_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (change when adding auth)
-- WARNING: These allow anyone to read/write. Update with auth!
CREATE POLICY "Public can view symptoms" ON symptoms FOR SELECT USING (true);
CREATE POLICY "Public can insert moods" ON moods FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view moods" ON moods FOR SELECT USING (true);
CREATE POLICY "Public can insert enhanced moods" ON enhanced_mood_assessments FOR ALL USING (true);
CREATE POLICY "Public can view enhanced moods" ON enhanced_mood_assessments FOR SELECT USING (true);
CREATE POLICY "Public can manage mood symptoms" ON mood_symptoms FOR ALL USING (true);
CREATE POLICY "Public can manage food items" ON food_items FOR ALL USING (true);
CREATE POLICY "Public can manage food logs" ON food_logs FOR ALL USING (true);

-- Optional: Create a view for easy correlation queries
CREATE OR REPLACE VIEW mood_food_correlation AS
SELECT 
  fl.consumed_at::date as date,
  fi.name as food_name,
  jsonb_extract_path_text(fi.nutrition_data, 'categories') as food_categories,
  ema.overall_mood,
  ema.digestive_comfort,
  ema.mental_clarity,
  ema.anxiety_level
FROM food_logs fl
JOIN food_items fi ON fl.food_item_id = fi.id
LEFT JOIN enhanced_mood_assessments ema 
  ON ema.created_at::date = fl.consumed_at::date
ORDER BY fl.consumed_at DESC;

COMMENT ON TABLE moods IS 'Legacy simple mood tracking';
COMMENT ON TABLE enhanced_mood_assessments IS 'Detailed mood assessments with multiple dimensions';
COMMENT ON TABLE symptoms IS 'Reference table for available symptoms';
COMMENT ON TABLE mood_symptoms IS 'Links mood assessments to symptoms';
COMMENT ON TABLE food_items IS 'Food items with nutritional data';
COMMENT ON TABLE food_logs IS 'Log of food consumption';

