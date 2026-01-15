# Naalu Aksharam Padikk - Backend

Backend server for SemSense AI and other API endpoints.

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the backend folder:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

### 3. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it in `.env`

### 4. Run the Backend

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

Backend will run on `http://localhost:5000`

## API Endpoints

### Health Check

```
GET /api/health
```

### SemSense AI Analysis

```
POST /api/semsense-ai
```

**Request Body:**

```json
{
  "semesterNumber": 4,
  "studentName": "Amal Victor",
  "subjects": [
    {
      "name": "Data Structures",
      "credits": 4,
      "difficulty": "Hard"
    },
    {
      "name": "Web Development",
      "credits": 3,
      "difficulty": "Medium"
    }
  ],
  "weeklyAvailableHours": 25,
  "studentInterests": ["Machine Learning", "Web Dev", "Open Source"],
  "academicCalendar": {
    "midExams": "2026-03-15",
    "endExams": "2026-05-20",
    "holidays": ["2026-01-26"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "semesterNumber": 4,
    "studentName": "Amal Victor",
    "analysisTimestamp": "2026-01-15T10:30:00.000Z",
    "aiAnalysis": "Detailed semester plan and guidance from Gemini...",
    "subjectsCount": 2,
    "weeklyAvailableHours": 25
  }
}
```

## Running Frontend + Backend

**Terminal 1 (Backend):**

```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev
```

Then update `frontend/src/config/api.ts` to point to `http://localhost:5000`

## Troubleshooting

- **"GEMINI_API_KEY not set"**: Add it to `.env` file
- **"Rate limit exceeded"**: Wait a few minutes before trying again
- **CORS errors**: Check that backend CORS is enabled for your frontend URL
- **Port already in use**: Change PORT in `.env` to an available port

## Environment Variables

| Variable       | Default     | Description                           |
| -------------- | ----------- | ------------------------------------- |
| GEMINI_API_KEY | -           | Your Google Gemini API key (required) |
| PORT           | 5000        | Server port                           |
| NODE_ENV       | development | Environment mode                      |
