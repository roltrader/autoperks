import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, User, Wrench, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const TechnicianScheduleGrid = () => {
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedTechnicians, setSelectedTechnicians] = useState([]);
  const [blockReason, setBlockReason] = useState('');
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const technicianColors = {
    1: 'bg-blue-100 border-blue-300 text-blue-800',
    2: 'bg-green-100 border-green-300 text-green-800', 
    3: 'bg-purple-100 border-purple-300 text-purple-800',
    4: 'bg-orange-100 border-orange-300 text-orange-800'
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, slotsRes, employeesRes] = await Promise.all([
        supabase.functions.invoke('get-bookings'),
        supabase.functions.invoke('manage-slots'),
        supabase.from('employees').select('*').order('id')
      ]);

      if (bookingsRes.data) setBookings(bookingsRes.data.bookings || []);
      if (slotsRes.data) setSlots(slotsRes.data.slots || []);
      if (employeesRes.data) setEmployees(employeesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const getSlotStatus = (time, technicianId) => {
    const booking = bookings.find(b => 
      b.booking_date === selectedDate && 
      b.booking_time === time && 
      b.technician_id === technicianId
    );
    
    if (booking) return { type: 'booking', data: booking };
    
    const blockedSlot = slots.find(s => 
      s.date === selectedDate && 
      s.time_slot === time && 
      s.employee_id === technicianId && 
      !s.is_available
    );
    
    if (blockedSlot) return { type: 'blocked', data: blockedSlot };
    
    return { type: 'available', data: null };
  };

  const handleBlockTechnicians = async () => {
    if (!selectedSlot || selectedTechnicians.length === 0) return;
    
    setLoading(true);
    try {
      await supabase.functions.invoke('manage-slots', {
        body: {
          action: 'block_technicians',
          date: selectedDate,
          time_slot: selectedSlot,
          employee_ids: selectedTechnicians,
          blocked_reason: blockReason || 'Manually blocked'
        }
      });
      
      fetchData();
      setSelectedTechnicians([]);
      setBlockReason('');
    } catch (error) {
      console.error('Error blocking technicians:', error);
    }
    setLoading(false);
  };

  const handleUnblockTechnicians = async () => {
    if (!selectedSlot || selectedTechnicians.length === 0) return;
    
    setLoading(true);
    try {
      await supabase.functions.invoke('manage-slots', {
        body: {
          action: 'unblock_technicians',
          date: selectedDate,
          time_slot: selectedSlot,
          employee_ids: selectedTechnicians
        }
      });
      
      fetchData();
      setSelectedTechnicians([]);
    } catch (error) {
      console.error('Error unblocking technicians:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Technician Schedule</h2>
          <p className="text-gray-600">Manage bookings and availability</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-500" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      {/* Technician Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Technician Color Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {employees.map(tech => (
              <div key={tech.id} className={`p-3 rounded-lg border-2 ${technicianColors[tech.id] || 'bg-gray-100 border-gray-300 text-gray-800'}`}>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{tech.name}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Daily Schedule - {new Date(selectedDate).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-700">Time</th>
                  {employees.map(tech => (
                    <th key={tech.id} className="text-center p-3 font-semibold text-gray-700 min-w-[200px]">
                      {tech.name}
                    </th>
                  ))}
                  <th className="text-center p-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">{time}</td>
                    {employees.map(tech => {
                      const status = getSlotStatus(time, tech.id);
                      return (
                        <td key={tech.id} className="p-2">
                          {status.type === 'booking' ? (
                            <div className={`p-3 rounded-lg border-2 ${technicianColors[tech.id]} shadow-sm`}>
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-medium text-sm">{status.data.customer_name}</span>
                              </div>
                              <div className="text-xs opacity-80">{status.data.service_type}</div>
                              <Badge variant="secondary" className="mt-1 text-xs">
                                {status.data.urgency}
                              </Badge>
                            </div>
                          ) : status.type === 'blocked' ? (
                            <div className="p-3 rounded-lg border-2 border-red-300 bg-red-50 text-red-800">
                              <div className="flex items-center gap-2 mb-1">
                                <XCircle className="h-4 w-4" />
                                <span className="font-medium text-sm">Blocked</span>
                              </div>
                              <div className="text-xs opacity-80">{status.data.blocked_reason}</div>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                className="mt-2 w-full text-xs"
                                onClick={() => {
                                  setSelectedSlot(time);
                                  setSelectedTechnicians([tech.id]);
                                  handleUnblockTechnicians();
                                }}
                              >
                                Unblock
                              </Button>
                            </div>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <button 
                                  className="p-3 rounded-lg border-2 border-dashed border-green-400 bg-green-50 text-green-600 hover:bg-green-100 hover:border-green-500 transition-all cursor-pointer w-full"
                                >
                                  <div className="flex flex-col items-center justify-center">
                                    <span className="text-sm font-medium">Available</span>
                                    <span className="text-xs mt-1">Click to Block</span>
                                  </div>
                                </button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Block Time Slot</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm"><strong>Technician:</strong> {tech.name}</p>
                                    <p className="text-sm"><strong>Date:</strong> {selectedDate}</p>
                                    <p className="text-sm"><strong>Time:</strong> {time}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Reason for blocking:</label>
                                    <Input
                                      value={blockReason}
                                      onChange={(e) => setBlockReason(e.target.value)}
                                      placeholder="e.g., Lunch break, Training, Maintenance"
                                    />
                                  </div>
                                  <Button 
                                    onClick={() => {
                                      setSelectedSlot(time);
                                      setSelectedTechnicians([tech.id]);
                                      handleBlockTechnicians();
                                    }}
                                    className="w-full"
                                    disabled={loading}
                                  >
                                    Block This Slot
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedSlot(time)}
                          >
                            <Wrench className="h-4 w-4 mr-1" />
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage {time} Slot</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Select Technicians:</label>
                              <div className="space-y-2">
                                {employees.map(tech => (
                                  <div key={tech.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`tech-${tech.id}`}
                                      checked={selectedTechnicians.includes(tech.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedTechnicians([...selectedTechnicians, tech.id]);
                                        } else {
                                          setSelectedTechnicians(selectedTechnicians.filter(id => id !== tech.id));
                                        }
                                      }}
                                    />
                                    <label htmlFor={`tech-${tech.id}`} className="text-sm font-medium">
                                      {tech.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium mb-2 block">Block Reason:</label>
                              <Input
                                value={blockReason}
                                onChange={(e) => setBlockReason(e.target.value)}
                                placeholder="Enter reason for blocking..."
                              />
                            </div>
                            
                            <div className="flex gap-2">
                              <Button onClick={handleBlockTechnicians} disabled={loading}>
                                Block Selected
                              </Button>
                              <Button variant="outline" onClick={handleUnblockTechnicians} disabled={loading}>
                                Unblock Selected
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianScheduleGrid;