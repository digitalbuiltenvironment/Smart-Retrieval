import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from torch.cuda import is_available as is_cuda_available

from backend.app.api.routers.chat import chat_router
from backend.app.api.routers.healthcheck import healthcheck_router
from backend.app.api.routers.query import query_router
from backend.app.api.routers.search import search_router
from backend.app.utils.index import create_index

load_dotenv()

app = FastAPI()

environment = os.getenv("ENVIRONMENT", "dev")  # Default to 'dev' if not set

# Add allowed origins from environment variables
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*")

if environment == "dev":
    # In development, allow all origins, methods, and headers
    logger = logging.getLogger("uvicorn")
    logger.level = logging.DEBUG
    logger.warning("Running in development mode - allowing CORS for all origins")
    app.add_middleware(
        middleware_class=CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

if environment == "prod":
    # In production, specify the allowed origins
    allowed_origins = allowed_origins.split(",") if allowed_origins != "*" else ["*"]
    # Set the logger level to INFO
    logger = logging.getLogger("uvicorn")
    logger.level = logging.INFO
    logger.info(f"Running in production mode - allowing CORS for {allowed_origins}")
    app.add_middleware(
        middleware_class=CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )

logger.info(f"CUDA available: {is_cuda_available()}")

# Set logger for httpx to WARNING
logging.getLogger("httpx").setLevel(logging.WARNING)

app.include_router(chat_router, prefix="/api/chat")
app.include_router(query_router, prefix="/api/query")
app.include_router(search_router, prefix="/api/search")
app.include_router(healthcheck_router, prefix="/api/healthcheck")

# Try to create the index first on startup
create_index()


# Redirect to the /docs endpoint
@app.get("/")
async def docs_redirect():
    return RedirectResponse(url="/docs")
