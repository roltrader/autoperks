'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext';


export default function DashboardPage() {
  const { 
    user, 
    isAuthenticated, 
    loading, 
    signOut, 
    services, 
    loadServices, 
    createBooking,
    error 
  } = useApp()
  
  const [selectedService, setSelectedService] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadServices()
      
      // Set default date to tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setDate(tomorrow.toISOString().split('T')[0])
    }
  }, [isAuthenticated])

  const handleBooking = async (e) => {
    e.preventDefault()
    
    if (!selectedService || !date || !time) {
      setMessage('Please fill all fields')
      return
    }

    setSubmitting(true)
    const result = await createBooking({
      service_id: parseInt(selectedService),
      booking_date: date,
      booking_time: time
    })

    if (result.success) {
      setMessage('Booking created successfully!')
      setSelectedService('')
      setTime('')
      // Reset date to tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setDate(tomorrow.toISOString().split('T')[0])
    } else {
      setMessage(result.error)
    }

    setSubmitting(false)
    setTimeout(() => setMessage(''), 5000)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">AutoPerks Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.email}</span>
              <button
                onClick={handleSignOut}
                className="btn-secondary"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Book a Service</h2>
          
          <form onSubmit={handleBooking} className="space-y-6">
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                Service
              </label>
              <select
                id="service"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select a service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price} ({service.duration}min)
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full"
            >
              {submitting ? 'Booking...' : 'Book Service'}
            </button>
          </form>
          
          {message && (
            <div className={`mt-4 p-4 rounded-md ${
              message.includes('success') 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}