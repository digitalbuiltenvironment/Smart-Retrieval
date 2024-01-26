ARG CUDA_IMAGE="12.1.1-devel-ubuntu22.04"
# Build with Cuda 12.1.1 and Ubuntu 22.04
FROM nvidia/cuda:${CUDA_IMAGE}

# Set up a new user named "user" with user ID 1000
RUN useradd -m -u 1000 user

# Install the dependencies
RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y git build-essential \
    python3.11 gcc wget \
    ocl-icd-opencl-dev opencl-headers clinfo \
    cmake protobuf-compiler pkg-config \
    libclblast-dev libopenblas-dev \
    liblapack-dev liblapacke-dev libeigen3-dev libboost-all-dev \
    && mkdir -p /etc/OpenCL/vendors && echo "libnvidia-opencl.so.1" > /etc/OpenCL/vendors/nvidia.icd

# Install pip for python 3.11
RUN wget https://bootstrap.pypa.io/get-pip.py && \
    python3.11 get-pip.py && \
    rm get-pip.py

# Switch to the user 'user'
USER user

# Setting build related env vars
ENV CUDA_DOCKER_ARCH=all
ENV LLAMA_CUBLAS=1

# Set home to the user's home directory and Poetry's environment variables
ENV HOME=/home/user \
	PATH=/home/user/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache \
    # Build llama-cpp-python with default cuda support
    CMAKE_ARGS="-DLLAMA_CUBLAS=on"
    # CMAKE_ARGS="-DLLAMA_BLAS=ON -DLLAMA_BLAS_VENDOR=OpenBLAS"

# Set the working directory to /app
WORKDIR $HOME/app

# Update pip and wheel
RUN python3.11 -m pip install --upgrade pip setuptools wheel

# Install poetry
RUN python3.11 -m pip install poetry

# Copy the poetry files
COPY --chown=user ./backend/pyproject.toml ./backend/poetry.lock $HOME/app/

# Copy the rest of the files
COPY --chown=user ./backend $HOME/app

# Install the dependencies
RUN poetry install --without dev,torch-cpu && \
    rm -rf /tmp/poetry_cache

# Change to the package directory
WORKDIR $HOME/app/backend

CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0"]