# 🚨 Troubleshooting SQL Schema Issues

## 🔍 Common Problems & Solutions

### Problem 1: "relation already exists" Error
```
ERROR: relation "public.users" already exists
```

**Cause**: Tables already exist in your database

**Solution**: Clear existing tables first
```sql
-- Run this BEFORE the main schema
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.technicians CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
```

### Problem 2: "permission denied" Error
```
ERROR: permission denied for schema public
```

**Cause**: Insufficient permissions

**Solutions**:
1. **Refresh the page** and try again
2. **Log out and log back in** to Supabase
3. **Check you're the project owner** (not just a collaborator)
4. **Try in an incognito/private browser window**

### Problem 3: "syntax error" Messages
```
ERROR: syntax error at or near "CREATE"
```

**Cause**: Incomplete or corrupted schema content

**Solutions**:
1. **Copy the schema again** from GitHub
2. **Make sure you copied the ENTIRE file** (it's quite long)
3. **Check for extra characters** at the beginning or end
4. **Use the raw GitHub link**: https://raw.githubusercontent.com/roltrader/autoperks/main/supabase/schema.sql

### Problem 4: "function does not exist" Error
```
ERROR: function update_updated_at_column() does not exist
```

**Cause**: Schema wasn't fully executed

**Solution**: Run the complete schema again
- The schema creates all necessary functions
- Make sure the entire file was executed

### Problem 5: No Success Message
```
Query runs but no confirmation appears
```

**Cause**: Large query might take time

**Solutions**:
1. **Wait longer** (up to 60 seconds)
2. **Check the results panel** below the editor
3. **Look for any error messages** in red
4. **Refresh and try again** if it seems stuck

### Problem 6: "JWT secret" Warning
```
WARNING: JWT secret not set properly
```

**Cause**: Database configuration issue

**Solution**: This warning can usually be ignored
- The schema will still work
- Your Next.js app will handle JWT properly

## 🔧 Step-by-Step Troubleshooting

### If Schema Fails Completely:

1. **Start Fresh**:
   ```sql
   -- Clear everything
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   GRANT ALL ON SCHEMA public TO postgres;
   GRANT ALL ON SCHEMA public TO public;
   ```

2. **Run Schema Again**:
   - Copy fresh content from GitHub
   - Paste and run the complete schema

3. **Verify Success**:
   - Run the verification script from `supabase/verify_schema.sql`

### If Partial Success:

1. **Check what's missing**:
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```

2. **Run missing parts**:
   - Copy only the CREATE TABLE statements you need
   - Run them individually

3. **Add sample data**:
   ```sql
   INSERT INTO public.services (name, description, price, duration) VALUES
   ('Car Wash', 'Professional exterior and interior cleaning', 25.00, 30),
   ('Full Detail', 'Complete vehicle detailing service', 150.00, 180),
   ('Oil Change', 'Quick and professional oil change', 45.00, 45);
   ```

## 🔍 Verification Checklist

After running the schema, verify these items:

### ✅ Tables Created:
- [ ] `public.users`
- [ ] `public.services`
- [ ] `public.technicians`
- [ ] `public.bookings`

### ✅ Sample Data:
- [ ] 5 services in `services` table
- [ ] Services have correct prices

### ✅ Security:
- [ ] RLS policies active
- [ ] User roles working

### ✅ Functions:
- [ ] `update_updated_at_column()` exists
- [ ] `handle_new_user()` exists

## 🆘 Emergency Reset

If everything goes wrong, you can reset your database:

### Option 1: Reset via Dashboard
1. Go to **Settings** → **General**
2. Look for "Reset Database" or "Danger Zone"
3. Follow the reset process
4. Re-run the schema

### Option 2: Manual Reset
```sql
-- Nuclear option: removes everything
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;
```

## 📞 Getting Help

### Check These First:
1. **Error message details** - read the full error
2. **Browser console** - check for JavaScript errors
3. **Network connection** - ensure stable internet
4. **Supabase status** - check status.supabase.com

### Common Error Patterns:

**"CASCADE" errors**: Usually safe to ignore
**"NOTICE" messages**: Informational, not errors
**"WARNING" messages**: Usually safe to ignore
**"ERROR" messages**: Need to be fixed

### If Still Stuck:
1. **Try the minimal update** script instead: `supabase/minimal_update.sql`
2. **Use a fresh Supabase project** if the current one is corrupted
3. **Check the Supabase documentation** for database issues

## ✅ Success Indicators

You know the schema worked when:

1. **No red error messages**
2. **Green success confirmation**
3. **4 new tables** in Table Editor
4. **5 services** in services table
5. **Verification script** shows all green checkmarks

## 🚀 After Success

Once the schema is applied successfully:

1. **Note your Supabase credentials** (URL and anon key)
2. **Deploy to Vercel** with these credentials
3. **Test the Next.js application**
4. **The "useApp must be used within AppProvider" error will be resolved!**

---

**Remember**: Database operations can take time. Be patient and don't run the same script multiple times simultaneously! 🕐