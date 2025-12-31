'use client';

import { useState } from 'react';
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatchingFormProps {
  sessionId: string;
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

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
  'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark',
  'India', 'China', 'Japan', 'South Korea', 'Singapore', 'Brazil', 'Mexico',
  'Argentina', 'South Africa', 'New Zealand', 'Ireland', 'Switzerland',
  'Austria', 'Belgium', 'Poland', 'Portugal', 'Greece', 'Other'
];

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function MatchingForm({ sessionId, onSubmit }: MatchingFormProps) {
  const [step, setStep] = useState(1); // 1: mood, 2: age, 3: country
  const [formData, setFormData] = useState({
    mood: '',
    age: 0,
    country: ''
  });

  const handleMoodSelect = (mood: string) => {
    setFormData({ ...formData, mood });
    setStep(2);
  };

  const handleAgeSubmit = (age: number) => {
    setFormData({ ...formData, age });
    setStep(3);
  };

  const handleCountrySelect = (country: string) => {
    setFormData({ ...formData, country });
    onSubmit({ ...formData, country });
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="text-center w-full">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Step 1: Mood Selection */}
        {step === 1 && (
          <motion.div variants={itemVariants}>
            <motion.h2 
              className="h1 text-white mb-4 sm:mb-6"
              variants={itemVariants}
            >
              How are you feeling?
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-12"
              variants={itemVariants}
            >
              Select the mood that best describes how you're feeling right now
            </motion.p>
            <div className="flex flex-col gap-4 sm:gap-6">
              {MOODS.map((mood, index) => (
                <motion.div
                  key={mood}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.button
                    onClick={() => handleMoodSelect(mood)}
                    className="w-full p-4 sm:p-6 text-lg sm:text-xl font-medium rounded-lg cursor-pointer transition-all duration-300 hover-lift relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {MOOD_DISPLAY_NAMES[mood] || mood}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Age Input */}
        {step === 2 && (
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <motion.h2 
              className="h1 text-white mb-4 sm:mb-6"
              variants={itemVariants}
            >
              What's your age?
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-12"
              variants={itemVariants}
            >
              Please enter your age to help us match you better
            </motion.p>
            <AgeInput onAgeSubmit={handleAgeSubmit} onBack={handleBack} />
          </motion.div>
        )}

        {/* Step 3: Country Selection */}
        {step === 3 && (
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <motion.h2 
              className="h1 text-white mb-4 sm:mb-6"
              variants={itemVariants}
            >
              Where are you located?
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-12"
              variants={itemVariants}
            >
              Select your country of residence
            </motion.p>
            <CountrySelect onCountrySelect={handleCountrySelect} onBack={handleBack} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function AgeInput({ onAgeSubmit, onBack }: { onAgeSubmit: (age: number) => void; onBack: () => void }) {
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
      setError('Please enter a valid age between 13 and 120');
      return;
    }
    onAgeSubmit(ageNum);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-6">
        <input
          type="number"
          value={age}
          onChange={(e) => {
            setAge(e.target.value);
            setError('');
          }}
          placeholder="Enter your age"
          className="w-full p-4 sm:p-6 text-lg sm:text-xl text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20"
          min="13"
          max="120"
          required
        />
        {error && <p className="text-red-300 mt-2 text-sm">{error}</p>}
      </div>
      <div className="flex gap-4 justify-center">
        <Button
          type="button"
          onClick={onBack}
          className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button type="submit" className="bg-white text-blue-600 hover:bg-white/90">
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}

function CountrySelect({ onCountrySelect, onBack }: { onCountrySelect: (country: string) => void; onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filteredCountries = COUNTRIES.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (country: string) => {
    setSelected(country);
    onCountrySelect(country);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for your country..."
          className="w-full p-4 text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20"
        />
      </div>
      <div className="max-h-96 overflow-y-auto flex flex-col gap-3 mb-6">
        {filteredCountries.map((country, index) => (
          <motion.button
            key={country}
            onClick={() => handleSelect(country)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className={`
              w-full p-4 text-lg font-medium rounded-lg cursor-pointer transition-all duration-300 hover-lift relative overflow-hidden text-left
              ${selected === country 
                ? 'bg-white text-blue-600 shadow-lg' 
                : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
              }
            `}
            whileHover={{ scale: selected === country ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {country}
          </motion.button>
        ))}
      </div>
      <Button
        type="button"
        onClick={onBack}
        className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back
      </Button>
    </div>
  );
}

