# StadiumIQ 2026

StadiumIQ is a GenAI-powered web application designed for the FIFA World Cup 2026™. It provides an interactive dual-interface experience for both Fans and Operations Staff, leveraging Google's Gemini API for dynamic data parsing, natural language chatting, and multilingual translation.

## Features

*   **Dual Mode Experience:**
    *   **Fan Mode:** Navigate the stadium, find optimal transit routes (prioritizing low CO2), view live match contexts (countdown, score, team standings), and chat with the AI Fan Copilot.
    *   **Ops Mode:** Access live analytics, monitor gate bottlenecks, deploy staff, and issue command feeds. (Accessible via passcode).
*   **GenAI Integration (Gemini 2.5 Flash):**
    *   Translates text seamlessly between English, French, Spanish, and Portuguese.
    *   Normalizes raw match and group data into a consistent, easily digestible JSON format.
    *   Powers the intelligent Fan Copilot and Ops Assistant chat interfaces.
*   **Graceful Client Fallbacks:** Provides a seamless user experience with high-quality mock data even if the backend is unreachable.

## Architecture

*   **Frontend:** HTML, Tailwind CSS, React (via Babel standalone CDN), Framer Motion for animations. Hosted statically (e.g., Netlify).
*   **Backend:** Python FastAPI. Serves API endpoints for Chat, Match Context, Translations, and Ops Authentication.
*   **LLM Provider:** Google Generative AI (Gemini).

## Getting Started

### Prerequisites

*   Python 3.11+
*   A Gemini API Key (get one from [Google AI Studio](https://aistudio.google.com/))
*   Node.js (optional, for running local dev servers like `npx serve`)

### Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/lohith-67/football.git
    cd football
    ```

2.  **Set up the Backend:**
    ```bash
    # Create a virtual environment (optional but recommended)
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    
    # Install dependencies
    pip install -r requirements.txt
    
    # Create a .env file and add your Gemini API Key
    echo "GEMINI_API_KEY=your_actual_key_here" > .env
    ```

3.  **Start the Backend Server:**
    ```bash
    cd backend
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
    *The FastAPI backend mounts the `frontend` folder to the root `/`, so by default, the entire app is now running at `http://localhost:8000`.*

### Deployment

**1. Deploying the Backend (e.g., Render)**
*   Connect this repository to Render and create a new **Web Service**.
*   You can use the provided `render.yaml` Blueprint or `Dockerfile`.
*   Ensure you set `GEMINI_API_KEY` in the environment variables on the Render dashboard.
*   The Ops passcode defaults to `STADIUM26`, but can be customized by setting the `OPS_PASSCODE` environment variable.

**2. Deploying the Frontend (e.g., Netlify)**
*   Connect the repository to Netlify.
*   The `netlify.toml` is pre-configured to deploy the `frontend` directory.
*   **Crucial Step:** In the Netlify dashboard under *Site configuration > Environment variables*, add a variable named `API_BASE_URL` pointing to your deployed backend URL (e.g., `https://stadiumiq-backend.onrender.com`). The build script will automatically wire the frontend to this backend.

## Structure

*   `/frontend` - Contains the React components, styles, HTML, and generated translations.
*   `/backend` - Contains the FastAPI application, Gemini orchestrators, and mocked data tools.
*   `render.yaml` & `Dockerfile` - Configurations for easy deployment.
