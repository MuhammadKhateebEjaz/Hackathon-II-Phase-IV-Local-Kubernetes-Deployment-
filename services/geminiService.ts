import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

export const sendMessageToGemini = async (message: string, systemPrompt: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Ensure process.env.API_KEY is configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ],
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
    },
  });

  return response.text ?? '';
};

export const getK8sHealthAnalysis = async (pods: any[]): Promise<string> => {
  if (!apiKey) return "API Key missing";
  
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Analyze the health of this Kubernetes cluster based on pod data: ${JSON.stringify(pods)}. Identify any risks and suggest optimization using Kagent principles.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    config: {
      systemInstruction: "You are Kagent, an AI assistant specialized in Kubernetes cluster optimization and health analysis.",
    }
  });
  
  return response.text ?? '';
};
