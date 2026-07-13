# StadiumIQ - FIFA World Cup 26™ Copilot ⚽🏟️

StadiumIQ is an AI-powered, real-time stadium assistant built for the FIFA World Cup 26™. It features two distinct, fully-integrated interfaces designed to elevate the stadium experience for both fans and operational staff.

---

## 🌟 Key Features

### 🏟️ Fan Mode (For Attendees)
* **Live Match Context**: Real-time score, match status, and live kickoff countdowns.
* **Smart Navigation**: AI-driven route recommendations calculating walking time, transit options, carbon footprint (Lowest CO2), and accessibility.
* **Fan Copilot**: A generative AI assistant that natively speaks 100+ languages (via real-time Gemini translation) to answer questions about gates, seating, accessibility, and stadium amenities.
* **Live Translator**: A simulated live translation interface to bridge communication gaps instantly.

### 🛡️ Ops Mode (For Venue Staff)
* **Command Feed**: GenAI-powered decision support surface that flags incidents (e.g., gate bottlenecks) and proposes actionable resolutions.
* **Live Dashboard**: Real-time KPI monitoring including attendance rates, gate wait times, staff deployment fulfillment, and active incidents.
* **Zone Sensors**: Simulated live feeds mapping crowd congestion across stadium sectors.
* **Resource Allocation**: Dashboard for managing security, medical, guest services, and maintenance staff efficiently.
*(Note: Ops Mode is protected by a passcode. Use **`STADIUM26`** to access it).*

---

## 🚀 Quickstart Guide

This project consists of a Python FastAPI backend and a lightweight React frontend (using Babel Standalone and Tailwind CSS via CDN).

### 1. Prerequisites
- Python 3.9+
- A Google Gemini API Key
- A Supabase Key (optional, if database features are active)

### 2. Installation
Clone the repository and install the backend dependencies:
```bash
git clone https://github.com/lohith-67/football.git
cd football
pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file in the root directory (you can copy `.env.example` if it exists) and add your keys:
```env
GEMINI_API_KEY=your_google_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### 4. Running the Application
Start the FastAPI backend (which also serves the frontend static files):
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Usage
* Open your browser and navigate to `http://localhost:8000`.
* **To enter Fan Mode**: Simply click "Enter" on the landing page.
* **To enter Ops Mode**: Click "Ops Mode" in the top right corner and enter the passcode **`STADIUM26`**.

---

## 🛠️ Tech Stack
* **Backend**: Python, FastAPI, Google GenAI (Gemini 2.5 Flash)
* **Frontend**: React (Client-side / Babel Standalone), Tailwind CSS, Framer Motion
* **Architecture**: Single Page Application (SPA) served statically via FastAPI `StaticFiles`.

---

## 🌐 Localization Architecture
StadiumIQ boasts an advanced translation engine. 
The GenAI Copilot determines the user's selected language globally and dynamically injects instructions into the AI's prompt to generate native responses in the requested language (e.g., French, Spanish, Portuguese), eliminating the need for slow post-generation translation passes. UI elements update dynamically without stale locale closures.

---

*Built for the future of live sports.*
