import React, { useState } from "react";

export default function GovernmentSchemaPage() {
  const [activeTab, setActiveTab] = useState("schemes");

  const schemes = [
    {
      id: 1,
      name: "Digital India Initiative",
      department: "Ministry of Electronics & IT",
      status: "Active",
      launchDate: "2015-07-01",
      beneficiaries: "All Citizens",
      description: "Transform India into a digitally empowered society and knowledge economy",
      eligibility: "Open to all Indian citizens and businesses",
      documents: ["Aadhaar Card", "Bank Account Details"],
      link: "#"
    },
    {
      id: 2,
      name: "PM Awas Yojana",
      department: "Ministry of Housing",
      status: "Active",
      launchDate: "2015-06-25",
      beneficiaries: "Economically Weaker Sections",
      description: "Provide affordable housing to urban poor by 2022",
      eligibility: "Family income below 3 LPA, No pucca house",
      documents: ["Income Certificate", "Aadhaar Card", "Bank Details"],
      link: "#"
    },
    {
      id: 3,
      name: "Ayushman Bharat",
      department: "Ministry of Health",
      status: "Active",
      launchDate: "2018-09-23",
      beneficiaries: "10.74 Crore Families",
      description: "World's largest government-funded healthcare program",
      eligibility: "Deprived rural families and identified occupational categories",
      documents: ["Aadhaar Card", "Income Certificate", "Ration Card"],
      link: "#"
    }
  ];

  const departments = [
    {
      id: 1,
      name: "Ministry of Finance",
      head: "Finance Minister",
      contact: "finmin@gov.in",
      phone: "011-23092834",
      schemes: 15
    },
    {
      id: 2,
      name: "Ministry of Education",
      head: "Education Minister",
      contact: "education@gov.in",
      phone: "011-23792475",
      schemes: 12
    },
    {
      id: 3,
      name: "Ministry of Health",
      head: "Health Minister",
      contact: "health@gov.in",
      phone: "011-23061489",
      schemes: 8
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Government Schemes & Information</h1>
          <p className="text-xl text-gray-600 mb-6">
            Comprehensive database of all government schemes, departments, and public information
          </p>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {["schemes", "departments", "documents", "circulars"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "schemes" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Government Schemes</h2>
              <div className="flex space-x-4">
                <input 
                  type="text" 
                  placeholder="Search schemes..." 
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Departments</option>
                  <option>Ministry of Finance</option>
                  <option>Ministry of Education</option>
                  <option>Ministry of Health</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6">
              {schemes.map(scheme => (
                <div key={scheme.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{scheme.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {scheme.department}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {scheme.status}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            Launched: {new Date(scheme.launchDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{scheme.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Eligibility Criteria</h4>
                        <p className="text-sm text-gray-600">{scheme.eligibility}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Target Beneficiaries</h4>
                        <p className="text-sm text-gray-600">{scheme.beneficiaries}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Required Documents</h4>
                        <div className="flex flex-wrap gap-2">
                          {scheme.documents.map((doc, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="mt-3 sm:mt-0 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "departments" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Government Departments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map(dept => (
                <div key={dept.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{dept.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Head: {dept.head}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {dept.contact}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {dept.phone}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{dept.schemes} schemes</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional tabs content can be added similarly */}

        {/* Information Footer */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Secure & Verified</h4>
              <p className="text-sm text-gray-600">All information is officially verified</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Updated Regularly</h4>
              <p className="text-sm text-gray-600">Information updated as per official notifications</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Easy Access</h4>
              <p className="text-sm text-gray-600">User-friendly interface for easy navigation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}