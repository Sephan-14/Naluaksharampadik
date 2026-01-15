# 🚀 Quick Start - Naalu Aksharam Padikk

## ⚡ 3-Step Setup

### 1️⃣ Create Firebase .env File

```bash
# Location: frontend/.env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2️⃣ Run Supabase SQL

1. Open: https://supabase.com/dashboard
2. SQL Editor → Paste `frontend/src/supabase-setup.sql`
3. Run ✅

### 3️⃣ Start Dev Server

```bash
cd frontend
npm run dev
```

Visit: **http://localhost:5173** 🎉

---

## 📂 Key Files

- `frontend/.env` - ⚠️ YOU MUST CREATE THIS
- `frontend/src/supabase-setup.sql` - Run in Supabase
- `PROJECT_SUMMARY.md` - Full overview
- `SETUP_GUIDE.md` - Detailed instructions
- `FIREBASE_SETUP_REQUIRED.md` - Firebase help

---

## ✅ What's Built

✅ Landing page
✅ Login/Signup
✅ Profile completion
✅ Dashboard with 5 tabs
✅ Database schema (9 tables)
✅ Authentication & routing
✅ Responsive design

---

## 🎯 Test Flow

1. Click "Get Started"
2. Create account
3. Complete profile:
   - Choose role (student/mentor/alumni)
   - College & department
   - Select expertise areas
4. Explore dashboard!

---

## 🆘 Common Issues

**"Firebase config not found"**
→ Create `.env` file

**"Table users does not exist"**
→ Run SQL script in Supabase

**Server not starting**
→ Check Node.js version 20.19+

---

## 🔗 Links

- Dev Server: http://localhost:5173
- Firebase: https://console.firebase.google.com
- Supabase: https://supabase.com/dashboard
- Your Supabase: https://kkmqsbyvwrmpopveavrs.supabase.co

---

**Everything is ready! Just add Firebase credentials and run! 🚀**
