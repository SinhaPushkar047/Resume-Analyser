# 🚀 Resume Analyser — AI-Powered Career Assistant

<p align="center">
  <b>Analyse a resume. Explore skill gaps. Plan your next career move.</b>
  <br />
  <a href="https://resume-analyser-six.vercel.app/">🌐 Try the Live App</a>
  &nbsp;•&nbsp;
  <a href="https://github.com/SinhaPushkar047/Resume-Analyser">💻 GitHub Repository</a>
</p>

## 📌 Overview

**Resume Analyser** is an AI-powered web application that extracts structured information from a PDF resume and analyses the candidate's profile against a target job role.

The application uses a two-stage Large Language Model (LLM) pipeline: one model extracts information from the resume, and another analyses the resulting profile for role-specific career insights.

### ✨ Features

- **PDF Resume Upload:** Upload a PDF resume for analysis.
- **Structured Resume Extraction:** Extract candidate information such as education, skills, projects, and experience.
- **Target Role Analysis:** Analyse a candidate profile in the context of a selected job role.
- **Skill Gap Insights:** Identify skills and areas that may need further development.
- **Career Recommendations:** Generate suggestions to help guide learning and project planning.
- **LLM Pipeline:** Separate resume extraction from career analysis.
- **Full-Stack Web App:** React frontend connected to a Python REST API.

> AI-generated recommendations are suggestions, not guarantees of employability or job selection.

## 🖥️ Live Demo

**Try the application:** [https://resume-analyser-six.vercel.app/](https://resume-analyser-six.vercel.app/)

Upload a PDF resume, enter a target job role, and submit it to view the generated results.

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| React | Frontend interface |
| Vite | Frontend development and build tooling |
| Python | Backend logic |
| FastAPI | REST API |
| LangChain | Prompt pipelines and LLM orchestration |
| Groq — GPT-OSS 120B | Resume information extraction |
| Google Gemini Flash-Lite | Target-role analysis |
| Pydantic / structured output parsers | Structured model responses |
| pypdf | PDF text extraction |
| python-dotenv | Local environment variable loading |
| Vercel | Frontend deployment |
| Render | Backend deployment |
| Git and GitHub | Version control |

## 🏗️ How It Works

```text
User uploads PDF + enters target role
                  |
                  v
          React + Vite Frontend
                  |
                  v
       FastAPI: /analyze-resume
                  |
                  v
          Extract PDF text
               (pypdf)
                  |
                  v
      Stage 1: Resume extraction
          Groq — GPT-OSS 120B
                  |
                  v
       Structured candidate profile
                  |
                  v
      Stage 2: Target-role analysis
       Google Gemini Flash-Lite
                  |
                  v
        Structured analysis result
                  |
                  v
          JSON response to UI
```

### Stage 1 — Resume Extraction

1. The user uploads a PDF and enters a target role.
2. The backend extracts readable text from the PDF using `pypdf`.
3. A LangChain prompt sends the resume text to Groq's GPT-OSS 120B model.
4. The response parser converts the result into a structured candidate profile.

### Stage 2 — Career Analysis

1. The candidate profile is serialized and passed to the second prompt.
2. The profile and target job role are sent to Google Gemini Flash-Lite.
3. The model generates a role-focused analysis.
4. The backend parses the response and returns the profile and analysis as JSON.

## 📂 Project Structure

The repository is organized into frontend and backend components. The main files include:

```text
Resume-Analyser/
├── Backend/
│   ├── api.py
│   ├── resume.py
|   ├── schemas.py
│   ├── prompt_template_1.py
│   └── prompt_template_2.py
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── requirement.txt
├── package.json
└── README.md
```

*This is a high-level overview; the repository may contain additional files.*

| File | Responsibility |
|---|---|
| `Backend/api.py` | FastAPI application, CORS settings, and API endpoint |
| `Backend/resume.py` | PDF text extraction and two-stage LLM pipeline |
| `Backend/prompt_template_1.py` | Resume extraction prompt and parser |
| `Backend/prompt_template_2.py` | Target-role analysis prompt and parser |
| `frontend/` | React interface and API request handling |

## ⚙️ Run Locally

### Prerequisites

- Python installed
- Node.js and npm installed
- A Groq API key
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/SinhaPushkar047/Resume-Analyser.git
cd Resume-Analyser
```

### 2. Install backend dependencies

Create and activate a virtual environment from the repository root:

**Windows PowerShell**

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirement.txt
```

If PowerShell blocks activation, you can use the appropriate activation method for your system or run the environment's Python directly.

### 3. Configure backend environment variables

Create a `.env` file in the directory from which the backend loads environment variables. For the commands below, the backend is started from `Backend/`, so a `.env` file inside that directory is a straightforward option.

```env
GROQ_API_KEY=your_groq_api_key
GOOGLE_API_KEY=your_google_gemini_api_key
```

Get API keys from:

- [Groq Console](https://console.groq.com/keys)
- [Google AI Studio](https://aistudio.google.com/)

**Never commit real API keys to GitHub.** Keep `.env` files excluded through `.gitignore`.

### 4. Start the backend

From the repository root:

```bash
cd Backend
uvicorn api:app --reload
```

The local API should be available at `http://127.0.0.1:8000`.

FastAPI interactive documentation is available at `http://127.0.0.1:8000/docs`.

### 5. Configure the frontend

Open a second terminal and run:

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

`VITE_API_URL` must point to the backend you are running. Vite variables prefixed with `VITE_` are exposed to browser-side code, so **never put API keys or secrets in them**.

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## 🔌 API Reference

### `GET /`

Checks that the backend is responding.

Example response:

```json
{
  "message": "Resume Analyser API is running!"
}
```

### `POST /analyze-resume`

Analyses a PDF resume against a target role.

**Content type:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | PDF file | Yes | Resume PDF |
| `target_role` | String | Yes | Role to analyse the resume against |

Example using cURL:

```bash
curl -X POST "http://127.0.0.1:8000/analyze-resume" \
  -F "file=@sample_resume.pdf" \
  -F "target_role=Software Development Engineer"
```

The response contains `profile` and `analysis` objects. Their exact fields depend on the schemas and parsers defined in the prompt-template files.

## 🚀 Deployment

The application uses separate services for its frontend and backend.

### Frontend — Vercel

1. Connect the GitHub repository to Vercel.
2. Configure the project root to use `frontend/` if required by the project settings.
3. Set the production environment variable:

   ```env
   VITE_API_URL=https://YOUR-RENDER-BACKEND-URL
   ```

4. Deploy or redeploy the frontend after changing environment variables.

### Backend — Render

1. Connect the repository to a Render web service.
2. Configure the service to run the backend from `Backend/`.
3. Example start command:

   ```bash
   cd Backend && uvicorn api:app --host 0.0.0.0 --port $PORT
   ```

4. Configure `GROQ_API_KEY` and `GOOGLE_API_KEY` in Render's environment settings.
5. Configure CORS to allow the intended frontend origins.
6. Deploy and verify the service logs and root endpoint.

Use the actual backend URL assigned by Render in `VITE_API_URL`.

## 🧪 Testing Checklist

- Upload a readable PDF resume.
- Try more than one target job role.
- Verify extracted details against the source resume.
- Check that the analysis matches the selected target role.
- Try an invalid file type.
- Try a PDF with no extractable text.
- Check the backend logs if an API provider returns an error.

LLM output can vary between runs, and the quality of recommendations depends on the resume, prompts, model behavior, and API availability.

## ⚠️ Limitations

- Scanned PDFs may not contain extractable text; OCR support may be needed for those documents.
- Extracted information can be incomplete or inaccurate and should be reviewed.
- Career recommendations are AI-generated suggestions and should not be treated as guaranteed outcomes.
- Groq and Gemini quotas, rate limits, and service availability can affect requests.
- The app sends resume text to external AI providers for processing.

## 🔐 Privacy and Security

- Avoid uploading sensitive resumes unless you understand and accept how the information is processed.
- Do not expose API keys in frontend code or public repositories.
- Keep provider credentials in backend environment variables.
- Avoid logging full resume contents or personal contact information.
- Document data retention and privacy practices before making the app available to a wider audience.

## 🔮 Potential Future Improvements

- Job description matching and compatibility insights.
- More detailed skill-gap prioritization.
- Curated learning resources and project recommendations.
- Resume bullet-point improvement suggestions.
- OCR support for scanned PDFs.
- Automated tests for API validation and error handling.
- Improved loading states, error messages, and result visualization.
- Model fallback and retry handling for temporary provider failures.

These are potential improvements and should not be interpreted as features already implemented.

## 📚 What I Learned

Building this project provided practical experience with:

- Connecting multiple LLMs in a sequential pipeline.
- Prompt design and structured output parsing.
- PDF text extraction.
- Building REST APIs with FastAPI.
- Connecting a React frontend to a Python backend.
- Configuring environment variables and CORS.
- Deploying and debugging a full-stack AI application.

## 🤝 Contributing

Suggestions and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Open a pull request describing the improvement.

## 📄 License

No license is specified in this README. Add a `LICENSE` file if you intend to publish the project under a particular open-source license.

## 👨‍💻 Author

**Pushkar Sinha**

- GitHub: [SinhaPushkar047](https://github.com/SinhaPushkar047)
- Live App: [Resume Analyser](https://resume-analyser-six.vercel.app/)

---

If you find this project useful, consider starring the repository!

*Built as a hands-on project to explore LLM orchestration, structured outputs, and full-stack AI application development.*
