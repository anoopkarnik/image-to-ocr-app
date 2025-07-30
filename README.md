# 🧾 Image-to-Google-Sheet Workflow

This project is a full-stack, Dockerized workflow that extracts structured tables from images using OCR, parses them with AI, and automatically logs the results into a Google Sheet. Built for rapid, reliable automation of data entry from images—such as financial documents, invoices, or tables.

---

## 📦 Overview

The system combines the following components:

- **Frontend** (`frontend/page.tsx`):  
  Upload images and trigger the workflow via a web UI.
- **OCR API** (`ocr-api/main.py`):  
  FastAPI service that uses PaddleOCR to extract tables from images.
- **n8n Automation** (`workflow.json`):  
  Orchestrates the workflow: receives webhooks, calls OCR, runs an AI agent for table parsing, and writes results to Google Sheets.
- **Docker Compose** (`docker-compose.yml`):  
  Orchestrates all services (frontend, OCR API, n8n, Postgres, etc).

---

## 🚀 Getting Started


### 1. **Clone the repo**

```bash
git clone image-to-ocr-app
cd image-to-ocr-app
```

### 2. **Build and run all the containers**

```bash
docker compose up -d
```

### 3. **Fill the credentials in n8n**

1. Open the n8n locally: http://localhost:5101
2. Register the n8n local account.
3. Open the Paddle Ocr Workflow.
4. In the app, fill OpenAI credentials and Google sheet credentials(make sure the google sheet selected has correct column names).

### 4. **Image To Google Sheet**

1. Open the nextjs app locally: http://localhost:5103
2. The default n8n webhook will be in input.(no need to change that)
3. Select the currency.
4. Upload, drag and drop or paste the image.
5. Click on Convert, to update your google sheet with table values.

The image is sent to n8n workflow which has the OCR API, which extracts table data. n8n workflow parses and structures the data with AI, then writes it to your configured Google Sheet.

## 📋 Example Workflow

1. User uploads image 
2. Frontend POSTs to n8n webhook 
3. n8n calls OCR API →
4. AI agent parses extracted text into structured JSON →
5. Structured rows are appended to Google Sheet