# 🚀 AutoPerks Deployment Guide

This guide will walk you through deploying the AutoPerks Next.js application to Vercel with Supabase.

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- Supabase account (free tier available)

## 🗂️ Step 1: GitHub Repository Setup

✅ **Already Done**: The code has been pushed to your GitHub repository at:
`https://github.com/roltrader/autoperks.git`

## 🗄️ Step 2: Set Up Supabase Database

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Choose your organization
6. Fill in project details:
   - **Name**: `autoperks`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
7. Click "Create new project"

### 2.2 Set Up Database Schema

1. Wait for your project to be ready (2-3 minutes)
2. Go to **SQL Editor** in the left sidebar
3. Click "New Query"
4. Copy and paste the entire contents from `supabase/schema.sql` in your repository
5. Click "Run" to execute the schema

### 2.3 Get Your Supabase Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values (you'll need them for Vercel):
   - **Project URL** (starts with `https://`)
   - **Anon public key** (starts with `eyJ`)

## 🚀 Step 3: Deploy to Vercel

### 3.1 Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Sign in with GitHub
3. Click "New Project"
4. Import your `autoperks` repository
5. Vercel will detect it's a Next.js project automatically

### 3.2 Configure Environment Variables

Before deploying, add these environment variables in Vercel:

1. In the import screen, scroll down to "Environment Variables"
2. Add these variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |

### 3.3 Deploy

1. Click "Deploy"
2. Wait for the build to complete (2-3 minutes)
3. You'll get a deployment URL like `https://autoperks-xyz.vercel.app`

## 🔐 Step 4: Create Admin User

### 4.1 Create Your First Admin Account

1. Visit your deployed application
2. Go to the client login page
3. Sign up with your admin email
4. Go back to Supabase dashboard
5. Navigate to **Authentication** → **Users**
6. Find your user and note the UUID
7. Go to **SQL Editor** and run:

\`\`\`sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
\`\`\`

### 4.2 Test Admin Access

1. Go to your app's admin login page: `https://your-app.vercel.app/auth/admin-login`
2. Sign in with your admin credentials
3. You should now have access to the admin dashboard

## 🧪 Step 5: Test Your Application

### Test Client Flow:
1. Visit your app homepage
2. Click "Client Login"
3. Sign up for a new account
4. Book a service
5. Verify booking appears in dashboard

### Test Admin Flow:
1. Go to admin login
2. Sign in with admin account
3. View all bookings
4. Update booking status
5. Verify changes are saved

## 🔧 Step 6: Custom Domain (Optional)

### Add Your Own Domain:

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

## 🛠️ Troubleshooting

### Common Issues:

**1. "useApp must be used within AppProvider" Error**
- ✅ **Fixed**: The new Next.js structure has AppProvider at root level

**2. Supabase Connection Error**
- Check environment variables are set correctly
- Verify Supabase project URL and keys
- Ensure database schema was applied

**3. Authentication Issues**
- Check Supabase Auth settings
- Verify RLS policies are enabled
- Ensure user roles are set correctly

**4. Build Failures**
- Check for TypeScript errors
- Verify all dependencies are installed
- Review Vercel build logs

### Getting Help:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify Supabase logs in dashboard
4. Test API endpoints directly

## 📱 Application URLs

After deployment, your application will have these routes:

- **Homepage**: `https://your-app.vercel.app/`
- **Client Login**: `https://your-app.vercel.app/auth/login`
- **Admin Login**: `https://your-app.vercel.app/auth/admin-login`
- **Client Dashboard**: `https://your-app.vercel.app/dashboard`
- **Admin Dashboard**: `https://your-app.vercel.app/admin`

## 🎉 Success!

Your AutoPerks application is now deployed and the "useApp must be used within AppProvider" error is resolved!

The application includes:
- ✅ Proper React context management
- ✅ Supabase authentication and database
- ✅ Role-based access control
- ✅ Modern responsive design
- ✅ Real-time updates
- ✅ Production-ready deployment

## 📞 Support

If you encounter any issues during deployment, the most common problems are:

1. **Environment variables not set**: Double-check Supabase URL and keys
2. **Database schema not applied**: Re-run the SQL schema in Supabase
3. **Admin role not set**: Update user role in Supabase database

Your application is now live and fully functional! 🚀