FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend files (assuming the build context is the repository root)
COPY backend/ ./backend/
# We also need the frontend folder for StaticFiles mounting, even if we are only deploying it to render as an API, because main.py mounts it!
COPY frontend/ ./frontend/

WORKDIR /app/backend

# Run the FastAPI server using the PORT environment variable provided by Render
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
