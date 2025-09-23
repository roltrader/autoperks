import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { Plus, Trash2, Edit2, Save, X, User, CalendarOff } from 'lucide-react';
import { format } from 'date-fns';

export function TechnicianManagement() {
  const { technicians, updateTechnician, addTechnician, removeTechnician } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [unavailableReason, setUnavailableReason] = useState('');
  
  const [newTech, setNewTech] = useState({
    name: '',
    email: '',
    phone: '',
    color: '#' + Math.floor(Math.random()*16777215).toString(16),
    specialties: [] as string[],
    availability: {}
  });

  const specialtyOptions = ['Basic Wash', 'Premium Detail', 'Full Valet', 'Ceramic Coating', 'Paint Correction', 'Interior Detail'];
  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#6366F1'];

  const handleEdit = (tech: any) => {
    setEditingId(tech.id);
    setEditData({...tech});
  };

  const handleSave = () => {
    if (editingId) {
      updateTechnician(editingId, editData);
      setEditingId(null);
    }
  };

  const handleAddTechnician = () => {
    if (!newTech.name || !newTech.email || !newTech.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (technicians.length >= 5) {
      alert('Maximum of 5 technicians allowed');
      return;
    }

    const techColor = colors[technicians.length] || '#' + Math.floor(Math.random()*16777215).toString(16);
    
    addTechnician({
      ...newTech,
      id: `tech-${Date.now()}`,
      color: techColor
    });

    setNewTech({
      name: '',
      email: '',
      phone: '',
      color: '#000000',
      specialties: [],
      availability: {}
    });
    setShowAddForm(false);
  };

  const toggleDateAvailability = (techId: string) => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const tech = technicians.find(t => t.id === techId);
    if (!tech) return;
    
    const currentAvailability = tech.availability[dateStr];
    const newAvailability = {
      ...tech.availability,
      [dateStr]: currentAvailability?.available === false 
        ? { available: true }
        : { available: false, reason: unavailableReason || 'Day off' }
    };
    
    updateTechnician(techId, { availability: newAvailability });
    setUnavailableReason('');
  };

  const isDateUnavailable = (techId: string, date: Date) => {
    const tech = technicians.find(t => t.id === techId);
    if (!tech) return false;
    const dateStr = format(date, 'yyyy-MM-dd');
    return tech.availability[dateStr]?.available === false;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Technicians ({technicians.length}/5)</h3>
        {technicians.length < 5 && (
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Technician
          </Button>
        )}
      </div>

      {technicians.length < 2 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">Minimum of 2 technicians required. Please add more technicians.</p>
        </div>
      )}

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Technician</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Name *</Label>
                <Input
                  value={newTech.name}
                  onChange={(e) => setNewTech({...newTech, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newTech.email}
                  onChange={(e) => setNewTech({...newTech, email: e.target.value})}
                  placeholder="john@autoperks.com"
                />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input
                  value={newTech.phone}
                  onChange={(e) => setNewTech({...newTech, phone: e.target.value})}
                  placeholder="555-0100"
                />
              </div>
            </div>
            
            <div>
              <Label>Specialties</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {specialtyOptions.map(spec => (
                  <label key={spec} className="flex items-center gap-2">
                    <Checkbox
                      checked={newTech.specialties.includes(spec)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewTech({...newTech, specialties: [...newTech.specialties, spec]});
                        } else {
                          setNewTech({...newTech, specialties: newTech.specialties.filter(s => s !== spec)});
                        }
                      }}
                    />
                    <span className="text-sm">{spec}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddTechnician}>Add Technician</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {technicians.map(tech => (
          <Card key={tech.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <User className="h-8 w-8 text-gray-400" />
                    <div 
                      className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
                      style={{ backgroundColor: tech.color }}
                    />
                  </div>
                  <div>
                    {editingId === tech.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                          className="w-48"
                        />
                        <Input
                          value={editData.email}
                          onChange={(e) => setEditData({...editData, email: e.target.value})}
                          className="w-48"
                          type="email"
                        />
                        <Input
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                          className="w-48"
                        />
                      </div>
                    ) : (
                      <>
                        <CardTitle>{tech.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{tech.email} • {tech.phone}</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {editingId === tech.id ? (
                    <>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(tech)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {technicians.length > 2 && (
                        <Button size="sm" variant="destructive" onClick={() => removeTechnician(tech.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium">Specialties: </span>
                  {editingId === tech.id ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {specialtyOptions.map(spec => (
                        <label key={spec} className="flex items-center gap-2">
                          <Checkbox
                            checked={editData.specialties?.includes(spec)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setEditData({...editData, specialties: [...(editData.specialties || []), spec]});
                              } else {
                                setEditData({...editData, specialties: editData.specialties?.filter((s: string) => s !== spec) || []});
                              }
                            }}
                          />
                          <span className="text-sm">{spec}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {tech.specialties?.join(', ') || 'None specified'}
                    </span>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarOff className="h-4 w-4" />
                    <span className="text-sm font-medium">Mark Unavailable Days</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                        modifiers={{
                          unavailable: (date) => isDateUnavailable(tech.id, date)
                        }}
                        modifiersStyles={{
                          unavailable: { backgroundColor: '#FEE2E2', color: '#991B1B' }
                        }}
                      />
                    </div>
                    <div className="space-y-3">
                      {selectedDate && (
                        <>
                          <div>
                            <Label>Reason for unavailability</Label>
                            <Input
                              value={unavailableReason}
                              onChange={(e) => setUnavailableReason(e.target.value)}
                              placeholder="e.g., Vacation, Training, Sick leave"
                            />
                          </div>
                          <Button 
                            onClick={() => toggleDateAvailability(tech.id)}
                            variant={isDateUnavailable(tech.id, selectedDate) ? "outline" : "destructive"}
                            className="w-full"
                          >
                            {isDateUnavailable(tech.id, selectedDate) 
                              ? `Mark Available on ${format(selectedDate, 'MMM d')}`
                              : `Mark Unavailable on ${format(selectedDate, 'MMM d')}`}
                          </Button>
                        </>
                      )}
                      
                      {Object.entries(tech.availability || {}).filter(([_, val]) => val.available === false).length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Unavailable Dates:</p>
                          {Object.entries(tech.availability || {})
                            .filter(([_, val]) => val.available === false)
                            .map(([date, val]) => (
                              <div key={date} className="text-sm text-muted-foreground">
                                {format(new Date(date + 'T00:00:00'), 'MMM d, yyyy')}: {val.reason}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default TechnicianManagement;