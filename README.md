# Resume Insight AI

**Resume Insight AI** is a full-stack web app that analyzes your PDF resume and gives you an **ATS-style score**, **keyword gap analysis**, **section-wise feedback**, and **actionable suggestions** so you can improve your resume and land more interviews.

---

## What This Project Does

- **Upload a PDF resume** – Drag-and-drop or select a PDF file.
- **Get an ATS score (0–100)** – Based on:
  - **Keywords** (40 pts): Match against common tech keywords (Python, SQL, AWS, React, DevOps, etc.).
  - **Sections** (40 pts): Checks for Summary, Skills, Experience, and Education.
  - **Length & format** (20 pts): Word-count heuristic (e.g. 400–1000 words).
- **See missing keywords** – Which tech terms are not in your resume.
- **Section feedback** – Short tips for Summary, Skills, Experience, and Education.
- **Suggestions** – General tips (metrics, keywords, formatting, proofreading).
- **Optional:** When the backend is not available, the frontend can use **Azure OpenAI (GPT-4o)** for AI-based analysis (configure via env vars).

**Backend** stores each analysis (filename + score) in a database (SQLite by default, or PostgreSQL if configured).

---

## Tech Stack

| Layer    | Tech |
|----------|------|
| **Frontend** | React 18, TypeScript, Vite 4, Tailwind-style UI |
| **Backend** | FastAPI (Python), Uvicorn |
| **Database** | SQLite (default) or PostgreSQL |
| **Resume parsing** | pdfplumber |
| **Optional AI fallback** | Azure OpenAI (GPT-4o) via env vars |

---

## Run Locally

**Prerequisites:** Node.js (14.18+), Python 3.x

### Option A: Frontend only (Azure OpenAI fallback)

1. Install dependencies:  
   `npm install`
2. Copy `.env.example` to `.env.local` and set Azure OpenAI credentials:
   - `VITE_AZURE_ENDPOINT`
   - `VITE_AZURE_OPENAI_API_KEY`
   - `VITE_AZURE_DEPLOYMENT_NAME`
   - `VITE_AZURE_API_VERSION`
3. Run:  
   `npm run dev`
4. Open **http://localhost:3000** and upload a PDF resume.  
   (If the backend is not running, analysis uses Azure OpenAI.)

### Option B: Full stack (Backend + Frontend)

1. **Backend**
   - Create a virtual env, then:
   ```bash
   pip install -r requirements.txt
   python main.py
   ```
   - Backend runs at **http://localhost:8000**.  
   - Optional: set `DATABASE_URL` in `.env` for PostgreSQL; otherwise SQLite is used.

2. **Frontend**
   - Same as Option A (steps 1–4).  
   - When the backend is running, PDF analysis uses the FastAPI backend; otherwise it falls back to Azure OpenAI.

---

## Deploy (Render + Vercel)

- **Backend:** Deploy the Python/FastAPI app on **Render** (Web Service).  
  Build: `pip install -r requirements.txt`  
  Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Frontend:** Deploy the Vite/React app on **Vercel**.  
  Build: `npm run build` · Output: `dist`  
  Set **`VITE_API_URL`** to your Render backend URL (e.g. `https://your-app.onrender.com`).

**Step-by-step guides:**
- [DEPLOYMENT.md](DEPLOYMENT.md) (Telugu)
- [DEPLOYMENT_EN.md](DEPLOYMENT_EN.md) (English)

---

## Project Structure (summary)

- **Frontend:** `App.tsx`, `index.tsx`, `components/`, `lib/api.ts`, `services/azureOpenAIService.ts`, `vite.config.ts`
- **Backend:** `main.py`, `database.py`, `models.py`, `services/analyzer.py`, `requirements.txt`
- **Config:** `.env.example`, `vercel.json`, `render.yaml`

---

## License

Use this project for learning or portfolio; adjust as needed for your use case.
