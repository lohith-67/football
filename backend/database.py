import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def get_db() -> Client:
    """
    Returns a configured Supabase client.
    Raises ValueError if credentials are not configured.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase URL and Key must be set in environment variables.")
    
    return create_client(SUPABASE_URL, SUPABASE_KEY)
