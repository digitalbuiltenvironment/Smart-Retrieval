import logging
import os

from llama_index import (
    PromptHelper,
    ServiceContext,
    SimpleDirectoryReader,
    StorageContext,
    VectorStoreIndex,
    load_index_from_storage,
    set_global_service_context,
)
from llama_index.embeddings import HuggingFaceEmbedding
from llama_index.llms import LlamaCPP
from llama_index.llms.llama_utils import (
    completion_to_prompt,
    messages_to_prompt,
)

from backend.app.utils.contants import (
    CHUNK_OVERLAP,
    CHUNK_OVERLAP_RATIO,
    CHUNK_SIZE,
    CHUNK_SIZE_LIMIT,
    CONTEXT_SIZE,
    DATA_DIR,
    DEVICE_TYPE,
    EMBED_MODEL_NAME,
    EMBED_POOLING,
    LLM_MODEL_URL,
    LLM_TEMPERATURE,
    MAX_NEW_TOKENS,
    MODEL_KWARGS,
    NUM_OUTPUT,
    STORAGE_DIR,
)

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


def create_index():
    logger = logging.getLogger("uvicorn")
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


def load_existing_index():
    # load the existing index
    logger = logging.getLogger("uvicorn")
    logger.info(f"Loading index from {STORAGE_DIR}...")
    storage_context = StorageContext.from_defaults(persist_dir=STORAGE_DIR)
    index = load_index_from_storage(storage_context, service_context=service_context)
    logger.info(f"Finished loading index from {STORAGE_DIR}")
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
