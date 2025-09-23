# GitHub Repository Setup Guide for Auto-Perks ITV Booking System

## Prerequisites
- Git installed on your computer ([Download Git](https://git-scm.com/downloads))
- GitHub account ([Sign up for GitHub](https://github.com/join))
- Your project files ready

## Step 1: Create a GitHub Repository

### Option A: Using GitHub Website (Recommended for Beginners)

1. **Log in to GitHub**
   - Go to [github.com](https://github.com)
   - Sign in with your account

2. **Create New Repository**
   - Click the green "New" button or go to https://github.com/new
   - Fill in the details:
     - Repository name: `auto-perks-booking`
     - Description: "ITV booking system for Auto-Perks"
     - Keep it Public (for free hosting) or Private
     - DO NOT initialize with README (we already have one)
     - DO NOT add .gitignore (we already have one)
     - DO NOT choose a license

3. **Click "Create repository"**

## Step 2: Initialize Git in Your Local Project

Open Terminal (Mac/Linux) or Command Prompt/PowerShell (Windows) in your project folder:

```bash
# Navigate to your project directory
cd path/to/your/project

# Initialize git (if not already initialized)
git init

# Add all files to git
git add .

# Create your first commit
git commit -m "Initial commit - Auto-Perks ITV Booking System"
```

## Step 3: Connect to GitHub Repository

After creating the repository on GitHub, you'll see instructions. Use these commands:

```bash
# Add your GitHub repository as the remote origin
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/auto-perks-booking.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Enter GitHub Credentials

When pushing, you'll need to authenticate:

### For HTTPS (Recommended):
- Username: Your GitHub username
- Password: Your Personal Access Token (NOT your password!)

### Creating a Personal Access Token:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Give it a name like "auto-perks-deployment"
4. Select scopes: `repo` (full control)
5. Generate token and SAVE IT (you won't see it again!)
6. Use this token as your password when pushing

## Step 5: Verify Upload

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/auto-perks-booking`
2. You should see all your files
3. The README.md should be displayed at the bottom

## Common Issues & Solutions

### "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/auto-perks-booking.git
```

### "Permission denied (publickey)"
Switch to HTTPS instead of SSH:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/auto-perks-booking.git
```

### "Updates were rejected because the remote contains work"
```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

## Next Steps After GitHub Upload

### 1. Deploy to Netlify (Easiest)
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "New site from Git"
4. Choose GitHub and authorize
5. Select your `auto-perks-booking` repository
6. Deploy settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Click "Deploy site"

### 2. Connect Your Domain
After deployment, in Netlify:
1. Go to Site settings → Domain management
2. Add custom domain: `www.auto-perks.com`
3. Follow DNS configuration instructions

## Quick Command Reference

```bash
# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest changes
git pull

# Check remote URL
git remote -v
```

## Maintaining Your Repository

### Making Updates:
```bash
# After making changes to your code
git add .
git commit -m "Description of changes"
git push
```

### Best Practices:
- Commit frequently with clear messages
- Pull before making changes if working with others
- Keep sensitive data in environment variables
- Never commit `.env` files with secrets

## Support Resources

- [GitHub Docs](https://docs.github.com)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [Netlify Deployment](https://docs.netlify.com)

---

Ready to deploy? Follow these steps and your site will be on GitHub in minutes!