
import React, { useState, useCallback, useEffect } from 'react';
import { AFFIRMATIONS } from '../constants';

const AffirmationCard: React.FC = () => {
  const [affirmation, setAffirmation] = useState('');

  const getNewAffirmation = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
    setAffirmation(AFFIRMATIONS[randomIndex]);
  }, []);

  useEffect(() => {
    getNewAffirmation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-2xl font-semibold text-slate-700 mb-4">Deine heutige Affirmation</h2>
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-8 rounded-xl shadow-md w-full max-w-md min-h-[150px] flex items-center justify-center mb-8">
        <p className="text-2xl font-medium text-slate-800">
          "{affirmation}"
        </p>
      </div>
      <button
        onClick={getNewAffirmation}
        className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        Neue Affirmation
      </button>
    </div>
  );
};

export default AffirmationCard;