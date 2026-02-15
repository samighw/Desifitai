import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, GeneratedPlan } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateFitnessPlan = async (profile: UserProfile): Promise<GeneratedPlan> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const systemInstruction = `
    You are "DesiFit Coach", a friendly, motivating, and professional Indian Gym Trainer. 
    You speak in a mix of English and Hindi (Hinglish) to connect with Indian users.
    
    Your task is to generate a PERSONALIZED workout and diet plan based on the user's details.

    IMPORTANT: WORKOUT ORGANIZATION
    - Do NOT create a weekly schedule (e.g., "Monday", "Tuesday").
    - Organize the workout plan by BODY PARTS: Chest, Back, Biceps, Triceps, Shoulder, Legs, Core.
    - For each body part, provide exercises strictly matching the user's Experience Level (${profile.experience}).

    EXPERIENCE LEVEL RULES:
    - Beginner: 3-4 basic exercises. Mostly bodyweight/dumbbells. Sets: 3, Reps: 10-12, Rest: 45-60s. Focus: Form.
    - Intermediate: 4-5 exercises. Compound + Isolation. Sets: 3-4, Reps: 8-12, Rest: 60s. Focus: Growth.
    - Advanced: 5-6 exercises. Heavy Compound + Advanced. Sets: 4, Reps: 6-12, Rest: 60-90s. Focus: Intensity.

    DIET RULES:
    - Simple Indian home-cooked meals (Roti, Dal, Sabzi, Paneer, Chicken, Eggs, etc.).
    - Match the user's goal (Fat Loss / Muscle Gain).

    FORMAT EXERCISE DETAILS:
    - Posture Tips: Provide detailed, specific visual cues in Hinglish (e.g., "Chest up rakho like a soldier", "Back ekdum seedha", "Core tight rakho").
    - Common Mistakes: Describe specific errors with visual descriptions in Hinglish (e.g., "Don't round your back like a turtle", "Elbows ko zyada flare mat karo").
    - Provide a YouTube search query for correct form.
  `;

  const userPrompt = `
    Create a detailed Body-Part wise workout and diet plan for this user:
    - Profile: ${profile.age}y ${profile.gender}, ${profile.height}cm, ${profile.weight}kg
    - Goal: ${profile.goal}
    - Level: ${profile.experience}
    - Location: ${profile.location}
    - Time: ${profile.timeAvailable}
    - Injuries: ${profile.injuries || "None"}
    
    Structure the 'schedule' as a list of Body Parts (e.g., 'Chest', 'Back').
  `;

  // Define the schema for structured output
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      intro: { type: Type.STRING, description: "A short, high-energy Hinglish welcome message tailored to their goal." },
      schedule: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING, description: "Body Part Name (e.g., 'Chest Workout')" },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sets: { type: Type.STRING },
                  reps: { type: Type.STRING },
                  rest: { type: Type.STRING },
                  muscle: { type: Type.STRING, description: "Specific target muscle" },
                  postureTips: { type: Type.STRING, description: "Detailed visual cues for correct form in Hinglish." },
                  mistakes: { type: Type.STRING, description: "Common errors with visual descriptions in Hinglish." },
                  youtubeQuery: { type: Type.STRING, description: "Search query for YouTube, e.g., 'Bench Press correct form'" }
                },
                required: ["name", "sets", "reps", "rest", "muscle", "postureTips", "mistakes", "youtubeQuery"]
              }
            }
          },
          required: ["day", "exercises"]
        }
      },
      diet: {
        type: Type.OBJECT,
        properties: {
          proteinTarget: { type: Type.STRING, description: "Daily protein target in grams" },
          calories: { type: Type.STRING, description: "Approximate daily calorie target" },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } },
          meals: {
            type: Type.OBJECT,
            properties: {
              breakfast: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } } } },
              lunch: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } } } },
              snack: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } } } },
              dinner: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } } } },
            },
            required: ["breakfast", "lunch", "snack", "dinner"]
          }
        },
        required: ["proteinTarget", "calories", "tips", "meals"]
      },
      safety: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Safety rules and warm-up/cool-down advice in Hinglish" },
      motivation: { type: Type.STRING, description: "A final closing motivation punchline in Hinglish." }
    },
    required: ["intro", "schedule", "diet", "safety", "motivation"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: systemInstruction,
        temperature: 0.7, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as GeneratedPlan;
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};