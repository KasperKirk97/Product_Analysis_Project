import psycopg
from dotenv import load_dotenv, find_dotenv
from pathlib import Path
import os

env_path = (
Path(__file__).resolve().parent
/ ".env"
)

load_dotenv(env_path)

def get_connection():
    return psycopg.connect(
        host=os.getenv("POSTGRES_HOST"),
        port=5432,
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password = os.getenv("POSTGRES_PASSWORD"),
        sslmode="verify-full",
        sslrootcert="certificates/root-cert.pem",
    )