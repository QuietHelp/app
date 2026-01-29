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
  const moodLabels: Record<string, string> = {
    'STRESS': '😰 Stressed',
    'LONELY': '😔 Lonely',
    'BURNOUT': '🔥 Burnout',
    'PANIC': '😨 Panic',
    'OTHER': '🤔 Other'
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
        How are you feeling?
      </h2>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 sm:mb-10">
        Pick what fits best right now.
      </p>
      <div className="flex flex-col gap-3 sm:gap-4">
        {MOODS.map((mood) => (
          <div key={mood}>
            <button
              type="button"
              onClick={() => onMoodSelect(mood)}
              className={`w-full p-4 sm:p-5 text-base sm:text-lg font-semibold rounded-xl cursor-pointer transition-all duration-200 hover-lift relative overflow-hidden ${
                selectedMood === mood
                  ? 'bg-blue-600 text-white shadow-lg dark:bg-blue-500'
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-md'
              }`}>
              {moodLabels[mood]}
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
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
        What's your age?
      </h2>
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <input
            type="number"
            name="age"
            value={selectedAge}
            onChange={(e) => onAgeChange(e.target.value)}
            placeholder="Enter your age"
            className="w-full p-4 sm:p-5 text-base sm:text-lg text-center bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
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
