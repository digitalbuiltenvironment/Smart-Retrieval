# Use the official Python Image
FROM python:3.11.4

# Set up a new user named "user" with user ID 1000
RUN useradd -m -u 1000 user
# Install the dependencies
RUN apt-get update && apt-get -y install cmake protobuf-compiler libopenblas-dev liblapack-dev liblapacke-dev libeigen3-dev libboost-all-dev

# Switch to the user 'user'
USER user

# Set home to the user's home directory and Poetry's environment variables
ENV HOME=/home/user \
	PATH=/home/user/.local/bin:$PATH \
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache \
    CMAKE_ARGS="-DLLAMA_BLAS=ON -DLLAMA_BLAS_VENDOR=OpenBLAS"

# Set the working directory to /app
WORKDIR $HOME/app

# Update pip and wheel
RUN pip install --upgrade pip setuptools wheel

# Install poetry
RUN pip install poetry

# Copy the poetry files
COPY --chown=user ./backend/pyproject.toml ./backend/poetry.lock $HOME/app/

# Copy the rest of the files
COPY --chown=user ./backend $HOME/app

# Install the dependencies
RUN poetry lock --no-update
RUN poetry install --without dev && \
    rm -rf /tmp/poetry_cache

# Change to the package directory
WORKDIR $HOME/app/backend

CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0"]