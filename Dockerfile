# Use the official Python slim image
FROM python:3.11.4-slim-bullseye

# Set up a new user named "user" with user ID 1000
RUN useradd -m -u 1000 user

USER user

# Set home to the user's home directory and Poetry's environment variables
ENV HOME=/home/user \
	PATH=/home/user/.local/bin:$PATH \
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

# Set the working directory to /app
WORKDIR $HOME/app

# Update pip and wheel
RUN pip install --upgrade pip setuptools wheel

# Install poetry
RUN pip install poetry

# Copy the poetry files
COPY --chown=user ./backend/pyproject.toml ./backend/poetry.lock $HOME/app/

# Install the dependencies
RUN poetry install --without dev && \
    --no-root && \
    rm -rf /tmp/poetry_cache

# Copy the rest of the files
COPY --chown=user ./backend $HOME/app

# Install the package
RUN poetry install --without dev

# Change to the package directory
WORKDIR $HOME/app/backend

CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
