# Deploying to auto-perks.com

This guide will help you deploy your ITV booking system to your auto-perks.com domain.

## Option 1: Deploy with Netlify (Recommended - Free)

### Step 1: Build Your Project
```bash
npm run build
```
This creates a `dist` folder with your production-ready files.

### Step 2: Deploy to Netlify
1. Go to [Netlify](https://app.netlify.com)
2. Sign up/login with your GitHub account
3. Drag and drop your `dist` folder to the deployment area
4. Your site will be live on a temporary Netlify URL

### Step 3: Connect auto-perks.com Domain
1. In Netlify, go to **Domain Settings**
2. Click **Add custom domain**
3. Enter `auto-perks.com`
4. Netlify will provide DNS records

### Step 4: Update Your Domain DNS
Go to your domain registrar (where you bought auto-perks.com) and update:

**Option A: Using Netlify DNS (Easiest)**
- Change nameservers to Netlify's:
  - `dns1.p01.nsone.net`
  - `dns2.p01.nsone.net`
  - `dns3.p01.nsone.net`
  - `dns4.p01.nsone.net`

**Option B: Keep Current DNS**
Add these records:
- Type: A, Name: @, Value: `75.2.60.5`
- Type: CNAME, Name: www, Value: `[your-site].netlify.app`

## Option 2: Deploy with Vercel (Also Free)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Deploy
```bash
vercel --prod
```
Follow the prompts to create/link your project.

### Step 3: Add Domain in Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Domains
4. Add `auto-perks.com`
5. Follow Vercel's DNS instructions

## Option 3: Traditional Web Hosting

If you have traditional hosting (cPanel, etc.):

### Step 1: Build Project
```bash
npm run build
```

### Step 2: Upload Files
1. Connect via FTP (FileZilla, etc.)
2. Upload contents of `dist` folder to `public_html`
3. Ensure `.htaccess` file is included for routing

### Step 3: Configure .htaccess
Create `.htaccess` in your public_html:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Important URLs After Deployment

- Main Site: `https://auto-perks.com`
- Admin Portal: `https://auto-perks.com/admin`
- Admin Login: 
  - Email: `info@auto-perks.com`
  - Password: `admin123`

## SSL Certificate

Most hosting providers offer free SSL:
- **Netlify/Vercel**: Automatic SSL with Let's Encrypt
- **Traditional Hosting**: Use cPanel's AutoSSL or Let's Encrypt

## Post-Deployment Checklist

- [ ] Site loads at auto-perks.com
- [ ] SSL certificate active (https://)
- [ ] Admin portal accessible at /admin
- [ ] Booking form works correctly
- [ ] Calendar displays properly
- [ ] Email notifications configured (if using)

## Troubleshooting

**Site shows 404 on routes:**
- Ensure your hosting supports SPA routing
- Check .htaccess configuration

**Domain not connecting:**
- DNS changes can take 24-48 hours
- Verify DNS records are correct

**Admin login not working:**
- Clear browser cache
- Check console for errors

## Need Help?

For domain-specific issues, contact your domain registrar's support.
For hosting issues, contact your hosting provider's support.