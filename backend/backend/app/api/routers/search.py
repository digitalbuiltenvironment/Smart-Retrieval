import logging
import re

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
    query = request.query_params.get("query")
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
    # similarity postprocessor: filter nodes below 0.45 similarity score
    node_postprocessor = SimilarityPostprocessor(similarity_cutoff=0.45)

    # retrieve results
    query_results = retriever.retrieve(query)

    query_results_scores = [result.get_score() for result in query_results]

    logger.info(f"Search results similarity score: {query_results_scores}")

    # postprocess results
    filtered_results = node_postprocessor.postprocess_nodes(query_results)

    filtered_results_scores = [result.get_score() for result in filtered_results]

    logger.info(f"Filtered Search results similarity score: {filtered_results_scores}")

    response = []
    id = 1
    for node in filtered_results:
        node_dict = node.to_dict()["node"]
        logger.debug(f"Node dict: {node_dict}")
        node_metadata = node_dict["metadata"]
        logger.debug(f"Node metadata: {node_metadata}")
        data = {}
        data["id"] = id
        data["file_name"] = node_metadata["file_name"]
        data["page_no"] = node_metadata["page_label"]
        cleaned_text = re.sub(
            "^_+ | _+$", "", node_dict["text"]
        )  # remove leading and trailing underscores
        data["text"] = cleaned_text
        data["similarity_score"] = round(
            node.get_score(), 2
        )  # round to 2 decimal places
        response.append(data)
        id += 1

    # TODO: do a reranking of the results and return them?
    # TODO: do a highlighting of the results in the relevant documents and return them?
    return response
