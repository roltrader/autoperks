# Quick GitHub Setup Commands

## Copy & Paste Commands for Auto-Perks Deployment

### Step 1: First-Time Setup
Open terminal in your project folder and run these commands:

```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit - Auto-Perks ITV Booking System"
```

### Step 2: Create GitHub Repository
1. Go to: https://github.com/new
2. Name: `auto-perks-booking`
3. Keep it Public
4. DON'T add README, .gitignore, or license
5. Click "Create repository"

### Step 3: Connect and Push
Replace `YOUR_USERNAME` with your GitHub username:

```bash
# Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/auto-perks-booking.git

# Push your code
git branch -M main
git push -u origin main
```

### Step 4: When Asked for Password
Use a Personal Access Token (not your GitHub password):
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Check `repo` scope
4. Copy token and use as password

## Daily Update Commands

After making changes to your code:

```bash
# See what changed
git status

# Add all changes
git add .

# Commit with message
git commit -m "Updated booking system"

# Push to GitHub
git push
```

## Deploy to Netlify After GitHub

1. Visit: https://app.netlify.com/start
2. Connect GitHub
3. Choose your repository
4. Deploy with these settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Your site will be live!

## Connect auto-perks.com Domain

In Netlify after deployment:
1. Site settings → Domain management
2. Add custom domain: `www.auto-perks.com`
3. Update your domain's DNS:
   - Type: CNAME
   - Name: www
   - Value: [your-site].netlify.app

---

**Need help?** The full guide is in `GITHUB_SETUP_GUIDE.md`