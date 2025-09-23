import React from 'react';

interface AdditionalServicesProps {
  onServiceSelect?: (service: any) => void;
}

const AdditionalServices: React.FC<AdditionalServicesProps> = ({ onServiceSelect }) => {
  const additionalServices = [
    {
      id: 'car-insurance',
      title: "Car Insurance Quotes",
      name: "Car Insurance Quotes",
      description: "Connect with trusted insurance providers for competitive quotes",
      price: 0,
      priceDisplay: "Free Quote",
      duration: 30,
      image: "https://d64gsuwffb70l.cloudfront.net/68d190bc5f836a08764308c8_1758564579136_7f96d7f8.webp",
      features: ["Multiple providers", "Competitive rates", "Fast processing", "Expert advice", "Online comparison"]
    },
    {
      id: 'car-finance',
      title: "Car Finance Calculator",
      name: "Car Finance Calculator",
      description: "Explore financing options for your next vehicle purchase",
      price: 0,
      priceDisplay: "Free Service",
      duration: 30,
      image: "https://d64gsuwffb70l.cloudfront.net/68d190bc5f836a08764308c8_1758564580995_35be9d41.webp",
      features: ["Loan calculator", "Multiple lenders", "Pre-approval", "Best rates", "Quick decisions"]
    }
  ];
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Additional Services</h2>
          <p className="text-xl text-gray-600">
            Complete automotive solutions beyond detailing and inspection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {additionalServices.map((service, index) => (
            <div key={index} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div 
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url('${service.image}')` }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-2xl font-bold text-blue-600 mb-4">{service.priceDisplay}</div>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => {
                    if (service.title === "Car Insurance Quotes") {
                      alert("Insurance quote feature coming soon!");
                    } else if (service.title === "Car Finance Calculator") {
                      alert("Finance calculator feature coming soon!");
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  {service.title === "Car Insurance Quotes" ? "Get Quote" : 
                   service.title === "Car Finance Calculator" ? "Calculate" : "Book Service"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Collection & Delivery Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-slate-700 mb-3">Convenient Pickup</h4>
              <p className="text-gray-600 mb-4">
                We'll collect your vehicle from your location and return it after service completion.
              </p>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600 flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Within 15km radius
                </li>
                <li className="text-sm text-gray-600 flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Same-day return
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-700 mb-3">Additional Charges</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Collection & Delivery (0-10km)</span>
                  <span className="font-semibold">€15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collection & Delivery (10-15km)</span>
                  <span className="font-semibold">€25</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdditionalServices;