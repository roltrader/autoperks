-- 🔍 Verification Script: Run this after applying schema.sql
-- This will check if everything was created correctly

-- 1. Check if all tables were created
SELECT 
    '✅ Tables Created' as check_type,
    table_name,
    CASE 
        WHEN table_name IN ('users', 'services', 'technicians', 'bookings') 
        THEN '✅ Required table exists'
        ELSE '❌ Unexpected table'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Check if custom types were created
SELECT 
    '✅ Custom Types' as check_type,
    typname as type_name,
    CASE 
        WHEN typname IN ('booking_status', 'user_role') 
        THEN '✅ Required type exists'
        ELSE '❌ Unexpected type'
    END as status
FROM pg_type 
WHERE typname IN ('booking_status', 'user_role')
ORDER BY typname;

-- 3. Check if sample services were inserted
SELECT 
    '✅ Sample Data' as check_type,
    COUNT(*) as service_count,
    CASE 
        WHEN COUNT(*) = 5 THEN '✅ All 5 services loaded'
        WHEN COUNT(*) > 0 THEN '⚠️ Some services loaded'
        ELSE '❌ No services found'
    END as status
FROM public.services;

-- 4. List all services to verify content
SELECT 
    '📋 Service Details' as check_type,
    name,
    price,
    duration,
    '✅ Service loaded' as status
FROM public.services
ORDER BY id;

-- 5. Check if RLS policies were created
SELECT 
    '🔒 RLS Policies' as check_type,
    tablename,
    policyname,
    '✅ Policy active' as status
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 6. Check if functions were created
SELECT 
    '⚙️ Functions' as check_type,
    routine_name as function_name,
    '✅ Function exists' as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('update_updated_at_column', 'handle_new_user')
ORDER BY routine_name;

-- 7. Check if triggers were created
SELECT 
    '🔄 Triggers' as check_type,
    trigger_name,
    event_object_table as table_name,
    '✅ Trigger active' as status
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 8. Summary check
SELECT 
    '📊 SUMMARY' as check_type,
    'Schema Application' as item,
    CASE 
        WHEN (
            (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') >= 4
            AND (SELECT COUNT(*) FROM public.services) = 5
            AND (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') > 0
        ) THEN '🎉 SUCCESS: Schema applied correctly!'
        ELSE '❌ ISSUES: Schema may not be complete'
    END as status;

-- 9. Next steps reminder
SELECT 
    '🚀 Next Steps' as check_type,
    'Deployment' as item,
    'Deploy Next.js app to Vercel with your Supabase credentials' as status;