import React from 'react';
import { Feature } from '../types';

interface NavigationProps {
  activeFeature: Feature;
  setActiveFeature: (feature: Feature) => void;
}

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
    </svg>
);

const LungsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5z"/>
        <path fillRule="evenodd" d="M1 14.5A1.5 1.5 0 012.5 13h11a1.5 1.5 0 011.5 1.5v-6A1.5 1.5 0 0113.5 7h-11A1.5 1.5 0 011 8.5v6zM2.5 8a.5.5 0 00-.5.5v6a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-6a.5.5 0 00-.5-.5h-11z" clipRule="evenodd"/>
    </svg>
);


const SmileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a.5.5 0 01.708 0 4.5 4.5 0 01-6.364 0 .5.5 0 01.708-.707 3.5 3.5 0 004.95 0 .5.5 0 010-.707z" clipRule="evenodd" />
    </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);

const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 3a1 1 0 011-1h4a1 1 0 011 1v1h-1.5a.5.5 0 00-.5.5V6h-2V4.5a.5.5 0 00-.5-.5H7V3z"/>
        <path fillRule="evenodd" d="M4.5 7A2.5 2.5 0 017 4.5h6A2.5 2.5 0 0115.5 7v.5a.5.5 0 00.5.5h1a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-1a.5.5 0 00-.5.5v.5A2.5 2.5 0 0113 14.5h-1.19a.5.5 0 00-.47.33L10.5 17.5h-1l-.84-2.67a.5.5 0 00-.47-.33H7A2.5 2.5 0 014.5 12v-.5a.5.5 0 00-.5-.5h-1a.5.5 0 01-.5-.5v-2a.5.5 0 01.5-.5h1a.5.5 0 00.5-.5V7zmM7 6.5A1.5 1.5 0 005.5 8v4A1.5 1.5 0 007 13.5h6A1.5 1.5 0 0014.5 12V8A1.5 1.5 0 0013 6.5H7z" clipRule="evenodd"/>
    </svg>
);

const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 10a3 3 0 116 0 3 3 0 01-6 0z" clipRule="evenodd" />
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M10 14a4 4 0 100-8 4 4 0 000 8zM5 10a5 5 0 1110 0 5 5 0 01-10 0z" clipRule="evenodd" />
    </svg>
);


const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const baseClasses = "flex-1 flex items-center justify-center p-3 text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  const activeClasses = "bg-white text-indigo-600 shadow-sm";
  const inactiveClasses = "bg-amber-100 text-amber-800 hover:bg-amber-200";
  const roundedClasses = "first:rounded-tl-xl last:rounded-tr-xl";

  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${roundedClasses}`}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};


const Navigation: React.FC<NavigationProps> = ({ activeFeature, setActiveFeature }) => {
  const features = [
    { id: Feature.Chat, label: Feature.Chat, icon: <ChatIcon /> },
    { id: Feature.Mood, label: Feature.Mood, icon: <SmileIcon/> },
    { id: Feature.Gedankenprotokoll, label: 'Gedanken', icon: <BrainIcon /> },
    { id: Feature.Ziele, label: Feature.Ziele, icon: <TargetIcon /> },
    { id: Feature.Breathing, label: Feature.Breathing, icon: <LungsIcon/> },
    { id: Feature.Affirmation, label: Feature.Affirmation, icon: <HeartIcon/> },
  ];

  return (
    <nav className="flex bg-amber-100 rounded-t-xl overflow-hidden">
      {features.map((feature) => (
        <NavButton
          key={feature.id}
          label={feature.label}
          icon={feature.icon}
          isActive={activeFeature === feature.id}
          onClick={() => setActiveFeature(feature.id)}
        />
      ))}
    </nav>
  );
};

export default Navigation;