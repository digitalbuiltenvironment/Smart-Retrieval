import os

from fastapi import APIRouter, Depends, Request
from supabase import Client, ClientOptions, create_client

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

    # Try to connect to supabase
    supabase_url: str = os.environ.get("SUPABASE_URL")
    supabase_key: str = os.environ.get("SUPABASE_ANON_KEY")

    supabase: Client = create_client(
        supabase_url=supabase_url,
        supabase_key=supabase_key,
        options=ClientOptions(
            postgrest_client_timeout=10,
            storage_client_timeout=10,
        ),
    )

    response = supabase.table("users").select("id").execute()

    if response.count >= 0:
        results["supabase"] = True
    else:
        results["supabase"] = False

    results["backend"] = True
    # logger.info("Healthcheck: {results}")
    return results


# Simple test to check if the healthcheck endpoint is working
def test_healthcheck():
    assert healthcheck() == {"status": True, "supabase": True}
