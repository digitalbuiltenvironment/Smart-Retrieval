import logging
import re

from fastapi import APIRouter, Depends, HTTPException, status
from llama_index.postprocessor import SimilarityPostprocessor
from llama_index.retrievers import VectorIndexRetriever

from backend.app.utils import auth
from backend.app.utils.index import get_index

search_router = r = APIRouter(dependencies=[Depends(auth.validate_user)])

"""
This router is for search functionality which consist of query engine.
The query engine is used to query the index.
It is similar to query except that it does not return the formulated response.
Instead it returns the relevant information from the index.
"""


@r.get("")
async def search(
    query: str = None,
    collection_id: str = None,
):
    # query = request.query_params.get("query")
    logger = logging.getLogger("uvicorn")
    logger.info(f"Document Set: {collection_id} | Search: {query}")
    # get the index for the selected document set
    index = get_index(collection_name=collection_id)
    if query is None or collection_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No search info/document set provided",
        )

    # configure retriever
    retriever = VectorIndexRetriever(
        index=index,
        similarity_top_k=10,
    )

    # retrieve results
    query_results = retriever.retrieve(query)

    query_results_scores = [result.get_score() for result in query_results]

    # get average score
    average_score = sum(query_results_scores) / len(query_results_scores)

    logger.info(f"Search results similarity score: {query_results_scores}")
    logger.info(f"Average similarity score: {average_score}")

    # similarity postprocessor: filter nodes below 0.45 similarity score
    node_postprocessor = SimilarityPostprocessor(similarity_cutoff=average_score)

    # postprocess results based on average score
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
        data["page_no"] = (
            node_metadata["page_label"] if "page_label" in node_metadata else "N/A"
        )
        cleaned_text = re.sub(
            "^_+ | _+$", "", node_dict["text"]
        )  # remove leading and trailing underscores
        data["text"] = cleaned_text
        data["similarity_score"] = node.get_score()
        response.append(data)
        id += 1

    # TODO: do a reranking of the results and return them?
    # TODO: do a highlighting of the results in the relevant documents and return them?
    return response
