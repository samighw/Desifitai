import React, { useState } from 'react';
import { UserProfile, Gender, Goal, Experience, Location, TimeAvailable } from '../types';
import { Input, Select } from './Input';
import { Button } from './Button';
import { Dumbbell, ChevronRight, Activity, Clock, MapPin } from 'lucide-react';

interface OnboardingFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    gender: 'Male',
    goal: 'Muscle Gain',
    experience: 'Intermediate',
    location: 'Gym',
    timeAvailable: '45 min',
    injuries: ''
  });

  const handleChange = (field: keyof UserProfile, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleFinalSubmit = () => {
    if (formData.age && formData.weight && formData.height) {
      onSubmit(formData as UserProfile);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Dumbbell className="text-orange-500" /> DesiFit Onboarding
        </h2>
        <p className="text-neutral-400">Let's build your perfect plan, Bhai!</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-neutral-800 w-full">
          <div 
            className="h-full bg-orange-600 transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="bg-orange-600/20 text-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Basic Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Age" 
                type="number" 
                value={formData.age || ''} 
                onChange={(e) => handleChange('age', parseInt(e.target.value))}
                placeholder="e.g. 25"
              />
              <Select 
                label="Gender" 
                value={formData.gender} 
                onChange={(e) => handleChange('gender', e.target.value)}
                options={['Male', 'Female', 'Other']}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input 
                label="Height (cm)" 
                type="number" 
                value={formData.height || ''} 
                onChange={(e) => handleChange('height', parseInt(e.target.value))}
                placeholder="e.g. 175"
              />
              <Input 
                label="Weight (kg)" 
                type="number" 
                value={formData.weight || ''} 
                onChange={(e) => handleChange('weight', parseInt(e.target.value))}
                placeholder="e.g. 70"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
             <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="bg-orange-600/20 text-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Goals & Experience
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select 
                  label="Fitness Goal" 
                  value={formData.goal} 
                  onChange={(e) => handleChange('goal', e.target.value)}
                  options={['Fat Loss', 'Muscle Gain', 'Strength', 'General Fitness']}
                />
                <Select 
                  label="Experience Level" 
                  value={formData.experience} 
                  onChange={(e) => handleChange('experience', e.target.value)}
                  options={['Beginner', 'Intermediate', 'Advanced']}
                />
              </div>
              
              <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700/50">
                 <p className="text-sm text-neutral-400 italic">
                   "If you are a Beginner, we will focus on form first. If Advanced, prepare for intensity!"
                 </p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="bg-orange-600/20 text-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Logistics & Health
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                label="Workout Location" 
                value={formData.location} 
                onChange={(e) => handleChange('location', e.target.value)}
                options={['Home', 'Gym']}
              />
              <Select 
                label="Time Available (Daily)" 
                value={formData.timeAvailable} 
                onChange={(e) => handleChange('timeAvailable', e.target.value)}
                options={['20-30 min', '45 min', '60+ min']}
              />
            </div>

            <Input 
              label="Any Injuries or Medical Conditions? (Optional)" 
              type="text" 
              value={formData.injuries || ''} 
              onChange={(e) => handleChange('injuries', e.target.value)}
              placeholder="e.g. Lower back pain, knee issue, or type 'None'"
            />
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 ? (
             <Button variant="secondary" onClick={handleBack} type="button">Back</Button>
          ) : (
            <div></div> // Spacer
          )}
          
          {step < 3 ? (
            <Button onClick={handleNext} type="button">
              Next <ChevronRight size={18} />
            </Button>
          ) : (
            <Button onClick={handleFinalSubmit} isLoading={isLoading}>
              Generate Plan <Activity size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
