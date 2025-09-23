import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Employee {
  id: number;
  name: string;
  role: string;
  is_active: boolean;
}

interface ServiceType {
  id: number;
  name: string;
  duration_minutes: number;
  price: number;
}

interface Booking {
  id: string;
  customer_name: string;
  service_type: string;
  booking_date: string;
  booking_time: string;
  end_time?: string;
  service_duration: number;
  employee_id?: number;
  vehicle_details: {
    make?: string;
    model?: string;
    year?: string;
    license_plate?: string;
  };
  status: string;
  phone?: string;
  notes?: string;
}

interface TimeSlot {
  id: string;
  date: string;
  time_slot: string;
  is_available: boolean;
  employee_id?: number;
  blocked_reason?: string;
}

const EnhancedDiaryView: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [blockReason, setBlockReason] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

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
      // Fetch employees
      const { data: employeesData } = await supabase
        .from('employees')
        .select('*')
        .eq('is_active', true);
      
      // Fetch service types
      const { data: serviceTypesData } = await supabase
        .from('service_types')
        .select('*');

      // Fetch bookings and slots
      const [bookingsRes, slotsRes] = await Promise.all([
        supabase.functions.invoke('get-bookings'),
        supabase.functions.invoke('manage-slots')
      ]);
      
      setEmployees(employeesData || []);
      setServiceTypes(serviceTypesData || []);
      setBookings(bookingsRes.data?.bookings || []);
      setSlots(slotsRes.data?.slots || []);
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

  const getBookingsForSlot = (date: string, time: string, employeeId: number) => {
    return bookings.filter(booking => 
      booking.booking_date === date && 
      booking.booking_time === time &&
      booking.employee_id === employeeId
    );
  };

  const getServiceDuration = (serviceType: string) => {
    const service = serviceTypes.find(s => s.name === serviceType);
    return service?.duration_minutes || 30;
  };

  const blockTimeSlot = async (date: string, time: string, employeeId: number) => {
    if (!blockReason.trim()) return;
    
    try {
      await supabase.functions.invoke('manage-slots', {
        body: {
          action: 'block',
          date,
          time_slot: time,
          employee_id: employeeId,
          blocked_reason: blockReason,
          is_available: false
        }
      });
      setBlockReason('');
      fetchData();
    } catch (error) {
      console.error('Error blocking slot:', error);
    }
  };

  const unblockTimeSlot = async (date: string, time: string, employeeId: number) => {
    try {
      await supabase.functions.invoke('manage-slots', {
        body: {
          action: 'unblock',
          date,
          time_slot: time,
          employee_id: employeeId,
          is_available: true
        }
      });
      fetchData();
    } catch (error) {
      console.error('Error unblocking slot:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading enhanced diary...</div>;
  }

  const weekDates = getWeekDates();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Enhanced Service Diary</h3>
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

      {/* Employee Headers */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {employees.map(employee => (
          <Card key={employee.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h4 className="font-bold text-lg text-slate-800">{employee.name}</h4>
            <p className="text-sm text-slate-600">{employee.role}</p>
          </Card>
        ))}
      </div>

      {/* Diary Grid by Employee */}
      <div className="space-y-8">
        {employees.map(employee => (
          <div key={employee.id} className="border rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-4 text-slate-800 bg-slate-100 p-2 rounded">
              {employee.name} - {employee.role}
            </h4>
            
            <div className="overflow-x-auto">
              <div className="grid grid-cols-8 gap-1 min-w-[800px]">
                {/* Date Headers */}
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
                      const dayBookings = getBookingsForSlot(date, time, employee.id);
                      const slot = slots.find(s => 
                        s.date === date && 
                        s.time_slot === time && 
                        s.employee_id === employee.id
                      );
                      const isBlocked = slot && !slot.is_available && slot.blocked_reason;
                      
                      return (
                        <div 
                          key={`${date}-${time}-${employee.id}`}
                          className={`p-1 border min-h-[80px] transition-colors ${
                            dayBookings.length > 0
                              ? 'bg-blue-100 border-blue-300' 
                              : isBlocked
                                ? 'bg-red-100 border-red-300'
                                : 'bg-green-50 border-green-200 hover:bg-green-100'
                          }`}
                        >
                          {dayBookings.length > 0 ? (
                            <div className="space-y-1">
                              {dayBookings.map(booking => (
                                <div key={booking.id} className="text-xs bg-white p-1 rounded border">
                                  <div className="font-semibold text-blue-800">{booking.customer_name}</div>
                                  <div className="text-blue-600 font-medium">{booking.service_type}</div>
                                  <div className="text-xs text-blue-500">
                                    {getServiceDuration(booking.service_type)}min
                                  </div>
                                  {booking.vehicle_details?.license_plate && (
                                    <div className="text-xs text-slate-600">
                                      {booking.vehicle_details.license_plate}
                                    </div>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {booking.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          ) : isBlocked ? (
                            <div className="text-xs text-red-600 p-1">
                              <div className="font-semibold">BLOCKED</div>
                              <div>{slot.blocked_reason}</div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="mt-1 text-xs h-6"
                                onClick={() => unblockTimeSlot(date, time, employee.id)}
                              >
                                Unblock
                              </Button>
                            </div>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="text-xs text-green-600 text-center cursor-pointer h-full w-full flex items-center justify-center hover:bg-green-200 rounded transition-colors border-2 border-dashed border-green-400">
                                  <div className="text-center">
                                    <div className="font-semibold">AVAILABLE</div>
                                    <div>Click to Block</div>
                                  </div>
                                </button>
                              </DialogTrigger>

                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Block Time Slot</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <p><strong>Employee:</strong> {employee.name}</p>
                                    <p><strong>Date:</strong> {date}</p>
                                    <p><strong>Time:</strong> {time}</p>
                                  </div>
                                  <Textarea
                                    placeholder="Reason for blocking (e.g., Break, Training, Maintenance)"
                                    value={blockReason}
                                    onChange={(e) => setBlockReason(e.target.value)}
                                  />
                                  <Button 
                                    onClick={() => blockTimeSlot(date, time, employee.id)}
                                    className="w-full"
                                  >
                                    Block Time Slot
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h5 className="font-semibold mb-2">Legend</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span>Blocked</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">Status</Badge>
            <span>Booking Status</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDiaryView;