# Database Migration Guide

## Quick Start - Apply Database Changes

### Step 1: Open Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Login to your account
3. Select your **Naalu Aksharam Padikk** project

### Step 2: Open SQL Editor

1. In the left sidebar, click **SQL Editor**
2. Click **+ New query**

### Step 3: Run Migration

Copy and paste the following SQL commands:

```sql
-- Add new columns to community_posts table
ALTER TABLE community_posts
  ADD COLUMN IF NOT EXISTS subject TEXT,
  ADD COLUMN IF NOT EXISTS topic TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS resources TEXT,
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 0;

-- Create student_projects table
CREATE TABLE IF NOT EXISTS student_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL,
  project_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger for student_projects updated_at
CREATE TRIGGER update_student_projects_updated_at BEFORE UPDATE ON student_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RPC function to increment post likes
CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Create RPC function to decrement post likes
CREATE OR REPLACE FUNCTION decrement_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
```

### Step 4: Execute

1. Click **Run** (or press Cmd/Ctrl + Enter)
2. Wait for success message
3. Check for any errors in the output panel

### Step 5: Verify Tables

Run this verification query:

```sql
-- Verify community_posts columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'community_posts';

-- Verify student_projects table exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'student_projects';

-- Verify RPC functions exist
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name IN ('increment_post_likes', 'decrement_post_likes');
```

Expected output should show:

- `community_posts` has new columns: subject, topic, description, resources, duration_minutes
- `student_projects` table exists with all 9 columns
- Both RPC functions are listed as 'FUNCTION'

---

## Troubleshooting

### Error: "function update_updated_at_column() does not exist"

This function should already exist from the initial setup. If not, create it:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Error: "relation community_posts does not exist"

Run the full `supabase-setup.sql` file first from:
`/frontend/src/supabase-setup.sql`

### Error: "column already exists"

This is safe to ignore. The `IF NOT EXISTS` clause prevents duplicate columns.

---

## Optional: Create Test Data

### Add a Test Mentor User

```sql
-- Update an existing student to be a mentor
UPDATE users
SET role = 'mentor', is_verified = true
WHERE email = 'your-test-email@example.com';
```

### Create Sample Community Post

```sql
INSERT INTO community_posts (user_id, content, subject, topic, description, resources, duration_minutes)
VALUES (
  (SELECT id FROM users LIMIT 1),
  'Just completed a deep dive into binary search trees!',
  'Data Structures',
  'Binary Search Trees',
  'Learned about insertion, deletion, and traversal algorithms. The concept finally clicked!',
  'https://visualgo.net/en/bst, CLRS Chapter 12',
  120
);
```

### Create Sample Project

```sql
INSERT INTO student_projects (user_id, title, description, technologies, project_url, github_url)
VALUES (
  (SELECT id FROM users LIMIT 1),
  'Todo App with React',
  'A full-featured todo application with authentication and real-time updates',
  ARRAY['React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
  'https://my-todo-app.vercel.app',
  'https://github.com/username/todo-app'
);
```

---

## Testing After Migration

1. **Restart your frontend dev server** (if running):

   ```bash
   cd frontend
   npm run dev
   ```

2. **Login to the app**

3. **Test Profile Tab**:

   - Go to Profile tab
   - Verify your real name appears (not "Rahul Verma")
   - Check stats display real numbers

4. **Test Community Feed**:

   - Go to Community tab
   - Try creating a new post
   - Fill all fields and submit
   - Try liking a post

5. **Test My Projects**:

   - Go to Projects tab
   - Click "Add New Project"
   - Fill the form and submit
   - Try editing a project
   - Try deleting a project

6. **Test Mentorship**:
   - Go to Mentorship tab
   - Verify mentors appear (if any exist with is_verified=true)
   - If no mentors show, create a test mentor user (see above)

---

## Success Indicators

✅ No SQL errors in Supabase  
✅ Profile shows your actual user data  
✅ Can create posts in Community Feed  
✅ Can add/edit/delete projects  
✅ Mentors appear in Mentorship tab  
✅ Like button works on posts  
✅ All 6 tabs render without errors

---

## Next Steps After Migration

1. Review [STUDENT_DASHBOARD_FIXES.md](./STUDENT_DASHBOARD_FIXES.md) for detailed changes
2. Test all features with real user interactions
3. Create additional test users for different roles
4. Consider adding more features:
   - Project images
   - Post comments
   - Search functionality
   - Notifications

---

## Need Help?

If you encounter issues:

1. Check Supabase logs in Dashboard > Logs
2. Check browser console for frontend errors
3. Verify user is authenticated (check AuthContext)
4. Ensure RLS policies allow operations (check Supabase > Authentication > Policies)

The database schema file is located at:
`/frontend/src/supabase-setup.sql`
