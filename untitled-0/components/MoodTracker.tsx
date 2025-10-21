import React, { useState, useEffect } from 'react';
import type { Mood, MoodLog } from '../types';
import { MOODS } from '../constants';

interface MoodTrackerProps {
}

const MOOD_HEATMAP_COLORS: Record<string, string> = {
    'Glücklich': 'bg-green-600',
    'Gut':       'bg-green-400',
    'Neutral':   'bg-slate-300',
    'Verwirrt':  'bg-sky-400',
    'Besorgt':   'bg-amber-500',
    'Traurig':   'bg-blue-600',
    'Wütend':    'bg-red-600',
};

const MOOD_TEXT_COLORS: Record<string, string> = {
    'Glücklich': 'text-white',
    'Gut':       'text-green-900 font-medium',
    'Neutral':   'text-slate-700',
    'Verwirrt':  'text-sky-900 font-medium',
    'Besorgt':   'text-white',
    'Traurig':   'text-white',
    'Wütend':    'text-white',
};


const MoodDetailModal: React.FC<{ log: MoodLog; onClose: () => void }> = ({ log, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center mb-4">
                    <span className="text-5xl mr-4">{log.emoji}</span>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-800">{log.label}</h3>
                        <p className="text-sm text-slate-500">
                            {new Date(log.date).toLocaleString('de-DE', { dateStyle: 'full', timeStyle: 'short' })}
                        </p>
                    </div>
                </div>
                {log.thoughts && (
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-slate-700 italic">"{log.thoughts}"</p>
                    </div>
                )}
                <button onClick={onClose} className="mt-6 w-full py-2 bg-indigo-500 text-white font-semibold rounded-full hover:bg-indigo-600 transition-colors">
                    Schließen
                </button>
            </div>
        </div>
    );
};

const CalendarView: React.FC<{
    logs: MoodLog[];
    onSelectLog: (log: MoodLog) => void;
}> = ({ logs, onSelectLog }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDayOfWeek = (startOfMonth.getDay() + 6) % 7; // 0=Monday, 6=Sunday
    const daysInMonth = endOfMonth.getDate();

    const days = Array.from({ length: startDayOfWeek }, () => null).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    const logsByDate = logs.reduce((acc, log) => {
        const dateKey = new Date(log.date).toDateString();
        acc[dateKey] = log;
        return acc;
    }, {} as Record<string, MoodLog>);

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100">&lt;</button>
                <h4 className="font-semibold text-lg text-slate-700">
                    {currentDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' })}
                </h4>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 font-medium mb-2">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
                {days.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`} />;
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const log = logsByDate[date.toDateString()];
                    const isToday = new Date().toDateString() === date.toDateString();

                    let buttonClasses = 'bg-slate-50 hover:bg-slate-100';
                    let textClasses = 'text-slate-600';

                    if (log) {
                        buttonClasses = `${MOOD_HEATMAP_COLORS[log.label] || 'bg-slate-200'} hover:brightness-110`;
                        textClasses = MOOD_TEXT_COLORS[log.label] || 'text-slate-800';
                    }

                    if (isToday) {
                        buttonClasses += ' ring-2 ring-indigo-500';
                        if (!log) {
                            textClasses = 'font-bold text-indigo-600';
                        } else {
                            textClasses += ' font-bold';
                        }
                    }
                    
                    return (
                        <button
                            key={day}
                            onClick={() => log && onSelectLog(log)}
                            className={`relative w-full aspect-square flex items-center justify-center rounded-lg transition-all duration-200 disabled:cursor-default disabled:hover:brightness-100 ${buttonClasses}`}
                            disabled={!log}
                        >
                            <span className={textClasses}>
                                {day}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};


const MoodTracker: React.FC<MoodTrackerProps> = () => {
    const [moodLogs, setMoodLogs] = useState<MoodLog[]>(() => {
        try {
            const savedLogs = localStorage.getItem('mood_logs');
            return savedLogs ? JSON.parse(savedLogs) : [];
        } catch (error) {
            console.error("Error reading mood logs from localStorage", error);
            return [];
        }
    });
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [thoughts, setThoughts] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [historyView, setHistoryView] = useState<'list' | 'calendar'>('list');
    const [selectedLogForModal, setSelectedLogForModal] = useState<MoodLog | null>(null);
    const [hasLoggedToday, setHasLoggedToday] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem('mood_logs', JSON.stringify(moodLogs));

            const today = new Date().toDateString();
            const loggedToday = moodLogs.some(log => new Date(log.date).toDateString() === today);
            setHasLoggedToday(loggedToday);
        } catch (error) {
            console.error("Error saving mood logs to localStorage", error);
        }
    }, [moodLogs]);
    
    const handleMoodSelect = (mood: Mood) => {
        setSelectedMood(mood);
    };

    const handleSaveLog = () => {
        if (!selectedMood) return;

        const newLog: MoodLog = {
            id: new Date().toISOString(),
            ...selectedMood,
            date: new Date().toISOString(),
            thoughts: thoughts.trim() || undefined,
        };

        setMoodLogs(prevLogs => 
            [newLog, ...prevLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
        
        setSelectedMood(null);
        setThoughts('');
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);
    };

    if (showConfirmation) {
        return (
             <div className="flex flex-col items-center justify-center text-center p-4 animate-fade-in h-full">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-semibold text-green-600">Stimmung gespeichert!</h2>
                <p className="text-slate-500 mt-1">Danke, dass du deine Gefühle teilst.</p>
            </div>
        )
    }

    if (selectedMood) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <h2 className="text-2xl font-semibold text-slate-700 mb-2">Wie fühlst du dich?</h2>
                <div className="text-6xl mb-4">{selectedMood.emoji}</div>
                <p className="text-lg font-medium text-slate-600 mb-6">{selectedMood.label}</p>
                <textarea
                    value={thoughts}
                    onChange={(e) => setThoughts(e.target.value)}
                    placeholder="Möchtest du mehr darüber erzählen? (Optional)"
                    className="w-full max-w-md p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
                    rows={4}
                />
                <div className="flex space-x-4">
                    <button onClick={() => setSelectedMood(null)} className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-300 transition-colors">
                        Zurück
                    </button>
                    <button onClick={handleSaveLog} className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-full hover:bg-indigo-600 transition-colors">
                        Speichern
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            {selectedLogForModal && <MoodDetailModal log={selectedLogForModal} onClose={() => setSelectedLogForModal(null)} />}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-700">Wie geht es dir heute?</h2>
                <p className="text-slate-500 mt-2">
                    {hasLoggedToday ? "Du hast deine Stimmung heute bereits erfasst." : "Wähle ein Emoji, das deine aktuelle Stimmung am besten beschreibt."}
                </p>
            </div>

            {!hasLoggedToday && (
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 mb-8">
                    {MOODS.map(mood => (
                        <button
                            key={mood.label}
                            onClick={() => handleMoodSelect(mood)}
                            className="flex flex-col items-center p-3 rounded-xl bg-slate-100 hover:bg-indigo-100 hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <span className="text-4xl mb-2">{mood.emoji}</span>
                            <span className="text-xs text-slate-600">{mood.label}</span>
                        </button>
                    ))}
                </div>
            )}
            
            <div className="border-t border-slate-200 pt-4 flex-grow flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-3 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-slate-700">Stimmungsverlauf</h3>
                    <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-full">
                        <button onClick={() => setHistoryView('list')} className={`p-1.5 rounded-full ${historyView === 'list' ? 'bg-white shadow' : 'text-slate-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                        </button>
                        <button onClick={() => setHistoryView('calendar')} className={`p-1.5 rounded-full ${historyView === 'calendar' ? 'bg-white shadow' : 'text-slate-500'}`}>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto pr-2">
                    {moodLogs.length > 0 ? (
                        historyView === 'list' ? (
                            <ul className="space-y-3 animate-fade-in">
                                {moodLogs.map(log => (
                                    <li key={log.id} className="flex items-center bg-slate-50 p-3 rounded-lg">
                                        <span className="text-3xl mr-4">{log.emoji}</span>
                                        <div className="flex-grow">
                                            <p className="font-semibold text-slate-800">{log.label}</p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(log.date).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                            {log.thoughts && (
                                                <p className="text-sm text-slate-600 mt-1 italic">"{log.thoughts}"</p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <CalendarView logs={moodLogs} onSelectLog={setSelectedLogForModal} />
                        )
                    ) : (
                        <div className="text-center text-slate-500 py-8">
                            <p>Noch keine Einträge vorhanden.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MoodTracker;