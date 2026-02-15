import React, { useState, useEffect, useMemo } from 'react';
import { DietPlan } from '../types';
import { Utensils, Droplets, Flame, TrendingUp, Plus, Trash2, History } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface DietDisplayProps {
  diet: DietPlan;
}

interface WeightEntry {
  date: string;
  weight: number;
}

export const DietDisplay: React.FC<DietDisplayProps> = ({ diet }) => {
  const [currentWeight, setCurrentWeight] = useState('');
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('desifit_weight_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Sort by date just in case
        parsed.sort((a: WeightEntry, b: WeightEntry) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setWeightHistory(parsed);
      } catch (e) {
        console.error("Failed to load weight history", e);
      }
    }
  }, []);

  // Save to local storage whenever history changes
  useEffect(() => {
    localStorage.setItem('desifit_weight_history', JSON.stringify(weightHistory));
  }, [weightHistory]);

  const handleAddWeight = () => {
    if (!currentWeight) return;
    const weightVal = parseFloat(currentWeight);
    if (isNaN(weightVal) || weightVal <= 0 || weightVal > 500) return; // Simple validation

    // Use local date string (YYYY-MM-DD)
    const dateObj = new Date();
    const today = dateObj.toLocaleDateString('en-CA'); 
    
    setWeightHistory(prev => {
      // Remove existing entry for today if any, then add new
      const filtered = prev.filter(entry => entry.date !== today);
      const newHistory = [...filtered, { date: today, weight: weightVal }];
      return newHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
    setCurrentWeight('');
  };

  const deleteEntry = (dateToDelete: string) => {
    setWeightHistory(prev => prev.filter(entry => entry.date !== dateToDelete));
  };

  // Calculate Chart Data
  const chartData = useMemo(() => {
    if (weightHistory.length < 2) return null;

    const weights = weightHistory.map(w => w.weight);
    const minWeight = Math.min(...weights) - 2;
    const maxWeight = Math.max(...weights) + 2;
    const range = maxWeight - minWeight;
    
    // SVG Dimensions
    const width = 800;
    const height = 250;
    const padding = 40;

    const points = weightHistory.map((entry, index) => {
      const x = padding + (index / (weightHistory.length - 1)) * (width - 2 * padding);
      const normalizedWeight = (entry.weight - minWeight) / (range || 1);
      const y = height - padding - (normalizedWeight * (height - 2 * padding));
      return `${x},${y}`;
    }).join(' ');

    // Generate points for circles
    const circles = weightHistory.map((entry, index) => {
      const x = padding + (index / (weightHistory.length - 1)) * (width - 2 * padding);
      const normalizedWeight = (entry.weight - minWeight) / (range || 1);
      const y = height - padding - (normalizedWeight * (height - 2 * padding));
      return { x, y, val: entry.weight, date: entry.date };
    });

    return { points, circles, width, height };
  }, [weightHistory]);

  const getProgressInsight = () => {
    if (weightHistory.length < 2) return "Start logging your weight weekly to see your progress graph!";
    const first = weightHistory[0].weight;
    const last = weightHistory[weightHistory.length - 1].weight;
    const diff = last - first;
    
    if (diff < 0) return `Great job! You've lost ${Math.abs(diff).toFixed(1)}kg since starting.`;
    if (diff > 0) return `Gaining mass! You're up ${diff.toFixed(1)}kg. Ensure it's muscle!`;
    return "You are maintaining your weight perfectly.";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col items-center justify-center text-center">
          <Flame className="text-orange-500 mb-2" size={24} />
          <span className="text-2xl font-bold text-white">{diet.calories}</span>
          <span className="text-xs text-neutral-400 uppercase tracking-wide">Daily Calories</span>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col items-center justify-center text-center">
          <Utensils className="text-green-500 mb-2" size={24} />
          <span className="text-2xl font-bold text-white">{diet.proteinTarget}g</span>
          <span className="text-xs text-neutral-400 uppercase tracking-wide">Protein Target</span>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 md:p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
           <h4 className="text-lg font-bold text-white flex items-center gap-2">
             <TrendingUp className="text-orange-500" /> Progress Tracker
           </h4>
           <button 
             onClick={() => setShowHistory(!showHistory)}
             className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
           >
             <History size={14} /> {showHistory ? 'Hide Logs' : 'View Logs'}
           </button>
        </div>

        {/* Input Area */}
        <div className="flex gap-3 mb-6 items-end">
          <div className="flex-1">
            <Input 
              label="Log Today's Weight (kg)" 
              type="number" 
              placeholder="e.g. 75.5" 
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddWeight()}
            />
          </div>
          <Button onClick={handleAddWeight} disabled={!currentWeight} className="mb-0">
             <Plus size={20} /> <span className="hidden md:inline">Log</span>
          </Button>
        </div>

        {/* Graph Area */}
        <div className="bg-neutral-950/50 rounded-lg p-4 border border-neutral-800 mb-4 min-h-[200px] flex items-center justify-center relative overflow-hidden">
          {weightHistory.length === 0 ? (
            <div className="text-center text-neutral-500">
               <TrendingUp className="mx-auto mb-2 opacity-50" size={32} />
               <p>No data yet. Log your weight to start tracking!</p>
            </div>
          ) : weightHistory.length === 1 ? (
             <div className="text-center text-neutral-500">
               <div className="text-4xl font-bold text-white mb-2">{weightHistory[0].weight} <span className="text-lg text-neutral-500 font-normal">kg</span></div>
               <p>First entry logged. Keep going!</p>
            </div>
          ) : chartData ? (
             <div className="w-full h-full relative">
               <svg viewBox={`0 0 ${chartData.width} ${chartData.height}`} className="w-full h-auto drop-shadow-xl">
                 {/* Grid Lines */}
                 <line x1="40" y1="20" x2="760" y2="20" stroke="#333" strokeDasharray="4" />
                 <line x1="40" y1="125" x2="760" y2="125" stroke="#333" strokeDasharray="4" />
                 <line x1="40" y1="230" x2="760" y2="230" stroke="#333" strokeDasharray="4" />

                 {/* The Line */}
                 <polyline 
                   fill="none" 
                   stroke="#f97316" 
                   strokeWidth="3" 
                   points={chartData.points} 
                   className="drop-shadow-lg"
                 />
                 {/* Area under curve (optional, simple gradient effect) */}
                 <defs>
                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                    </linearGradient>
                 </defs>
                 <polygon 
                   points={`${40},250 ${chartData.points} ${760},250`} 
                   fill="url(#gradient)" 
                   opacity="0.5"
                 />

                 {/* Data Points */}
                 {chartData.circles.map((point, i) => (
                    <g key={i} className="group">
                      <circle cx={point.x} cy={point.y} r="5" fill="#000" stroke="#f97316" strokeWidth="2" className="transition-all duration-300 group-hover:r-7 cursor-pointer" />
                      {/* Tooltip on hover */}
                      <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <rect x={point.x - 40} y={point.y - 45} width="80" height="35" rx="4" fill="#171717" stroke="#333" />
                        <text x={point.x} y={point.y - 28} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{point.val} kg</text>
                        <text x={point.x} y={point.y - 15} textAnchor="middle" fill="#888" fontSize="9">{point.date.slice(5)}</text>
                      </g>
                    </g>
                 ))}
               </svg>
             </div>
          ) : null}
        </div>

        <p className="text-sm text-neutral-400 italic text-center">
          {getProgressInsight()}
        </p>

        {/* History List (Collapsible) */}
        {showHistory && (
          <div className="mt-6 border-t border-neutral-800 pt-4 animate-fade-in">
            <h5 className="text-sm font-bold text-neutral-300 mb-3">History</h5>
            <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
              {[...weightHistory].reverse().map((entry, idx) => (
                <div key={idx} className="flex justify-between items-center bg-neutral-800/40 p-2 rounded px-3 text-sm">
                   <span className="text-neutral-400">{entry.date}</span>
                   <div className="flex items-center gap-4">
                     <span className="font-bold text-white">{entry.weight} kg</span>
                     <button onClick={() => deleteEntry(entry.date)} className="text-red-500/50 hover:text-red-500 transition-colors">
                       <Trash2 size={14} />
                     </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Meals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "Breakfast", meals: diet.meals.breakfast, color: "border-l-yellow-500" },
          { title: "Lunch", meals: diet.meals.lunch, color: "border-l-orange-500" },
          { title: "Pre/Post Workout Snack", meals: diet.meals.snack, color: "border-l-purple-500" },
          { title: "Dinner", meals: diet.meals.dinner, color: "border-l-blue-500" },
        ].map((section) => (
          <div key={section.title} className={`bg-neutral-900 border border-neutral-800 rounded-xl p-5 border-l-4 ${section.color}`}>
            <h4 className="text-lg font-bold text-white mb-3">{section.title}</h4>
            <ul className="space-y-3">
              {section.meals.map((meal, idx) => (
                <li key={idx} className="bg-neutral-800/50 p-3 rounded-lg">
                  <p className="font-medium text-orange-200">{meal.name}</p>
                  <p className="text-sm text-neutral-400 mt-1">{meal.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Diet Tips */}
      <div className="bg-emerald-900/20 border border-emerald-900/50 rounded-xl p-6">
        <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
          <Droplets size={20} /> Nutrition & Hydration Tips
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {diet.tips.map((tip, idx) => (
            <li key={idx} className="flex gap-2 text-emerald-100/80 text-sm">
              <span className="text-emerald-500 font-bold">•</span> {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
