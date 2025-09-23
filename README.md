# ITV Booking System

A professional booking and management system for ITV (Inspección Técnica de Vehículos) services, featuring calendar scheduling, technician management, and administrative controls.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 💼 Features

### Customer Features
- **Online Booking Calendar** - Easy appointment scheduling
- **Service Selection** - Choose from maintenance, ITV testing, and valet services
- **Multi-language Support** - Spanish and English interfaces
- **Mobile Responsive** - Works on all devices
- **Real-time Availability** - Live calendar updates

### Business Features
- **Admin Portal** - Complete booking management
- **Technician Scheduling** - Staff assignment and workload management
- **Corporate Bookings** - Special forms for company clients
- **Notification System** - Automated reminders and updates
- **Analytics Dashboard** - Track bookings and performance

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **State Management**: React Context API
- **Database Ready**: Supabase integration prepared
- **Build Tool**: Vite

## 📦 Installation

1. Clone or download the repository
2. Install Node.js 18+ if not already installed
3. Run `npm install` in the project directory
4. Start with `npm run dev`

## 🌐 Deployment

### Netlify (Easiest)
1. Build project: `npm run build`
2. Drag `dist` folder to Netlify

### Vercel
```bash
npm i -g vercel
vercel
```

### Traditional Hosting
Upload `dist` folder contents to your web server

## 📱 Screenshots

- Calendar booking interface
- Admin management dashboard
- Technician scheduling grid
- Mobile responsive design

## 🔧 Configuration

### Environment Variables (Optional)
Create `.env` file for database:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### Customization
- Colors: Edit `tailwind.config.ts`
- Services: Modify `src/components/ServicesGrid.tsx`
- Prices: Update service components

## 📞 Support

**Powered by Roltrader Consultancy Group**
- Tel: +34 977 320 682
- Mobile: 699 25 15 88

## 📄 License

Proprietary software - All rights reserved

---

Built with ❤️ for professional ITV services