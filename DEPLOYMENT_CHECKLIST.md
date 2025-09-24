# 🚀 Quick Deployment Checklist

## ✅ Pre-Deployment (Already Done)
- [x] Next.js application structure created
- [x] AppProvider context properly implemented
- [x] Supabase integration configured
- [x] Code pushed to GitHub repository
- [x] Database schema prepared

## 🗄️ Supabase Setup (Do This First)

### 1. Use Your Existing Project ✅
- [x] You already have "autoperks" project in Supabase
- [ ] Go to your existing project dashboard

### 2. Check Current Database Structure
- [ ] Go to SQL Editor in Supabase
- [ ] Run the query from `supabase/check_existing.sql`
- [ ] See what tables/data you currently have

### 3. Update Database Schema
Choose one option:

**Option A: Keep Existing Data (Recommended)**
- [ ] Run `supabase/minimal_update.sql` in SQL Editor
- [ ] This adds new tables without affecting existing data

**Option B: Fresh Start**
- [ ] Run complete `supabase/schema.sql` 
- [ ] ⚠️ This will replace all existing tables

### 4. Get Your Existing Credentials
- [ ] Go to Settings → API in your existing project
- [ ] Copy Project URL: `https://xxxxx.supabase.co`
- [ ] Copy Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🚀 Vercel Deployment

### 1. Import Project
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "New Project"
- [ ] Import `roltrader/autoperks` repository

### 2. Set Environment Variables
Add these in Vercel before deploying:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |

### 3. Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Get your deployment URL

## 👤 Create Admin User

### 1. Sign Up
- [ ] Visit your deployed app
- [ ] Go to client login and sign up with your email

### 2. Set Admin Role
- [ ] Go to Supabase → Authentication → Users
- [ ] Find your user, copy the UUID
- [ ] Go to SQL Editor and run:
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### 3. Test Admin Access
- [ ] Go to `/auth/admin-login` on your app
- [ ] Sign in with your credentials
- [ ] Verify admin dashboard loads

## 🧪 Final Testing

### Client Flow
- [ ] Visit homepage
- [ ] Sign up as new client
- [ ] Book a service
- [ ] Verify booking appears

### Admin Flow
- [ ] Access admin login
- [ ] View all bookings
- [ ] Update booking status
- [ ] Verify changes save

## 🎉 Success Indicators

When everything is working correctly, you should see:

✅ **No "useApp must be used within AppProvider" errors**
✅ **Users can sign up and log in**
✅ **Clients can book services**
✅ **Admins can manage bookings**
✅ **Real-time updates work**

## 🆘 If Something Goes Wrong

### Common Issues:
1. **Build fails**: Check package.json dependencies
2. **Auth errors**: Verify Supabase environment variables
3. **Database errors**: Ensure schema was applied correctly
4. **Context errors**: Should be fixed with new structure

### Quick Fixes:
- Redeploy from Vercel dashboard
- Check environment variables are set
- Verify Supabase project is active
- Check browser console for specific errors

## 📱 Your Live Application

After successful deployment:
- **App URL**: `https://autoperks-[random].vercel.app`
- **Client Login**: `/auth/login`
- **Admin Login**: `/auth/admin-login`
- **Dashboard**: `/dashboard`
- **Admin Panel**: `/admin`

## 🔄 Making Updates

To update your deployed app:
1. Make changes to your code
2. Commit and push to GitHub
3. Vercel automatically redeploys
4. Changes are live in ~2 minutes

---

**Total deployment time: ~15 minutes**

The "useApp must be used within AppProvider" error will be completely resolved once deployed! 🎉