########################################################################
#                   Model Constants for the backend app                #
########################################################################
import os
from pathlib import Path

from torch.cuda import is_available as is_cuda_available

# ENV variables
USE_LOCAL_LLM = bool(os.getenv("USE_LOCAL_LLM").lower() == "true")
USE_LOCAL_VECTOR_STORE = bool(os.getenv("USE_LOCAL_VECTOR_STORE").lower() == "true")

# Model Constants
MAX_NEW_TOKENS = 4096
CONTEXT_SIZE = 3900  # llama2 has a context window of 4096 tokens, but we set it lower to allow for some wiggle room
DEVICE_TYPE = "cuda" if is_cuda_available() else "cpu"

# Get the current directory
CUR_DIR = Path.cwd()

STORAGE_DIR = str(CUR_DIR / "storage")  # directory to cache the generated index
DATA_DIR = str(CUR_DIR / "data")  # directory containing the documents to index

# LLM Model Constants
LLM_MODEL_URL = "https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf"
LLM_TEMPERATURE = 0.1
# Model Kwargs
# set to at least 1 to use GPU, adjust according to your GPU memory, but must be able to fit the model
MODEL_KWARGS = {"n_gpu_layers": 100} if DEVICE_TYPE == "cuda" else {}

# Service Context Constants
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 100

# Embedding Model Constants
EMBED_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
EMBED_POOLING = "mean"
EMBED_MODEL_DIMENSIONS = 384  # MiniLM-L6-v2 uses 384 dimensions
DEF_EMBED_MODEL_DIMENSIONS = (
    1536  # Default embedding model dimensions used by OpenAI text-embedding-ada-002
)
EMBED_BATCH_SIZE = 64  # batch size for openai embeddings

# Chat Memory Buffer Constants
MEMORY_TOKEN_LIMIT = 1500 if USE_LOCAL_LLM else 6144

# Prompt Helper Constants
# set maximum input size
CHUNK_SIZE_LIMIT = MAX_NEW_TOKENS
# set number of output tokens
NUM_OUTPUT = 256
# set maximum chunk overlap
CHUNK_OVERLAP_RATIO = 0.2
