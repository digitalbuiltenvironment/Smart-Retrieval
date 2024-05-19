import logging
import os
import uuid
from typing import List

import asyncpg
from asyncpg.exceptions import PostgresError
from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import BaseModel

from backend.app.utils import auth


class _CollectionIds(BaseModel):
    collection_ids: List[str]


collections_router = r = APIRouter(dependencies=[Depends(auth.validate_user)])

logger = logging.getLogger("uvicorn")

schema_name = "vecs"

"""
This router is for deleting collections functionality.
"""


def is_valid_uuidv4(uuid_str: str) -> bool:
    try:
        val = uuid.UUID(uuid_str, version=4)
    except ValueError:
        return False
    return str(val) == uuid_str


async def drop_table(conn, collection_id):
    try:
        await conn.execute(
            f'DROP TABLE IF EXISTS "{schema_name}"."{collection_id}" CASCADE'
        )
        return True
    except PostgresError as e:
        logger.error(f"Failed to drop table {collection_id}: {e}")
        return False


@r.post("/delete/single")
async def delete_single(collection_id: str):
    # Log the received collection_id
    logger.info(f"Delete Collection: {collection_id}")

    # Validate the collection_id to ensure it's a valid UUIDv4
    if not is_valid_uuidv4(collection_id):
        logger.error(f"Invalid collection_id: {collection_id}")
        raise HTTPException(status_code=400, detail="Invalid collection_id format")

    # Try to connect to the PostgreSQL database
    db_url: str = os.environ.get("POSTGRES_CONNECTION_STRING")
    if not db_url:
        logger.error("POSTGRES_CONNECTION_STRING environment variable not set")
        raise HTTPException(status_code=500, detail="Database configuration error")

    try:
        conn = await asyncpg.connect(dsn=db_url)
        result = await drop_table(conn, collection_id)
    except Exception as e:
        logger.error(f"Failed to connect to the database: {e}")
        raise HTTPException(status_code=500, detail="Failed to connect to the database")
    finally:
        await conn.close()

    logger.debug(f"Delete Collection {collection_id}: {result}")
    return {collection_id: result}


@r.post("/delete/multiple")
async def delete_multiple(collection_ids: _CollectionIds = Body(...)):
    # Log the received collection_ids
    logger.info(f"Delete Collections: {collection_ids.collection_ids}")

    # Validate the collection_ids to ensure they are valid UUIDv4s
    for collection_id in collection_ids.collection_ids:
        if not is_valid_uuidv4(collection_id):
            logger.error(f"Invalid collection_id: {collection_id}")
            raise HTTPException(status_code=400, detail="Invalid collection_id format")

    # Try to connect to the PostgreSQL database
    db_url: str = os.environ.get("POSTGRES_CONNECTION_STRING")
    if not db_url:
        logger.error("POSTGRES_CONNECTION_STRING environment variable not set")
        raise HTTPException(status_code=500, detail="Database configuration error")

    results = {}
    try:
        conn = await asyncpg.connect(dsn=db_url)
        for collection_id in collection_ids.collection_ids:
            async with conn.transaction():
                results[collection_id] = await drop_table(conn, collection_id)
    except Exception as e:
        logger.error(f"Failed to connect to the database: {e}")
        raise HTTPException(status_code=500, detail="Failed to connect to the database")
    finally:
        await conn.close()

    logger.debug(f"Delete Collections: {results}")
    return results
