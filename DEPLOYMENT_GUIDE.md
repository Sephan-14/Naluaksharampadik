# Mentor & Alumni Dashboard - Deployment Guide

## Quick Start Checklist

- [ ] 1. Database Migration
- [ ] 2. Test Components Load
- [ ] 3. Test Mentor Features
- [ ] 4. Test Alumni Features
- [ ] 5. Verify Security & Permissions

---

## Step 1: Database Migration

### Execute in Supabase SQL Editor:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: **Naalu Aksharam Padikk**
3. Navigate to **SQL Editor**
4. Create a new query
5. Copy the entire content from:
   ```
   frontend/src/supabase-setup.sql
   ```
6. Paste into the SQL editor
7. Click **Run** button
8. Wait for completion (should see green checkmarks)

### What This Does:

- Removes college column from users table (migration)
- Creates 6 new feature tables
- Creates 13 performance indexes
- Enables RLS on all new tables
- Creates 10 RLS policies
- Creates 4 auto-update triggers

---

## Step 2: Verify Database Setup

### Check Tables Created:

1. Go to **Table Editor** in Supabase
2. Refresh the list
3. Verify these tables exist:
   - `mentor_playbooks`
   - `mentor_student_notes`
   - `mentor_pulse_checkins`
   - `alumni_roadmaps`
   - `skill_recommendations`
   - `catchup_plan_history`

### Check Indexes:

1. Go to **SQL Editor**
2. Run this query:
   ```sql
   SELECT * FROM pg_indexes
   WHERE schemaname = 'public'
   AND tablename IN ('mentor_playbooks', 'mentor_student_notes', 'mentor_pulse_checkins',
                     'alumni_roadmaps', 'skill_recommendations', 'catchup_plan_history');
   ```
3. Should see 13 indexes

### Check Policies:

1. Go to **Authentication > Policies**
2. Expand each new table
3. Should see 10 total policies (mix of SELECT, INSERT, UPDATE, DELETE)

---

## Step 3: Frontend Setup

### Install Dependencies:

```bash
cd frontend
npm install
```

### Start Development Server:

```bash
npm run dev
```

The app will be available at `http://localhost:5176`

---

## Step 4: Test Mentor Features

### Prerequisites:

- Have a test account with `role = 'mentor'`
- Have student accounts connected to this mentor

### Test Flow:

1. **Dashboard Tab:**

   - ✅ Academic Radar Panel loads
   - ✅ Displays student status (Stable/Attention/Critical)
   - ✅ Shows overview stats (counts by status)

2. **Catch-Up Plan Simulator:**

   - ✅ Adjust syllabus completion %, days remaining, daily hours
   - ✅ View 3 timeline outputs (Best/Realistic/Worst)
   - ✅ See color-coded feasibility warnings
   - ✅ Click "Approve Plan" button

3. **Weekly Mentor Pulse:**

   - ✅ See list of connected students
   - ✅ Click "Edit" on a student
   - ✅ Select status (On Track/Concern/Critical)
   - ✅ Add optional notes
   - ✅ Click "Save Checkin"
   - ✅ Verify it saves to Supabase

4. **Timeline Tab:**

   - ✅ Select a student from dropdown
   - ✅ View chronological activity (study logs, notes, streaks)
   - ✅ See inactivity gaps highlighted
   - ✅ Check "Inactivity Gap Detected" warning if applicable

5. **Playbooks Tab:**
   - ✅ Click "+ Create New Playbook"
   - ✅ Fill: Title, Category, Guidance
   - ✅ Click "Create Playbook"
   - ✅ Verify it appears in list
   - ✅ Click copy icon to duplicate
   - ✅ Click trash icon to delete

---

## Step 5: Test Alumni Features

### Prerequisites:

- Have a test account with `role = 'alumni'`
- Have student accounts connected to this alumni

### Test Flow:

1. **Dashboard Tab:**

   - ✅ Roadmap Vault loads with list of roadmaps
   - ✅ See Compare-Year View
   - ✅ See Long-Term Growth Tracker chart

2. **Roadmaps Tab:**

   - ✅ View all roadmaps created by you
   - ✅ See year badge, academic focus, skills focus
   - ✅ Click "+ Create New Roadmap" (should open form)

3. **Skills Tab:**

   - ✅ Skill Drift Indicator loads
   - ✅ Select a student from dropdown
   - ✅ Click "+ Add" recommendation
   - ✅ Fill: Skill, Resource URL, Action Item, Priority
   - ✅ Click "Add Recommendation"
   - ✅ Verify it appears in list

4. **Compare-Year View:**

   - ✅ Select a student
   - ✅ See student's current year
   - ✅ See your year X roadmap (if exists)
   - ✅ Compare academic focus
   - ✅ Compare skills (you developed vs student has)
   - ✅ See skill gaps highlighted

5. **Long-Term Growth Tracker:**
   - ✅ Select a student
   - ✅ See current streak & skills count
   - ✅ See 12-month growth chart
   - ✅ See strength & focus area analysis

---

## Step 6: Verify Security & Permissions

### Test Row-Level Security:

1. **As Mentor Account:**

   - Open browser DevTools → Network
   - Try to view another mentor's playbooks (should be empty)
   - Try to view student notes for students NOT connected to you
   - Verify only YOUR data is returned

2. **As Alumni Account:**

   - Verify you can only see recommendations you created
   - Verify you can only see roadmaps you created
   - Try to delete another alumni's data (should fail silently)

3. **As Student Account:**
   - Verify mentor/alumni features are hidden
   - Verify only student dashboard visible
   - Check that you can't access mentor tables

---

## Troubleshooting

### Error: "Cannot find module 'recharts'"

```bash
npm install recharts
```

### Error: "Type errors in components"

```bash
cd frontend
npx tsc --noEmit
```

### Error: "Supabase table not found"

- Verify migration ran successfully
- Check table exists in Supabase dashboard
- Verify spelling matches exactly

### Features not loading data

- Check browser console for errors
- Verify user has active mentorship connections
- Check Supabase RLS policies are enabled
- Verify auth context has correct user ID

### Styling looks wrong

- Clear browser cache (Cmd+Shift+Delete on Mac)
- Restart development server (`npm run dev`)
- Check that Tailwind CSS is loading

---

## Performance Optimization

### Indexes Status:

All queries use indexes:

- `mentor_id` on mentor tables
- `alumni_id` on alumni tables
- `mentee_id` on student connection tables
- `week_starting` on pulse checkins for unique constraint

### Query Performance:

All components use single queries (no N+1):

- Mentorship connections use subqueries
- Student data aggregated in single round-trip
- Recommendations filtered server-side

---

## Next Features to Consider

1. **Message System:**

   - Create messages table
   - Add messaging component
   - Notification system

2. **Advanced Analytics:**

   - Student performance trends
   - Mentor effectiveness metrics
   - Alumni success correlation

3. **Automation:**

   - Auto-send reminders for inconsistent students
   - Suggest playbooks based on student patterns
   - Alert system for critical students

4. **Import/Export:**
   - Export playbooks template library
   - Import community playbooks
   - CSV export of student metrics

---

## Rollback Instructions

If you need to undo the migration:

```sql
-- Drop new tables (reverse order of creation)
DROP TABLE IF EXISTS catchup_plan_history;
DROP TABLE IF EXISTS skill_recommendations;
DROP TABLE IF EXISTS alumni_roadmaps;
DROP TABLE IF EXISTS mentor_pulse_checkins;
DROP TABLE IF EXISTS mentor_student_notes;
DROP TABLE IF EXISTS mentor_playbooks;

-- Re-add college column if needed
ALTER TABLE users ADD COLUMN college TEXT DEFAULT NULL;
```

---

## Support & Documentation

- **Components Documentation:** See MENTOR_ALUMNI_DASHBOARD_COMPLETE.md
- **Database Schema:** frontend/src/supabase-setup.sql
- **Component Code:** frontend/src/components/mentor/ and frontend/src/components/alumni/

---

## Sign-Off

- Database Schema: ✅ Complete
- Component Implementation: ✅ Complete
- Dashboard Integration: ✅ Complete
- Design System: ✅ Complete
- TypeScript Validation: ✅ Complete
- Ready for Deployment: ✅ YES

**Deploy when you're ready!**
