import React, { createContext, useContext, useState, ReactNode } from 'react';
import { format, addDays } from 'date-fns';

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  date: string;
  time: string;
  endTime: string;
  technicianId: string;
  technicianName?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  duration?: number;
  price?: number;
  addons?: any[];
  vehicleInfo?: {
    make: string;
    model: string;
    year: string;
    mileage: string;
  };
  createdAt: string;
}

export interface BlockedTime {
  id: string;
  technicianId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}

export interface Technician {
  id: string;
  name: string;
  isActive: boolean;
  specialties: string[];
  availability: Record<string, any>;
  color: string;
}

interface AppContextType {
  bookings: Booking[];
  technicians: Technician[];
  blockedTimes: BlockedTime[];
  selectedService: any;
  selectedAddons: any[];
  addBooking: (booking: any) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  addTechnician: (technician: Technician) => void;
  updateTechnician: (id: string, updates: Partial<Technician>) => void;
  removeTechnician: (id: string) => void;
  addBlockedTime: (blockedTime: BlockedTime) => void;
  removeBlockedTime: (id: string) => void;
  setSelectedService: (service: any) => void;
  setSelectedAddons: (addons: any[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log("✅ AppProvider mounted");

  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedAddons, setSelectedAddons] = useState<any[]>([]);
  
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'booking-1',
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      customerPhone: '555-0123',
      service: 'Full Valet',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      endTime: '13:00',
      technicianId: 'tech-1',
      status: 'confirmed',
      notes: 'BMW 3 Series, Black',
      createdAt: new Date().toISOString()
    },
    {
      id: 'booking-2',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@example.com',
      customerPhone: '555-0124',
      service: 'Mini Valet',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '14:00',
      endTime: '16:00',
      technicianId: 'tech-2',
      status: 'pending',
      notes: 'Tesla Model 3, White',
      createdAt: new Date().toISOString()
    },
    {
      id: 'booking-3',
      customerName: 'Mike Wilson',
      customerEmail: 'mike@example.com',
      customerPhone: '555-0125',
      service: 'Wash & Go',
      date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      time: '10:00',
      endTime: '11:00',
      technicianId: 'tech-1',
      status: 'confirmed',
      notes: 'Mercedes C-Class, Silver',
      createdAt: new Date().toISOString()
    },
    {
      id: 'booking-4',
      customerName: 'Emma Davis',
      customerEmail: 'emma@example.com',
      customerPhone: '555-0126',
      service: 'Full Valet',
      date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      time: '13:00',
      endTime: '17:00',
      technicianId: 'tech-2',
      status: 'confirmed',
      notes: 'Audi Q5, Blue',
      createdAt: new Date().toISOString()
    },
    {
      id: 'booking-5',
      customerName: 'Tom Brown',
      customerEmail: 'tom@example.com',
      customerPhone: '555-0127',
      service: 'Mini Valet',
      date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      time: '09:30',
      endTime: '11:30',
      technicianId: 'tech-3',
      status: 'completed',
      notes: 'VW Golf, Red',
      createdAt: new Date().toISOString()
    }
  ]);

  const [technicians, setTechnicians] = useState<Technician[]>([
    {
      id: 'tech-1',
      name: 'Alex Thompson',
      isActive: true,
      specialties: ['Full Valet', 'Mini Valet', 'Wash & Go'],
      availability: {},
      color: '#3B82F6'
    },
    {
      id: 'tech-2',
      name: 'Jamie Rodriguez',
      isActive: true,
      specialties: ['Full Valet', 'Mini Valet'],
      availability: {},
      color: '#10B981'
    },
    {
      id: 'tech-3',
      name: 'Sam Chen',
      isActive: true,
      specialties: ['Mini Valet', 'Wash & Go'],
      availability: {},
      color: '#F59E0B'
    }
  ]);
  // Start with empty blocked times to allow testing bookings
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const addTechnician = (technician: Technician) => {
    if (technicians.length >= 5) {
      alert('Maximum of 5 technicians allowed');
      return;
    }
    setTechnicians(prev => [...prev, technician]);
  };

  const updateTechnician = (id: string, updates: Partial<Technician>) => {
    setTechnicians(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const removeTechnician = (id: string) => {
    if (technicians.length <= 2) {
      alert('Minimum of 2 technicians required');
      return;
    }
    setTechnicians(prev => prev.filter(t => t.id !== id));
  };

  const addBlockedTime = (blockedTime: BlockedTime) => {
    setBlockedTimes(prev => [...prev, blockedTime]);
  };

  const removeBlockedTime = (id: string) => {
    setBlockedTimes(prev => prev.filter(b => b.id !== id));
  };

  return (
    <AppContext.Provider value={{
      bookings,
      technicians,
      blockedTimes,
      selectedService,
      selectedAddons,
      addBooking,
      updateBooking,
      addTechnician,
      updateTechnician,
      removeTechnician,
      addBlockedTime,
      removeBlockedTime,
      setSelectedService,
      setSelectedAddons
    }}>
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}