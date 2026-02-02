<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1HSAVgRm7efB5mStR196i66kIwpzdpJws

## Run Locally

**Prerequisites:** Node.js, Python 3.x (for backend), PostgreSQL (optional, for storing analysis history)

### Option A: Frontend only (Azure OpenAI fallback)

1. Install dependencies: `npm install`
2. Copy [.env.example](.env.example) to `.env.local` and set Azure OpenAI credentials:
   - `VITE_AZURE_ENDPOINT` – Azure OpenAI endpoint (e.g. `https://your-resource.openai.azure.com/`)
   - `VITE_AZURE_OPENAI_API_KEY` – Azure OpenAI API key
   - `VITE_AZURE_DEPLOYMENT_NAME` – Deployment name (e.g. `gpt-4o`)
   - `VITE_AZURE_API_VERSION` – API version (e.g. `2024-02-15-preview`)
3. Run the app: `npm run dev`
4. Open http://localhost:3000 and upload a PDF resume.

### Option B: Full stack (Backend + Frontend)

1. **Backend:** Create a virtual env, install deps, set `DATABASE_URL` in `.env`, then:
   ```bash
   pip install -r requirements.txt
   python main.py
   ```
   Backend runs at http://localhost:8000

2. **Frontend:** Same as Option A (steps 1–4). When the backend is running, PDF analysis uses the FastAPI backend; otherwise it falls back to Azure OpenAI.

---

## Deploy to Render + Vercel

**Step-by-step process:** [DEPLOYMENT.md](DEPLOYMENT.md) చదవండి – ప్రతి స్టెప్ వివరంగా ఉంది.

- **Backend (Render):** Deploy the Python/FastAPI app. Use [render.yaml](render.yaml) or in Render Dashboard:
  - **Build:** `pip install -r requirements.txt`
  - **Start:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
  - Optional: add a PostgreSQL database and set `DATABASE_URL` in Environment. If unset, SQLite is used (ephemeral on free tier).
- **Frontend (Vercel):** Deploy the root folder (Vite/React). In Vercel:
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
  - **Environment:** set `VITE_API_URL` to your Render backend URL (e.g. `https://resumeinsight-api.onrender.com`). Also set `VITE_AZURE_*` if you want the Azure fallback when the backend is cold/slow.
- **CORS:** Backend allows all origins (`*`), so the Vercel domain can call the Render API. For production you can restrict CORS to your Vercel URL in `main.py` if you prefer.
