# 📋 How to Run supabase/schema.sql in Your Project

## 🎯 Quick Steps

### 1. Access Supabase SQL Editor
1. Go to [supabase.com](https://supabase.com)
2. Sign in and select your **"autoperks"** project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### 2. Get the Schema Content
You have two options:

**Option A: Copy from GitHub (Easiest)**
1. Go to your repository: `https://github.com/roltrader/autoperks`
2. Navigate to `supabase/schema.sql`
3. Click the file to open it
4. Click the **"Copy raw file"** button (or select all text and copy)

**Option B: Copy from Local File**
1. Open the `supabase/schema.sql` file in your code editor
2. Select all content (Ctrl+A / Cmd+A)
3. Copy (Ctrl+C / Cmd+C)

### 3. Paste and Run in Supabase
1. In the Supabase SQL Editor, paste the entire schema content
2. Click **"Run"** button (usually green button)
3. Wait for execution to complete (may take 10-30 seconds)
4. Check for success message or errors

## 📋 Detailed Step-by-Step Instructions

### Step 1: Navigate to SQL Editor
```
Supabase Dashboard → Left Sidebar → SQL Editor → New Query
```

### Step 2: Clear Existing Data (Optional)
If you want a completely fresh start, first run this:

```sql
-- WARNING: This deletes all existing data!
-- Only run if you want to start completely fresh

DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.technicians CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
```

### Step 3: Run the Complete Schema
1. **Clear the editor** (delete any existing content)
2. **Paste the entire contents** of `supabase/schema.sql`
3. **Click "Run"** 
4. **Wait for completion**

### Step 4: Verify Success
After running, you should see:
- ✅ Success message
- ✅ No error messages
- ✅ New tables created

## 🔍 What the Schema Creates

The `schema.sql` file will create:

### Tables:
- `public.users` - User profiles and roles
- `public.services` - Available automotive services
- `public.technicians` - Service technicians
- `public.bookings` - Service bookings

### Sample Data:
- 5 default services (Car Wash, Full Detail, Oil Change, etc.)

### Security:
- Row Level Security (RLS) policies
- User role management
- Proper access controls

### Functions:
- Auto-update timestamps
- New user registration handler

## ⚠️ Important Notes

### Before Running:
- **Backup important data** if you have any
- The schema will **replace existing tables** with the same names
- Existing `auth.users` will be preserved (authentication data)

### After Running:
- All existing users will still be able to log in
- You may need to set admin roles manually
- Test the application to ensure everything works

## 🧪 Verify the Schema Was Applied

Run this query to check if everything was created:

```sql
-- Check tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check sample services were added
SELECT name, price FROM public.services;

-- Check RLS policies exist
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

You should see:
- 4 tables: `bookings`, `services`, `technicians`, `users`
- 5 services with prices
- Multiple RLS policies

## 🚨 Troubleshooting

### "Permission denied" errors:
- You might not have the right permissions
- Try refreshing the page and logging in again

### "Table already exists" errors:
- Run the DROP TABLE commands first (see Step 2 above)
- Or use the `minimal_update.sql` instead

### "Syntax error" messages:
- Make sure you copied the entire file content
- Check for any missing characters at the beginning/end

### "Function does not exist" errors:
- The schema creates all necessary functions
- Make sure the entire file was executed

## ✅ Success Indicators

When the schema is successfully applied:

1. **No error messages** in the SQL Editor
2. **Tables appear** in the Table Editor
3. **Sample services** are visible in the services table
4. **RLS policies** are active
5. **Your Next.js app can connect** to the database

## 🎉 Next Steps

After successfully running the schema:

1. **Deploy your Next.js app** to Vercel
2. **Set environment variables** with your Supabase credentials
3. **Test user registration** and login
4. **Set admin roles** for admin users
5. **Verify booking functionality**

The "useApp must be used within AppProvider" error will be resolved once your Next.js app is deployed! 🚀