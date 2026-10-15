from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from prompt_template_1 import prompt_1, parser_1
from prompt_template_2 import prompt_2, parser_2
from pypdf import PdfReader
from dotenv import load_dotenv

load_dotenv()


def extract_resume_text(pdf_file):
    reader = PdfReader(pdf_file)

    resume_text = ""
    for page in reader.pages:
        resume_text += page.extract_text() or ""

    if not resume_text.strip():
        raise ValueError("No readable text found in the PDF.")

    return resume_text


model_1 = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=1
)

model_2 = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    temperature=0.2
)

chain_1 = prompt_1 | model_1 | parser_1
chain_2 = prompt_2 | model_2 | parser_2


def analyze_resume(pdf_file, target_role):
    if not target_role or not target_role.strip():
        raise ValueError("Target job role cannot be empty.")

    resume_text = extract_resume_text(pdf_file)

    profile = chain_1.invoke({
        "resume": resume_text
    })

    analysis = chain_2.invoke({
        "candidate_profile": profile.model_dump_json(),
        "target_role": target_role.strip()
    })

    return {
        "profile": profile.model_dump(),
        "analysis": analysis.model_dump()
    }