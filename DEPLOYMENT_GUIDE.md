# AutoPerks Booking System - Complete Deployment Package

## System Overview
A premium automotive service booking system with customer interface and admin management dashboard for AutoPerks Valls, Tarragona.

## Latest Updates (v1.1.0)
- **RSJ Logo Integration**: Professional branding with RSJ logo
- **Updated Tagline**: "Premium Automotive Services supplied by Qualified Supply Agents"
- **Revised Service Pricing**:
  - Full Valet: €150
  - Standard Valet: €60
  - Wash & Go: €20
  - Ceramic Coating: €300
  - Paint Correction: €200
  - Interior Detailing: €120
  - Pre ITV Testing: €60

## Features
- **Customer Booking Interface**: Service selection, calendar booking, and customer form
- **Admin Management Dashboard**: Secure login with view bookings, manage technician schedules
- **Real-time Availability**: Blocked times from admin affect customer booking availability
- **Technician Management**: Add/remove technicians, manage their schedules
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Email Authentication**: Secure admin access with email/password login

## Login Credentials

### Admin Dashboard Access
- **URL**: `/management` or click "Management Portal" button
- **Email**: `admin@autoperks.com`
- **Password**: `admin123`

## Installation Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (project already configured)

### Setup Steps

1. **Extract the project files**
   ```bash
   unzip autoperks-complete-package.zip
   cd autoperks-booking-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   The Supabase configuration is already set up in `src/lib/supabase.ts`
   - URL: https://mqcvybwkkpjqxvtqfqvw.supabase.co
   - All edge functions are pre-configured

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Access at: http://localhost:5173

5. **Build for Production**
   ```bash
   npm run build
   ```
   Production files will be in the `dist` folder

## Database Structure

### Tables
- `bookings`: Customer bookings with service details
- `admin_users`: Admin login credentials (email/password)
- `available_slots`: Time slot availability management
- `employees`: Technician information

### Edge Functions
- `admin-login`: Admin authentication with email/password
- `create-booking`: Create new customer bookings
- `get-bookings`: Retrieve all bookings
- `manage-slots`: Manage time slot availability
- `get-available-slots`: Check available booking slots

## Usage Guide

### For Customers
1. Visit the homepage
2. Browse available services with updated pricing
3. Click "Book Now" on desired service
4. Select date and time from available slots
5. Fill in contact information
6. Submit booking (will appear in admin dashboard)

### For Administrators
1. Navigate to `/management` or click "Management Portal"
2. Login with email: `admin@autoperks.com` password: `admin123`
3. View all customer bookings in the unified dashboard
4. Click on calendar slots to block/unblock times
5. Manage technician schedules
6. Add/remove technicians as needed
7. Bookings made by customers will appear immediately

## Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
Follow prompts to deploy

### Netlify
1. Build the project: `npm run build`
2. Drag the `dist` folder to Netlify dashboard
3. Set up environment variables if needed

### Traditional Hosting
1. Build: `npm run build`
2. Upload contents of `dist` folder to your web server
3. Configure server to serve index.html for all routes (SPA routing)

## File Structure
```
autoperks-booking-system/
├── src/
│   ├── components/       # All UI components
│   ├── lib/              # Supabase configuration
│   ├── pages/            # Page components
│   └── main.tsx          # Application entry
├── public/               # Static assets
├── dist/                 # Production build (after npm run build)
└── package.json          # Dependencies and scripts
```

## Troubleshooting

### Bookings not appearing in dashboard
- Ensure Supabase edge functions are deployed
- Check browser console for errors
- Verify admin is logged in properly

### Login issues
- Use email: `admin@autoperks.com`
- Password: `admin123`
- Clear browser cache if needed

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (18+ required)

## Support
For issues or customization requests, refer to the codebase documentation.

## Version History
- v1.1.0 (Current) - Added RSJ branding, updated pricing, email authentication
- v1.0.0 - Initial release with booking system

## License
Proprietary - AutoPerks Valls 2025