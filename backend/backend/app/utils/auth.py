import logging
import os
import time
from typing import Dict

import jwt
from dotenv import load_dotenv
from fastapi import HTTPException, Security
from fastapi.security import APIKeyHeader
from supabase import Client, ClientOptions, create_client

load_dotenv()

# Retrieve the API key header name from the environment
API_AUTH_HEADER_NAME: str = os.getenv(
    key="API_AUTH_HEADER_NAME", default="Authorization"
)

# Retrieve the Backend API key header from the environment
API_KEY_HEADER_NAME: str = os.getenv(key="API_KEY_HEADER_NAME", default="X-API-Key")

# Create an API key header instance
API_AUTH_HEADER = APIKeyHeader(name=API_AUTH_HEADER_NAME, auto_error=False)

# Retrieve the API key from the environment
BACKEND_API_KEY: str = os.getenv(key="BACKEND_API_KEY")

# Create an API key header instance
API_KEY_HEADER = APIKeyHeader(name=API_KEY_HEADER_NAME, auto_error=False)

JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET")
JWT_ALGORITHM = "HS256"


def verify_jwt(jwtoken: str) -> bool:
    """Verify the JWT token and return True if the token is valid, else return False"""
    isTokenValid: bool = False

    try:
        payload = decodeJWT(jwtoken)
    except Exception:
        payload = None
    if payload:
        isTokenValid = True
    return isTokenValid


def decodeJWT(token: str) -> Dict:
    """Decode the JWT token and return the payload if the token is valid, else return None"""
    try:
        decoded_token = jwt.decode(
            token, JWT_SECRET, algorithms=[JWT_ALGORITHM], options={"verify_aud": False}
        )
        return decoded_token if decoded_token["exp"] >= time.time() else None
    except Exception:
        return None


def get_user_from_JWT(token: str):
    """Get the user id from the JWT token and return True if the user exists, else return False"""
    supabase_url: str = os.environ.get("SUPABASE_URL")
    supabase_key: str = os.environ.get("SUPABASE_ANON_KEY")

    supabase: Client = create_client(
        supabase_url=supabase_url,
        supabase_key=supabase_key,
        options=ClientOptions(
            postgrest_client_timeout=10,
            storage_client_timeout=10,
        ),
    )

    payload = decodeJWT(token)
    user_id = payload["sub"]

    if user_id is not None:
        # Try to get the user from the database using the user_id
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        # print(response.data)
        if len(response.data) == 0:
            return False
        return True
    return False


async def validate_user(
    auth_token: str = Security(dependency=API_AUTH_HEADER),
    api_key: str = Security(dependency=API_KEY_HEADER),
):
    try:
        logger = logging.getLogger("uvicorn")
        # logger.debug(f"Auth Token: {auth_token} | API Key: {api_key}")
        if auth_token is not None or api_key is not None:
            # If the access token is empty, use the 'X-API-Key' from the header
            if auth_token is None:
                # Access the 'X-API-Key' header directly
                if BACKEND_API_KEY is None:
                    raise ValueError("Backend API key is not set in Backend Service!")
                # If the 'X-API-Key' does not match the backend API key, raise an error
                if api_key != BACKEND_API_KEY:
                    raise ValueError(
                        "Invalid API key provided in the 'X-API-Key' header!"
                    )
                else:
                    logger.info("Validated API key successfully!")
                    return None
            else:
                auth_token = (
                    auth_token.strip()
                )  # Remove leading and trailing whitespaces
                isBearer = auth_token.startswith(
                    "Bearer"
                )  # Check if the token starts with 'Bearer'
                jwtoken = auth_token.split("Bearer ")[
                    1
                ]  # Extract the token from the 'Bearer' string
                if JWT_SECRET is None:
                    raise ValueError(
                        "Supabase JWT Secret is not set in Backend Service!"
                    )
                if not isBearer:
                    return (
                        "Invalid token scheme. Please use the format 'Bearer [token]'"
                    )
                # Verify the JWT token is valid
                if verify_jwt(jwtoken=jwtoken) is None:
                    return "Invalid token. Please provide a valid token."
                # Check if the user exists in the database
                if get_user_from_JWT(token=jwtoken):
                    logger.info("Validated User's Auth Token successfully!")
                    return None
                else:
                    raise ValueError("User does not exist in the database!")
        else:
            raise ValueError(
                "Either Access token [Authorization] or API key [X-API-Key] needed!"
            )
    except Exception as e:
        logger = logging.getLogger("uvicorn")
        logger.error(f"Error validating Auth Token / API key: {e}")
        raise HTTPException(status_code=401, detail=f"Unauthorized - {e}")
