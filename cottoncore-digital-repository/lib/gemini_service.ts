
import { GoogleGenAI } from "@google/genai";
import { BaleData } from '../types';

// Use this helper to initialize GoogleGenAI inside functions
// Fix 1: Allow browser usage
const getAI = () => new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

// Fix 2: In analyzeFiberQuality
const response = await ai.models.generateContent({
  model: 'gemini-2.0-flash',   // was 'gemini-3-flash-preview'
  contents: prompt,
});

// Fix 3: In predictFiberCount
const response = await ai.models.generateContent({
  model: 'gemini-2.0-flash',   // was 'gemini-3-flash-preview'
  contents: { parts: [imagePart, { text: prompt }] },
  config: { responseMimeType: "application/json" }
});
export async function analyzeFiberQuality(metrics: BaleData['metrics']) {
  try {
    const ai = getAI();
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

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Access .text property directly per guidelines
    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "AI analysis temporarily unavailable. Please check HVI parameters manually.";
  }
}

/**
 * Uses Gemini as a Vision-ML Classifier to predict yarn count suitability (Target: 40s).
 */
export async function predictFiberCount(imageBase64: string) {
  try {
    const ai = getAI();
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
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
    
    JSON Output Required:
    {
      "prediction": "40s_SUITABLE" | "NON_40s_GRADE",
      "probability": number (0.0 to 1.0),
      "analysis_logs": [
        "Detection of [Feature] completed...",
        "Calculated [Metric] at [Value]..."
      ],
      "morphology": {
        "fineness_estimate": "Fine" | "Medium" | "Coarse",
        "convolution_rate": "High" | "Medium" | "Low",
        "maturity_visual": "Mature" | "Immature"
      },
      "reasoning": "A one-sentence scientific conclusion."
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json"
      }
    });

    // Access .text property directly and parse JSON
    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Prediction Inference Error:", error);
    throw error;
  }
}
