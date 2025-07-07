import fetch from 'node-fetch';

import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

// Basic word list
const positiveWords = ['good', 'great', 'happy', 'excellent', 'amazing', 'love', 'fantastic', 'like', 'nice', 'awesome'];
const negativeWords = ['bad', 'terrible', 'sad', 'awful', 'hate', 'horrible', 'worst', 'angry', 'dislike', 'frustrated'];

// New Gemini-based response function
async function generateResponse(question, subject = 'General') {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash", // or "gemini-2.0-flash" if you're on early access
      contents: [{
        role: "user",
        parts: [{text: `As an AI tutor specializing in ${subject}, answer this question: ${question}`}]
      }],
      config: {systemInstruction: `You are an expert tutor named BrainBytes helping students with a focus on ${subject}. Provide clear, supportive, and helpful responses.`}
    });

    const output = result.text || result.candidates?.[0]?.content?.parts?.[0]?.text;

    return {
      category: subject.toLowerCase(),
      response: output || "Sorry, I couldn't generate a response.",
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      category: subject.toLowerCase(),
      response: "Sorry, I couldn't get a response from Gemini. Please try again later.",
    };
  }
}



export default {
  generateResponse
};
