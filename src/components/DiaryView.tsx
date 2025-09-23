import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface TimeSlot {
  id: string;
  date: string;
  time_slot: string;
  is_available: boolean;
  service_types: string[];
}

interface Booking {
  id: string;
  customer_name: string;
  service_type: string;
  booking_date: string;
  booking_time: string;
  vehicle_details: {
    make?: string;
    model?: string;
    year?: string;
  };
  status: string;
}

const DiaryView: React.FC = () => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [newSlotTime, setNewSlotTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slotsRes, bookingsRes] = await Promise.all([
        supabase.functions.invoke('manage-slots'),
        supabase.functions.invoke('get-bookings')
      ]);
      
      setSlots(slotsRes.data?.slots || []);
      setBookings(bookingsRes.data?.bookings || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDates = () => {
    const dates = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + (selectedWeek * 7));
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getBookingForSlot = (date: string, time: string) => {
    return bookings.find(booking => 
      booking.booking_date === date && booking.booking_time === time
    );
  };

  const getSlot = (date: string, time: string) => {
    return slots.find(slot => slot.date === date && slot.time_slot === time);
  };

  const toggleSlot = async (date: string, time: string) => {
    const existingSlot = getSlot(date, time);
    const isAvailable = !existingSlot?.is_available;
    
    try {
      await supabase.functions.invoke('manage-slots', {
        body: {
          action: 'update',
          date,
          time_slot: time,
          is_available: isAvailable,
          service_types: ['Car Wash', 'Oil Change', 'Tire Service']
        }
      });
      fetchData();
    } catch (error) {
      console.error('Error updating slot:', error);
    }
  };

  const addCustomSlot = async () => {
    if (!newSlotTime || !selectedDate) return;
    
    try {
      await supabase.functions.invoke('manage-slots', {
        body: {
          action: 'update',
          date: selectedDate,
          time_slot: newSlotTime,
          is_available: true,
          service_types: ['Car Wash', 'Oil Change', 'Tire Service']
        }
      });
      setNewSlotTime('');
      setSelectedDate('');
      fetchData();
    } catch (error) {
      console.error('Error adding slot:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading diary...</div>;
  }

  const weekDates = getWeekDates();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Service Diary</h3>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setSelectedWeek(selectedWeek - 1)}
            variant="outline"
            size="sm"
          >
            ← Previous Week
          </Button>
          <Button 
            onClick={() => setSelectedWeek(selectedWeek + 1)}
            variant="outline"
            size="sm"
          >
            Next Week →
          </Button>
        </div>
      </div>

      {/* Add Custom Slot */}
      <Card className="p-4 mb-6">
        <h4 className="font-semibold mb-3">Add Custom Time Slot</h4>
        <div className="flex space-x-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
          />
          <Input
            type="time"
            value={newSlotTime}
            onChange={(e) => setNewSlotTime(e.target.value)}
            className="w-32"
          />
          <Button onClick={addCustomSlot} size="sm">
            Add Slot
          </Button>
        </div>
      </Card>

      {/* Diary Grid */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-8 gap-1 min-w-[800px]">
          {/* Header */}
          <div className="p-2 font-semibold text-center bg-gray-100">Time</div>
          {weekDates.map(date => (
            <div key={date} className="p-2 font-semibold text-center bg-gray-100">
              <div>{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className="text-xs">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            </div>
          ))}

          {/* Time Slots */}
          {timeSlots.map(time => (
            <React.Fragment key={time}>
              <div className="p-2 text-sm font-medium bg-gray-50 text-center border-r">
                {time}
              </div>
              {weekDates.map(date => {
                const booking = getBookingForSlot(date, time);
                const slot = getSlot(date, time);
                const isAvailable = slot?.is_available ?? false;
                
                return (
                  <div 
                    key={`${date}-${time}`}
                    className={`p-1 border min-h-[60px] cursor-pointer transition-colors ${
                      booking 
                        ? 'bg-blue-100 border-blue-300' 
                        : isAvailable 
                          ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => !booking && toggleSlot(date, time)}
                  >
                    {booking ? (
                      <div className="text-xs">
                        <div className="font-semibold text-blue-800">{booking.customer_name}</div>
                        <div className="text-blue-600 font-medium">{booking.service_type}</div>
                        {booking.vehicle_details && (
                          <div className="text-blue-500">
                            {booking.vehicle_details.make} {booking.vehicle_details.model}
                            {booking.vehicle_details.year && ` (${booking.vehicle_details.year})`}
                          </div>
                        )}
                      </div>
                    ) : isAvailable ? (
                      <div className="text-xs text-green-600 text-center">Available</div>
                    ) : (
                      <div className="text-xs text-gray-400 text-center">Closed</div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-200"></div>
            <span>Closed</span>
          </div>
        </div>
        <p className="mt-2">Click on available/closed slots to toggle availability</p>
      </div>
    </div>
  );
};

export default DiaryView;