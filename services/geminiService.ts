
import { GoogleGenAI } from "@google/genai";

export const getGadgetAdvice = async (query: string, productContext?: string) => {
  try {
    // Initialize the Google GenAI SDK right before making the call to ensure up-to-date API key.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a gadget expert assistant for "Electro-Auction & Gadget Hub". 
      Context: ${productContext || 'General Electronics Market'}.
      User asks: ${query}`,
      config: {
        systemInstruction: "Provide concise, expert technical advice on electronics. Compare specs and help users decide on high-value purchases.",
        temperature: 0.7,
      },
    });
    // Return the generated text using the property .text (not a method).
    return response.text;
  } catch (error) {
    console.error("Gemini Advice Error:", error);
    return "I'm having trouble connecting to my expert database right now. Please try again later!";
  }
};
