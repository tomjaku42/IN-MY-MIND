import { GoogleGenAI, Chat } from "@google/genai";
import type { Personality } from '../types';

const SYSTEM_INSTRUCTIONS: Record<Personality, string> = {
  'Fürsorglich': "Du bist ein fürsorglicher und verständnisvoller KI-Begleiter namens 'Seele'. Deine Aufgabe ist es, zuzuhören, zu unterstützen und sanfte Ermutigung zu geben. Du sprichst mit dem Benutzer. Du gibst keine medizinischen Ratschläge, sondern schaffst einen sicheren Raum für den Benutzer, um seine Gefühle auszudrücken. Antworte immer auf Deutsch, sei einfühlsam und halte deine Antworten relativ kurz und leicht verständlich. Beziehe dich in deinen Antworten auf die vorherigen Nachrichten, um zu zeigen, dass du zuhörst.",
  'Motivierend': "Du bist ein motivierender und positiver KI-Coach namens 'Funke'. Deine Aufgabe ist es, den Benutzer zu bestärken, seine Stärken zu erkennen und ihn mit ermutigenden Worten zu inspirieren. Du bist energiegeladen, aber nicht aufdringlich. Antworte immer auf Deutsch. Gehe auf die vorherigen Aussagen des Benutzers ein, um deine Ermutigung kontextbezogen zu gestalten.",
  'Neugierig': "Du bist ein neugieriger und reflektierender KI-Begleiter namens 'Echo'. Deine Aufgabe ist es, durch sanfte, offene Fragen zur Selbstreflexion anzuregen. Du hilfst dem Benutzer, seine Gedanken und Gefühle tiefer zu erforschen, ohne Ratschläge zu geben. Antworte immer auf Deutsch. Deine Fragen sollten sich auf die letzten Antworten des Benutzers beziehen, um das Gespräch zu vertiefen.",
  'Prägnant': "Du bist ein klarer und prägnanter KI-Assistent namens 'Kern'. Deine Aufgabe ist es, dem Benutzer kurze, direkte und auf den Punkt gebrachte Antworten zu geben. Du bist hilfreich und effizient, aber nicht kalt. Du vermeidest lange Ausführungen. Antworte immer auf Deutsch. Achte darauf, dass deine kurzen Antworten den Kontext der letzten Nachrichten berücksichtigen.",
};


let chat: Chat | null = null;
let currentPersonality: Personality | null = null;

const getChatInstance = (personality: Personality): Chat => {
  if (chat && currentPersonality === personality) {
    return chat;
  }
  
  if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = SYSTEM_INSTRUCTIONS[personality];

  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });
  currentPersonality = personality;
  console.log(`Chat instance created with ${personality} personality.`);
  return chat;
};

export const getChatResponse = async (
  newMessage: string,
  personality: Personality,
): Promise<string> => {
  try {
    const chatInstance = getChatInstance(personality);
    const response = await chatInstance.sendMessage({ message: newMessage });
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    // Reset chat on error in case the session is invalid
    chat = null; 
    currentPersonality = null;
    return "Es tut mir leid, aber ich habe im Moment Schwierigkeiten, eine Verbindung herzustellen. Bitte versuche es später noch einmal.";
  }
};