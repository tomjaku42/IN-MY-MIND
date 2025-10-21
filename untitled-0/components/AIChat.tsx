import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Personality } from '../types';
import { getChatResponse } from '../services/geminiService';


const PERSONALITY_OPTIONS: Personality[] = ['Fürsorglich', 'Motivierend', 'Neugierig', 'Prägnant'];

const PERSONALITY_DESCRIPTIONS: Record<Personality, string> = {
    'Fürsorglich': 'Ein einfühlsamer und verständnisvoller Begleiter, der zuhört und unterstützt.',
    'Motivierend': 'Ein positiver Coach, der dich ermutigt und bestärkt, deine Ziele zu erreichen.',
    'Neugierig': 'Ein nachdenklicher Partner, der dir Fragen stellt, um die Selbstreflexion anzuregen.',
    'Prägnant': 'Ein direkter Begleiter, der dir kurze, klare und auf den Punkt gebrachte Antworten gibt.',
};

const PERSONALITY_TAGLINES: Record<Personality, string> = {
    'Fürsorglich': 'Dein einfühlsamer Begleiter.',
    'Motivierend': 'Dein positiver Coach!',
    'Neugierig': 'Dein nachdenklicher Partner.',
    'Prägnant': 'Dein direkter Assistent.',
};


const SettingsModal: React.FC<{
    currentPersonality: Personality;
    onSelect: (p: Personality) => void;
    onClose: () => void;
}> = ({ currentPersonality, onSelect, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Persönlichkeit anpassen</h3>
                <div className="space-y-3">
                    {PERSONALITY_OPTIONS.map(p => (
                        <button
                            key={p}
                            onClick={() => onSelect(p)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${currentPersonality === p ? 'bg-indigo-50 border-indigo-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                        >
                            <p className={`font-semibold ${currentPersonality === p ? 'text-indigo-700' : 'text-slate-700'}`}>{p}</p>
                            <p className="text-sm text-slate-500">{PERSONALITY_DESCRIPTIONS[p]}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [personality, setPersonality] = useState<Personality>(() => {
    try {
        const saved = localStorage.getItem('ai_personality');
        return (saved as Personality) || 'Fürsorglich';
    } catch (error) {
        return 'Fürsorglich';
    }
  });
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    setMessages([
        { sender: 'ai', text: `Hallo! Ich bin dein ${personality.toLowerCase()}er Begleiter. Wie geht es dir heute?` },
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getChatResponse(
        userMessage.text,
        personality
      );
      const aiMessage: ChatMessage = { sender: 'ai', text: aiResponse };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: ChatMessage = {
        sender: 'ai',
        text: 'Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePersonalityChange = (newPersonality: Personality) => {
    setPersonality(newPersonality);
    localStorage.setItem('ai_personality', newPersonality);
    setShowSettings(false);
    
    const systemMessage: ChatMessage = {
      sender: 'system',
      text: `Gewechselt zu ${newPersonality}: ${PERSONALITY_TAGLINES[newPersonality]}`,
    };

    setMessages([
      systemMessage,
      { sender: 'ai', text: `Hallo! Ich bin jetzt dein ${newPersonality.toLowerCase()}er Begleiter. Wie kann ich dir helfen?` },
    ]);
  };


  return (
    <div className="flex flex-col h-full">
      {showSettings && <SettingsModal currentPersonality={personality} onSelect={handlePersonalityChange} onClose={() => setShowSettings(false)} />}
        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {messages.map((msg, index) => {
            if (msg.sender === 'system') {
                return (
                  <div key={index} className="text-center text-xs text-slate-500">
                    <span className="bg-slate-100 rounded-full px-3 py-1.5">{msg.text}</span>
                  </div>
                )
            }
            return (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-indigo-500 text-white rounded-br-lg'
                      : 'bg-slate-100 text-slate-800 rounded-bl-lg'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            )
        })}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-slate-200 text-slate-800 rounded-2xl rounded-bl-lg p-3">
                <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 border-t border-slate-200 pt-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Schreibe eine Nachricht..."
            className="flex-grow p-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            onClick={() => setShowSettings(true)}
            className="text-slate-500 p-3 rounded-full hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Einstellungen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ''}
            className="bg-indigo-500 text-white p-3 rounded-full hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-slate-400 text-center mt-2">
            Dies ist keine medizinische Beratung. Bei Krisen bitte professionelle Hilfe suchen.
        </p>
      </div>
    </div>
  );
};

export default AIChat;