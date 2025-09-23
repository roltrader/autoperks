'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { auth } from '@/lib/auth'

// Create the App Context
const AppContext = createContext(undefined)

// Initial state
const initialState = {
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  services: [],
  bookings: [],
  technicians: []
}

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  SET_SESSION: 'SET_SESSION',
  LOGOUT: 'LOGOUT',
  SET_SERVICES: 'SET_SERVICES',
  SET_BOOKINGS: 'SET_BOOKINGS',
  SET_TECHNICIANS: 'SET_TECHNICIANS',
  ADD_BOOKING: 'ADD_BOOKING',
  UPDATE_BOOKING: 'UPDATE_BOOKING',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null }
    
    case ActionTypes.SET_USER:
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        loading: false,
        error: null
      }
    
    case ActionTypes.SET_SESSION:
      return {
        ...state,
        session: action.payload,
        user: action.payload?.user || null,
        isAuthenticated: !!action.payload?.user,
        loading: false
      }
    
    case ActionTypes.LOGOUT:
      return { 
        ...initialState,
        loading: false
      }
    
    case ActionTypes.SET_SERVICES:
      return { ...state, services: action.payload }
    
    case ActionTypes.SET_BOOKINGS:
      return { ...state, bookings: action.payload }
    
    case ActionTypes.SET_TECHNICIANS:
      return { ...state, technicians: action.payload }
    
    case ActionTypes.ADD_BOOKING:
      return { ...state, bookings: [...state.bookings, action.payload] }
    
    case ActionTypes.UPDATE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id ? action.payload : booking
        )
      }
    
    default:
      return state
  }
}

// AppProvider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    async function initializeAuth() {
      try {
        // Get initial session
        const { session, error } = await auth.getSession()
        
        if (mounted) {
          if (error) {
            console.error('Error getting session:', error)
            dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
          } else {
            dispatch({ type: ActionTypes.SET_SESSION, payload: session })
          }
        }
      } catch (error) {
        if (mounted) {
          console.error('Error initializing auth:', error)
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          console.log('Auth state changed:', event, session?.user?.email)
          dispatch({ type: ActionTypes.SET_SESSION, payload: session })
          
          if (event === 'SIGNED_OUT') {
            dispatch({ type: ActionTypes.LOGOUT })
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  // Actions
  const actions = {
    // Auth actions
    signIn: async (email, password) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true })
        dispatch({ type: ActionTypes.CLEAR_ERROR })
        
        const { data, error } = await auth.signIn(email, password)
        
        if (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
          return { success: false, error: error.message }
        }
        
        dispatch({ type: ActionTypes.SET_SESSION, payload: data.session })
        return { success: true, data }
      } catch (error) {
        const errorMessage = error.message || 'Sign in failed'
        dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage })
        return { success: false, error: errorMessage }
      }
    },

    signUp: async (email, password, userData = {}) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true })
        dispatch({ type: ActionTypes.CLEAR_ERROR })
        
        const { data, error } = await auth.signUp(email, password, userData)
        
        if (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
          return { success: false, error: error.message }
        }
        
        dispatch({ type: ActionTypes.SET_LOADING, payload: false })
        return { success: true, data }
      } catch (error) {
        const errorMessage = error.message || 'Sign up failed'
        dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage })
        return { success: false, error: errorMessage }
      }
    },

    signOut: async () => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true })
        const { error } = await auth.signOut()
        
        if (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
          return { success: false, error: error.message }
        }
        
        dispatch({ type: ActionTypes.LOGOUT })
        return { success: true }
      } catch (error) {
        const errorMessage = error.message || 'Sign out failed'
        dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage })
        return { success: false, error: errorMessage }
      }
    },

    // Data actions
    loadServices: async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('name')
        
        if (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
          return []
        }
        
        dispatch({ type: ActionTypes.SET_SERVICES, payload: data || [] })
        return data || []
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
        return []
      }
    },

    loadBookings: async () => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true })
        
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            service:services(*),
            user:users(*),
            technician:technicians(*)
          `)
          .order('created_at', { ascending: false })
        
        if (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
          return []
        }
        
        dispatch({ type: ActionTypes.SET_BOOKINGS, payload: data || [] })
        dispatch({ type: ActionTypes.SET_LOADING, payload: false })
        return data || []
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
        return []
      }
    },

    createBooking: async (bookingData) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true })
        
        const { data, error } = await supabase
          .from('bookings')
          .insert([{
            ...bookingData,
            user_id: state.user?.id,
            status: 'pending'
          }])
          .select()
          .single()
        
        if (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
          return { success: false, error: error.message }
        }
        
        dispatch({ type: ActionTypes.ADD_BOOKING, payload: data })
        dispatch({ type: ActionTypes.SET_LOADING, payload: false })
        return { success: true, data }
      } catch (error) {
        const errorMessage = error.message || 'Failed to create booking'
        dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage })
        return { success: false, error: errorMessage }
      }
    },

    updateBooking: async (bookingId, updates) => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .update(updates)
          .eq('id', bookingId)
          .select()
          .single()
        
        if (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
          return { success: false, error: error.message }
        }
        
        dispatch({ type: ActionTypes.UPDATE_BOOKING, payload: data })
        return { success: true, data }
      } catch (error) {
        const errorMessage = error.message || 'Failed to update booking'
        dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage })
        return { success: false, error: errorMessage }
      }
    },

    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR })
    }
  }

  const value = {
    ...state,
    ...actions
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use the app context
export function useApp() {
  const context = useContext(AppContext)
  
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider')
  }
  
  return context
}

export default AppContext