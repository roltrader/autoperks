import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useApp } from '../contexts/AppContext';
import { Clock, Ban, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { BlockedTime } from '../contexts/AppContext';

const BlockTimeManager: React.FC = () => {
  const { technicians, blockedTimes, addBlockedTime, removeBlockedTime } = useApp();
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTechnician || !date || !startTime || !endTime || !reason) {
      alert('Please fill in all fields');
      return;
    }

    if (startTime >= endTime) {
      alert('End time must be after start time');
      return;
    }

    const newBlockedTime: BlockedTime = {
      id: `blocked-${Date.now()}`,
      technicianId: selectedTechnician,
      date: format(date, 'yyyy-MM-dd'),
      startTime,
      endTime,
      reason
    };

    addBlockedTime(newBlockedTime);
    
    // Reset form
    setSelectedTechnician('');
    setDate(new Date());
    setStartTime('');
    setEndTime('');
    setReason('');
    
    alert('Time blocked successfully');
  };

  // Generate time options in 30-minute intervals
  const timeOptions = [];
  for (let hour = 8; hour < 18; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, '0')}:00`);
    timeOptions.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5" />
            Block Time Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Technician</Label>
              <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map(tech => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>End Time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Reason</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Lunch break, Training, Personal time"
              />
            </div>

            <Button type="submit" className="w-full">
              <Ban className="h-4 w-4 mr-2" />
              Block Time Slot
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Display blocked times */}
      {blockedTimes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Blocked Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {blockedTimes.map(block => {
                const tech = technicians.find(t => t.id === block.technicianId);
                return (
                  <div key={block.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                    <div>
                      <div className="font-medium">{tech?.name}</div>
                      <div className="text-sm text-gray-600">
                        {block.date} | {block.startTime} - {block.endTime}
                      </div>
                      <div className="text-sm text-gray-500">{block.reason}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBlockedTime(block.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {blockedTimes.length === 0 && (
        <Alert>
          <AlertDescription>
            No blocked times scheduled. Use the form above to block time slots.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BlockTimeManager;