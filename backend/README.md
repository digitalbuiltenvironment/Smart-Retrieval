# Smart Retrieval Backend

The backend is built using Python & [FastAPI](https://fastapi.tiangolo.com/) bootstrapped with [`create-llama`](https://github.com/run-llama/LlamaIndexTS/tree/main/packages/create-llama).

## Requirements

1. Python >= 3.11
2. Poetry (To manage dependencies)
   - ```pipx install poetry```

## Getting Started

First, setup the `pyproject.toml` file to install the correct version of PyTorch (CPU or GPU):

Comment/Uncomment the following block depending on your system. Use CPU only if you do not have a supported Cuda Device.

```bash
# For CPU version: Windows and Linux and MacOS (arm64)
torch = [
    { url = "https://download.pytorch.org/whl/cpu/torch-2.1.1%2Bcpu-cp311-cp311-win_amd64.whl", markers = "sys_platform == 'win32'" },
    { url = "https://download.pytorch.org/whl/cpu/torch-2.1.1%2Bcpu-cp311-cp311-linux_x86_64.whl", markers = "sys_platform == 'linux'" },
    { url = "https://download.pytorch.org/whl/cpu/torch-2.1.1-cp311-none-macosx_11_0_arm64.whl", markers = "sys_platform == 'darwin'" },
]
## For GPU version: Windows and Linux and MacOS (arm64)
# torch = [
#     { url = "https://download.pytorch.org/whl/cu121/torch-2.1.1%2Bcu121-cp311-cp311-win_amd64.whl", markers = "sys_platform == 'win32'" },
#     { url = "https://download.pytorch.org/whl/cu121/torch-2.1.1%2Bcu121-cp311-cp311-linux_x86_64.whl", markers = "sys_platform == 'linux'" },
#     { url = "https://download.pytorch.org/whl/cu121/torch-2.1.1-cp311-none-macosx_11_0_arm64.whl", markers = "sys_platform == 'darwin'" },
# ]
```

Second, setup the environment:

```bash
poetry install
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
