import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { format, addDays, parse, addMinutes } from 'date-fns';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import SuggestedTimes from './SuggestedTimes';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BookingCalendarProps {
  selectedService: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
  onBookingComplete: (date: string, time: string, technicianId: string, technicianName: string) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ selectedService, onBookingComplete }) => {
  const { bookings, blockedTimes, technicians } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  // Generate time slots from 8:00 AM to 6:00 PM in 30-minute intervals
  const timeSlots = [];
  for (let hour = 8; hour < 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  // Check if a specific slot is available for a technician
  const isSlotAvailable = (techId: string, date: Date, startTime: string, duration: number): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const endTime = format(addMinutes(parse(startTime, 'HH:mm', new Date()), duration), 'HH:mm');

    // Check blocked times
    const hasBlockedTime = blockedTimes.some(bt => 
      bt.technicianId === techId && 
      bt.date === dateStr && 
      ((bt.startTime <= startTime && bt.endTime > startTime) ||
       (bt.startTime < endTime && bt.endTime >= endTime) ||
       (bt.startTime >= startTime && bt.endTime <= endTime))
    );

    if (hasBlockedTime) return false;

    // Check existing bookings
    const hasBooking = bookings.some(b => 
      b.technicianId === techId && 
      b.date === dateStr && 
      b.status !== 'cancelled' &&
      ((b.time <= startTime && b.endTime > startTime) ||
       (b.time < endTime && b.endTime >= endTime) ||
       (b.time >= startTime && b.endTime <= endTime))
    );

    return !hasBooking;
  };

  // Get available slots for selected date
  useEffect(() => {
    if (!selectedDate) return;

    const duration = selectedService.duration;
    const slots: any[] = [];

    timeSlots.forEach(time => {
      const availableTechs = technicians.filter(tech => {
        if (!tech.isActive) return false;
        return isSlotAvailable(tech.id, selectedDate, time, duration);
      });

      if (availableTechs.length > 0) {
        slots.push({
          time,
          technicians: availableTechs,
          available: true
        });
      } else {
        slots.push({
          time,
          technicians: [],
          available: false
        });
      }
    });

    setAvailableSlots(slots);
    
    // Show suggestions if no slots available
    const hasAvailableSlots = slots.some(s => s.available);
    setShowSuggestions(!hasAvailableSlots);
  }, [selectedDate, selectedService, bookings, blockedTimes, technicians]);

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) return;
    
    const slot = availableSlots.find(s => s.time === time);
    if (slot && slot.available && slot.technicians.length > 0) {
      setSelectedTime(time);
      setSelectedTechnician(slot.technicians[0]);
    }
  };

  const handleBookNow = () => {
    if (selectedDate && selectedTime && selectedTechnician) {
      onBookingComplete(
        format(selectedDate, 'yyyy-MM-dd'),
        selectedTime,
        selectedTechnician.id,
        selectedTechnician.name
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Select Date & Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Selection */}
          <div>
            <h3 className="font-medium mb-3">Available Dates</h3>
            <div className="grid grid-cols-7 gap-2">
              {dates.map(date => (
                <Button
                  key={date.toISOString()}
                  variant={selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') ? 'default' : 'outline'}
                  className="p-2 h-auto flex flex-col"
                  onClick={() => setSelectedDate(date)}
                >
                  <span className="text-xs">{format(date, 'EEE')}</span>
                  <span className="text-lg font-bold">{format(date, 'd')}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Available Times for {format(selectedDate, 'EEEE, MMMM d')}
              </h3>
              
              {availableSlots.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Loading available times...
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {availableSlots.map(slot => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? 'default' : slot.available ? 'outline' : 'ghost'}
                      className={cn(
                        "relative",
                        !slot.available && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={!slot.available}
                      onClick={() => handleTimeSelect(slot.time)}
                    >
                      {slot.time}
                      {slot.available && slot.technicians.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {slot.technicians.length}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              )}

              {!availableSlots.some(s => s.available) && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No available times for this date. Please select another date or see suggestions below.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Show suggestions when no slots available */}
          {showSuggestions && selectedDate && (
            <SuggestedTimes 
              selectedDate={selectedDate}
              selectedService={selectedService.name}
              onSelectTime={(date, time, techId) => {
                const tech = technicians.find(t => t.id === techId);
                setSelectedDate(date);
                setSelectedTime(time);
                setSelectedTechnician(tech);
                setShowSuggestions(false);
              }}
            />
          )}

          {/* Selected Summary */}
          {selectedDate && selectedTime && selectedTechnician && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-4">
              <div>
                <h4 className="font-medium mb-2">Selected Appointment</h4>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time: {selectedTime}
                  </p>
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Technician: {selectedTechnician.name}
                  </p>
                  <p>Service: {selectedService.name}</p>
                  <p>Duration: {selectedService.duration} minutes</p>
                  <p className="font-semibold text-lg pt-2">Price: ${selectedService.price}</p>
                </div>
              </div>
              
              <Button 
                onClick={handleBookNow}
                className="w-full"
                size="lg"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Book Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCalendar;