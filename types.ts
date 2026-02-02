
export interface SectionFeedback {
  summary: string;
  skills: string;
  experience: string;
  education: string;
}

export interface AnalysisResult {
  score: number;
  found_keywords: string[];
  missing_keywords: string[];
  section_feedback: SectionFeedback;
  suggestions: string[];
  // Added fields to match Dashboard requirements
  summary: string;
  strengths: string[];
  weaknesses: string[];
  targetRoleMatch: string;
}

export interface FileData {
  name: string;
  size: number;
  text: string;
  rawFile: File;
}