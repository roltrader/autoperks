'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/components/providers/AppProvider'
import Link from 'next/link'

export default function HomePage() {
  const { user, isAuthenticated, loading } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Redirect based on user role
      const userRole = user?.user_metadata?.role || 'client'
      if (userRole === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to AutoPerks
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Professional automotive services at your fingertips. Book car washes, 
            detailing, oil changes, and more with our expert technicians.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/login" 
              className="btn-primary text-lg px-8 py-3"
            >
              Client Login
            </Link>
            <Link 
              href="/auth/admin-login" 
              className="btn-secondary text-lg px-8 py-3"
            >
              Admin Login
            </Link>
          </div>
          
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Car Wash</h3>
              <p className="text-gray-600">Professional exterior and interior cleaning</p>
              <p className="text-2xl font-bold text-primary-600 mt-4">$25</p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Full Detail</h3>
              <p className="text-gray-600">Complete vehicle detailing service</p>
              <p className="text-2xl font-bold text-primary-600 mt-4">$150</p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Oil Change</h3>
              <p className="text-gray-600">Quick and professional oil change</p>
              <p className="text-2xl font-bold text-primary-600 mt-4">$45</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}