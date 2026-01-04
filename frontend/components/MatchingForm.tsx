'use client';

import { useState, useRef } from 'react';
import Stepper, { Step } from './ui/Stepper';
import { CountryDropdown } from 'react-country-region-selector';

interface MatchingFormProps {
  onSubmit: (data: { mood: string; age: number; country: string }) => void;
}

const MOODS = ['STRESS', 'LONELY', 'BURNOUT', 'PANIC','OTHER'];


export default function MatchingForm({ onSubmit }: MatchingFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleFinalStepCompleted = () => {
    // Validate all fields
    if (!selectedMood || !selectedAge || !selectedCountry) {
      if (formRef.current) {
        formRef.current.reportValidity();
      }
      return;
    }

    const age = parseInt(selectedAge);
    if (age < 13 || age > 120) {
      if (formRef.current) {
        formRef.current.reportValidity();
      }
      return;
    }

    // Submit the form data
    onSubmit({ 
      mood: selectedMood, 
      age: age, 
      country: selectedCountry 
    });
  };

  return (
    <form 
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
    >
      <Stepper
        initialStep={1}
        onFinalStepCompleted={handleFinalStepCompleted}
        backButtonText="Back"
        nextButtonText="Continue"
        contentClassName="text-center"
        nextButtonProps={{
          type: 'button'
        }}
        backButtonProps={{
          type: 'button'
        }}
      >
        <Step>
          <MoodSelectionStep 
            selectedMood={selectedMood}
            onMoodSelect={setSelectedMood}
          />
        </Step>
        <Step>
          <AgeInputStep 
            selectedAge={selectedAge}
            onAgeChange={setSelectedAge}
          />
        </Step>
        <Step>
          <CountrySelectionStep 
            selectedCountry={selectedCountry}
            onCountrySelect={setSelectedCountry}
          />
        </Step>
      </Stepper>
    </form>
  );
}

function MoodSelectionStep({ 
  selectedMood, 
  onMoodSelect 
}: { 
  selectedMood: string; 
  onMoodSelect: (mood: string) => void; 
}) {
  return (
    <div className="text-center">
      <h2 className="h1 text-white mb-3 sm:mb-4">
        How are you feeling?
      </h2>
      <p className="text-sm sm:text-base text-white/80 mb-6 sm:mb-8">
        Pick what fits best right now.
      </p>
      <div className="flex flex-col gap-3 sm:gap-4">
        {MOODS.map((mood) => (
          <div
            key={mood}>
            <button
              type="button"
              onClick={() => onMoodSelect(mood)}
              className={`w-full p-3 sm:p-4 text-base sm:text-lg font-medium rounded-xl cursor-pointer transition-all duration-200 hover-lift relative overflow-hidden ${
                selectedMood === mood
                  ? 'bg-white text-blue-600 shadow-xl shadow-white/20 scale-[1.02]'
                  : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:shadow-md'
              }`}>
              {mood}
            </button>
         </div>
        ))}
      </div>
    </div>
  );
}

function AgeInputStep({ 
  selectedAge, 
  onAgeChange 
}: { 
  selectedAge: string; 
  onAgeChange: (age: string) => void; 
}) {
  return (
      <div className="text-center">
        <h2 
        className="text-2xl sm:text-3xl font-semibold text-white mb-3 sm:mb-4"
      >
        What&apos;s your age?
      </h2>
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <input
            type="number"
            name="age"
            value={selectedAge}
            onChange={(e) => onAgeChange(e.target.value)}
            placeholder="Enter your age"
            className="w-full p-3 sm:p-4 text-base sm:text-lg text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20"
            min="13"
            max="120"
            required
          />
        </div>
      </div>
    </div>
  );
}

function CountrySelectionStep({ 
  selectedCountry, 
  onCountrySelect 
}: { 
  selectedCountry: string; 
  onCountrySelect: (country: string) => void; 
}) {
  return (
    <div className="text-center">
      <h2 
        className="h1 text-white mb-4 sm:mb-6">
        Where are you located?
      </h2>
      <div className="max-w-md mx-auto">
        <div className="mb-4 country-select-wrapper">
          <CountryDropdown
            value={selectedCountry}
            onChange={(val) => onCountrySelect(val)}
            defaultOptionLabel="Select your country..."
            priorityOptions={['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'IN', 'CN', 'JP', 'KR', 'BR', 'MX', 'AR', 'ZA', 'NZ', 'IE']}
          />
        </div>
      </div>
    </div>
  );
}
