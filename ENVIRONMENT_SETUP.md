# 🔐 Environment Variables Setup Guide

## 📋 Required Environment Variables

Your Next.js application needs these environment variables to connect to Supabase:

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abcdefghijklmnop.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

## 🗄️ Getting Supabase Credentials

### Step 1: Find Your Supabase Project Settings
1. Go to your Supabase dashboard
2. Select your "autoperks" project
3. Click on **Settings** (gear icon) in the left sidebar
4. Click on **API**

### Step 2: Copy the Required Values
You'll see a section called "Project API keys":

**Project URL:**
```
https://abcdefghijklmnop.supabase.co
```
👆 Copy this entire URL

**Anon Key (public):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU0ODAwMCwiZXhwIjoxOTUyMTI0MDAwfQ.example-signature
```
👆 Copy this entire key (it's very long!)

## 🚀 Setting Variables in Vercel

### Method 1: During Initial Deployment
1. When importing your project to Vercel
2. Scroll down to "Environment Variables" section
3. Add each variable:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase URL
   - Click "Add"
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon key
   - Click "Add"

### Method 2: After Deployment
1. Go to your Vercel dashboard
2. Click on your "autoperks" project
3. Go to **Settings** tab
4. Click **Environment Variables** in the left menu
5. Click "Add New"
6. Fill in:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase URL
   - **Environments**: Select all (Production, Preview, Development)
7. Click "Save"
8. Repeat for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Method 3: Using Vercel CLI (Advanced)
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your Supabase anon key when prompted
```

## 🔄 Redeploy After Adding Variables

**Important**: After adding environment variables, you need to redeploy:

1. Go to your Vercel project dashboard
2. Click on **Deployments** tab
3. Find the latest deployment
4. Click the three dots menu (⋯)
5. Click "Redeploy"
6. Wait for the new deployment to complete

## ✅ Verify Environment Variables

### Check in Vercel Dashboard:
1. Go to Settings → Environment Variables
2. You should see both variables listed
3. Values should be hidden for security

### Test in Your Application:
1. Visit your deployed app
2. Open browser developer tools (F12)
3. Go to Console tab
4. Type: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
5. You should see your Supabase URL (not undefined)

## 🚨 Security Notes

### ✅ Safe to Expose (NEXT_PUBLIC_):
- `NEXT_PUBLIC_SUPABASE_URL` - This is your public project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - This is designed to be public

### ❌ Never Expose:
- Service role keys
- Database passwords
- Private API keys
- JWT secrets

## 🛠️ Troubleshooting

### "Cannot read properties of undefined" Error:
- Environment variables not set correctly
- Redeploy after adding variables
- Check variable names are exact (case-sensitive)

### "Failed to connect to Supabase" Error:
- Verify Supabase URL is correct
- Check anon key is complete (very long string)
- Ensure Supabase project is active

### Variables Not Loading:
- Must start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding variables
- Clear browser cache

## 📝 Local Development

For local development, create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Note**: Never commit `.env.local` to Git (it's in .gitignore)

## 🎉 Success!

When environment variables are set correctly:
- ✅ No "Cannot read properties of undefined" errors
- ✅ Authentication works
- ✅ Database connections succeed
- ✅ "useApp must be used within AppProvider" error is resolved

Your application will now have full access to Supabase services! 🚀