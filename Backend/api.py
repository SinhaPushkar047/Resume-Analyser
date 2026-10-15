
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf.errors import PdfReadError
from resume import analyze_resume

app = FastAPI(
    title="Resume Analyser API",
    description="AI-powered resume analysis and career recommendations",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://resume-analyser-six.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Resume Analyser API is running!"}


@app.post("/analyze-resume")
def analyze_resume_endpoint(
    file: UploadFile = File(...),
    target_role: str = Form(...)
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF resume."
        )

    if not target_role.strip():
        raise HTTPException(
            status_code=400,
            detail="Target job role cannot be empty."
        )

    try:
        result = analyze_resume(file.file, target_role)
        return result

    except (PdfReadError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        file.file.close()
