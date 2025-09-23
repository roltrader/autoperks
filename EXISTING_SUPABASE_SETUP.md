# 🔄 Using Your Existing Supabase Project

Since you already have an "autoperks" project in Supabase, you can reuse it! Here's how to update it for the new Next.js application.

## 🔍 Step 1: Assess Your Current Setup

### Check What You Have:
1. Go to your existing Supabase "autoperks" project
2. Navigate to **Table Editor**
3. See what tables currently exist

### Common Scenarios:

**Scenario A: Empty/Minimal Project**
- Few or no tables
- No important data to preserve
- **Action**: Apply full schema

**Scenario B: Has Data You Want to Keep**
- Existing users, bookings, or other data
- **Action**: Selective schema updates

**Scenario C: Different Structure**
- Tables with different names/structure
- **Action**: Migration approach

## 🛠️ Step 2: Update Database Schema

### Option 1: Fresh Start (Recommended if no important data)

1. Go to **SQL Editor** in Supabase
2. **Clear existing tables** (if you want a clean start):
```sql
-- WARNING: This will delete all existing data!
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.technicians CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop custom types if they exist
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
```

3. **Apply the new schema** - Copy and paste the entire contents from `supabase/schema.sql`
4. Click **Run**

### Option 2: Selective Updates (Keep existing data)

If you want to keep existing data, run only the parts you need:

1. **Check what tables you have**:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

2. **Add missing tables only** - From `supabase/schema.sql`, copy only the CREATE TABLE statements for tables you don't have

3. **Add missing columns** - If tables exist but are missing columns:
```sql
-- Example: Add missing columns to existing tables
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'client';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS status booking_status DEFAULT 'pending';
```

### Option 3: Migration Approach (Advanced)

If you have a complex existing structure:

1. **Backup your data**:
```sql
-- Export existing data
SELECT * FROM your_existing_table;
```

2. **Create new tables with different names**:
```sql
-- Rename in schema.sql: users -> users_new, etc.
```

3. **Migrate data**:
```sql
-- Copy data from old to new structure
INSERT INTO users_new (id, email, ...) 
SELECT id, email, ... FROM old_users;
```

## 🔐 Step 3: Get Your Credentials

### Your Existing Project Credentials:
1. Go to **Settings** → **API**
2. Copy these values (they're the same as before):
   - **Project URL**: `https://[your-project-id].supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIs...`

### Use in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL` = Your existing project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your existing anon key

## 👤 Step 4: Handle Existing Users

### If You Have Existing Users:

**Check current user structure**:
```sql
SELECT id, email, raw_user_meta_data 
FROM auth.users 
LIMIT 5;
```

**Update user roles** (if needed):
```sql
-- Set admin role for specific users
UPDATE public.users 
SET role = 'admin' 
WHERE email IN ('admin@example.com', 'your-email@example.com');

-- Set all others as clients
UPDATE public.users 
SET role = 'client' 
WHERE role IS NULL;
```

## 🧪 Step 5: Test Your Setup

### Verify Tables Exist:
```sql
-- Check all tables are created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Verify Sample Data:
```sql
-- Check services are loaded
SELECT * FROM public.services;

-- Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### Test Authentication:
1. Try signing up a new user in your app
2. Check if user appears in both `auth.users` and `public.users`
3. Verify role assignment works

## ⚠️ Important Notes

### Data Safety:
- **Always backup important data** before making schema changes
- Test changes in a development environment first
- The `DROP TABLE` commands will **permanently delete data**

### Authentication:
- Existing auth users will still work
- You may need to update user metadata/roles
- New signup flow will use the updated schema

### RLS Policies:
- New Row Level Security policies will be applied
- This might affect access to existing data
- Test thoroughly after applying

## 🚨 Troubleshooting

### "Table already exists" errors:
- Use `CREATE TABLE IF NOT EXISTS` or `DROP TABLE IF EXISTS` first

### "Permission denied" errors:
- Check RLS policies are correctly applied
- Verify user roles are set properly

### "Function does not exist" errors:
- Make sure all functions from schema.sql are created
- Check for typos in function names

## ✅ Success Checklist

After updating your existing project:

- [ ] All required tables exist
- [ ] Sample services data is loaded
- [ ] RLS policies are active
- [ ] Existing users (if any) have proper roles
- [ ] New user signup works
- [ ] Authentication flow works
- [ ] Admin users can access admin features

## 🎉 Benefits of Reusing Existing Project

✅ **Keep your existing project URL and keys**
✅ **Preserve any existing data you want to keep**
✅ **No need to update environment variables if already set**
✅ **Maintain continuity with existing setup**

Your existing Supabase project will work perfectly with the new Next.js application! 🚀