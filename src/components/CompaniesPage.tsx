import React, { useState } from 'react';
import { Building2, Users, Shield, TrendingDown, Car, Sparkles, Check, ArrowRight } from 'lucide-react';
import CorporateContactForm from './CorporateContactForm';

interface CompaniesPageProps {
  onBack: () => void;
}
const CompaniesPage: React.FC<CompaniesPageProps> = ({ onBack }) => {
  const [showContactForm, setShowContactForm] = useState(false);
  
  const benefits = [
    'Significant discounts on all AutoPerks services',
    'Exclusive deals on our premium car inventory',
    'Priority booking for all services',
    'Dedicated account management',
    'Monthly usage reports and analytics',
    'Fully customized app with your company branding',
    'Employee self-service portal',
    'Flexible payment options'
  ];

  const plans = [
    {
      name: 'Startup',
      employees: '1-50',
      price: '€299',
      features: ['15% discount on all services', 'Basic branding customization', 'Monthly reporting', 'Email support']
    },
    {
      name: 'Business',
      employees: '51-200',
      price: '€599',
      features: ['20% discount on all services', 'Full branding customization', 'Weekly reporting', 'Priority support', 'Dedicated account manager'],
      popular: true
    },
    {
      name: 'Enterprise',
      employees: '200+',
      price: 'Custom',
      features: ['25%+ discount on all services', 'Complete white-label solution', 'Real-time analytics', '24/7 support', 'On-site services available']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Services
          </button>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              AutoPerks for Companies
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Offer your employees premium automotive services as a registered benefit. 
              Boost satisfaction and retention with exclusive discounts and a fully branded experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Users className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Employee Satisfaction</h3>
              <p className="text-slate-600">Provide valuable perks that save your team time and money on essential car services.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <TrendingDown className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Significant Savings</h3>
              <p className="text-slate-600">Exclusive corporate discounts on all services plus special deals on vehicle purchases.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Shield className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trusted Quality</h3>
              <p className="text-slate-600">All services provided by qualified supply agents with guaranteed satisfaction.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Your Own Branded App</h2>
                <p className="text-blue-100 mb-6">
                  Get a fully customized AutoPerks app with your company branding. 
                  Your employees will access exclusive discounts through an app that 
                  represents your company's commitment to their wellbeing.
                </p>
                <div className="flex items-center space-x-4">
                  <Sparkles className="w-6 h-6" />
                  <span className="font-medium">White-label solution available</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">What's Included:</h3>
                <ul className="space-y-3">
                  {benefits.slice(0, 5).map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`relative bg-white rounded-xl shadow-lg p-6 ${
                    plan.popular ? 'ring-2 ring-blue-600' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-4">{plan.employees} employees</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-slate-600">/month</span>}
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => setShowContactForm(true)}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.popular 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-100 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <Car className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Special Vehicle Purchase Program</h2>
              <p className="text-slate-600 mb-6">
                As part of our corporate partnership, your employees gain access to exclusive 
                discounts on our premium vehicle inventory. We maintain a selection of quality 
                pre-owned and new vehicles available at special corporate rates.
              </p>
              <button 
                onClick={() => setShowContactForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="my-8">
            <CorporateContactForm onClose={() => setShowContactForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;