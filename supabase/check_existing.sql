-- 🔍 Run this in your existing Supabase project to see what you currently have

-- Check what tables exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check what columns exist in each table (if any)
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Check existing users (if auth.users table has data)
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users
FROM auth.users;

-- Check if public.users table exists and has data
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') 
        THEN 'public.users table exists'
        ELSE 'public.users table does NOT exist'
    END as users_table_status;

-- If public.users exists, check its content
-- (Uncomment the next line if the table exists)
-- SELECT COUNT(*) as public_users_count FROM public.users;

-- Check existing RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check if custom types exist
SELECT 
    typname as type_name,
    typtype as type_type
FROM pg_type 
WHERE typname IN ('booking_status', 'user_role')
ORDER BY typname;