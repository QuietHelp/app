'use client';

import { useState, useRef } from 'react';
import { motion } from "framer-motion";
import Stepper, { Step } from './Stepper';
import { CountryDropdown } from 'react-country-region-selector';

interface MatchingFormProps {
  onSubmit: (data: { mood: string; age: number; country: string }) => void;
}

const MOODS = ['STRESS', 'LONELY', 'BURNOUT', 'PANIC', 'NOT_SURE'];

const MOOD_DISPLAY_NAMES: Record<string, string> = {
  'STRESS': 'STRESS',
  'LONELY': 'LONELY',
  'BURNOUT': 'BURNOUT',
  'PANIC': 'PANIC',
  'NOT_SURE': 'NOT SURE',
  'OTHER': 'OTHER'
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

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
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <motion.h2 
        className="text-2xl sm:text-3xl font-semibold text-white mb-3 sm:mb-4"
        variants={itemVariants}
      >
        How are you feeling?
      </motion.h2>
      <motion.p
        className="text-sm sm:text-base text-white/80 mb-6 sm:mb-8"
        variants={itemVariants}
      >
        Select the mood that best describes how you&apos;re feeling right now
      </motion.p>
      <div className="flex flex-col gap-3 sm:gap-4">
        {MOODS.map((mood, index) => (
          <motion.div
            key={mood}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.05 }}
          >
            <motion.button
              type="button"
              onClick={() => onMoodSelect(mood)}
              className={`w-full p-3 sm:p-4 text-base sm:text-lg font-medium rounded-lg cursor-pointer transition-all duration-300 hover-lift relative overflow-hidden ${
                selectedMood === mood
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {MOOD_DISPLAY_NAMES[mood] || mood}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
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
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <motion.h2 
        className="text-2xl sm:text-3xl font-semibold text-white mb-3 sm:mb-4"
        variants={itemVariants}
      >
        What&apos;s your age?
      </motion.h2>
      <motion.p
        className="text-sm sm:text-base text-white/80 mb-6 sm:mb-8"
        variants={itemVariants}
      >
        Please enter your age to help us match you better
      </motion.p>
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
    </motion.div>
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
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <motion.h2 
        className="text-2xl sm:text-3xl font-semibold text-white mb-3 sm:mb-4"
        variants={itemVariants}
      >
        Where are you located?
      </motion.h2>
      <motion.p
        className="text-sm sm:text-base text-white/80 mb-6 sm:mb-8"
        variants={itemVariants}
      >
        Select your country of residence
      </motion.p>
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
    </motion.div>
  );
}
