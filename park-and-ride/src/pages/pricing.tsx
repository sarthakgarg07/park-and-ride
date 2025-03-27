import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { FiCheck, FiX, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import Link from 'next/link';

const PRICING_PLANS = [
  {
    name: 'Basic',
    description: 'For occasional commuters',
    monthlyPrice: '₹499',
    yearlyPrice: '₹4,999',
    savings: 'Save ₹989 yearly',
    features: [
      '5 parking reservations/month',
      '3 ride bookings/month',
      'Standard support',
      'Access to all parking locations'
    ]
  },
  {
    name: 'Commuter',
    description: 'For regular commuters',
    monthlyPrice: '₹999',
    yearlyPrice: '₹9,999',
    savings: 'Save ₹1,989 yearly',
    features: [
      'Unlimited parking reservations',
      '15 ride bookings/month',
      'Priority support',
      'Reserved parking spots',
      'Ride cancellation flexibility'
    ],
    popular: true
  },
  {
    name: 'Premium',
    description: 'For daily commuters & business',
    monthlyPrice: '₹1,999',
    yearlyPrice: '₹19,999',
    savings: 'Save ₹3,989 yearly',
    features: [
      'Unlimited parking & ride bookings',
      'Premium support 24/7',
      'Guaranteed parking spots',
      'Free EV charging',
      'Airport lounge access',
      'Corporate billing'
    ]
  }
];

const PARKING_RATES = [
  {
    location: 'Delhi Metro Stations',
    hourlyRate: '₹40',
    dailyRate: '₹250',
    monthlyPass: '₹3,500'
  },
  {
    location: 'Mumbai Central Locations',
    hourlyRate: '₹60',
    dailyRate: '₹400',
    monthlyPass: '₹5,500'
  },
  {
    location: 'Bangalore Tech Parks',
    hourlyRate: '₹50',
    dailyRate: '₹300',
    monthlyPass: '₹4,000'
  },
  {
    location: 'Chennai Central',
    hourlyRate: '₹30',
    dailyRate: '₹200',
    monthlyPass: '₹3,000'
  },
  {
    location: 'Kolkata CBD',
    hourlyRate: '₹35',
    dailyRate: '₹225',
    monthlyPass: '₹3,200'
  },
  {
    location: 'Hyderabad HITEC City',
    hourlyRate: '₹45',
    dailyRate: '₹275',
    monthlyPass: '₹3,800'
  }
];

const RIDE_RATES = [
  {
    type: 'Auto Rickshaw',
    baseFare: '₹30',
    perKm: '₹15',
    waitingCharge: '₹2/min'
  },
  {
    type: 'Hatchback Car',
    baseFare: '₹70',
    perKm: '₹20',
    waitingCharge: '₹3/min'
  },
  {
    type: 'Sedan',
    baseFare: '₹100',
    perKm: '₹22',
    waitingCharge: '₹3/min'
  },
  {
    type: 'SUV',
    baseFare: '₹150',
    perKm: '₹25',
    waitingCharge: '₹3.5/min'
  },
  {
    type: 'Electric Car',
    baseFare: '₹90',
    perKm: '₹18',
    waitingCharge: '₹2.5/min'
  }
];

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<'plans' | 'parking' | 'rides'>('plans');
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works for you, with clear pricing and no hidden fees.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-5 py-2.5 text-sm font-medium rounded-l-lg ${
                activeTab === 'plans'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('plans')}
            >
              Subscription Plans
            </button>
            <button
              type="button"
              className={`px-5 py-2.5 text-sm font-medium ${
                activeTab === 'parking'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('parking')}
            >
              Parking Rates
            </button>
            <button
              type="button"
              className={`px-5 py-2.5 text-sm font-medium rounded-r-lg ${
                activeTab === 'rides'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('rides')}
            >
              Ride Fares
            </button>
          </div>
        </div>

        {/* Subscription Plans Tab */}
        {activeTab === 'plans' && (
          <>
            {/* Billing cycle toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
                <div className="flex items-center">
                  <span className={`px-4 py-2 text-sm font-medium rounded-md ${
                    billingCycle === 'monthly' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                  }`}>
                    Monthly
                  </span>
                  <button
                    onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                    className="mx-2 text-primary-600"
                  >
                    {billingCycle === 'monthly' ? (
                      <FiToggleLeft className="h-6 w-6" />
                    ) : (
                      <FiToggleRight className="h-6 w-6" />
                    )}
                  </button>
                  <span className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                    billingCycle === 'yearly' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                  }`}>
                    Yearly
                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Save 20%
                    </span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Pricing cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PRICING_PLANS.map((plan, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
                    plan.popular ? 'border-primary-500 relative' : 'border-transparent'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                      <span className="text-gray-600">
                        {billingCycle === 'monthly' ? 'per month' : `per ${billingCycle === 'yearly' ? 'year' : 'month'}`}
                      </span>
                    </div>
                    
                    <Link
                      href={billingCycle === 'monthly' ? '/book-parking' : '/checkout'}
                      className={`block w-full text-center py-2 px-4 rounded-md font-medium ${
                        plan.popular
                          ? 'bg-primary-600 hover:bg-primary-700 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      {billingCycle === 'monthly' ? 'Get Started' : 'Subscribe Now'}
                    </Link>
                  </div>
                  
                  <div className="bg-gray-50 p-6">
                    <h4 className="font-medium text-gray-900 mb-4">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <FiCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Parking Rates Tab */}
        {activeTab === 'parking' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Parking Rates by Location</h2>
              <p className="text-gray-600 mb-6">
                Our parking rates vary by location. Subscribers receive discounts on these base rates.
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hourly Rate
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Daily Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {PARKING_RATES.map((rate, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {rate.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rate.hourlyRate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rate.dailyRate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Notes:</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li>Parking rates are subject to change based on availability and season.</li>
                  <li>Commuter plan subscribers receive a 15% discount on all rates.</li>
                  <li>Premium plan subscribers receive a 25% discount on all rates.</li>
                  <li>Special event rates may apply during major events.</li>
                  <li>Extended stay discounts available for bookings over 7 days.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Ride Fares Tab */}
        {activeTab === 'rides' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ride Fares by Service Type</h2>
              <p className="text-gray-600 mb-6">
                Our ride services are priced based on service type and distance. Subscribers receive discounts on these base rates.
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Base Fare
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Per Mile Rate
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Waiting Charge
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {RIDE_RATES.map((rate, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {rate.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rate.baseFare}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rate.perKm}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rate.waitingCharge}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Notes:</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li>All fares include taxes and standard fees.</li>
                  <li>Additional fees may apply during high-demand periods.</li>
                  <li>Commuter plan subscribers receive a 15% discount on all fares.</li>
                  <li>Premium plan subscribers receive a 25% discount on all fares.</li>
                  <li>Group discounts are available for parties of 3 or more.</li>
                  <li>Cancellation fees may apply for rides cancelled with less than 10 minutes notice.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Are there any hidden fees?</h3>
              <p className="text-gray-600">
                No, what you see is what you pay. We believe in transparent pricing with no surprises.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Can I cancel my subscription?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer prorated refunds for yearly subscriptions. Monthly subscriptions are non-refundable but can be cancelled anytime.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">How do ride credits work?</h3>
              <p className="text-gray-600">
                Ride credits are added to your account monthly and can be used to pay for rides. Unused credits roll over for up to 3 months.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of happy commuters who have switched to Park & Ride for a better commuting experience.
          </p>
          <Link href="/book-parking" className="btn-primary">
            Start Booking Now
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default PricingPage; 