-- Run this in Supabase SQL Editor to check mentor/alumni availability

-- 1. Check if any mentors/alumni exist
SELECT 
    role, 
    is_verified, 
    COUNT(*) as count,
    STRING_AGG(full_name, ', ') as names
FROM users
WHERE role IN ('mentor', 'alumni')
GROUP BY role, is_verified;

-- 2. Check all mentor/alumni users with their verification status
SELECT 
    id,
    full_name,
    email,
    role,
    is_verified,
    department,
    year,
    areas_of_expertise
FROM users
WHERE role IN ('mentor', 'alumni')
ORDER BY is_verified DESC, role;

-- 3. Check total users by role
SELECT role, COUNT(*) as count
FROM users
GROUP BY role;

-- 4. If you need to create a test mentor, uncomment and modify this:
/*
-- Create a test mentor user (modify the email to match an existing student)
UPDATE users 
SET 
    role = 'mentor',
    is_verified = true,
    areas_of_expertise = ARRAY['Data Structures', 'Web Development', 'Python']
WHERE email = 'your-email@example.com';  -- Replace with actual email
*/

-- 5. Or insert a completely new test mentor:
/*
INSERT INTO users (
    firebase_uid, 
    email, 
    full_name, 
    role, 
    department, 
    year, 
    is_verified, 
    areas_of_expertise
)
VALUES (
    'test-mentor-uid-' || gen_random_uuid()::text,
    'mentor@test.com',
    'Test Mentor',
    'mentor',
    'Computer Science',
    4,
    true,
    ARRAY['Data Structures', 'Algorithms', 'System Design']
);
*/
