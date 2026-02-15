import React, { useState } from 'react';
import { OnboardingForm } from './components/OnboardingForm';
import { WorkoutDisplay } from './components/WorkoutDisplay';
import { DietDisplay } from './components/DietDisplay';
import { UserProfile, GeneratedPlan } from './types';
import { generateFitnessPlan } from './services/geminiService';
import { Dumbbell, Utensils, ShieldCheck, RefreshCw } from 'lucide-react';

function App() {
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'workout' | 'diet' | 'safety'>('workout');
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (profile: UserProfile) => {
    setLoading(true);
    setError(null);
    try {
      const generatedPlan = await generateFitnessPlan(profile);
      setPlan(generatedPlan);
    } catch (err) {
      setError("Something went wrong while generating your plan. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPlan(null);
    setActiveTab('workout');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-lg">
              <Dumbbell className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">DesiFit <span className="text-orange-500">AI</span></h1>
              <p className="text-[10px] text-neutral-400 font-medium tracking-wider uppercase">Personal Trainer</p>
            </div>
          </div>
          {plan && (
            <button 
              onClick={handleReset}
              className="text-sm text-neutral-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={14} /> New Plan
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!plan ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
             {loading ? (
                <div className="text-center space-y-6 animate-pulse">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-neutral-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <Dumbbell className="absolute inset-0 m-auto text-orange-500 opacity-50" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Analyzing Body Type...</h2>
                  <p className="text-neutral-400 max-w-md mx-auto">
                    Wait bhai, generating the best exercises and mixing your protein shake...
                  </p>
                  
                  <div className="flex justify-center gap-2 mt-4">
                     <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-75"></span>
                     <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-150"></span>
                     <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
             ) : (
                <>
                  {error && (
                    <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg mb-6 max-w-lg text-center">
                      {error}
                    </div>
                  )}
                  <OnboardingForm onSubmit={handleFormSubmit} isLoading={loading} />
                </>
             )}
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Intro Section */}
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-6 md:p-8 border border-neutral-700 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Dumbbell size={150} />
               </div>
               <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Your Custom Plan is Ready! 🚀</h2>
               <p className="text-lg text-gray-300 italic mb-4">"{plan.intro}"</p>
               <div className="flex flex-wrap gap-3">
                 <span className="bg-neutral-950/50 text-orange-400 px-3 py-1 rounded-full text-sm border border-orange-500/20">
                   Protein Goal: {plan.diet.proteinTarget}
                 </span>
                 <span className="bg-neutral-950/50 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/20">
                   Schedule: {plan.schedule.length} Days/Week
                 </span>
               </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-800 overflow-x-auto scrollbar-hide">
              {[
                { id: 'workout', label: 'Workout Plan', icon: Dumbbell },
                { id: 'diet', label: 'Diet & Nutrition', icon: Utensils },
                { id: 'safety', label: 'Safety & Warm-up', icon: ShieldCheck },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap relative ${
                    activeTab === tab.id 
                      ? 'text-orange-500' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 shadow-[0_-2px_10px_rgba(249,115,22,0.5)]"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
              {activeTab === 'workout' && <WorkoutDisplay schedule={plan.schedule} />}
              {activeTab === 'diet' && <DietDisplay diet={plan.diet} />}
              {activeTab === 'safety' && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 md:p-8 animate-fade-in">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-orange-500" /> Important Safety Guidelines
                  </h3>
                  <ul className="space-y-4">
                    {plan.safety.map((tip, idx) => (
                      <li key={idx} className="flex gap-4 items-start bg-neutral-800/30 p-4 rounded-lg">
                        <span className="flex-shrink-0 bg-orange-500/10 text-orange-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </span>
                        <p className="text-neutral-300 pt-1">{tip}</p>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8 p-6 bg-gradient-to-br from-orange-900/20 to-neutral-900 rounded-xl border border-orange-500/20 text-center">
                    <p className="text-lg font-bold text-white mb-2">Trainer's Motivation</p>
                    <p className="text-orange-200 italic">"{plan.motivation}"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-900 mt-12 py-8 text-center text-neutral-500 text-sm">
        <p>© {new Date().getFullYear()} DesiFit AI Trainer. Built for fitness enthusiasts.</p>
        <p className="mt-2 text-xs">Consult a doctor before starting any new exercise routine.</p>
      </footer>
    </div>
  );
}

export default App;
