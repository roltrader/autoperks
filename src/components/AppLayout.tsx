import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useIsMobile } from '../hooks/use-mobile';
import Header from './Header';
import Hero from './Hero';
import ServicesGrid from './ServicesGrid';
import BookingCalendar from './BookingCalendar';
import CustomerForm from './CustomerForm';
import AdditionalServices from './AdditionalServices';
import LocationInfo from './LocationInfo';
import Footer from './Footer';
import CompaniesPage from './CompaniesPage';

const AppLayout: React.FC = () => {
  const { selectedService, setSelectedService } = useApp();
  const isMobile = useIsMobile();
  const [showCompaniesPage, setShowCompaniesPage] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  if (showCompaniesPage) {
    return <CompaniesPage onBack={() => setShowCompaniesPage(false)} />;
  }

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setShowCustomerForm(false);
    // Scroll to booking calendar
    setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBookingComplete = (date: string, time: string, technicianId: string, technicianName: string) => {
    setBookingDetails({ date, time, technicianId, technicianName });
    setShowCustomerForm(true);
  };

  const handleBookingConfirm = () => {
    setShowCustomerForm(false);
    setSelectedService(null);
    setBookingDetails(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onCompaniesClick={() => setShowCompaniesPage(true)}
      />
      <main className="pt-16">
        <Hero />
        
        {!showCustomerForm ? (
          <>
            <div id="services">
              <ServicesGrid onServiceSelect={handleServiceSelect} />
            </div>
            
            {selectedService && (
              <div id="booking" className="py-12 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-8">
                    Book Your {selectedService.name}
                  </h2>
                  <BookingCalendar 
                    selectedService={selectedService}
                    onBookingComplete={handleBookingComplete}
                  />
                </div>
              </div>
            )}
            
            <AdditionalServices onServiceSelect={handleServiceSelect} />
            <div id="contact">
              <LocationInfo />
            </div>
          </>
        ) : (
          <div className="py-12 px-4 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto">
              <CustomerForm 
                bookingDetails={bookingDetails}
                onConfirm={handleBookingConfirm}
                onBack={() => setShowCustomerForm(false)}
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;