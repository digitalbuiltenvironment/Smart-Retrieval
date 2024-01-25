import logging
import os

from app.api.routers.chat import chat_router
from app.api.routers.healthcheck import healthcheck_router
from app.api.routers.query import query_router
from app.api.routers.search import search_router
from app.utils.index import create_index
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

environment = os.getenv("ENVIRONMENT", "dev")  # Default to 'development' if not set


if environment == "dev":
    logger = logging.getLogger("uvicorn")
    logger.warning("Running in development mode - allowing CORS for all origins")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(chat_router, prefix="/api/chat")
app.include_router(query_router, prefix="/api/query")
app.include_router(search_router, prefix="/api/search")
app.include_router(healthcheck_router, prefix="/api/healthcheck")

# try to create the index first on startup
create_index()
