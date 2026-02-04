# Render లో పని చేయడానికి – ముఖ్య స్టెప్ (Important Step for Render)

Render పై backend **పని చేయడానికి ఒక్క ముఖ్యమైన సెట్టింగ్** చేయాలి.

---

## 1. Python Version = 3.12 సెట్ చేయండి

Render **డిఫాల్ట్ గా Python 3.13** వాడుతోంది. ఈ ప్రాజెక్ట్ కోడ్ **Python 3.12** తోనే సరిగా పని చేస్తుంది (pydantic, SQLAlchemy, psycopg2 అన్నీ 3.12 లో స్టేబుల్).

### ఎలా సెట్ చేయాలి

1. **Render Dashboard** లోకి వెళ్లండి: https://dashboard.render.com  
2. మీ **Web Service** (ఉదా. ai-resume-analyzer) ఎంచుకోండి.  
3. ఎడమ వైపు **Environment** క్లిక్ చేయండి.  
4. **Add Environment Variable** క్లిక్ చేయండి.  
5. ఇలా ఇవ్వండి:  
   - **Key:** `PYTHON_VERSION`  
   - **Value:** `3.12.0`  
6. **Save Changes** క్లిక్ చేయండి.  
7. **Manual Deploy** → **Deploy latest commit** చేయండి (లేదా push చేస్తే auto deploy అవుతుంది).

ఇలా చేసిన తర్వాత Render **Python 3.12** తో build మరియు run చేస్తుంది – build మరియు runtime errors తగ్గుతాయి.

---

## 2. PostgreSQL వాడకపోతే (ఐచ్ఛికం)

- Render లో **PostgreSQL database add చేయకపోతే**, **DATABASE_URL** ఏమీ సెట్ చేయకండి.  
- అప్పుడు app **SQLite** వాడుతుంది (ఫైల్ బేస్).  
- Free tier లో SQLite డేటా restart తర్వాత పోవచ్చు – అయినా app పని చేస్తుంది.

PostgreSQL add చేసి DATABASE_URL సెట్ చేస్తే, అది కూడా Python 3.12 + psycopg2 తో పని చేస్తుంది.

---

## సారాంశం

| ఏమి చేయాలి | ఎక్కడ |
|-------------|--------|
| **PYTHON_VERSION = 3.12.0** | Render → మీ Service → Environment → Add Variable |
| Save → Redeploy | Render Dashboard |

ఇది సెట్ చేసిన తర్వాత మళ్లీ deploy చేయండి.
