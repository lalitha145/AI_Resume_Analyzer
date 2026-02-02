import { AnalysisResult } from "../types";

const getAzureConfig = () => {
  const endpoint = (import.meta.env?.VITE_AZURE_ENDPOINT ?? "").replace(/\/$/, "");
  const apiKey = import.meta.env?.VITE_AZURE_OPENAI_API_KEY ?? "";
  const deployment = import.meta.env?.VITE_AZURE_DEPLOYMENT_NAME ?? "gpt-4o";
  const apiVersion = import.meta.env?.VITE_AZURE_API_VERSION ?? "2024-02-15-preview";

  if (!endpoint || !apiKey) {
    throw new Error("Missing Azure OpenAI config: set VITE_AZURE_ENDPOINT and VITE_AZURE_OPENAI_API_KEY in .env.local");
  }

  return { endpoint, apiKey, deployment, apiVersion };
};

export const analyzeResume = async (resumeText: string, targetRole: string): Promise<AnalysisResult> => {
  const { endpoint, apiKey, deployment, apiVersion } = getAzureConfig();

  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

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

Respond with a single JSON object only (no markdown, no code block) with: atsScore, summary, strengths (array), weaknesses (array), missingKeywords (array), matchedKeywords (array), targetRoleMatch, sectionFeedback (object with summary, skills, experience, education), suggestions (array).

RESUME TEXT:
${resumeText}
`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: "You are an ATS expert. Reply only with valid JSON matching the requested schema." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Azure OpenAI error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content?.trim() || "{}";
  const result = JSON.parse(rawText);

  return {
    score: result.atsScore ?? 0,
    found_keywords: result.matchedKeywords ?? [],
    missing_keywords: result.missingKeywords ?? [],
    section_feedback: result.sectionFeedback ?? { summary: "", skills: "", experience: "", education: "" },
    suggestions: result.suggestions ?? [],
    strengths: result.strengths ?? [],
    weaknesses: result.weaknesses ?? [],
    targetRoleMatch: result.targetRoleMatch ?? "",
    summary: result.summary ?? "",
  };
};
