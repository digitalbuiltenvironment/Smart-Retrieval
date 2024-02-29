import os

import uvicorn
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    environment = os.getenv("ENVIRONMENT", "dev")  # Default to 'development' if not set
    if environment == "dev":
        # Run the app with the development settings to auto reload
        uvicorn.run(app="main:app", host="0.0.0.0", reload=True)
    if environment == "prod":
        # Run the app with the production settings, no auto reload
        uvicorn.run(app="main:app", host="0.0.0.0", reload=False)
