from fastapi import APIRouter, Request

healthcheck_router = r = APIRouter()

"""
This router is for healthcheck functionality.
"""


@r.get("")
async def healthcheck(
    request: Request,
    # index: VectorStoreIndex = Depends(get_index),
):
    results = {}
    # check if index is ready
    # if index:
    #     results["index"] = True
    # else:
    #     results["index"] = False

    # TODO: check if other services are ready

    # logger.info("Healthcheck: {results}")

    results = {"status": "OK"}
    return results
