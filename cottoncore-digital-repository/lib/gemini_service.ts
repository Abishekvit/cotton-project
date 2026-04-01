import { GoogleGenerativeAI } from "@google/generative-ai";
import { BaleData } from '../types';

const getAI = () => new GoogleGenerativeAI("AIzaSyD3y_9SQmiIiNagmCCbXchvDDla1ChyYrE");
/**
 * Analyzes cotton fiber quality using Gemini 2.0 Flash.
 */
export async function analyzeFiberQuality(metrics: BaleData['metrics']): Promise<string> {
  try {
    const ai = getAI();
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const prompt = `Analyze this cotton fiber batch based on the following HVI metrics:
    - SCI (Spinning Consistency Index): ${metrics.sci}
    - Micronaire: ${metrics.mic}
    - Strength: ${metrics.str} g/tex
    - Length: ${metrics.sl2} inches
    - Uniformity: ${metrics.ur}%
    - Short Fiber Index: ${metrics.sf}%
    - Maturity: ${metrics.mat}
    
    Provide a professional technical summary in 3 bullet points:
    1. Spinning Potential (Ring vs Rotor spinning suitability).
    2. Strength and Durability assessment.
    3. Potential processing risks (e.g. neps, breakage).
    
    Keep it concise and technical. Format as plain text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "AI analysis temporarily unavailable. Please check HVI parameters manually.";
  }
}

/**
 * Uses Gemini Vision to predict yarn count suitability (Target: 40s).
 */
export async function predictFiberCount(imageBase64: string): Promise<{
  prediction: "40s_SUITABLE" | "NON_40s_GRADE";
  probability: number;
  analysis_logs: string[];
  morphology: {
    fineness_estimate: "Fine" | "Medium" | "Coarse";
    convolution_rate: "High" | "Medium" | "Low";
    maturity_visual: "Mature" | "Immature";
  };
  reasoning: string;
}> {
  try {
    const ai = getAI();
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg' as const,
        data: imageBase64.split(',')[1],
      },
    };

    const prompt = `ACT AS A COTTON MORPHOLOGY CLASSIFIER (ML MODEL).
    Task: Binary classification for 40s (Ne 40/1) yarn count suitability.
    
    Visual Features to analyze:
    1. Fiber Fineness: Are the fibers thin enough for fine counts?
    2. Convolution Density: Check frequency of fiber twists.
    3. Impurity Mapping: Detect neps or trash that might cause 40s yarn breakage.
    4. Maturity: Assess the lumen width and wall thickness visually.
    
    Respond ONLY with valid JSON, no markdown, no extra text:
    {
      "prediction": "40s_SUITABLE" or "NON_40s_GRADE",
      "probability": number between 0.0 and 1.0,
      "analysis_logs": ["Detection of [Feature] completed...", "Calculated [Metric] at [Value]..."],
      "morphology": {
        "fineness_estimate": "Fine" or "Medium" or "Coarse",
        "convolution_rate": "High" or "Medium" or "Low",
        "maturity_visual": "Mature" or "Immature"
      },
      "reasoning": "A one-sentence scientific conclusion."
    }`;

    const result = await model.generateContent([imagePart, prompt]);
    const response = await result.response;
    const rawText = response.text();

    const clean = rawText.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error("Prediction Inference Error:", error);
    throw error;
  }
}
