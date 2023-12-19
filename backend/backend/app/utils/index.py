import logging
import os
from pathlib import Path

from llama_index import (
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
from torch.cuda import is_available as is_cuda_available

MAX_NEW_TOKENS = 4096
CONTEXT_SIZE = MAX_NEW_TOKENS
MODEL_ID = "TheBloke/Llama-2-7B-Chat-GGUF"
DEVICE_TYPE = "cuda" if is_cuda_available() else "cpu"

# Get the current directory
current_directory = Path.cwd()

STORAGE_DIR = str(
    current_directory / "storage"
)  # directory to cache the generated index
DATA_DIR = str(
    current_directory / "data"
)  # directory containing the documents to index

llm = LlamaCPP(
    model_url="https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf",
    temperature=0.1,
    max_new_tokens=MAX_NEW_TOKENS,
    # llama2 has a context window of 4096 tokens, but we set it lower to allow for some wiggle room
    context_window=CONTEXT_SIZE,
    # kwargs to pass to __call__()
    # generate_kwargs={},
    # kwargs to pass to __init__()
    # set to at least 1 to use GPU, adjust according to your GPU memory, but must be able to fit the model
    model_kwargs={"n_gpu_layers": 100},
    # transform inputs into Llama2 format
    messages_to_prompt=messages_to_prompt,
    completion_to_prompt=completion_to_prompt,
    verbose=True,
)

embed_model = HuggingFaceEmbedding(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    pooling="mean",
    device=DEVICE_TYPE,
)

service_context = ServiceContext.from_defaults(
    llm=llm, embed_model=embed_model, chunk_size=1000, chunk_overlap=100
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


def get_index():
    logger = logging.getLogger("uvicorn")
    # check if storage already exists
    if not os.path.exists(STORAGE_DIR):
        create_index()
    else:
        # load the existing index
        logger.info(f"Loading index from {STORAGE_DIR}...")
        storage_context = StorageContext.from_defaults(persist_dir=STORAGE_DIR)
        index = load_index_from_storage(
            storage_context, service_context=service_context
        )
        logger.info(f"Finished loading index from {STORAGE_DIR}")
    return index
