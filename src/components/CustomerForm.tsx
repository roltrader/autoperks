import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Mail, Phone, FileText, Plus, ArrowLeft, CheckCircle, Car } from 'lucide-react';
import { format, addMinutes, parse } from 'date-fns';

interface CustomerFormProps {
  bookingDetails: {
    date: string;
    time: string;
    technicianId: string;
    technicianName: string;
  };
  onConfirm: () => void;
  onBack: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ bookingDetails, onConfirm, onBack }) => {
  const { selectedService, selectedAddons, addBooking, setSelectedAddons } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    carMake: '',
    carModel: '',
    carYear: '',
    carMileage: ''
  });

  if (!selectedService || !bookingDetails) {
    return null;
  }
  // Define valet services for Standard Maintenance and Pre ITV Testing
  const valetServices = [
    { id: 'collection-delivery-10', name: 'Collection & Delivery (0-10km)', price: 15 },
    { id: 'collection-delivery-15', name: 'Collection & Delivery (10-15km)', price: 25 },
    { id: 'courtesy-car', name: 'Courtesy Car', price: 35 },
    { id: 'full-valet', name: 'Full Valet Service', price: 150 },
    { id: 'standard-valet', name: 'Standard Valet', price: 60 },
    { id: 'wash-and-go', name: 'Wash & Go', price: 20 }
  ];

  // Regular additional services for other service types
  const regularAdditionalServices = [
    { id: 'addon1', name: 'Interior Vacuum', price: 15 },
    { id: 'addon2', name: 'Tire Shine', price: 10 },
    { id: 'addon3', name: 'Air Freshener', price: 5 },
    { id: 'addon4', name: 'Engine Bay Cleaning', price: 30 }
  ];

  // Choose which additional services to show based on selected service
  const additionalServices = (selectedService?.id === 'standard-maintenance' || selectedService?.id === 'pre-itv-testing')
    ? valetServices 
    : regularAdditionalServices;

  const handleAddonToggle = (addon: any) => {
    const isSelected = selectedAddons.some(a => a.id === addon.id);
    if (isSelected) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const calculateTotal = () => {
    const servicePrice = selectedService.price;
    const addonsPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return servicePrice + addonsPrice;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const endTime = format(
      addMinutes(parse(bookingDetails.time, 'HH:mm', new Date()), selectedService.duration),
      'HH:mm'
    );
    
    const booking = {
      id: `booking-${Date.now()}`,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      service: selectedService.name,
      date: bookingDetails.date,
      time: bookingDetails.time,
      endTime: endTime,
      technicianId: bookingDetails.technicianId,
      technicianName: bookingDetails.technicianName,
      status: 'confirmed' as const,
      notes: formData.notes,
      duration: selectedService.duration,
      price: calculateTotal(),
      addons: selectedAddons,
      vehicleInfo: {
        make: formData.carMake,
        model: formData.carModel,
        year: formData.carYear,
        mileage: formData.carMileage
      },
      createdAt: new Date().toISOString()
    };
    
    addBooking(booking);
    setSelectedAddons([]);
    // Show success message
    alert(`Booking confirmed! We'll send a confirmation to ${formData.email}`);
    onConfirm();
  };

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="ghost" className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Calendar
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
              
              {/* Vehicle Details Section - REQUIRED for Standard Maintenance, optional for others */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border-2 border-blue-200">
                <Label className="flex items-center gap-2 text-lg font-semibold text-blue-700">
                  <Car className="h-5 w-5" />
                  Vehicle Information
                  {selectedService?.id === 'standard-maintenance' && (
                    <span className="text-sm text-red-500 ml-2">(Required for Standard Maintenance)</span>
                  )}
                </Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="carMake">
                      Make {selectedService?.id === 'standard-maintenance' ? '*' : '(Optional)'}
                    </Label>
                    <Input
                      id="carMake"
                      required={selectedService?.id === 'standard-maintenance'}
                      value={formData.carMake}
                      onChange={(e) => setFormData({...formData, carMake: e.target.value})}
                      placeholder="e.g., Toyota, Ford, BMW"
                      className="border-gray-300"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="carModel">
                      Model {selectedService?.id === 'standard-maintenance' ? '*' : '(Optional)'}
                    </Label>
                    <Input
                      id="carModel"
                      required={selectedService?.id === 'standard-maintenance'}
                      value={formData.carModel}
                      onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                      placeholder="e.g., Camry, Focus, 3 Series"
                      className="border-gray-300"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="carYear">
                      Year {selectedService?.id === 'standard-maintenance' ? '*' : '(Optional)'}
                    </Label>
                    <Select 
                      value={formData.carYear}
                      onValueChange={(value) => setFormData({...formData, carYear: value})}
                      required={selectedService?.id === 'standard-maintenance'}
                    >
                      <SelectTrigger id="carYear" className="border-gray-300">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="carMileage">
                      Current Mileage {selectedService?.id === 'standard-maintenance' ? '*' : '(Optional)'}
                    </Label>
                    <Input
                      id="carMileage"
                      type="number"
                      required={selectedService?.id === 'standard-maintenance'}
                      value={formData.carMileage}
                      onChange={(e) => setFormData({...formData, carMileage: e.target.value})}
                      placeholder="e.g., 45000"
                      className="border-gray-300"
                    />
                  </div>
                </div>
                
                {selectedService?.id === 'standard-maintenance' && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 mb-2">
                      <strong>Note:</strong> Vehicle information is required for Standard Maintenance service to ensure proper parts and fluids are used for your specific vehicle.
                    </p>
                    <p className="text-sm text-blue-700">
                      <strong>Service includes:</strong>
                    </p>
                    <ul className="text-sm text-blue-700 ml-4 mt-1">
                      <li>• Oil change</li>
                      <li>• Filter replacement</li>
                      <li>• Spark plugs</li>
                      <li>• Points adjustment</li>
                      <li>• Fluid top-up</li>
                    </ul>
                  </div>
                )}
              </div>
              
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Plus className="h-4 w-4" />
                  {(selectedService?.id === 'standard-maintenance' || selectedService?.id === 'pre-itv-testing') ? 'Valet Services' : 'Additional Services'}
                </Label>
                {(selectedService?.id === 'standard-maintenance' || selectedService?.id === 'pre-itv-testing') && (
                  <div className="mb-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-700">
                      <strong>Convenient Options:</strong> Add collection & delivery service or a courtesy car while your vehicle is being serviced. You can also add a professional valet service to have your car returned clean and fresh!
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  {additionalServices.map(addon => (
                    <div key={addon.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedAddons.some(a => a.id === addon.id)}
                          onCheckedChange={() => handleAddonToggle(addon)}
                        />
                        <span>{addon.name}</span>
                      </div>
                      <span className="font-medium text-blue-600">+€{addon.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Special Instructions (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any special requests or vehicle details..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Service:</span>
                <span>{selectedService.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Date:</span>
                <span>{format(new Date(bookingDetails.date + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Time:</span>
                <span>{bookingDetails.time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Duration:</span>
                <span>{selectedService.duration} minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Technician:</span>
                <span>{bookingDetails.technicianName}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>€{calculateTotal()}</span>
              </div>
            </div>
            
            <Button type="submit" className="w-full" size="lg">
              <CheckCircle className="h-5 w-5 mr-2" />
              Confirm Booking
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;