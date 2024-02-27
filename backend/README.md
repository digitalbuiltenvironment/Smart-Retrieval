# Smart Retrieval Backend

The backend is built using Python & [FastAPI](https://fastapi.tiangolo.com/) bootstrapped with [`create-llama`](https://github.com/run-llama/LlamaIndexTS/tree/main/packages/create-llama).

To get started, you must first install the required dependencies in `Requirements` section below, then follow the `Getting Started` section.

## Requirements

1. Python >= 3.11
2. Miniconda (To manage Python versions)
   - [Windows](https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe)
   - [Linux](https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh)
   - [MacOS](https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.pkg)
   - ```conda create -n SmartRetrieval python=3.11```
3. Pipx (To manage Python packages)
   - ```pip install pipx``` (If you already have pipx installed, you can skip this step)
4. Cuda > 12.1 (if you have a Nvidia GPU)
    - [Windows](https://developer.nvidia.com/cuda-downloads)
    - [Linux](https://developer.nvidia.com/cuda-downloads)
    - [MacOS](https://developer.nvidia.com/cuda-downloads)
5. Poetry (To manage dependencies)
   - ```pipx install poetry```

## Getting Started

First, ensure if you want to use the cuda version of pytorch, you have the correct version `cuda > 12.1` of cuda installed. You can check this by running `nvcc --version or nvidia-smi` in your terminal, nvcc --version should correctly chow whether you have installed cuda properly or not. If you do not have cuda installed, you can install it from [here](https://developer.nvidia.com/cuda-downloads).

- You may need to add cuda to your path, which can be found online.

Ensure you have followed the steps in the `requirements` section above.

Then activate the conda environment:

```bash
conda activate SmartRetrieval
```

Second, setup the environment:

```bash
# Only choose one of the options below depending on if you have CUDA enabled GPU or not:
-----------------------------------------------
# Install dependencies and torch (cpu version)
# Windows: Set env for llama-cpp-python with openblas support on cpu
$env:CMAKE_ARGS = "-DLLAMA_BLAS=ON -DLLAMA_BLAS_VENDOR=OpenBLAS"
# Linux: Set env for llama-cpp-python with openblas support on cpu
CMAKE_ARGS="-DLLAMA_BLAS=ON -DLLAMA_BLAS_VENDOR=OpenBLAS"
# Then:
poetry install --with torch-cpu
-----------------------------------------------
# Install dependencies and torch (cuda version)
# Windows: Set env for llama-cpp-python with cuda support on gpu
$env:CMAKE_ARGS = "-DLLAMA_CUBLAS=on"
# Linux: Set env for llama-cpp-python with cuda support on gpu
CMAKE_ARGS="-DLLAMA_CUBLAS=on"
# Then:
poetry install --with torch-cuda
```

```bash
# Enter poetry shell
poetry shell
```

Third, run the development server:

```bash
python run.py
```

Then call the API endpoint `/api/chat` to see the result:

```bash
curl --location 'localhost:8000/api/chat' \
--header 'Content-Type: application/json' \
--data '{ "messages": [{ "role": "user", "content": "Hello" }] }'
```

You can start editing the API by modifying `app/api/routers/chat.py`. The endpoint auto-updates as you save the file.

Open [http://localhost:8000/docs](http://localhost:8000/docs) with your browser to see the Swagger UI of the API.

The API allows CORS for all origins to simplify development. You can change this behavior by setting the `ENVIRONMENT` environment variable to `prod`:

```bash
ENVIRONMENT=prod uvicorn main:app
```

## Learn More

To learn more about LlamaIndex, take a look at the following resources:

- [LlamaIndex Documentation](https://docs.llamaindex.ai) - learn about LlamaIndex.
- [LlamaIndexTS Documentation](https://ts.llamaindex.ai) - learn about LlamaIndexTS (Typescript features).
- [FastAPI Documentation](https://fastapi.tiangolo.com/) - learn about FastAPI.
