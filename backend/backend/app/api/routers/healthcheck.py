from fastapi import APIRouter, Depends, Request

from backend.app.utils import auth

healthcheck_router = r = APIRouter(dependencies=[Depends(auth.validate_user)])

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


# Simple test to check if the healthcheck endpoint is working
def test_healthcheck():
    assert healthcheck() == {"status": "OK"}
