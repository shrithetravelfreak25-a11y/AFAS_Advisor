
import { GoogleGenAI, Type } from "@google/genai";
import { ProblemType, UserContext, FertilizerAdvice } from "../types";

// Classifies the user query into predefined categories
export const classifyProblem = async (query: string): Promise<ProblemType> => {
  // Always create a new instance before making an API call to ensure latest configuration
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Classify the following farmer query into one of these categories: 'fertilizer', 'disease', 'market', 'general'. Query: "${query}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING }
          },
          required: ["category"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return (result.category?.toLowerCase() as ProblemType) || 'general';
  } catch (error) {
    console.error("Classification error:", error);
    return 'general';
  }
};

// Generates expert agricultural advice based on context and images
export const getExplanation = async (
  context: UserContext, 
  calculation: Partial<FertilizerAdvice>
): Promise<{ explanation: string; diseaseFindings?: string }> => {
  // Always create a new instance before making an API call to ensure latest configuration
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const parts: any[] = [
      { text: `You are an expert agricultural officer. Explain the following fertilizer recommendation to a farmer.
      Context: Crop: ${context.crop}, Area: ${context.area} acres, Soil: ${context.soilType}. 
      Recommendation: Urea: ${calculation.urea}kg, DAP: ${calculation.dap}kg, MOP: ${calculation.mop}kg.
      
      If images are provided, also analyze them for potential diseases or nutrient deficiencies.
      
      CRITICAL INSTRUCTIONS:
      1. Structure your entire response using clear bullet points (starting with '•' or '-').
      2. Keep points concise and actionable.
      3. DO NOT suggest new chemicals or quantities for fertilizers. ONLY explain the reasoning for the calculated numbers.
      4. Separate the Fertilizer Explanation from the Image Analysis Findings with the header "--- Disease & Nutrient Analysis ---".
      5. If analyzing images, be specific about visual symptoms observed in the provided photos.` }
    ];

    if (context.images && context.images.length > 0) {
      context.images.forEach((img) => {
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: img.split(',')[1]
          }
        });
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts }
    });

    const fullText = response.text || "";
    const separator = "--- Disease & Nutrient Analysis ---";
    const splitIndex = fullText.indexOf(separator);
    
    if (splitIndex > -1) {
      return {
        explanation: fullText.substring(0, splitIndex).trim(),
        diseaseFindings: fullText.substring(splitIndex + separator.length).trim()
      };
    }

    return {
      explanation: fullText.trim(),
      diseaseFindings: context.images?.length ? "Analysis details are included in the explanation above." : undefined
    };
  } catch (error) {
    console.error("Gemini advisory error:", error);
    return {
      explanation: "• This recommendation is based on standard nutrient requirements for your selected crop and region.",
      diseaseFindings: context.images?.length ? "• Image analysis encountered an error." : undefined
    };
  }
};
