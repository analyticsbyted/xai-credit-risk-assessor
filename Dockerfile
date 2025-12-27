# Stage 1: Build the Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/client
# Copy package files
COPY client/package*.json ./
# Install dependencies
RUN npm install
# Copy source code
COPY client/ .
# Build static site (output to client/out)
RUN npm run build

# Stage 2: Build the Backend
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for XGBoost/OpenMP
RUN apt-get update && apt-get install -y libgomp1 && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY api/ ./api/

# Copy built frontend assets from Stage 1 to api/static
COPY --from=frontend-builder /app/client/out ./api/static

# Expose port 7860 (Hugging Face Default)
EXPOSE 7860

# Run command
# We point to api.main:app, and listen on 0.0.0.0:7860
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "7860"]
