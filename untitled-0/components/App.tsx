import React, { useState } from 'react';
import { Feature } from './types';
import Header from './components/Header';
import AIChat from './components/AIChat';
import BreathingExercise from './components/BreathingExercise';
import MoodTracker from './components/MoodTracker';
import AffirmationCard from './components/AffirmationCard';
import Navigation from './components/Navigation';
import ThoughtRecord from './components/ThoughtRecord';
import Goals from './components/Goals';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.Chat);

  const renderFeature = () => {
    switch (activeFeature) {
      case Feature.Chat:
        return <AIChat />;
      case Feature.Breathing:
        return <BreathingExercise />;
      case Feature.Mood:
        return <MoodTracker />;
      case Feature.Affirmation:
        return <AffirmationCard />;
      case Feature.Gedankenprotokoll:
        return <ThoughtRecord />;
      case Feature.Ziele:
        return <Goals />;
      default:
        return <AIChat />;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800 flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto p-4 flex flex-col h-screen">
        <Header />
        <Navigation activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
        <main className="flex-grow bg-white rounded-b-xl shadow-lg p-4 sm:p-6 overflow-y-auto">
          {renderFeature()}
        </main>
      </div>
    </div>
  );
};

export default App;