import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AppContext = createContext();

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  bookings: []
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  SET_BOOKINGS: 'SET_BOOKINGS',
  UPDATE_BOOKING: 'UPDATE_BOOKING'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case actionTypes.SET_USER:
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        loading: false,
        error: null
      };
    case actionTypes.LOGOUT:
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false,
        bookings: [],
        loading: false,
        error: null
      };
    case actionTypes.SET_BOOKINGS:
      return { ...state, bookings: action.payload };
    case actionTypes.UPDATE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id ? action.payload : booking
        )
      };
    default:
      return state;
  }
}

// AppProvider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = window.location.origin;
  }, []);

  // Actions
  const actions = {
    setLoading: (loading) => dispatch({ type: actionTypes.SET_LOADING, payload: loading }),
    
    setError: (error) => dispatch({ type: actionTypes.SET_ERROR, payload: error }),
    
    login: async (email, password) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        const response = await axios.post('/api/admin/login', { email, password });
        dispatch({ type: actionTypes.SET_USER, payload: response.data.user });
        return { success: true, data: response.data };
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Login failed';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        return { success: false, error: errorMessage };
      }
    },
    
    logout: async () => {
      try {
        await axios.post('/api/logout');
        dispatch({ type: actionTypes.LOGOUT });
      } catch (error) {
        console.error('Logout error:', error);
        // Still logout locally even if server request fails
        dispatch({ type: actionTypes.LOGOUT });
      }
    },
    
    loadBookings: async () => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        const response = await axios.get('/api/admin/bookings');
        dispatch({ type: actionTypes.SET_BOOKINGS, payload: response.data });
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Failed to load bookings';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        return [];
      }
    },
    
    updateBookingStatus: async (bookingId, status) => {
      try {
        const response = await axios.put(`/api/admin/bookings/${bookingId}`, { status });
        dispatch({ type: actionTypes.UPDATE_BOOKING, payload: response.data.booking });
        return { success: true, data: response.data };
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Failed to update booking';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        return { success: false, error: errorMessage };
      }
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the app context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export default AppContext;