# SemSense AI Backend Setup Guide

## Quick Start

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file with Gemini API key
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 2. Get Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Paste into `backend/.env`:
   ```
   GEMINI_API_KEY=paste_your_key_here
   ```

### 3. Run Backend

```bash
npm run dev
```

You should see:

```
🚀 Backend running on http://localhost:5000
📝 SemSense AI endpoint: POST http://localhost:5000/api/semsense-ai
🏥 Health check: GET http://localhost:5000/api/health
```

### 4. Frontend Setup

```bash
cd frontend

# Create .env.local with backend URL
cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:5000
EOF

npm run dev
```

### 5. Test the Endpoint

Use curl or Postman:

```bash
curl -X POST http://localhost:5000/api/semsense-ai \
  -H "Content-Type: application/json" \
  -d '{
    "semesterNumber": 4,
    "studentName": "Test Student",
    "subjects": [
      {"name": "Data Structures", "credits": 4, "difficulty": "Hard"},
      {"name": "Web Dev", "credits": 3, "difficulty": "Medium"}
    ],
    "weeklyAvailableHours": 25,
    "studentInterests": ["ML", "Web Dev"]
  }'
```

## Troubleshooting

**Backend won't start:**

- Check Node.js version: `node --version` (need v16+)
- Clear node_modules: `rm -rf node_modules && npm install`

**GEMINI_API_KEY error:**

- Make sure `.env` file exists in backend folder
- API key is correct and not expired
- Try regenerating it at https://makersuite.google.com/app/apikey

**Frontend can't reach backend:**

- Ensure backend is running on http://localhost:5000
- Check frontend `.env.local` has correct `VITE_API_BASE_URL`
- Check CORS is enabled (it is in our server.js)

**Rate limit errors:**

- Gemini API has free tier limits
- Wait a few minutes before trying again

## Next Steps

Once backend is running, you can:

1. Create the SemSense AI page in frontend
2. Build the semester planning form
3. Display AI-generated analysis
4. Add save/sync features

Need help? Check backend/README.md for detailed docs.
