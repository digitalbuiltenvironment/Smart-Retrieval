import logging
import os

from dotenv import load_dotenv
from llama_index import (
    PromptHelper,
    ServiceContext,
    # Document,
    SimpleDirectoryReader,
    StorageContext,
    VectorStoreIndex,
    load_index_from_storage,
    set_global_service_context,
)
from llama_index.embeddings import HuggingFaceEmbedding
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms import LlamaCPP, OpenAI
from llama_index.llms.llama_utils import (
    completion_to_prompt,
    messages_to_prompt,
)
from llama_index.vector_stores.supabase import SupabaseVectorStore

from backend.app.utils.contants import (
    CHUNK_OVERLAP,
    CHUNK_OVERLAP_RATIO,
    CHUNK_SIZE,
    CHUNK_SIZE_LIMIT,
    CONTEXT_SIZE,
    DATA_DIR,
    DEF_EMBED_MODEL_DIMENSIONS,
    DEVICE_TYPE,
    EMBED_MODEL_DIMENSIONS,
    EMBED_MODEL_NAME,
    EMBED_POOLING,
    LLM_MODEL_URL,
    LLM_TEMPERATURE,
    MAX_NEW_TOKENS,
    MODEL_KWARGS,
    NUM_OUTPUT,
    STORAGE_DIR,
)

# from llama_index.vector_stores.supabase import SupabaseVectorStore
# import textwrap

load_dotenv()
logger = logging.getLogger("uvicorn")

# ENV variables
USE_LOCAL_LLM = bool(os.getenv("USE_LOCAL_LLM").lower() == "true")
USE_LOCAL_VECTOR_STORE = bool(os.getenv("USE_LOCAL_VECTOR_STORE").lower() == "true")


# use local LLM if USE_LOCAL_LLM is set to True, else use openai's API
if USE_LOCAL_LLM:
    logger.info("Using local LLM...")
    llm = LlamaCPP(
        model_url=LLM_MODEL_URL,
        temperature=LLM_TEMPERATURE,
        max_new_tokens=MAX_NEW_TOKENS,
        context_window=CONTEXT_SIZE,
        # kwargs to pass to __call__()
        generate_kwargs={},
        # kwargs to pass to __init__()
        model_kwargs=MODEL_KWARGS,
        # transform inputs into Llama2 format
        messages_to_prompt=messages_to_prompt,
        completion_to_prompt=completion_to_prompt,
        verbose=True,
    )
    embed_model = HuggingFaceEmbedding(
        model_name=EMBED_MODEL_NAME,
        pooling=EMBED_POOLING,
        device=DEVICE_TYPE,
    )

    prompt_helper = PromptHelper(
        chunk_size_limit=CHUNK_SIZE_LIMIT,
        chunk_overlap_ratio=CHUNK_OVERLAP_RATIO,
        num_output=NUM_OUTPUT,
    )

    service_context = ServiceContext.from_defaults(
        llm=llm,
        embed_model=embed_model,
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        prompt_helper=prompt_helper,
    )

    set_global_service_context(service_context)
else:
    logger.info("Using OpenAI's API...")
    llm = OpenAI(
        model="gpt-3.5-turbo",
        temperature=0.2,
        api_key=os.getenv("OPENAI_API_KEY"),
    )
    # By default, LlamaIndex uses text-embedding-ada-002 from OpenAI
    embed_model = OpenAIEmbedding(embed_batch_size=42)

    prompt_helper = PromptHelper(
        chunk_size_limit=CHUNK_SIZE_LIMIT,
        chunk_overlap_ratio=CHUNK_OVERLAP_RATIO,
        num_output=NUM_OUTPUT,
    )

    service_context = ServiceContext.from_defaults(
        llm=llm,
        embed_model=embed_model,
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        prompt_helper=prompt_helper,
    )

    set_global_service_context(service_context)


def create_index():
    # if use local vector store, store the index locally
    if USE_LOCAL_VECTOR_STORE:
        logger.info("Checking if index exists locally...")
        # check if storage already exists
        if not os.path.exists(STORAGE_DIR):
            logger.info("Creating new index")
            # load the documents and create the index
            try:
                documents = SimpleDirectoryReader(
                    input_dir=DATA_DIR, recursive=True
                ).load_data()
            except ValueError as e:
                logger.error(f"{e}")
            index = VectorStoreIndex.from_documents(
                documents=documents, service_context=service_context, show_progress=True
            )
            # store it for later
            index.storage_context.persist(STORAGE_DIR)
            logger.info(f"Finished creating new index. Stored in {STORAGE_DIR}")
        else:
            # do nothing
            logger.info(f"Index already exist at {STORAGE_DIR}...")
    # else, store the index in Supabase
    else:
        # check if remote storage already exists
        dimension = (
            EMBED_MODEL_DIMENSIONS if USE_LOCAL_LLM else DEF_EMBED_MODEL_DIMENSIONS
        )
        vector_store = SupabaseVectorStore(
            postgres_connection_string=os.getenv("POSTGRES_CONNECTION_STRING"),
            collection_name="base_demo",
            dimension=dimension,
        )
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
        logger.info("Checking if index exists in Supabase...")
        logger.info(f"Index summary: {index.summary}")
        if index.summary == "None":
            logger.info("Creating new index")
            # load the documents and create the index
            try:
                documents = SimpleDirectoryReader(
                    input_dir=DATA_DIR, recursive=True
                ).load_data()
            except ValueError as e:
                logger.error(f"{e}")
            index = VectorStoreIndex.from_documents(
                documents=documents, storage_context=storage_context, show_progress=True
            )
            logger.info("Finished creating new index")
        else:
            # do nothing
            logger.info("Index already exist in Supabase...")


def load_existing_index():
    # load the existing index
    if USE_LOCAL_VECTOR_STORE == "true":
        # load the index from local storage
        logger.info(f"Loading index from {STORAGE_DIR}...")
        storage_context = StorageContext.from_defaults(persist_dir=STORAGE_DIR)
        index = load_index_from_storage(
            storage_context, service_context=service_context
        )
        logger.info(f"Finished loading index from {STORAGE_DIR}")
        return index
    else:
        # load the index from Supabase
        vector_store = SupabaseVectorStore(
            postgres_connection_string=os.getenv("POSTGRES_CONNECTION_STRING"),
            collection_name="base_demo",
        )
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        index = load_index_from_storage(
            storage_context, service_context=service_context
        )
        return index


def get_index():
    # check if storage already exists
    if not os.path.exists(STORAGE_DIR):
        # create the index if it does not exist
        create_index()
        # load the index from storage
        index = load_existing_index()
    # check if storage is empty, 4 files should be present if using simplevectorstore
    elif os.path.exists(STORAGE_DIR) and len(os.listdir(STORAGE_DIR)) < 4:
        # create the index if it does not exist
        create_index()
        # load the index from storage
        index = load_existing_index()
    else:
        # load the index from storage
        index = load_existing_index()
    return index
