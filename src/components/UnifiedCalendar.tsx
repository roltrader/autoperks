import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Plus, Minus, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { format, addDays, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UnifiedCalendar: React.FC = () => {
  const { bookings, blockedTimes, technicians, addTechnician, removeTechnician, addBlockedTime, removeBlockedTime } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  // Generate time slots from 8:00 AM to 6:00 PM in 30-minute intervals
  const timeSlots = [];
  for (let hour = 8; hour < 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  // Calculate stats
  const stats = {
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    todayBookings: bookings.filter(b => isSameDay(new Date(b.date), currentDate)).length,
    availableTechs: technicians.filter(t => t.isActive).length
  };

  const getSlotStatus = (techId: string, date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Check if blocked
    const isBlocked = blockedTimes.some(bt => 
      bt.technicianId === techId && 
      bt.date === dateStr && 
      bt.startTime <= time && 
      bt.endTime > time
    );
    if (isBlocked) return 'blocked';

    // Check if booked
    const booking = bookings.find(b => 
      b.technicianId === techId && 
      b.date === dateStr && 
      b.time <= time && 
      b.endTime > time
    );
    if (booking) return booking;

    return 'available';
  };

  const getSlotColor = (status: any) => {
    if (status === 'blocked') return 'bg-gray-200 hover:bg-gray-300 cursor-pointer';
    if (status === 'available') return 'bg-green-50 hover:bg-green-100 cursor-pointer';
    if (typeof status === 'object') {
      switch (status.status) {
        case 'confirmed': return 'bg-blue-100 cursor-pointer';
        case 'pending': return 'bg-yellow-100 cursor-pointer';
        case 'completed': return 'bg-gray-100';
        case 'cancelled': return 'bg-red-50';
        default: return 'bg-gray-50';
      }
    }
    return 'bg-gray-50';
  };

  const handleSlotClick = (techId: string, date: Date, time: string, status: any) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setSelectedSlot({ techId, date: dateStr, time, status });
  };

  const handleStatusChange = (newStatus: string) => {
    if (!selectedSlot) return;
    
    const { techId, date, time } = selectedSlot;
    const endTime = time.split(':')[1] === '00' ? 
      `${time.split(':')[0]}:30` : 
      `${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`;

    // Remove any existing blocked time for this slot
    const existingBlocked = blockedTimes.find(bt => 
      bt.technicianId === techId && 
      bt.date === date && 
      bt.startTime === time
    );
    
    if (existingBlocked) {
      removeBlockedTime(existingBlocked.id);
    }

    // Add new status if not available
    if (newStatus === 'blocked') {
      const newBlockedTime = {
        id: `blocked-${Date.now()}`,
        technicianId: techId,
        date: date,
        startTime: time,
        endTime: endTime,
        reason: 'Blocked'
      };
      addBlockedTime(newBlockedTime);
    }
    
    setSelectedSlot(null);
  };
  
  const handleAddTechnician = () => {
    if (technicians.length < 5) {
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
      const newTech = {
        id: `tech-${Date.now()}`,
        name: `Technician ${technicians.length + 1}`,
        isActive: true,
        specialties: ['Full Valet', 'Mini Valet'],
        availability: {},
        color: colors[technicians.length] || '#6B7280'
      };
      addTechnician(newTech);
    }
  };

  const handleRemoveTechnician = () => {
    if (technicians.length > 2) {
      const lastTech = technicians[technicians.length - 1];
      removeTechnician(lastTech.id);
    }
  };

  // Test function to block all technicians for a specific time slot
  const blockAllTechniciansForTimeSlot = (time: string) => {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const endTime = time.split(':')[1] === '00' ? 
      `${time.split(':')[0]}:30` : 
      `${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`;
    
    technicians.forEach(tech => {
      const blockId = `blocked-${tech.id}-${Date.now()}`;
      addBlockedTime({
        id: blockId,
        technicianId: tech.id,
        date: dateStr,
        startTime: time,
        endTime: endTime,
        reason: 'Test Block - All Technicians'
      });
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Status Change Popover */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setSelectedSlot(null)}>
          <div className="bg-white rounded-lg p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-3">Change Slot Status</h3>
            <p className="text-sm text-gray-600 mb-4">
              {selectedSlot.time} - Technician {selectedSlot.techId.split('-')[1]}
            </p>
            <Select onValueChange={handleStatusChange} defaultValue={
              selectedSlot.status === 'blocked' ? 'blocked' :
              selectedSlot.status === 'available' ? 'available' : ''
            }>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end mt-4">
              <Button size="sm" variant="outline" onClick={() => setSelectedSlot(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.todayBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Technicians</p>
                <p className="text-2xl font-bold text-purple-600">{stats.availableTechs}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking Calendar - {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(addDays(currentDate, -1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(addDays(currentDate, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Technician Management */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Technicians ({technicians.length})</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddTechnician}
                disabled={technicians.length >= 5}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Technician
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRemoveTechnician}
                disabled={technicians.length <= 2}
              >
                <Minus className="h-4 w-4 mr-1" />
                Remove Technician
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid" style={{ gridTemplateColumns: `100px repeat(${technicians.length}, 1fr)` }}>
                <div className="p-2 font-medium text-sm text-gray-600 border-b-2">Time</div>
                {technicians.map(tech => (
                  <div key={tech.id} className="p-2 font-medium text-center border-b-2">
                    <div>{tech.name}</div>
                    <Badge variant={tech.isActive ? "default" : "secondary"} className="mt-1">
                      {tech.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {timeSlots.map(time => (
                <div key={time} className="grid" style={{ gridTemplateColumns: `100px repeat(${technicians.length}, 1fr)` }}>
                  <div className="p-2 text-sm font-medium text-gray-600 border-r border-b flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {time}
                  </div>
                  {technicians.map(tech => {
                    const status = getSlotStatus(tech.id, currentDate, time);
                    return (
                      <div
                        key={`${tech.id}-${time}`}
                        className={cn(
                          "p-2 border-b border-r text-xs",
                          getSlotColor(status)
                        )}
                        onClick={() => handleSlotClick(tech.id, currentDate, time, status)}
                      >
                        {status === 'blocked' && <span className="text-gray-500">Blocked</span>}
                        {status === 'available' && <span className="text-green-600">Available</span>}
                        {typeof status === 'object' && (
                          <div>
                            <div className="font-medium">{status.customerName}</div>
                            <div className="text-gray-600">{status.service}</div>
                            {status.vehicleInfo && (status.vehicleInfo.make || status.vehicleInfo.model) && (
                              <div className="text-gray-500 mt-1 border-t pt-1">
                                <div className="font-semibold text-xs">Vehicle Details:</div>
                                <div>
                                  {status.vehicleInfo.year} {status.vehicleInfo.make} {status.vehicleInfo.model}
                                </div>
                                {status.vehicleInfo.mileage && (
                                  <div>Mileage: {status.vehicleInfo.mileage} km</div>
                                )}
                              </div>
                            )}
                            <Badge variant="outline" className="mt-1 scale-75">
                              {status.status}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
              <span className="text-sm">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span className="text-sm">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
              <span className="text-sm">Blocked</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedCalendar;