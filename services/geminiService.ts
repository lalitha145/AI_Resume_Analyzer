
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeResume = async (resumeText: string, targetRole: string): Promise<AnalysisResult> => {
  // Use named parameter and direct process.env.API_KEY access as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Act as a Senior Technical Recruiter and ATS Expert. 
    Analyze the provided resume text against the target job role: "${targetRole}".
    
    1. Extract all text and evaluate based on standard ATS (Applicant Tracking System) heuristics.
    2. Calculate an ATS score (0-100) based on: 
       - Keyword density (comparison with industry standard keywords for ${targetRole}).
       - Formatting (detecting if sections like Experience/Education are clear).
       - Impact (quantifiable achievements).
    3. Identify missing keywords specific to "${targetRole}".
    4. Provide section-specific feedback for: Summary, Skills, Experience, and Education.
    5. List concrete improvement suggestions.

    RESUME TEXT:
    ${resumeText}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          atsScore: { type: Type.NUMBER },
          summary: { type: Type.STRING, description: "Professional candidate summary based on resume." },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          targetRoleMatch: { type: Type.STRING, description: "Briefly explain how well they fit the role." },
          sectionFeedback: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              skills: { type: Type.STRING },
              experience: { type: Type.STRING },
              education: { type: Type.STRING }
            },
            required: ["summary", "skills", "experience", "education"]
          },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["atsScore", "summary", "strengths", "weaknesses", "missingKeywords", "matchedKeywords", "sectionFeedback", "suggestions", "targetRoleMatch"]
      }
    }
  });

  try {
    // Access response.text property directly as per guidelines.
    const rawText = response.text || '{}';
    const result = JSON.parse(rawText);
    
    // Explicitly map Gemini's schema to the application's AnalysisResult interface.
    return {
      score: result.atsScore || 0,
      found_keywords: result.matchedKeywords || [],
      missing_keywords: result.missingKeywords || [],
      section_feedback: result.sectionFeedback || { summary: '', skills: '', experience: '', education: '' },
      suggestions: result.suggestions || [],
      strengths: result.strengths || [],
      weaknesses: result.weaknesses || [],
      targetRoleMatch: result.targetRoleMatch || '',
      summary: result.summary || ''
    };
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Analysis failed. Please try a cleaner PDF file.");
  }
};