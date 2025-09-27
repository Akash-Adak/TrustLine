import React from "react";
import { Link } from "react-router-dom";

export default function GovernmentServicesPage() {
  const services = [
    {
      id: 1,
      title: "File a Complaint",
      description: "Report issues related to public services, infrastructure, or government departments",
      icon: "📝",
      category: "Public Grievance",
      estimatedTime: "10-15 mins",
      popular: true,
      link: "/file-complaint"
    },
    {
      id: 2,
      title: "Apply for Certificate",
      description: "Apply for birth, death, marriage, and other essential certificates",
      icon: "📄",
      category: "Document Services",
      estimatedTime: "20-30 mins",
      popular: false,
      link: "/certificate-application"
    },
    {
      id: 3,
      title: "Property Registration",
      description: "Register your property transactions and land records",
      icon: "🏠",
      category: "Revenue Department",
      estimatedTime: "45-60 mins",
      popular: true,
      link: "/property-registration"
    },
    {
      id: 4,
      title: "Business License",
      description: "Apply for new business licenses and renew existing ones",
      icon: "💼",
      category: "Commerce & Industry",
      estimatedTime: "30-45 mins",
      popular: false,
      link: "/business-license"
    },
    {
      id: 5,
      title: "Utility Connections",
      description: "Apply for new water, electricity, and gas connections",
      icon: "⚡",
      category: "Public Utilities",
      estimatedTime: "15-25 mins",
      popular: true,
      link: "/utility-connections"
    },
    {
      id: 6,
      title: "Social Welfare Schemes",
      description: "Apply for various social security and welfare programs",
      icon: "👵",
      category: "Social Welfare",
      estimatedTime: "25-35 mins",
      popular: false,
      link: "/welfare-schemes"
    }
  ];

  const categories = [...new Set(services.map(service => service.category))];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Government Services Portal</h1>
            <p className="text-xl text-gray-600 mb-6">
              Access all government services in one place. Fast, secure, and citizen-friendly.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-800 font-medium">All services are available 24/7</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{services.length}+</div>
            <div className="text-gray-600">Services Available</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600">Service Availability</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-gray-600">Digital Process</div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Available Services</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition duration-200">
                All Services
              </button>
              {categories.map(category => (
                <button key={category} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition duration-200">
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{service.icon}</div>
                    {service.popular && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Popular
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {service.category}
                    </span>
                    <span className="text-sm text-gray-500">⏱️ {service.estimatedTime}</span>
                  </div>
                  
                  <Link 
                    to={service.link}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
                  >
                    Access Service
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-blue-800">Our support team is here to assist you with any service-related queries.</p>
            </div>
            <div className="flex space-x-4">
              <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition duration-200">
                Contact Support
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200">
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}