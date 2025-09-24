# AutoPerks - Automotive Services Booking System

A modern automotive services booking system built with Next.js, Supabase, and Vercel.

## 🚀 Features

- **Client Portal**: Book automotive services with ease
- **Admin Dashboard**: Manage bookings and technicians
- **Real-time Updates**: Live booking status updates
- **Secure Authentication**: Supabase Auth with role-based access
- **Responsive Design**: Works on all devices
- **Modern Stack**: Next.js 14, React 18, Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Vercel
- **Authentication**: Supabase Auth with RLS
- **Styling**: Tailwind CSS

## 🧰 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/roltrader/autoperks.git
cd autoperks
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Go to SQL Editor and run the schema from `supabase/schema.sql`

### 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🚀 Deployment to Vercel

### 1. Connect to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard

### 2. Environment Variables in Vercel

Add these environment variables in your Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Deploy

Vercel will automatically deploy your application on every push to main branch.

## 🔐 Authentication & Roles

The application supports two user roles:

- **Client**: Can book services and view their bookings
- **Admin**: Can manage all bookings and view analytics

### Creating Admin Users

To create an admin user, sign up normally and then update the user's role in Supabase:

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

## 📱 Application Structure

```
app/
├── layout.js              # Root layout with AppProvider
├── page.js                # Home page
├── auth/
│   ├── login/page.js      # Client login
│   └── admin-login/page.js # Admin login
├── dashboard/page.js      # Client dashboard
└── admin/page.js          # Admin dashboard

components/
└── providers/
    └── AppProvider.jsx    # Main context provider

lib/
├── supabase.js           # Supabase client
└── auth.js               # Authentication helpers
```

## 🐛 Troubleshooting

### "useApp must be used within AppProvider" Error

This error occurs when components try to use the `useApp` hook outside of the `AppProvider` context. 

**Solution**: Ensure your root layout (`app/layout.js`) wraps all content with `<AppProvider>`:

```jsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
```

### Database Connection Issues

1. Check your Supabase URL and keys in environment variables
2. Ensure Row Level Security policies are set up correctly
3. Verify the database schema is applied

### Deployment Issues

1. Ensure all environment variables are set in Vercel
2. Check build logs for any missing dependencies
3. Verify Supabase project is accessible from Vercel

## 📊 Database Schema

The application uses the following main tables:

- `users` - User profiles and roles
- `services` - Available automotive services
- `bookings` - Service bookings
- `technicians` - Service technicians

See `supabase/schema.sql` for the complete schema.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.