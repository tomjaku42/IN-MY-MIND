import React, { useState, useEffect, useMemo } from 'react';
import type { Goal } from '../types';


const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);


const Goals: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>(() => {
        try {
            const savedGoals = localStorage.getItem('goals');
            return savedGoals ? JSON.parse(savedGoals) : [];
        } catch (error) {
            console.error("Error reading goals from localStorage", error);
            return [];
        }
    });
    const [newGoalText, setNewGoalText] = useState('');
    const [filter, setFilter] = useState<'active' | 'completed'>('active');

    useEffect(() => {
        try {
            localStorage.setItem('goals', JSON.stringify(goals));
        } catch (error) {
            console.error("Error saving goals to localStorage", error);
        }
    }, [goals]);

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGoalText.trim() === '') return;

        const newGoal: Goal = {
            id: new Date().toISOString(),
            text: newGoalText.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
        };
        
        setGoals(prevGoals => [newGoal, ...prevGoals].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setNewGoalText('');
    };

    const handleToggleGoal = (id: string) => {
        setGoals(prevGoals => 
            prevGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g)
        );
    };

    const handleDeleteGoal = (id: string) => {
        setGoals(prevGoals => prevGoals.filter(g => g.id !== id));
    };

    const filteredGoals = useMemo(() => {
        const sortedGoals = [...goals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if (filter === 'active') {
            return sortedGoals.filter(goal => !goal.completed);
        }
        return sortedGoals.filter(goal => goal.completed);
    }, [goals, filter]);

    return (
        <div className="flex flex-col h-full">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-700">Meine Ziele</h2>
                <p className="text-slate-500 mt-2">Setze, verfolge und erreiche, was dir wichtig ist.</p>
            </div>

            <form onSubmit={handleAddGoal} className="flex space-x-2 mb-4">
                <input
                    type="text"
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    placeholder="Neues Ziel hinzufügen..."
                    className="flex-grow p-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    type="submit"
                    className="bg-indigo-500 text-white p-3 rounded-full hover:bg-indigo-600 disabled:bg-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={!newGoalText.trim()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </form>

            <div className="flex-shrink-0 mb-4 border-b border-slate-200">
                <div className="flex -mb-px">
                    <button onClick={() => setFilter('active')} className={`py-3 px-4 text-sm font-medium border-b-2 ${filter === 'active' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                        Aktiv
                    </button>
                    <button onClick={() => setFilter('completed')} className={`py-3 px-4 text-sm font-medium border-b-2 ${filter === 'completed' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                        Erledigt
                    </button>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 space-y-3">
                {filteredGoals.length > 0 ? (
                    filteredGoals.map(goal => (
                        <div key={goal.id} 
                             className={`flex items-center p-4 rounded-xl transition-all duration-300 group animate-fade-in
                                        ${goal.completed 
                                            ? 'bg-green-100' 
                                            : 'bg-white shadow-sm border-l-4 border-indigo-400'
                                        }`}
                        >
                            <button 
                                onClick={() => handleToggleGoal(goal.id)}
                                className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors
                                            ${goal.completed 
                                                ? 'bg-green-500 border-green-500' 
                                                : 'border-slate-300 hover:border-indigo-500'
                                            }`}
                                aria-label={goal.completed ? 'Ziel als aktiv markieren' : 'Ziel als erledigt markieren'}
                            >
                                {goal.completed && <CheckIcon />}
                            </button>
                            <p className={`flex-grow mx-4 text-slate-800 ${goal.completed ? 'line-through text-green-800 opacity-70' : ''}`}>
                                {goal.text}
                            </p>
                            <button onClick={() => handleDeleteGoal(goal.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-slate-500 py-10">
                         <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <p className="font-semibold">{filter === 'active' ? 'Du hast alle Ziele erreicht!' : 'Zeit, neue Ziele zu setzen!'}</p>
                        <p className="text-sm">{filter === 'active' ? 'Füge oben ein neues Ziel hinzu, um weiterzumachen.' : 'Keine erledigten Ziele vorhanden.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Goals;