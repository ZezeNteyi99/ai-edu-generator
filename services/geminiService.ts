import { GoogleGenAI, Type } from "@google/genai";
import type { GenerateOptions, QuizData } from '../types';
import { ContentType, Length } from '../types';

// IMPORTANT: This assumes the API key is set in the environment.
// Do not add any UI to input the API key.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
    // In a real app, you'd want to handle this more gracefully.
    // For this environment, we assume it's always present.
    console.warn("VITE_API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const generateQuizPrompt = (options: GenerateOptions): string => {
    let questionCount;
    switch (options.length) {
        case Length.Brief:
            questionCount = "3 multiple-choice questions and 2 short-answer questions";
            break;
        case Length.Standard:
            questionCount = "5 multiple-choice questions and 3 short-answer questions";
            break;
        case Length.Detailed:
            questionCount = "8 multiple-choice questions and 5 short-answer questions";
            break;
        default:
            questionCount = "5 multiple-choice questions and 3 short-answer questions";
    }

    let prompt = `Generate a quiz about "${options.topic}" for a ${options.grade} student at a ${options.difficulty} difficulty level.
The tone of the quiz should be ${options.tone}.
The quiz should include ${questionCount}.
For multiple-choice questions, provide 4 options with only one correct answer.
For short-answer questions, provide a concise, correct answer.
Return the output as a single JSON object that strictly adheres to the provided schema. Do not include any markdown formatting like \`\`\`json.`;

    if (options.instructions.trim()) {
        prompt += `\n\nAdditional Instructions: ${options.instructions}`;
    }

    return prompt;
};


const generateStudyGuidePrompt = (options: GenerateOptions): string => {
    let detailLevel;
    switch (options.length) {
        case Length.Brief:
            detailLevel = "a concise summary focusing on the most critical key points, definitions, and concepts. Keep it high-level.";
            break;
        case Length.Standard:
            detailLevel = "a balanced overview that covers main topics, explains key terms with examples, and summarizes important processes or events.";
            break;
        case Length.Detailed:
            detailLevel = "a comprehensive and in-depth guide. It should include detailed explanations, multiple examples for each concept, historical context if applicable, and potential areas of confusion or common mistakes.";
            break;
        default:
            detailLevel = "a balanced overview.";
    }

    let prompt = `Generate a study guide about "${options.topic}" for a ${options.grade} student at a ${options.difficulty} difficulty level.
The tone of the guide should be ${options.tone}.
The guide should be structured with clear headings and bullet points.
Provide ${detailLevel}
Format the entire response in Markdown. Use headings (#, ##), bold text, italics, and lists as appropriate to create a well-organized and readable document.`;

    if (options.instructions.trim()) {
        prompt += `\n\nAdditional Instructions: ${options.instructions}`;
    }

    return prompt;
};

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'The title of the quiz.' },
        multipleChoice: {
            type: Type.ARRAY,
            description: 'An array of multiple-choice questions.',
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    answer: { type: Type.STRING }
                },
                required: ['question', 'options', 'answer']
            }
        },
        shortAnswer: {
            type: Type.ARRAY,
            description: 'An array of short-answer questions.',
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
                },
                required: ['question', 'answer']
            }
        }
    },
    required: ['title', 'multipleChoice', 'shortAnswer']
};

export const generateEducationalContent = async (options: GenerateOptions): Promise<string> => {
    try {
        if (options.contentType === ContentType.Quiz) {
            const prompt = generateQuizPrompt(options);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: quizSchema,
                    temperature: 0.7,
                }
            });
            // The response text should be a valid JSON string adhering to the schema.
            // We'll just return it as a string to be parsed by the component.
            return response.text;

        } else { // Study Guide
            const prompt = generateStudyGuidePrompt(options);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                 config: {
                    temperature: 0.6,
                }
            });
            return response.text;
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate content from the AI. Please check your connection or API key.");
    }
};
// Test API key
export const testApiKey = async (): Promise<void> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Say "Hello World"',
      config: { temperature: 0 }
    });
    console.log("API response test:", response.text);
  } catch (error) {
    console.error("API call failed:", error);
  }
};
