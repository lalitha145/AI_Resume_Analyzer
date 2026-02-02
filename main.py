
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import io

import models
from database import engine, get_db
from services.analyzer import extract_text_from_pdf, analyze_resume_logic

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Resume AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Resume AI API is running"}

@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        content = await file.read()
        text = extract_text_from_pdf(io.BytesIO(content))
        analysis = analyze_resume_logic(text)
        
        # Save to DB
        db_resume = models.Resume(filename=file.filename, score=analysis["score"])
        db.add(db_resume)
        db.commit()
        
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
