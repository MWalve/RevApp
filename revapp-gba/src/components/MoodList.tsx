import React from 'react';

interface MoodEntry {
  id: number;
  mood: number;
  note: string;
  createdAt: string;
}

interface MoodListProps {
  moodEntries: MoodEntry[];
}

const MoodList: React.FC<MoodListProps> = ({ moodEntries }) => {
  return (
    <div className="space-y-4">
      {moodEntries.map((entry) => (
        <div key={entry.id} className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Mood: {entry.mood}/10</span>
            <span className="text-sm text-gray-500">
              {new Date(entry.createdAt).toLocaleString()}
            </span>
          </div>
          {entry.note && <p className="mt-2 text-gray-600">{entry.note}</p>}
        </div>
      ))}
    </div>
  );
};

export default MoodList;