# Naalu Aksharam Padikk 🎓

**Connect. Learn. Grow Together.**

A mentorship and accountability platform connecting students for academic success. Solve the "guidance disconnect" with verified mentorship, social accountability through study logs, and smart catch-up plans.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20.19+ or 22.12+
- Firebase account (for authentication)
- Supabase account (for database)

### 1. Setup Supabase Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Open the SQL Editor
3. Copy and run the SQL from `src/supabase-setup.sql`
4. This will create all necessary tables, indexes, and RLS policies

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication in Authentication > Sign-in method
3. Copy your Firebase config
4. Create a `.env` file in the `frontend` directory:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Install & Run

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to see your app! 🎉

---

## 📋 Database Schema

### Core Tables

#### `users`

Stores user profiles with authentication details

- Firebase UID linking
- Role (student/mentor/alumni)
- College, department, year
- Areas of expertise
- Verification status

#### `mentorship_connections`

Manages mentor-mentee relationships

- Connection status (pending/active/completed)
- Timestamps for tracking

#### `study_logs`

Daily study accountability tracking

- Hours studied, subjects
- Date-based logging
- Notes and reflections

#### `catch_up_plans`

Personalized recovery roadmaps

- Time-optimized plans
- Mentor approval system
- Progress tracking

#### `community_posts`

Social feed for sharing progress

- Content, images
- Likes and comments
- Engagement metrics

#### `user_streaks`

Gamification and motivation

- Current and longest streaks
- Last activity tracking

#### `messages`

Direct messaging between users

- Read status tracking
- Private communications

---

## 🎯 Features

### ✅ Verified Mentorship Network

- Connect with seniors by department and expertise
- Search and filter mentors
- Direct messaging
- Rating system

### ✅ Social Accountability System

- Daily study logs
- Consistency streaks
- Community feed
- Positive peer pressure (no toxic competition)

### ✅ Smart Catch-Up Plans

- Time-optimized roadmaps
- Senior-approved plans
- Progress tracking
- Deadline management

### ✅ User Roles

- **Students**: Seek guidance, log studies, build streaks
- **Mentors**: Help juniors, approve plans, share knowledge
- **Alumni**: Share experience, guide career paths

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI
- **Authentication**: Firebase Auth
- **Database**: Supabase (PostgreSQL)
- **Routing**: React Router v6

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── MentorshipTab.tsx
│   │   ├── StudyLogTab.tsx
│   │   ├── CatchUpTab.tsx
│   │   ├── CommunityFeedTab.tsx
│   │   └── ProfileTab.tsx
│   ├── config/          # Configuration files
│   │   ├── firebase.ts  # Firebase setup
│   │   └── supabase.ts  # Supabase client
│   ├── contexts/        # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/           # Page components
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── CompleteProfile.tsx
│   │   └── Dashboard.tsx
│   ├── App.tsx          # Main app with routing
│   └── main.tsx         # Entry point
├── supabase-setup.sql   # Database schema
└── .env.example         # Environment variables template
```

---

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Firebase authentication with secure token handling
- Environment variables for sensitive data
- Protected routes for authenticated users only

---

## 🚀 Deployment

### Firebase Hosting

```bash
npm run build
firebase deploy
```

### Vercel/Netlify

1. Connect your repository
2. Set environment variables
3. Deploy automatically on push

---

## 📝 Next Steps

1. **Setup Firebase**: Add your credentials to `.env`
2. **Run Database Migration**: Execute `supabase-setup.sql`
3. **Customize**: Update branding, colors, features
4. **Test**: Create accounts, test workflows
5. **Deploy**: Share with your community!

---

## 🤝 Contributing

This is a student project aimed at solving real academic challenges. Feel free to:

- Report bugs
- Suggest features
- Improve documentation
- Share with your college community

---

## 📄 License

Built with ❤️ for students, by students.

---

## 🆘 Support

If you encounter issues:

1. Check the `.env` file is configured correctly
2. Verify Supabase tables are created
3. Ensure Firebase authentication is enabled
4. Check browser console for errors

---

**Let's build a supportive academic community together! 🎓✨**
