# 🐍 Base image with Python
FROM python:3.10-slim

# 🛠 Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    libgomp1 \              
    && rm -rf /var/lib/apt/lists/*

# 🏗 Set working directory
WORKDIR /app

# 📦 Copy and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# 🚀 Preload PaddleOCR model during image build
COPY preload_model.py .
RUN python preload_model.py

# 🧠 Copy the main app
COPY main.py .


# 🌍 Expose the FastAPI default port
EXPOSE 8000

# 🚀 Start the FastAPI app using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]