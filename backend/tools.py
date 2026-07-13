from datetime import datetime, timedelta

def get_match_info(venue_id: str):
    """Mock match data API."""
    now = datetime.now()
    
    # For testing, let's make kickoff exactly at the current hour + 30 mins
    kickoff = now.replace(minute=30, second=0, microsecond=0)
    if now.minute >= 30:
        kickoff = now.replace(minute=0, second=0, microsecond=0) + timedelta(hours=1)
    
    # Calculate state based on time relative to kickoff
    diff_minutes = (now - kickoff).total_seconds() / 60
    
    status = "Pre-match"
    score = "0 - 0"
    
    if diff_minutes >= 110:
        status = "Full-time"
        score = "2 - 1"
    elif diff_minutes >= 45 and diff_minutes < 60:
        status = "Half-time"
        score = "1 - 0"
    elif diff_minutes >= 0 and diff_minutes < 110:
        status = "Live"
        score = "1 - 0" if diff_minutes < 70 else "2 - 1"

    matches = {
        'metlife': {
            'home': 'USA',
            'away': 'ENG',
            'score': score,
            'kickoff': kickoff.isoformat(),
            'status': status,
            'weather': 'Sunny',
            'temp': '72°F',
            'venue': 'New York/New Jersey Stadium'
        },
        'azteca': {
            'home': 'MEX',
            'away': 'ARG',
            'score': score,
            'kickoff': kickoff.isoformat(),
            'status': status,
            'weather': 'Rain',
            'temp': '65°F',
            'venue': 'Estadio Azteca'
        },
        'bmo': {
            'home': 'CAN',
            'away': 'FRA',
            'score': score,
            'kickoff': kickoff.isoformat(),
            'status': status,
            'weather': 'Cloudy',
            'temp': '58°F',
            'venue': 'Toronto Stadium'
        }
    }
    
    return matches.get(venue_id, matches['metlife'])

def get_congestion(venue_id: str, zone: str):
    """Simulated congestion feed."""
    return {
        "venue": venue_id,
        "zone": zone,
        "congestion_level": "High" if zone == "Gate C" else "Low",
        "wait_time_mins": 45 if zone == "Gate C" else 5,
        "is_simulated": True
    }

def get_route(venue_id: str, from_location: str, to_location: str, mode: str, accessible: bool):
    """Simulated routing."""
    return {
        "path": f"{from_location} -> {to_location}",
        "mode": mode,
        "accessible": accessible,
        "eta_mins": 24,
        "eco_friendly": True if mode in ['transit', 'walk'] else False
    }

def get_transit_options(venue_id: str, location: str):
    """Simulated transit options."""
    return [
        {"mode": "Transit + Walk", "time_mins": 24, "emissions": "Low", "accessible": True},
        {"mode": "Rideshare", "time_mins": 18, "emissions": "High", "accessible": True, "congestion_warning": "High congestion at Dropoff Zone B"}
    ]

def get_group_standings(venue_id: str):
    """Mock group standings mapping a venue's current match to its group."""
    groups = {
        'metlife': {
            'group_name': 'Group A',
            'teams': [
                { 'rank': 1, 'name': 'USA', 'emoji': '🇺🇸', 'played': 3, 'won': 2, 'draw': 1, 'lost': 0, 'pts': 7 },
                { 'rank': 2, 'name': 'ENG', 'emoji': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'played': 3, 'won': 2, 'draw': 0, 'lost': 1, 'pts': 6 },
                { 'rank': 3, 'name': 'MEX', 'emoji': '🇲🇽', 'played': 3, 'won': 1, 'draw': 1, 'lost': 1, 'pts': 4 },
                { 'rank': 4, 'name': 'CAN', 'emoji': '🇨🇦', 'played': 3, 'won': 0, 'draw': 0, 'lost': 3, 'pts': 0 },
            ]
        },
        'azteca': {
            'group_name': 'Group B',
            'teams': [
                { 'rank': 1, 'name': 'ARG', 'emoji': '🇦🇷', 'played': 3, 'won': 3, 'draw': 0, 'lost': 0, 'pts': 9 },
                { 'rank': 2, 'name': 'FRA', 'emoji': '🇫🇷', 'played': 3, 'won': 1, 'draw': 1, 'lost': 1, 'pts': 4 },
                { 'rank': 3, 'name': 'ESP', 'emoji': '🇪🇸', 'played': 3, 'won': 1, 'draw': 1, 'lost': 1, 'pts': 4 },
                { 'rank': 4, 'name': 'MEX', 'emoji': '🇲🇽', 'played': 3, 'won': 0, 'draw': 0, 'lost': 3, 'pts': 0 },
            ]
        },
        'bmo': {
            'group_name': 'Group C',
            'teams': [
                { 'rank': 1, 'name': 'CAN', 'emoji': '🇨🇦', 'played': 3, 'won': 2, 'draw': 1, 'lost': 0, 'pts': 7 },
                { 'rank': 2, 'name': 'FRA', 'emoji': '🇫🇷', 'played': 3, 'won': 2, 'draw': 0, 'lost': 1, 'pts': 6 },
                { 'rank': 3, 'name': 'POR', 'emoji': '🇵🇹', 'played': 3, 'won': 1, 'draw': 0, 'lost': 2, 'pts': 3 },
                { 'rank': 4, 'name': 'JPN', 'emoji': '🇯🇵', 'played': 3, 'won': 0, 'draw': 1, 'lost': 2, 'pts': 1 },
            ]
        }
    }
    return groups.get(venue_id, groups['metlife'])
