import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { Clock, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useApp } from '../contexts/AppContext';

interface SuggestedTimesProps {
  selectedDate: Date;
  selectedService: any;
  onSelectTime: (date: Date, time: string, technicianId: string) => void;
}

export function SuggestedTimes({ selectedDate, selectedService, onSelectTime }: SuggestedTimesProps) {
  const { technicians, bookings, blockedTimes } = useApp();

  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const isTimeSlotAvailable = (date: Date, time: string, techId: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const tech = technicians.find(t => t.id === techId);
    
    // Check if technician is unavailable on this date
    if (tech?.availability[dateStr]?.available === false) {
      return false;
    }
    
    // Parse time to get end time based on service duration
    const [hours, minutes] = time.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + selectedService.duration;
    const endHour = Math.floor(endMinutes / 60);
    const endMinute = endMinutes % 60;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
    // Check for existing bookings that overlap
    const hasConflict = bookings.some(b => {
      if (b.technicianId !== techId || b.date !== dateStr || b.status === 'cancelled') {
        return false;
      }
      
      const [bHours, bMinutes] = b.time.split(':').map(Number);
      const bookingStart = bHours * 60 + bMinutes;
      const bookingEnd = bookingStart + b.duration;
      
      // Check for overlap
      return (startMinutes < bookingEnd && endMinutes > bookingStart);
    });
    
    if (hasConflict) return false;
    
    // Check for blocked times that overlap
    const isBlocked = blockedTimes.some(block => {
      if (block.technicianId !== techId || block.date !== dateStr) {
        return false;
      }
      
      const [blockStartH, blockStartM] = block.startTime.split(':').map(Number);
      const [blockEndH, blockEndM] = block.endTime.split(':').map(Number);
      const blockStart = blockStartH * 60 + blockStartM;
      const blockEnd = blockEndH * 60 + blockEndM;
      
      // Check for overlap
      return (startMinutes < blockEnd && endMinutes > blockStart);
    });
    
    return !isBlocked;
  };

  // Find available slots for the next 7 days
  const suggestions: Array<{ date: Date; time: string; technicianId: string; technicianName: string }> = [];
  
  for (let dayOffset = 0; dayOffset < 7 && suggestions.length < 5; dayOffset++) {
    const checkDate = addDays(selectedDate, dayOffset);
    
    for (const time of timeSlots) {
      if (suggestions.length >= 5) break;
      
      // Skip past times for today
      if (isSameDay(checkDate, new Date())) {
        const [hours, minutes] = time.split(':').map(Number);
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);
        if (slotTime <= new Date()) continue;
      }
      
      for (const tech of technicians) {
        if (isTimeSlotAvailable(checkDate, time, tech.id)) {
          suggestions.push({
            date: checkDate,
            time,
            technicianId: tech.id,
            technicianName: tech.name
          });
          break; // Only one technician per time slot
        }
      }
    }
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 mt-4">
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Suggested Available Times
      </h3>
      <div className="space-y-2">
        {suggestions.map((slot, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start text-left"
            onClick={() => onSelectTime(slot.date, slot.time, slot.technicianId)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            <div className="flex-1">
              <div className="font-medium">
                {format(slot.date, 'EEEE, MMM d')} at {slot.time}
              </div>
              <div className="text-sm text-muted-foreground">
                with {slot.technicianName}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
}

export default SuggestedTimes;