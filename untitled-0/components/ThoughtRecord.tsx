import React, { useState, useEffect } from 'react';
import type { ThoughtRecord, EmotionRating } from '../types';


const EmotionEditor: React.FC<{
    emotions: EmotionRating[];
    setEmotions: (emotions: EmotionRating[]) => void;
    title: string;
}> = ({ emotions, setEmotions, title }) => {
    
    const handleAddEmotion = () => {
        setEmotions([...emotions, { name: '', intensity: 50 }]);
    };

    const handleEmotionChange = (index: number, field: keyof EmotionRating, value: string | number) => {
        const newEmotions = [...emotions];
        if (field === 'name') {
            newEmotions[index].name = value as string;
        } else if (field === 'intensity') {
            newEmotions[index].intensity = Number(value);
        }
        setEmotions(newEmotions);
    };

    const handleRemoveEmotion = (index: number) => {
        setEmotions(emotions.filter((_, i) => i !== index));
    };
    
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">{title}</label>
            {emotions.map((emotion, index) => (
                <div key={index} className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg">
                    <input
                        type="text"
                        placeholder="Emotion (z.B. Angst)"
                        value={emotion.name}
                        onChange={(e) => handleEmotionChange(index, 'name', e.target.value)}
                        className="flex-grow p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={emotion.intensity}
                        onChange={(e) => handleEmotionChange(index, 'intensity', e.target.value)}
                        className="w-24"
                    />
                    <span className="w-8 text-sm text-slate-600">{emotion.intensity}%</span>
                    <button type="button" onClick={() => handleRemoveEmotion(index)} className="text-red-500 hover:text-red-700 p-1">
                        &times;
                    </button>
                </div>
            ))}
            <button type="button" onClick={handleAddEmotion} className="text-sm text-indigo-600 hover:text-indigo-800">
                + Emotion hinzufügen
            </button>
        </div>
    );
};

const ThoughtRecordForm: React.FC<{
    onSave: (record: Omit<ThoughtRecord, 'id' | 'date'>) => void;
    onCancel: () => void;
}> = ({ onSave, onCancel }) => {
    const [situation, setSituation] = useState('');
    const [automaticThoughts, setAutomaticThoughts] = useState('');
    const [initialEmotions, setInitialEmotions] = useState<EmotionRating[]>([]);
    const [evidenceFor, setEvidenceFor] = useState('');
    const [evidenceAgainst, setEvidenceAgainst] = useState('');
    const [balancedThought, setBalancedThought] = useState('');
    const [outcomeEmotions, setOutcomeEmotions] = useState<EmotionRating[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            situation,
            automaticThoughts,
            initialEmotions: initialEmotions.filter(e => e.name.trim() !== ''),
            evidenceFor,
            evidenceAgainst,
            balancedThought,
            outcomeEmotions: outcomeEmotions.filter(e => e.name.trim() !== ''),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div>
                <label htmlFor="situation" className="block text-sm font-medium text-slate-700 mb-1">Situation</label>
                <p className="text-xs text-slate-500 mb-2">Was ist passiert? Wo warst du? Wer war dabei?</p>
                <textarea id="situation" value={situation} onChange={(e) => setSituation(e.target.value)} required rows={3} className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            
            <EmotionEditor emotions={initialEmotions} setEmotions={setInitialEmotions} title="Anfängliche Emotionen & ihre Intensität" />

            <div>
                <label htmlFor="automaticThoughts" className="block text-sm font-medium text-slate-700 mb-1">Automatische Gedanken</label>
                <p className="text-xs text-slate-500 mb-2">Was ging dir durch den Kopf? Welche Bilder oder Erinnerungen hattest du?</p>
                <textarea id="automaticThoughts" value={automaticThoughts} onChange={(e) => setAutomaticThoughts(e.target.value)} required rows={3} className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
                <label htmlFor="evidenceFor" className="block text-sm font-medium text-slate-700 mb-1">Beweise für die automatischen Gedanken</label>
                <p className="text-xs text-slate-500 mb-2">Welche Fakten oder Erfahrungen unterstützen diese Gedanken?</p>
                <textarea id="evidenceFor" value={evidenceFor} onChange={(e) => setEvidenceFor(e.target.value)} rows={3} className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            
            <div>
                <label htmlFor="evidenceAgainst" className="block text-sm font-medium text-slate-700 mb-1">Beweise gegen die automatischen Gedanken</label>
                <p className="text-xs text-slate-500 mb-2">Welche Fakten oder Erfahrungen sprechen gegen diese Gedanken?</p>
                <textarea id="evidenceAgainst" value={evidenceAgainst} onChange={(e) => setEvidenceAgainst(e.target.value)} rows={3} className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            
            <div>
                <label htmlFor="balancedThought" className="block text-sm font-medium text-slate-700 mb-1">Ausgewogener, realistischer Gedanke</label>
                <p className="text-xs text-slate-500 mb-2">Wie könntest du die Situation anders sehen? Was ist eine hilfreichere Perspektive?</p>
                <textarea id="balancedThought" value={balancedThought} onChange={(e) => setBalancedThought(e.target.value)} rows={3} className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            
            <EmotionEditor emotions={outcomeEmotions} setEmotions={setOutcomeEmotions} title="Emotionen nach der Neubewertung & ihre Intensität" />

            <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
                <button type="button" onClick={onCancel} className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-300 transition-colors">
                    Abbrechen
                </button>
                <button type="submit" className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-full hover:bg-indigo-600 transition-colors">
                    Protokoll speichern
                </button>
            </div>
        </form>
    );
};

const ThoughtRecordDetail: React.FC<{ record: ThoughtRecord; onClose: () => void }> = ({ record, onClose }) => {
    const renderEmotions = (emotions: EmotionRating[]) => (
        <ul className="flex flex-wrap gap-2">
            {emotions.map((e, i) => (
                <li key={i} className="bg-slate-200 text-slate-700 text-sm px-2 py-1 rounded-full">
                    {e.name} <span className="font-semibold">{e.intensity}%</span>
                </li>
            ))}
        </ul>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-800">Gedankenprotokoll</h3>
                        <p className="text-sm text-slate-500">
                            {new Date(record.date).toLocaleString('de-DE', { dateStyle: 'full', timeStyle: 'short' })}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl font-bold">&times;</button>
                </div>
                
                <div className="space-y-4">
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-slate-700 mb-1">Situation</h4>
                        <p className="text-slate-600">{record.situation}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-slate-700 mb-1">Anfängliche Emotionen</h4>
                        {renderEmotions(record.initialEmotions)}
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-slate-700 mb-1">Automatische Gedanken</h4>
                        <p className="text-slate-600 italic">"{record.automaticThoughts}"</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-slate-700 mb-1">Beweise dafür</h4>
                        <p className="text-slate-600">{record.evidenceFor || '–'}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-slate-700 mb-1">Beweise dagegen</h4>
                        <p className="text-slate-600">{record.evidenceAgainst || '–'}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-slate-700 mb-1">Ausgewogener Gedanke</h4>
                        <p className="text-slate-600 italic">"{record.balancedThought || '–'}"</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-slate-700 mb-1">Emotionen danach</h4>
                        {renderEmotions(record.outcomeEmotions)}
                    </div>
                </div>

                <button onClick={onClose} className="mt-6 w-full py-2 bg-indigo-500 text-white font-semibold rounded-full hover:bg-indigo-600 transition-colors">
                    Schließen
                </button>
            </div>
        </div>
    );
};


const ThoughtRecordComponent: React.FC = () => {
    const [records, setRecords] = useState<ThoughtRecord[]>(() => {
        try {
            const savedRecords = localStorage.getItem('thought_records');
            return savedRecords ? JSON.parse(savedRecords) : [];
        } catch (error) {
            console.error("Error reading records from localStorage", error);
            return [];
        }
    });
    const [view, setView] = useState<'list' | 'form'>('list');
    const [selectedRecord, setSelectedRecord] = useState<ThoughtRecord | null>(null);

    useEffect(() => {
        try {
            localStorage.setItem('thought_records', JSON.stringify(records));
        } catch (error) {
            console.error("Error saving records to localStorage", error);
        }
    }, [records]);


    const handleSaveRecord = (recordData: Omit<ThoughtRecord, 'id' | 'date'>) => {
        const newRecord: ThoughtRecord = {
            id: new Date().toISOString(),
            date: new Date().toISOString(),
            ...recordData,
        };
        
        setRecords(prevRecords => 
            [newRecord, ...prevRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
        setView('list');
    };

    if (view === 'form') {
        return (
            <div>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-slate-700">Neues Gedankenprotokoll</h2>
                    <p className="text-slate-500 mt-2">Untersuche deine Gedanken, um eine neue Perspektive zu gewinnen.</p>
                </div>
                <ThoughtRecordForm onSave={handleSaveRecord} onCancel={() => setView('list')} />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {selectedRecord && <ThoughtRecordDetail record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-700">Gedankenprotokoll</h2>
                <p className="text-slate-500 mt-2">Erkenne und verändere belastende Denkmuster.</p>
            </div>
            <div className="mb-6 text-center">
                <button 
                    onClick={() => setView('form')}
                    className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-full hover:bg-indigo-600 transition-colors shadow-sm"
                >
                    + Neues Protokoll erstellen
                </button>
            </div>
            <div className="border-t border-slate-200 pt-4 flex-grow flex flex-col overflow-hidden">
                <h3 className="text-lg font-semibold text-slate-700 mb-3 flex-shrink-0">Deine Protokolle</h3>
                <div className="flex-grow overflow-y-auto pr-2 space-y-3">
                    {records.length > 0 ? (
                        records.map(record => (
                            <button 
                                key={record.id} 
                                onClick={() => setSelectedRecord(record)}
                                className="w-full text-left flex items-center bg-white p-4 rounded-xl shadow-sm border hover:border-indigo-400 transition-colors animate-fade-in"
                            >
                                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex flex-col items-center justify-center">
                                    <span className="text-indigo-700 font-bold text-lg">{new Date(record.date).getDate()}</span>
                                    <span className="text-indigo-600 text-xs">{new Date(record.date).toLocaleString('de-DE', { month: 'short' })}</span>
                                </div>
                                <div className="ml-4 flex-grow">
                                    <p className="font-semibold text-slate-800 truncate">{record.situation}</p>
                                    <p className="text-sm text-slate-500">
                                        {new Date(record.date).toLocaleString('de-DE', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center text-slate-500 py-10">
                            <p>Noch keine Gedankenprotokolle erstellt.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThoughtRecordComponent;