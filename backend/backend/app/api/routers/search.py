import logging

from app.utils.index import get_index
from fastapi import APIRouter, Depends, HTTPException, Request, status
from llama_index import VectorStoreIndex
from llama_index.postprocessor import SimilarityPostprocessor
from llama_index.retrievers import VectorIndexRetriever

search_router = r = APIRouter()

"""
This router is for search functionality which consist of query engine.
The query engine is used to query the index.
It is similar to query except that it does not return the formulated response.
Instead it returns the relevant information from the index.
"""


@r.get("")
async def search(
    request: Request,
    index: VectorStoreIndex = Depends(get_index),
):
    query = request.query_params.get("search")
    logger = logging.getLogger("uvicorn")
    logger.info(f"Search: {query}")
    if query is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No search info provided",
        )

    # configure retriever
    retriever = VectorIndexRetriever(
        index=index,
        similarity_top_k=10,
    )
    # configure postprocessor
    node_postprocessors = [SimilarityPostprocessor(similarity_cutoff=0.7)]

    # retrieve results
    query_results = retriever.retrieve(query, node_postprocessors=node_postprocessors)

    # TODO: get only relevant info from response such as references and not the whole thing without using LLM to formulate response
    results = query_results.to_dict()
    return results
