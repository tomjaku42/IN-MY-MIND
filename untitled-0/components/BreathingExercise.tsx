
import React, { useState, useEffect } from 'react';

const BreathingExercise: React.FC = () => {
  const [phase, setPhase] = useState<'Einatmen' | 'Halten' | 'Ausatmen'>('Einatmen');
  const [text, setText] = useState('Bereit machen...');

  useEffect(() => {
    const cycle = () => {
      setText('Einatmen');
      setPhase('Einatmen');
      setTimeout(() => {
        setText('Halten');
        setPhase('Halten');
        setTimeout(() => {
          setText('Ausatmen');
          setPhase('Ausatmen');
        }, 4000); // Hold for 4s
      }, 4000); // Inhale for 4s
    };
    
    // Initial start
    const startTimeout = setTimeout(cycle, 1500);
    // Interval for subsequent cycles
    const interval = setInterval(cycle, 12000); // 4s in + 4s hold + 4s out = 12s total

    return () => {
      clearTimeout(startTimeout);
      clearInterval(interval);
    };
  }, []);

  const getAnimationClasses = () => {
    switch (phase) {
      case 'Einatmen':
        return 'scale-100 opacity-100';
      case 'Halten':
        return 'scale-100 opacity-100';
      case 'Ausatmen':
        return 'scale-50 opacity-70';
      default:
        return 'scale-50 opacity-70';
    }
  };

  const getDurationClass = () => {
    switch (phase) {
        case 'Einatmen':
            return 'duration-[4000ms]';
        case 'Halten':
            return 'duration-[4000ms]';
        case 'Ausatmen':
            return 'duration-[4000ms]';
        default:
            return 'duration-1000';
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-2xl font-semibold text-slate-700 mb-4">Geführte Atemübung</h2>
      <p className="text-slate-500 mb-8">Folge dem Kreis, um deinen Geist zu beruhigen.</p>
      <div className="relative w-64 h-64 flex items-center justify-center">
        <div className="absolute w-full h-full bg-teal-100 rounded-full animate-pulse" />
        <div
          className={`absolute w-full h-full bg-teal-300 rounded-full transition-all ease-in-out ${getDurationClass()} ${getAnimationClasses()}`}
        />
        <span className="relative text-2xl font-medium text-teal-800 z-10">{text}</span>
      </div>
    </div>
  );
};

export default BreathingExercise;