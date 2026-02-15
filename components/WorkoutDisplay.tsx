import React from 'react';
import { WorkoutDay } from '../types';
import { Youtube, Info, AlertTriangle, Clock, Repeat } from 'lucide-react';

interface WorkoutDisplayProps {
  schedule: WorkoutDay[];
}

export const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ schedule }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {schedule.map((day, dayIndex) => (
        <div key={dayIndex} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-neutral-800/60 p-4 border-b border-neutral-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-orange-500">{day.day}</h3>
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold bg-neutral-950 px-3 py-1 rounded-full">
              {day.exercises.length} Exercises
            </span>
          </div>
          
          <div className="p-4 md:p-6 space-y-6">
            {day.exercises.map((ex, exIndex) => (
              <div key={exIndex} className="flex flex-col md:flex-row gap-6 pb-6 border-b border-neutral-800 last:border-0 last:pb-0">
                {/* Exercise Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white">{ex.name}</h4>
                    <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-1 rounded border border-neutral-700">
                      {ex.muscle}
                    </span>
                  </div>
                  
                  <div className="flex gap-4 text-sm text-neutral-300">
                    <div className="flex items-center gap-1.5 bg-neutral-800 px-3 py-1.5 rounded-lg">
                      <Repeat size={14} className="text-orange-500" />
                      <span>{ex.sets} Sets x {ex.reps}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-neutral-800 px-3 py-1.5 rounded-lg">
                      <Clock size={14} className="text-orange-500" />
                      <span>Rest: {ex.rest}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mt-2">
                    <div className="flex gap-2 items-start text-sm text-gray-400">
                       <Info size={16} className="text-blue-400 mt-0.5 shrink-0" />
                       <p><span className="text-blue-400 font-semibold">Tip:</span> {ex.postureTips}</p>
                    </div>
                    <div className="flex gap-2 items-start text-sm text-gray-400">
                       <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
                       <p><span className="text-red-400 font-semibold">Mistake:</span> {ex.mistakes}</p>
                    </div>
                  </div>
                </div>

                {/* Video Link */}
                <div className="md:w-48 shrink-0 flex items-center justify-center md:justify-end">
                  <a 
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.youtubeQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full md:w-auto justify-center"
                  >
                    <Youtube size={20} />
                    Watch Guide
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
