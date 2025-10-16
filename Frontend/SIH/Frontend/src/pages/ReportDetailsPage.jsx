import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { toast } from 'react-toastify';

export default function ReportDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updates, setUpdates] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateText, setUpdateText] = useState("");

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        setLoading(true);
        const [complaintRes, updatesRes] = await Promise.all([
          api.get(`/complaints/${id}`),
          api.get(`/complaints/${id}/updates`)
        ]);
        
        setComplaint(complaintRes.data);
        setUpdates(updatesRes.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to fetch complaint details.");
        toast.error("Failed to load complaint details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchComplaintDetails();
  }, [id]);

  const handleAddUpdate = async (e) => {
    e.preventDefault();
    if (!updateText.trim()) return;
    
    try {
      const res = await api.post(`/complaints/${id}/updateStatus`, {
        message: updateText,
        status: complaint.status // Keep same status or allow change if needed
      });
      
      setUpdates([...updates, res.data]);
      setUpdateText("");
      setShowUpdateForm(false);
      toast.success("Update added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add update");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800";
      case "RESOLVED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING": return "⏳";
      case "IN_PROGRESS": return "🔄";
      case "RESOLVED": return "✅";
      case "REJECTED": return "❌";
      default: return "📋";
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { status: "PENDING", label: "Pending", description: "Report received and under review" },
      { status: "IN_PROGRESS", label: "In Progress", description: "Authorities are working on it" },
      { status: "RESOLVED", label: "Resolved", description: "Issue has been resolved" },
    ];
    
    if (complaint.status === "REJECTED") {
      steps.push({ status: "REJECTED", label: "Rejected", description: "Report was not valid" });
    }
    
    return steps;
  };

  const getCurrentStepIndex = () => {
    const steps = getStatusSteps();
    return steps.findIndex(step => step.status === complaint.status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md">
            <svg className="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
            <button 
              onClick={() => navigate(-1)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg max-w-md">
            <svg className="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-medium">Complaint not found</p>
            <button 
              onClick={() => navigate("/my-reports")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              View My Reports
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();
  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{complaint.title}</h1>
          <p className="text-gray-600 mt-2">Report ID: #{complaint.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">{getStatusIcon(complaint.status)}</span>
                Report Status
              </h2>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  {statusSteps.map((step, index) => (
                    <div key={step.status} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index <= currentStepIndex 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-xs mt-1 text-gray-600">{step.label}</span>
                    </div>
                  ))}
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full">
                  <div 
                    className="absolute top-0 left-0 h-2 bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Status */}
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                {getStatusIcon(complaint.status)} Current Status: {complaint.status.replace('_', ' ')}
              </div>
              
              {complaint.status === "RESOLVED" && complaint.resolvedAt && (
                <p className="text-green-600 mt-3">
                  ✅ Resolved on {new Date(complaint.resolvedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Report Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="text-gray-900">{complaint.category?.replace('_', ' ') || 'Not specified'}</p>
                </div>
                
                {complaint.subcategory && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Subcategory</h3>
                    <p className="text-gray-900">{complaint.subcategory.replace('_', ' ')}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date Reported</h3>
                  <p className="text-gray-900">{new Date(complaint.createdAt).toLocaleString()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Reported By</h3>
                  <p className="text-gray-900">{complaint.filedBy || 'Anonymous'}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="text-gray-900 mt-2 whitespace-pre-wrap">{complaint.description}</p>
              </div>

              {complaint.image && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Attached Image</h3>
                  <img 
                    src={complaint.image} 
                    alt="Report evidence" 
                    className="rounded-lg max-w-full h-64 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Location Map */}
            {complaint.latitude && complaint.longitude && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <div className="h-64 w-full rounded-lg overflow-hidden">
                  <iframe
                    title="Complaint Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}&z=16&output=embed`}
                    allowFullScreen
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Coordinates: {complaint.latitude.toFixed(6)}, {complaint.longitude.toFixed(6)}
                </p>
              </div>
            )}

            {/* Updates Section */}
            {/* <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Updates & Progress</h2>
                <button
                  onClick={() => setShowUpdateForm(!showUpdateForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                >
                  {showUpdateForm ? 'Cancel' : 'Add Update'}
                </button>
              </div>

              {showUpdateForm && (
                <form onSubmit={handleAddUpdate} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <textarea
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                    placeholder="Add an update about this report..."
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                  >
                    Post Update
                  </button>
                </form>
              )}

              {updates.length > 0 ? (
                <div className="space-y-4">
                  {updates.map((update, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <p className="text-gray-900">{update.message}</p>
                        <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                          {new Date(update.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {update.status && (
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${getStatusColor(update.status)}`}>
                          Status: {update.status.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No updates yet. Check back later for progress.</p>
              )}
            </div> */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/report-issue"
                  className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  File New Report
                </Link>
                <Link
                  to="/my-reports"
                  className="block w-full border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                >
                  View All Reports
                </Link>
                <button
                  onClick={() => window.print()}
                  className="block w-full border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Print Report
                </button>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
              <p className="text-gray-600 text-sm mb-4">
                If you have questions about this report or need assistance, contact our support team.
              </p>
              <div className="space-y-2 text-sm">
                <p>📧 support@citizenconnect.com</p>
                <p>📞 +91-XXX-XXX-XXXX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}