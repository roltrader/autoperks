import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { ChevronLeft, ChevronRight, Clock, User, Phone, Mail, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

export function CalendarView() {
  const { bookings, blockedTimes, technicians } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const getBookingsForSlot = (date: Date, time: string, technicianId: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(b => 
      b.date === dateStr && 
      b.time === time && 
      b.technicianId === technicianId
    );
  };

  const isBlocked = (date: Date, time: string, technicianId: string) => {
    const dateStr = date.toISOString().split('T')[0];
    const tech = technicians.find(t => t.id === technicianId);
    
    // Check if technician is unavailable for this date
    if (tech?.availability[dateStr]?.available === false) {
      return true;
    }
    
    // Check blocked times
    return blockedTimes.some(b => 
      b.technicianId === technicianId &&
      b.date === dateStr &&
      time >= b.startTime &&
      time < b.endTime
    );
  };

  const getBookingSpan = (duration: number) => {
    return Math.ceil(duration / 30);
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 border-green-300 text-green-900';
      case 'pending': return 'bg-yellow-100 border-yellow-300 text-yellow-900';
      case 'completed': return 'bg-blue-100 border-blue-300 text-blue-900';
      case 'cancelled': return 'bg-red-100 border-red-300 text-red-900';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Calendar View</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium px-4">
            {startOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - 
            {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-20 pt-12">
          <div className="space-y-0">
            {timeSlots.map(time => (
              <div key={time} className="h-12 flex items-center justify-end pr-2 text-sm text-muted-foreground">
                {time}
              </div>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1 h-[600px]">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map(day => (
              <div key={day.toISOString()} className="min-w-[200px]">
                <div className="text-center p-2 border-b">
                  <div className="font-medium">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="text-2xl">{day.getDate()}</div>
                </div>
                
                {technicians.map(tech => (
                  <div key={tech.id} className="border-l border-r">
                    <div 
                      className="px-2 py-1 text-xs font-medium text-white text-center"
                      style={{ backgroundColor: tech.color }}
                    >
                      {tech.name}
                    </div>
                    
                    <div className="relative">
                      {timeSlots.map((time, idx) => {
                        const slotBookings = getBookingsForSlot(day, time, tech.id);
                        const blocked = isBlocked(day, time, tech.id);
                        
                        return (
                          <div
                            key={`${tech.id}-${time}`}
                            className={`h-12 border-b border-gray-100 ${
                              blocked ? 'bg-gray-100 opacity-50' : 'hover:bg-gray-50'
                            }`}
                          >
                            {slotBookings.map(booking => (
                              <div
                                key={booking.id}
                                className={`absolute left-0 right-0 mx-1 p-1 rounded border cursor-pointer ${getStatusColor(booking.status)}`}
                                style={{
                                  top: `${idx * 48}px`,
                                  height: `${getBookingSpan(booking.duration) * 48 - 4}px`,
                                  zIndex: 10
                                }}
                                onClick={() => setSelectedBooking(booking)}
                              >
                                <div className="text-xs font-medium truncate">
                                  {booking.customerName}
                                </div>
                                <div className="text-xs truncate">
                                  {booking.serviceName}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(selectedBooking.status)}>
                  {selectedBooking.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ID: {selectedBooking.id}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedBooking.customerName}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedBooking.customerEmail}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedBooking.customerPhone}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(selectedBooking.date).toLocaleDateString()} at {selectedBooking.time}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">${selectedBooking.totalPrice}</span>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <p className="font-medium mb-1">Service</p>
                <p>{selectedBooking.serviceName}</p>
                {selectedBooking.additionalServices.length > 0 && (
                  <>
                    <p className="font-medium mt-2 mb-1">Additional Services</p>
                    <p>{selectedBooking.additionalServices.join(', ')}</p>
                  </>
                )}
              </div>
              
              {selectedBooking.notes && (
                <div className="border-t pt-3">
                  <p className="font-medium mb-1">Notes</p>
                  <p className="text-sm">{selectedBooking.notes}</p>
                </div>
              )}
              
              <div className="border-t pt-3">
                <p className="font-medium mb-1">Technician</p>
                <p>{selectedBooking.technicianName}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}