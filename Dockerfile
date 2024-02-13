ARG CUDA_IMAGE="12.1.1-devel-ubuntu22.04"
# Build with Cuda 12.1.1 and Ubuntu 22.04
FROM nvidia/cuda:${CUDA_IMAGE}

# Set up a new user named "user" with user ID 1000
RUN useradd -m -u 1000 user

# Install the dependencies & clean up
RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y git build-essential \
    python3.11 gcc wget \
    ocl-icd-opencl-dev opencl-headers clinfo \
    cmake protobuf-compiler pkg-config \
    libclblast-dev libopenblas-dev \
    liblapack-dev liblapacke-dev libeigen3-dev libboost-all-dev \
    && mkdir -p /etc/OpenCL/vendors && echo "libnvidia-opencl.so.1" > /etc/OpenCL/vendors/nvidia.icd \
    # Cleaning cache:
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Install pip for python 3.11
RUN wget https://bootstrap.pypa.io/get-pip.py && \
    python3.11 get-pip.py && \
    rm get-pip.py

# Switch to the user 'user'
USER user

# Setting build / container related env vars
ENV CUDA_DOCKER_ARCH=all \
    LLAMA_CUBLAS=1 \
    # Set home to the user's home directory and Poetry's environment variables
    HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache \
    # Set the uvicorn env
    ENVIRONMENT=prod \
    ##########################################################
    # # Build llama-cpp-python with cuda support
    # CMAKE_ARGS="-DLLAMA_CUBLAS=on"
    ##########################################################
    # Build llama-cpp-python with openblas support on CPU
    CMAKE_ARGS="-DLLAMA_BLAS=ON -DLLAMA_BLAS_VENDOR=OpenBLAS"
    ##########################################################

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
RUN poetry install --without torch-cpu --with torch-cuda && \
    rm -rf /tmp/poetry_cache

# Change to the package directory
WORKDIR $HOME/app/backend

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run the app when the container launches
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0"]