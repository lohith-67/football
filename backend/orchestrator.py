import os
import json
import google.generativeai as genai
from tools import get_match_info, get_congestion, get_route, get_transit_options, get_group_standings

api_key = os.getenv("GEMINI_API_KEY")
if api_key and api_key != "your_gemini_api_key_here":
    genai.configure(api_key=api_key)

FAN_SYSTEM_PROMPT = """You are StadiumIQ, a multilingual stadium companion. Given a fan's message
(any language), their selected venue, location, accessibility needs, and time until kickoff:
1. Detect language and accessibility requirements from the message.
2. Call get_match_info(venue_id) for live score, teams, kickoff countdown, weather.
3. Call get_congestion(venue_id, zone) for live crowd levels near their gate.
4. Call get_route(venue_id, from_location, to_location, mode, accessible) for path + timing.
5. Call get_transit_options(venue_id, location) and score each by time and estimated emissions.
6. Synthesize one clear plan in the fan's own language: route, transit mode,
   ETA, buffer time before kickoff, plus the live match context.
Never suggest a route flagged non-accessible if the fan indicated a mobility need.
Never invent match data — only report what get_match_info returns."""

OPS_SYSTEM_PROMPT = """You are StadiumIQ Ops. Given an incident report from staff (any language) and the selected venue:
1. Classify severity and zone.
2. Cross-reference get_congestion(venue_id, zone) for current crowd state.
3. Draft a short recommended action in plain language.
4. Draft a translated fan-facing announcement if needed.
Output must be concise enough to read in under 10 seconds."""

# Map of tool names to functions
TOOL_MAP = {
    "get_match_info": get_match_info,
    "get_congestion": get_congestion,
    "get_route": get_route,
    "get_transit_options": get_transit_options
}

def resolve_match_context(venue_id: str):
    """
    Uses Gemini to resolve and normalize raw match and group data into a consistent JSON shape.
    """
    raw_match = get_match_info(venue_id)
    raw_group = get_group_standings(venue_id)
    
    api_key = os.getenv("GEMINI_API_KEY")
    # If no key, fallback immediately to raw data mapped to context shape
    if api_key in [None, "your_gemini_api_key_here", "dummy_key", ""]:
        return _build_fallback_context(raw_match, raw_group, is_estimated=True)
        
    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction="You are a data normalizer. You will receive raw dicts of match data and group standings. Normalize them into this exact JSON schema (without markdown code blocks): { 'teams': { 'home': 'str', 'away': 'str' }, 'score': 'str', 'status': 'str', 'kickoff': 'ISO-8601', 'venue_name': 'str', 'group_name': 'str', 'standings': [ { 'rank': 1, 'name': 'str', 'emoji': 'str', 'played': int, 'won': int, 'draw': int, 'lost': int, 'pts': int } ] }."
        )
        prompt = f"Raw Match: {json.dumps(raw_match)}\nRaw Group: {json.dumps(raw_group)}"
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        
        ctx = json.loads(text)
        ctx['is_estimated'] = False
        print(f"[GEMINI SUCCESS] Match context resolved via Gemini for venue: {venue_id}")
        return ctx
    except Exception as e:
        print(f"[GEMINI ERROR] Failed to resolve match context for venue {venue_id}: {str(e)}")
        # Fallback if Gemini hits rate limit (429) or other errors
        return _build_fallback_context(raw_match, raw_group, is_estimated=True)

def _build_fallback_context(match, group, is_estimated=True):
    return {
        "teams": {"home": match.get("home"), "away": match.get("away")},
        "score": match.get("score"),
        "status": match.get("status"),
        "kickoff": match.get("kickoff"),
        "venue_name": match.get("venue"),
        "group_name": group.get("group_name"),
        "standings": group.get("teams", []),
        "is_estimated": is_estimated
    }

def process_chat(message: str, mode: str, venue_id: str, language: str, accessible: bool, match_context: dict = None):
    api_key = os.getenv("GEMINI_API_KEY")
    
    # Helper to generate fallback
    def get_fallback(reason: str):
        home = match_context.get("teams", {}).get("home", "Unknown") if match_context else "Unknown"
        away = match_context.get("teams", {}).get("away", "Unknown") if match_context else "Unknown"
        venue_name = match_context.get("venue_name", venue_id) if match_context else venue_id
        if mode == 'fan':
            return f"[{reason}] Looking into {venue_name}. Match is {home} vs {away}. Use Gate B. Accessible routing: {accessible}."
        else:
            return f"[{reason}] Severity: Low. Zone: Concourse. Action: Deploy 2 staff members. Announcement: Please proceed normally."

    if api_key in [None, "your_gemini_api_key_here", "dummy_key", ""]:
        return get_fallback("Mock Fallback - No API Key")

    system_prompt = FAN_SYSTEM_PROMPT if mode == 'fan' else OPS_SYSTEM_PROMPT
    
    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=system_prompt,
            tools=[get_match_info, get_congestion, get_route, get_transit_options]
        )
        
        chat = model.start_chat(enable_automatic_function_calling=True)
        
        context = f"[System Context: Venue={venue_id}, Language Preference={language}. IMPORTANT: You MUST write your response entirely in the {language} language. Do NOT use English unless the language preference is English. Accessible Routing Needed={accessible}]\n\nUser: "
        
        response = chat.send_message(context + message)
        
        return {"response": response.text, "fallback": False}
            
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "Quota exceeded" in error_msg:
            return {"response": get_fallback("Mock Fallback - API Limit Reached"), "fallback": True}
        return {"response": f"Error connecting to AI: {error_msg}", "fallback": True}

def translate_text(text: str, target_language: str):
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key in [None, "your_gemini_api_key_here", "dummy_key", ""]:
        # Mock response
        return {"translation": text, "fallback": True}

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"Translate the following text to the {target_language} locale. Return ONLY the translated text without quotes or explanation.\n\nText: {text}"
        response = model.generate_content(prompt)
        return {"translation": response.text.strip(), "fallback": False}
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "Quota exceeded" in error_msg:
            return {"translation": text, "fallback": True}
        return {"translation": text, "fallback": True}
