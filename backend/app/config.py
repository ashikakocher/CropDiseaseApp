import os
from dotenv import load_dotenv

load_dotenv()

LOCATIONIQ_API_KEY = os.getenv("LOCATIONIQ_API_KEY")