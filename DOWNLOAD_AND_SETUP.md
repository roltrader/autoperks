# ITV Booking System - Download & Setup Guide

## 📦 Quick Setup

### Prerequisites
- Node.js 18+ and npm installed
- Git (optional, for cloning)

### 1. Download the Code
Download all files from this project to a folder on your computer.

### 2. Install Dependencies
Open terminal in the project folder and run:
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Visit `http://localhost:5173` in your browser.

## 🚀 Production Build

### Build for Production
```bash
npm run build
```
This creates an optimized build in the `dist` folder.

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure
```
itv-booking-system/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── lib/            # Utilities
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── package.json        # Dependencies
└── vite.config.ts      # Build configuration
```

## 🌐 Deployment Options

### Option 1: Netlify (Recommended)
1. Create account at netlify.com
2. Drag `dist` folder to Netlify dashboard
3. Your site is live!

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

### Option 3: Traditional Hosting
1. Build project: `npm run build`
2. Upload `dist` folder contents to your web server
3. Configure server to serve index.html for all routes

## 🔧 Environment Variables
Create `.env` file for Supabase (optional):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 📱 Features Included
- Service booking calendar
- Admin management portal
- Technician scheduling
- Company booking forms
- Mobile responsive design
- Multi-language support (ES/EN)

## 🆘 Troubleshooting

### Port Already in Use
Change port in vite.config.ts:
```javascript
server: { port: 3000 }
```

### Build Errors
Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support
For assistance with deployment or customization:
- Roltrader Consultancy Group
- Tel: +34 977 320 682
- Mobile: 699 25 15 88

## 📄 License
This project is proprietary software developed for ITV services.