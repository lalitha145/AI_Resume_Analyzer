# Deploy to Render + Vercel – Step by Step (English)

Your project is already on GitHub. Follow these steps to deploy the **backend on Render** and the **frontend on Vercel**. You use the **same repo** for both; each platform runs only what it needs.

---

## Part 1: Deploy Backend on Render

### Step 1: Open Render
- Go to **https://render.com**
- **Sign Up** or **Log In** (e.g. with GitHub).

### Step 2: Create a Web Service
- On the dashboard, click **"New +"**
- Select **"Web Service"**

### Step 3: Connect Your GitHub Repo
- Under **"Connect a repository"**, find and select your repo (e.g. **AI_Resume_Analyzer** or **resumeinsight-ai**).
- If the repo does not appear, click **"Configure account"** and grant Render access to GitHub, then select the repo again.
- Click **"Connect"**.

### Step 4: Configure the Web Service
- **Name:** Any name (e.g. `resumeinsight-api`).
- **Region:** Any (e.g. Oregon).
- **Runtime:** **Python 3**.
- **Build Command:**  
  `pip install -r requirements.txt`
- **Start Command:**  
  `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Instance Type:** Choose **Free** if you want the free tier.

### Step 5: Environment Variables (Optional)
- In the **Environment** section:
  - To use **PostgreSQL:** Create a PostgreSQL database in Render, then add **DATABASE_URL** here (copy from the database’s connection string).
  - If you skip this: The app will use SQLite (on the free tier, data may be lost when the service restarts).

### Step 6: Deploy
- Click **"Create Web Service"**.
- Wait 2–5 minutes for the build and deploy to finish.
- When it’s done, you’ll see a URL like:  
  **`https://resumeinsight-api.onrender.com`**  
  **Copy this URL** – you will use it in Vercel in Part 2.

---

## Part 2: Deploy Frontend on Vercel

### Step 1: Open Vercel
- Go to **https://vercel.com**
- **Sign Up** or **Log In** (e.g. with GitHub).

### Step 2: Create a New Project
- On the dashboard, click **"Add New..."** → **"Project"**.
- Under **Import Git Repository**, select the **same GitHub repo** (e.g. AI_Resume_Analyzer).
- Click **"Import"**.

### Step 3: Configure Build Settings
- **Framework Preset:** Choose **Vite** if available; otherwise **Other**.
- **Root Directory:** Leave blank (build from repo root).
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install` (default is fine).

### Step 4: Add Environment Variable (Important)
- In **Environment Variables**, click **"Add"**.
- **Name:** `VITE_API_URL`  
- **Value:** Your Render backend URL from Part 1 (e.g. `https://resumeinsight-api.onrender.com`).  
  - Do **not** add a trailing slash.
- (Optional) For Azure fallback, you can also add:
  - `VITE_AZURE_ENDPOINT`
  - `VITE_AZURE_OPENAI_API_KEY`
  - `VITE_AZURE_DEPLOYMENT_NAME`
  - `VITE_AZURE_API_VERSION`

### Step 5: Deploy
- Click **"Deploy"**.
- When the build finishes, you’ll get a URL like:  
  **`https://your-project-xxxx.vercel.app`**

---

## Part 3: Verify It Works

1. Open your **Vercel URL** in the browser.
2. Upload a PDF resume.
3. Check that the analysis result appears.  
   - On the free tier, the first request to Render can take 30–60 seconds (cold start). Later requests are faster.
4. If you see an error: Open **Developer Tools (F12)** → **Console** and check the message. Ensure `VITE_API_URL` is set correctly and matches your Render URL.

---

## Quick Reference

| What        | Where   | What to set |
|------------|---------|-------------|
| **Backend** | Render | Build: `pip install -r requirements.txt` · Start: `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Frontend** | Vercel | Build: `npm run build` · Output: `dist` · Env: `VITE_API_URL` = your Render URL (no trailing slash) |
| **Connect** | Vercel | Environment variable: `VITE_API_URL` = your Render Web Service URL |

---

## Troubleshooting

- **Frontend: "Backend not found" or API error**  
  In Vercel → Project → **Settings** → **Environment Variables**, set `VITE_API_URL` to your Render URL, then **Redeploy** the project.

- **Render: Build failed (pydantic-core / maturin / Rust)**  
  If the build fails with "maturin" or "Read-only file system" while installing pydantic, Render is using Python 3.13 and building pydantic-core from source. The repo includes a **`runtime.txt`** that pins Python to **3.12** so Render uses pre-built wheels. Commit and push `runtime.txt`, then redeploy. In Render Dashboard → Service → **Environment**, you can also set **Python Version** to **3.12** if needed.

- **Render: First request is very slow**  
  On the free tier, the service sleeps when idle. The first request may take 30–60 seconds to wake it up. If you set the Azure env vars on Vercel, the app can use Azure when the backend is cold.

- **CORS error**  
  The backend is configured with `allow_origins=["*"]`, so CORS is usually fine. If you still see CORS errors, double-check that the Render and Vercel URLs are correct and that `VITE_API_URL` has no trailing slash.
