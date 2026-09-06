# Python AI service

This service handles interview feedback for the Laravel API and keeps the existing frontend response format.

## Start it

From the `backend` directory:

```powershell
& "C:\Program Files\Python310\python.exe" python_ai\ai_service.py
```

The service listens on `http://127.0.0.1:8010`. Laravel forwards `/api/interview/feedback` requests to it using `PYTHON_AI_URL`.

The service reads `GROQ_API_KEY` and `GROQ_MODEL` from the process environment or `backend/.env`. It uses Python's standard library, so no `pip install` step is needed.
