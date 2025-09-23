import React from 'react';
import ServiceCard from './ServiceCard';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
}

interface ServicesGridProps {
  onServiceSelect: (service: Service) => void;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({ onServiceSelect }) => {
  const services: Service[] = [
    // First Row - Valet Services
    {
      id: 'full-valet',
      name: 'Full Valet',
      description: 'Complete interior and exterior detailing with premium products',
      price: 150,
      duration: 240,
      image: 'https://d64gsuwffb70l.cloudfront.net/68d190bc5f836a08764308c8_1758564574929_459c5211.webp'
    },
    {
      id: 'standard-valet',
      name: 'Standard Valet',
      description: 'Thorough cleaning for your vehicle inside and out',
      price: 60,
      duration: 120,
      image: 'https://d64gsuwffb70l.cloudfront.net/68d190bc5f836a08764308c8_1758564574929_459c5211.webp'
    },
    {
      id: 'wash-go',
      name: 'Wash & Go',
      description: 'Express exterior wash and dry service',
      price: 20,
      duration: 60,
      image: 'https://d64gsuwffb70l.cloudfront.net/68d190bc5f836a08764308c8_1758564574929_459c5211.webp'
    },
    // Second Row - Specialty Services
    {
      id: 'ceramic-coating',
      name: 'Ceramic Coating',
      description: 'Long-lasting paint protection with ceramic technology',
      price: 300,
      duration: 480,
      image: 'https://d64gsuwffb70l.cloudfront.net/68d190bc5f836a08764308c8_1758564574929_459c5211.webp'
    },
    {
      id: 'paint-correction',
      name: 'Paint Correction',
      description: 'Remove swirls and scratches for showroom finish',
      price: 200,
      duration: 360,
      image: 'https://d64gsuwffb70l.cloudfront.net/68d190bc5f836a08764308c8_1758564574929_459c5211.webp'
    },
    {
      id: 'interior-detail',
      name: 'Interior Detailing',
      description: 'Deep clean and condition all interior surfaces',
      price: 120,
      duration: 180,
      image: 'https://d64gsuwffb70l.cloudfront.net/68d190bc5f836a08764308c8_1758564574929_459c5211.webp'
    },
    // Third Row - Maintenance Services
    {
      id: 'pre-itv-testing',
      name: 'Pre ITV Testing',
      description: 'Comprehensive vehicle inspection before official ITV test',
      price: 60,
      duration: 90,
      image: 'https://d64gsuwffb70l.cloudfront.net/68d190bc5f836a08764308c8_1758564574929_459c5211.webp'
    },
    {
      id: 'standard-maintenance',
      name: 'Standard Maintenance',
      description: 'Complete vehicle servicing including oil, filters, plugs, and points',
      price: 85,
      duration: 120,
      image: 'https://d64gsuwffb70l.cloudfront.net/68d190bc5f836a08764308c8_1758564574929_459c5211.webp'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-gray-600">Choose from our range of professional car care services</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service}
              onSelect={() => onServiceSelect(service)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;