import os
import json
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = None # Force mock translations for speed and rate limits during test

if api_key and api_key != "your_gemini_api_key_here":
    genai.configure(api_key=api_key)

# 80 FIFA Member Association Primary Languages
FIFA_LANGUAGES = {
    'af': 'Afrikaans', 'sq': 'Albanian', 'am': 'Amharic', 'ar': 'Arabic', 'hy': 'Armenian',
    'az': 'Azerbaijani', 'be': 'Belarusian', 'bn': 'Bengali', 'bs': 'Bosnian', 'bg': 'Bulgarian',
    'my': 'Burmese', 'ca': 'Catalan', 'zh': 'Chinese (Simplified)', 'hr': 'Croatian', 'cs': 'Czech',
    'da': 'Danish', 'nl': 'Dutch', 'en': 'English', 'et': 'Estonian', 'fi': 'Finnish',
    'fr': 'French', 'ka': 'Georgian', 'de': 'German', 'el': 'Greek', 'he': 'Hebrew',
    'hi': 'Hindi', 'hu': 'Hungarian', 'is': 'Icelandic', 'id': 'Indonesian', 'it': 'Italian',
    'ja': 'Japanese', 'kk': 'Kazakh', 'km': 'Khmer', 'ko': 'Korean', 'ku': 'Kurdish',
    'ky': 'Kyrgyz', 'lo': 'Lao', 'lv': 'Latvian', 'lt': 'Lithuanian', 'mk': 'Macedonian',
    'ms': 'Malay', 'mt': 'Maltese', 'mn': 'Mongolian', 'ne': 'Nepali', 'no': 'Norwegian',
    'ps': 'Pashto', 'fa': 'Persian', 'pl': 'Polish', 'pt': 'Portuguese', 'ro': 'Romanian',
    'ru': 'Russian', 'sr': 'Serbian', 'sk': 'Slovak', 'sl': 'Slovenian', 'es': 'Spanish',
    'sw': 'Swahili', 'sv': 'Swedish', 'tg': 'Tajik', 'ta': 'Tamil', 'th': 'Thai',
    'tr': 'Turkish', 'tk': 'Turkmen', 'uk': 'Ukrainian', 'ur': 'Urdu', 'uz': 'Uzbek',
    'vi': 'Vietnamese', 'cy': 'Welsh', 'xh': 'Xhosa', 'zu': 'Zulu'
}

BASE_KEYS = {
    "app_title": "StadiumIQ",
    "app_subtitle": "FIFA World Cup 26™ Copilot",
    "live_translator": "Live Translator",
    "ops_mode": "Ops Mode",
    "fan_mode": "Fan Mode",
    "keyboard": "Keyboard",
    "live_conversation": "Live Conversation",
    "tap_mic_to_speak": "Tap mic to speak. Auto-detecting",
    "live_match_context": "Live Match Context",
    "kickoff_in": "Kickoff in",
    "mins": "mins",
    "venue_forecast": "Venue Forecast",
    "group_stage_match": "Group Stage Match",
    "recommended_route": "Recommended Route",
    "transit_walk": "Transit + Walk",
    "rideshare": "Rideshare",
    "walking_scenic": "Walking (Scenic Route)",
    "eta": "ETA",
    "lowest_co2": "Lowest CO2",
    "accessible": "Accessible",
    "high_congestion": "High congestion at Dropoff Zone B",
    "zero_carbon": "Zero Carbon",
    "group_stage_results": "Group Stage Results",
    "team": "Team",
    "mp": "MP",
    "w": "W",
    "pts": "Pts",
    "live_zone_congestion": "Live Zone Congestion",
    "fan_copilot": "Fan Copilot",
    "ops_assistant": "Ops Assistant",
    "online": "Online",
    "thinking": "Thinking...",
    "send": "Send",
    "fan_placeholder": "Ask about routes, accessibility...",
    "ops_placeholder": "Report an incident...",
    "mock_fan_greeting": "Hi! I'm StadiumIQ. How can I help you navigate the stadium, find transit, or get match info?",
    "mock_ops_greeting": "StadiumIQ Ops ready. Report incidents or ask for operational intel.",
    "attendance": "Attendance",
    "capacity_reached": "Capacity Reached",
    "avg_gate_wait": "Avg Gate Wait",
    "moving_avg": "from moving avg",
    "active_incidents": "Active Incidents",
    "gate_bottleneck": "Gate C Bottleneck",
    "staff_deployed": "Staff Deployed",
    "fulfillment_rate": "Fulfillment Rate",
    "eco_transit": "Eco-Transit",
    "last_match": "from last match",
    "command_feed": "Command Feed",
    "high": "High",
    "wait_time_risk": "Wait time > 45 mins. Fans at risk of missing kickoff. Action required.",
    "genai_resolution": "GenAI Resolution",
    "auto_translating": "Auto-translating to:",
    "broadcast_route": "Broadcast & Route",
    "zone_sensors": "Zone Sensors",
    "live_feed": "LIVE FEED [SIMULATED]",
    "quick_phrases": "Quick Phrases",
    "resource_allocation": "Resource Allocation",
    "shift_change": "Shift Change",
    "request_backup": "Request Backup",
    "security": "Security",
    "guest_services": "Guest Services",
    "medical": "Medical",
    "maintenance": "Maintenance",
    "find_my_seat": "Find My Seat",
    "your_seat": "Your Seat",
    "walk_time": "Walk time"
}

OUTPUT_FILE = "../frontend/i18n_generated.js"

def load_cache():
    if not os.path.exists(OUTPUT_FILE):
        return {}
    
    with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
        try:
            # Extract JSON from JS variable assignment
            json_str = content.split('window.translations = ')[1].split(';')[0]
            return json.loads(json_str)
        except Exception as e:
            print("Error parsing cache:", e)
            return {}

def save_cache(cache):
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json_str = json.dumps(cache, ensure_ascii=False, indent=4)
        f.write(f"window.translations = {json_str};\n")
        f.write(f"window.FIFA_LANGUAGES = {json.dumps(FIFA_LANGUAGES, ensure_ascii=False, indent=4)};\n")

def translate_batch(target_lang_name, missing_keys):
    if not api_key or api_key in ["your_gemini_api_key_here", "dummy_key", ""]:
        print(f"Mocking translation for {target_lang_name}")
        return {k: f"[{target_lang_name}] {BASE_KEYS[k]}" for k in missing_keys}

    model = genai.GenerativeModel("gemini-2.5-flash")
    
    # We will format the missing keys into a JSON object and ask Gemini to translate the values
    prompt = f"""Translate the values of the following JSON object into {target_lang_name}.
    Return ONLY a valid JSON object matching the exact structure and keys, with translated values.
    Do not wrap it in markdown code blocks. Just valid JSON.
    
    JSON:
    {json.dumps({k: BASE_KEYS[k] for k in missing_keys}, ensure_ascii=False, indent=2)}
    """
    
    try:
        response = model.generate_content(prompt)
        # Parse JSON
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Failed to translate for {target_lang_name}: {e}")
        return None

def main():
    print("Starting translation generator...")
    cache = load_cache()
    
    # Initialize English if missing
    if 'en' not in cache:
        cache['en'] = BASE_KEYS
    
    updated = False
    
    for code, name in FIFA_LANGUAGES.items():
        if code not in cache:
            cache[code] = {}
        
        missing_keys = [k for k in BASE_KEYS if k not in cache[code]]
        
        if not missing_keys:
            continue
            
        print(f"Translating {len(missing_keys)} keys to {name} ({code})...")
        translated_dict = translate_batch(name, missing_keys)
        
        if translated_dict:
            for k in missing_keys:
                cache[code][k] = translated_dict.get(k, BASE_KEYS[k])
            updated = True
        
        # Avoid hitting rate limits if real API is used
        if api_key and api_key not in ["your_gemini_api_key_here", "dummy_key", ""]:
            time.sleep(2)
            
    if updated:
        print("Saving updated translations...")
        save_cache(cache)
    else:
        print("No new translations needed.")

    # Always ensure the output file exists, even if mock
    if not os.path.exists(OUTPUT_FILE):
        save_cache(cache)

if __name__ == "__main__":
    main()
