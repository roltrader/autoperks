import React, { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Ban } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useApp } from '../contexts/AppContext';
import { cn } from '../lib/utils';

export function EnhancedCalendarView() {
  const { technicians, bookings, blockedTimes } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'day' | 'week'>('day');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const daysToShow = viewType === 'day' ? [currentDate] : Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Generate time slots for every 30 minutes from 8:00 to 18:00
  const timeSlots: string[] = [];
  for (let hour = 8; hour < 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  const getBookingForSlot = (techId: string, date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const [slotHour, slotMinute] = time.split(':').map(Number);
    const slotMinutes = slotHour * 60 + slotMinute;
    
    return bookings.find(booking => {
      if (booking.technicianId !== techId || booking.date !== dateStr) return false;
      
      const [bookingHour, bookingMinute] = booking.time.split(':').map(Number);
      const bookingStart = bookingHour * 60 + bookingMinute;
      const bookingEnd = bookingStart + booking.duration;
      
      // Check if this slot falls within the booking time
      return slotMinutes >= bookingStart && slotMinutes < bookingEnd;
    });
  };

  const isSlotBlocked = (techId: string, date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const [slotHour, slotMinute] = time.split(':').map(Number);
    const slotMinutes = slotHour * 60 + slotMinute;
    
    return blockedTimes.some(block => {
      if (block.technicianId !== techId || block.date !== dateStr) return false;
      
      const [startHour, startMinute] = block.startTime.split(':').map(Number);
      const [endHour, endMinute] = block.endTime.split(':').map(Number);
      const blockStart = startHour * 60 + startMinute;
      const blockEnd = endHour * 60 + endMinute;
      
      // Check if this slot falls within the blocked time
      return slotMinutes >= blockStart && slotMinutes < blockEnd;
    });
  };

  const isFirstBookingSlot = (booking: any, time: string) => {
    return booking && booking.time === time;
  };

  const getBookingSpan = (booking: any) => {
    // Calculate how many 30-minute slots this booking spans
    return Math.ceil(booking.duration / 30);
  };

  const serviceColors: Record<string, string> = {
    'Basic Wash': 'bg-blue-500',
    'Premium Detail': 'bg-purple-500',
    'Full Valet': 'bg-green-500',
    'Express Clean': 'bg-yellow-500',
    'Ceramic Coating': 'bg-pink-500',
    'Interior Detail': 'bg-indigo-500'
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(prev => addDays(prev, viewType === 'day' ? -1 : -7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {viewType === 'day' 
              ? format(currentDate, 'EEEE, MMMM d, yyyy')
              : `Week of ${format(weekStart, 'MMM d, yyyy')}`}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(prev => addDays(prev, viewType === 'day' ? 1 : 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewType === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('day')}
          >
            Day View
          </Button>
          <Button
            variant={viewType === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('week')}
          >
            Week View
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid" style={{ gridTemplateColumns: `100px repeat(${technicians.length * daysToShow.length}, 1fr)` }}>
            {/* Header */}
            <div className="border-b border-r p-2 bg-gray-50 sticky left-0 z-10">
              <Clock className="h-4 w-4 mx-auto" />
            </div>
            {daysToShow.map(day => (
              <React.Fragment key={day.toISOString()}>
                {technicians.map(tech => (
                  <div 
                    key={`${day}-${tech.id}`} 
                    className="border-b border-r p-2 bg-gray-50 text-center"
                    style={{ minWidth: '150px' }}
                  >
                    <div className="font-medium text-sm flex items-center justify-center gap-1">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: tech.color }}
                      />
                      {tech.name}
                    </div>
                    {viewType === 'week' && (
                      <div className="text-xs text-gray-500">{format(day, 'EEE MMM d')}</div>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}

            {/* Time slots */}
            {timeSlots.map(time => (
              <React.Fragment key={time}>
                <div className="border-r border-b p-2 text-sm text-gray-600 bg-gray-50 sticky left-0 z-10">
                  {time}
                </div>
                {daysToShow.map(day => (
                  <React.Fragment key={`${day}-${time}`}>
                    {technicians.map(tech => {
                      const booking = getBookingForSlot(tech.id, day, time);
                      const isBlocked = isSlotBlocked(tech.id, day, time);
                      const isFirstSlot = isFirstBookingSlot(booking, time);
                      
                      return (
                        <div
                          key={`${day}-${time}-${tech.id}`}
                          className={cn(
                            "border-r border-b h-12 relative",
                            isBlocked && "bg-red-50",
                            booking && !isFirstSlot && "bg-opacity-20",
                            booking && `${serviceColors[booking.service] || 'bg-gray-500'} bg-opacity-10`
                          )}
                        >
                          {isBlocked && !booking && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Ban className="h-3 w-3 text-red-400" />
                            </div>
                          )}
                          {booking && isFirstSlot && (
                            <div
                              className={cn(
                                "absolute inset-x-1 top-1 rounded p-1 text-white text-xs overflow-hidden z-20",
                                serviceColors[booking.service] || 'bg-gray-500'
                              )}
                              style={{
                                height: `calc(${getBookingSpan(booking) * 3}rem - 0.5rem)`
                              }}
                            >
                              <div className="font-semibold truncate">{booking.customerName}</div>
                              <div className="truncate">{booking.service}</div>
                              <div>{booking.time} ({booking.duration}min)</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm">Basic Wash (1 hr)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm">Premium Detail (3 hrs)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">Full Valet (4 hrs)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm">Express Clean (30 min)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded flex items-center justify-center">
              <Ban className="h-3 w-3 text-red-400" />
            </div>
            <span className="text-sm">Blocked Time</span>
          </div>
        </div>
      </Card>
    </div>
  );
}