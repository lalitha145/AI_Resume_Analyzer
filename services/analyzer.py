
import pdfplumber
import re

COMMON_TECH_KEYWORDS = [
    "Python", "SQL", "APIs", "AWS", "Docker", "Kubernetes", "React", "Node.js",
    "JavaScript", "TypeScript", "CI/CD", "Git", "Java", "C++", "NoSQL", 
    "Machine Learning", "Azure", "GCP", "Microservices", "REST", "GraphQL",
    "Terraform", "PostgreSQL", "Redis", "Agile", "Scrum", "DevOps", "Linux"
]

def extract_text_from_pdf(file_bytes):
    with pdfplumber.open(file_bytes) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def analyze_resume_logic(text: str):
    score = 0
    found_keywords = []
    missing_keywords = []
    
    # 1. Keyword Scoring (40 points)
    for kw in COMMON_TECH_KEYWORDS:
        if re.search(r'\b' + re.escape(kw) + r'\b', text, re.IGNORECASE):
            found_keywords.append(kw)
        else:
            missing_keywords.append(kw)
    
    keyword_score = (len(found_keywords) / len(COMMON_TECH_KEYWORDS)) * 40
    score += keyword_score

    # 2. Section Detection (40 points)
    sections = {
        "summary": ["summary", "profile", "objective"],
        "skills": ["skills", "expertise", "technologies"],
        "experience": ["experience", "employment", "work history"],
        "education": ["education", "academic"]
    }
    
    section_results = {}
    for section, keywords in sections.items():
        found = any(re.search(r'\b' + re.escape(k) + r'\b', text, re.IGNORECASE) for k in keywords)
        section_results[section] = "Strongly present" if found else "Missing or unclear"
        if found:
            score += 10

    # 3. Length/Formatting Heuristic (20 points)
    word_count = len(text.split())
    if 400 <= word_count <= 1000:
        score += 20
    elif word_count > 0:
        score += 10

    return {
        "score": round(score),
        "found_keywords": found_keywords,
        "missing_keywords": missing_keywords[:8],
        "section_feedback": {
            "summary": "Professional summary detected." if "Strongly" in section_results["summary"] else "Add a 3-4 sentence summary to hook recruiters.",
            "skills": "Technical skills are well-indexed." if "Strongly" in section_results["skills"] else "List your core stack clearly in a dedicated section.",
            "experience": "Strong work history formatting." if "Strongly" in section_results["experience"] else "Ensure experience is in reverse chronological order.",
            "education": "Education background clear." if "Strongly" in section_results["education"] else "Include degree, institution, and graduation year."
        },
        "suggestions": [
            "Use more quantifiable metrics (e.g., 'Increased efficiency by 20%')",
            "Ensure keywords match the job description precisely.",
            "Keep formatting simple; avoid complex multi-column layouts.",
            "Proofread for consistent verb tenses in experience bullets."
        ]
    }
