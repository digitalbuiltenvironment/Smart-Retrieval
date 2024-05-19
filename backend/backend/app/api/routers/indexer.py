import logging
import os
import tempfile
from typing import List

from fastapi import APIRouter, Depends, Form, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from backend.app.utils import auth, index

# Initialize the logger
logger = logging.getLogger("uvicorn")

# Initialize the API Router with dependencies
indexer_router = r = APIRouter(dependencies=[Depends(auth.validate_user)])

"""
This router is for indexing of user uploaded documents functionality.
A list of files is received by the router and stored in a temporary directory.
The uploaded documents are indexed and stored in the vecs database.
"""


@r.post("")
async def indexer(
    collection_id: str = Form(...),
    files: List[UploadFile] = File(...),
    user=Depends(auth.validate_user),
):
    logger.info(f"Indexer -> Collection ID: {collection_id}")
    logger.info(
        f"User {user} is uploading {len(files)} files to collection {collection_id}"
    )

    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            logger.info(f"Created temporary directory at {temp_dir}")

            file_paths = []

            for file in files:
                contents = await file.read()
                file_path = os.path.join(temp_dir, file.filename)
                with open(file_path, "wb") as f:
                    f.write(contents)
                file_paths.append(file_path)
                logger.info(f"Saved file: {file.filename} at {file_path}")

            # Call indexing function with the directory and collection_id
            if len(file_paths) == 0:
                raise HTTPException(
                    status_code=400, detail="No files uploaded for indexing"
                )
            if collection_id is None:
                raise HTTPException(
                    status_code=400, detail="No collection ID provided for indexing"
                )
            if index.index_uploaded_files(temp_dir, collection_id):
                logger.info("Files uploaded and indexed successfully.")
                return JSONResponse(
                    status_code=200,
                    content={
                        "status": "Files uploaded and indexed successfully",
                        "filenames": [file.filename for file in files],
                    },
                )
            else:
                raise HTTPException(
                    status_code=500, detail="Failed to upload and index files"
                )
    except Exception as e:
        logger.error(f"Failed to upload and index files: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to upload and index files.")
