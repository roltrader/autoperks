import { Inter } from 'next/font/google'
import { AppProvider } from '@/contexts/AppContext';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AutoPerks - Automotive Services',
  description: 'Book automotive services with ease',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}