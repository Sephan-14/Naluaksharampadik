import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5176', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date().toISOString() });
});

// SemSense AI endpoint
app.post('/api/semsense-ai', async (req, res) => {
  try {
    const {
      semesterNumber,
      subjects,
      weeklyAvailableHours,
      studentInterests,
      academicCalendar,
      studentName = 'Student'
    } = req.body;

    // Validate required fields
    if (!semesterNumber || !subjects || !weeklyAvailableHours) {
      return res.status(400).json({
        error: 'Missing required fields: semesterNumber, subjects, weeklyAvailableHours'
      });
    }

    // Validate Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key not configured'
      });
    }

    // Build the prompt for Gemini
    const subjectsList = subjects
      .map(s => `- ${s.name} (${s.credits} credits, Difficulty: ${s.difficulty})`)
      .join('\n');

    const interestsList = studentInterests
      ? `Student interests: ${studentInterests.join(', ')}`
      : 'Student interests: Not provided';

    const calendarInfo = academicCalendar
      ? `KTU Academic Calendar: ${JSON.stringify(academicCalendar)}`
      : 'No calendar provided';

    const prompt = `
You are an expert academic advisor helping a student plan their semester intelligently.

STUDENT PROFILE:
- Name: ${studentName}
- Semester: ${semesterNumber}
- Weekly Available Study Hours: ${weeklyAvailableHours} hours
- ${interestsList}

SUBJECTS THIS SEMESTER:
${subjectsList}

${calendarInfo}

TASK:
Analyze this semester data and provide:

1. WORKLOAD ANALYSIS:
   - Overall difficulty level (Low/Medium/High)
   - Identifying high-risk periods (exam clusters, heavy weeks)
   - Realistic time allocation per subject per week

2. WEEKLY ACADEMIC PLAN:
   - Create a 16-week semester plan with:
     - Recommended study hours per subject per week
     - Key revision milestones
     - Built-in buffer weeks for exams

3. PROJECT & UPSKILLING SUGGESTIONS:
   - Suggest 2-3 project ideas aligned with current subjects and industry trends
   - Recommend 1-2 key skills to focus on this semester
   - Clearly mark which are "Must-do" vs "Optional if time permits"

4. EMERGING TRENDS PANEL:
   - Show 2-3 engineering trends relevant to the student's branch
   - Explain why each matters in simple language

5. REST & RECOVERY:
   - Identify light weeks suitable for projects
   - Suggest optimal times for upskilling
   - Highlight risk of burnout and how to avoid it

IMPORTANT:
- Be supportive and realistic, not overwhelming
- Prioritize clarity over quantity
- Keep all suggestions semester-bound
- Format response in clear sections with bullet points
- Provide actionable, specific guidance

START RESPONSE NOW:
`;

    console.log('📨 Sending prompt to Gemini...');
    console.log('Semester:', semesterNumber, '| Subjects:', subjects.length, '| Available Hours:', weeklyAvailableHours);

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('✅ Gemini response received successfully');

    // Return structured response
    res.json({
      success: true,
      data: {
        semesterNumber,
        studentName,
        analysisTimestamp: new Date().toISOString(),
        aiAnalysis: text,
        subjectsCount: subjects.length,
        weeklyAvailableHours
      }
    });

  } catch (error) {
    console.error('💥 Error in SemSense AI endpoint:', error.message);

    // Handle specific Gemini errors
    if (error.message.includes('API key')) {
      return res.status(500).json({
        error: 'Gemini API key is invalid or missing',
        details: error.message
      });
    }

    if (error.message.includes('rate limit')) {
      return res.status(429).json({
        error: 'API rate limit exceeded. Please try again later.'
      });
    }

    res.status(500).json({
      error: 'Failed to generate semester plan',
      details: error.message,
      hint: 'Check backend logs for more information'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📝 SemSense AI endpoint: POST http://localhost:${PORT}/api/semsense-ai`);
  console.log(`🏥 Health check: GET http://localhost:${PORT}/api/health`);
  
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not set in environment variables');
  }
});

