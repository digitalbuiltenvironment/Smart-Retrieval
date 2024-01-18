import logging
from typing import List

from app.utils.index import get_index
from app.utils.json import json_to_model
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from fastapi.websockets import WebSocketDisconnect
from llama_index import VectorStoreIndex
from llama_index.llms.types import MessageRole
from pydantic import BaseModel

query_router = r = APIRouter()

"""
This router is for query functionality which consist of query engine.
The query engine is used to query the index.
There is no chat memory used here, every query is independent of each other.
"""


class _Message(BaseModel):
    role: MessageRole
    content: str


class _ChatData(BaseModel):
    messages: List[_Message]


@r.get("")
async def search(
    request: Request,
    # Note: To support clients sending a JSON object using content-type "text/plain",
    # we need to use Depends(json_to_model(_ChatData)) here
    data: _ChatData = Depends(json_to_model(_ChatData)),
    index: VectorStoreIndex = Depends(get_index),
):
    # check preconditions and get last message which is query
    if len(data.messages) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No query provided",
        )
    query = data.messages.pop()
    if query.role != MessageRole.USER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Last message must be from user",
        )
    logger = logging.getLogger("uvicorn")
    logger.info(f"Query: {query}")

    # Query index
    query_engine = index.as_query_engine(streaming=True, similarity_top_k=1)
    response = query_engine.query(query)

    # stream response
    async def event_generator():
        try:
            logger = logging.getLogger("uvicorn")
            for token in response.response_gen:
                # If client closes connection, stop sending events
                if await request.is_disconnected():
                    logger.info("Client disconnected, closing stream")
                    break
                yield token
        except WebSocketDisconnect:
            # WebSocket was disconnected, gracefully handle it
            logger.info("Client disconnected, closing stream")

    return StreamingResponse(event_generator(), media_type="text/plain")
