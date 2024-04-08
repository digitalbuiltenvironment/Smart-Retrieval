import logging
import os

import uvicorn
from dotenv import load_dotenv

load_dotenv()

ENVIRONMENT = os.getenv("ENVIRONMENT", "dev")  # Default to 'dev' if not set
CREATE_VECTOR_STORE = bool(
    os.getenv("CREATE_VECTOR_STORE", "false").lower() == "true"
)  # Default to False if not set


def run_app():
    # Run the app
    if ENVIRONMENT == "dev":
        # Run the app with the development settings to auto reload
        uvicorn.run(app="main:app", host="0.0.0.0", reload=True)
    if ENVIRONMENT == "prod":
        # Run the app with the production settings, no auto reload
        uvicorn.run(app="main:app", host="0.0.0.0", reload=False)


if __name__ == "__main__":
    logging_format = "%(levelname)s: %(message)s"
    logging.basicConfig(level=logging.INFO, format=logging_format)
    logger = logging.getLogger(__name__)
    logger.info("Create vector store: " + str(CREATE_VECTOR_STORE))
    if CREATE_VECTOR_STORE:
        # Create the vector store
        from backend.app.utils.index import create_index

        logger.info("Creating vector stores first...")
        create_index()
        logger.info("Vector stores created successfully! Running App...")
        # Run the app
        run_app()
    else:
        # Run the app
        run_app()
