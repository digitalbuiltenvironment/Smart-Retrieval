import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from fastapi.websockets import WebSocketDisconnect
from llama_index.llms.types import MessageRole
from pydantic import BaseModel

from backend.app.utils import auth
from backend.app.utils.index import get_index
from backend.app.utils.json import json_to_model

query_router = r = APIRouter(dependencies=[Depends(auth.validate_user)])

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
    document: str


@r.post("")
async def query(
    request: Request,
    # Note: To support clients sending a JSON object using content-type "text/plain",
    # we need to use Depends(json_to_model(_ChatData)) here
    data: _ChatData = Depends(json_to_model(_ChatData)),
):
    logger = logging.getLogger("uvicorn")
    # get the document set selected from the request body
    document_set = data.document
    logger.info(f"Document Set: {document_set}")
    # get the index for the selected document set
    index = get_index(collection_name=document_set)
    # check preconditions and get last message which is query
    if len(data.messages) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No query provided",
        )
    lastMessage = data.messages.pop()
    if lastMessage.role != MessageRole.USER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Last message must be from user",
        )
    logger.info(f"Query: {lastMessage}")

    # Query index
    query_engine = index.as_query_engine(streaming=True, similarity_top_k=5)
    response = query_engine.query(lastMessage.content)

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
