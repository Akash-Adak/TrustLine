import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fileComplaint } from "../services/api";
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";

export default function NewReportPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    latitude: null,
    longitude: null,
    image: null,
    category: "",
  });
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const categories = [
    { value: "", label: t("file.report.categoryPlaceholder") },
    { value: "CYBER_CRIME", label: t("file.report.categories.cyberCrime") },
    { value: "CIVIC_ISSUE", label: t("file.report.categories.civicIssue") },
    { value: "OTHER", label: t("file.report.categories.other") }
  ];

  const civicSubcategories = [
    { value: "", label: t("file.report.subcategoryPlaceholder") },
    { value: "POTHOLE", label: t("file.report.subcategories.pothole") },
    { value: "GARBAGE", label: t("file.report.subcategories.garbage") },
    { value: "STREET_LIGHT", label: t("file.report.subcategories.streetLight") },
    { value: "WATER_SUPPLY", label: t("file.report.subcategories.waterSupply") },
    { value: "ROAD_SAFETY", label: t("file.report.subcategories.roadSafety") }
  ];

  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      toast.info(t("file.report.voiceNotSupported"));
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = navigator.language || "en-US";

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      setFormData(prev => ({
        ...prev,
        description: prev.description + ' ' + transcript
      }));
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        toast.error(t("file.report.microphonePermission"));
      } else {
        toast.error(t("file.report.voiceError"));
      }
    };

    recognitionRef.current.onend = () => {
      if (isListening) {
        // If still supposed to be listening, restart
        recognitionRef.current.start();
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, t]);

  // Auto-fetch location
  useEffect(() => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }));
          setLocationLoading(false);
        },
        (err) => {
          console.error("⚠️ Could not fetch location:", err);
          setLocationLoading(false);
          toast.warning(t("file.report.locationWarning"));
        },
        { timeout: 10000 }
      );
    } else {
      setLocationLoading(false);
      toast.error(t("file.report.locationNotSupported"));
    }
  }, [t]);

  // Toggle voice recognition
  const toggleListening = () => {
    if (!speechSupported) {
      toast.error(t("file.report.voiceNotSupported"));
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info(t("file.report.voiceStopped"));
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.info(t("file.report.voiceStarted"));
      } catch (error) {
        console.error("Error starting voice recognition:", error);
        toast.error(t("file.report.voiceError"));
      }
    }
  };

  // Camera functions
  const startCamera = async () => {
    try {
      setCameraMode(true);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error(t("file.report.cameraError"));
      setCameraMode(false);
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], "report-photo.jpg", { type: "image/jpeg" });
      setFormData({ ...formData, image: file });
      
      // Create preview
      const previewUrl = URL.createObjectURL(blob);
      setImagePreview(previewUrl);
      
      stopCamera();
    }, "image/jpeg", 0.8);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setCameraMode(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(t("file.report.invalidFileType"));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("file.report.fileSizeError"));
        return;
      }
      
      setFormData({ ...formData, image: file });
      
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Stop listening if still active
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    
    setIsLoading(true);
    setMsg(t("file.report.analyzing"));

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);
      if (formData.category) data.append("category", formData.category);
      if (formData.image) data.append("image", formData.image);

      const res = await fileComplaint(data, true);

      toast.success(t("file.report.successMessage", { category: res.data.category }));
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        latitude: formData.latitude,
        longitude: formData.longitude,
        image: null,
        category: ""
      });
      
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || t("file.report.submitError");
      toast.error(errorMsg);
      setMsg("");
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup camera and URLs on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [imagePreview, isListening]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {t("file.report.title")}
            </h1>
            <p className="text-blue-100">
              {t("file.report.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            {msg && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400 animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M17 10a7 7 0 11-14 0 7 7 0 0114 0zm-7-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">{msg}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                {t("file.report.titleLabel")} *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={t("file.report.titlePlaceholder")}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Description with Voice Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  {t("file.report.descriptionLabel")} *
                </label>
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`flex items-center text-sm ${isListening ? 'text-red-600' : 'text-blue-600'} hover:underline`}
                  >
                    {isListening ? (
                      <>
                        <svg className="h-4 w-4 mr-1 animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {t("file.report.stopVoice")}
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                        </svg>
                        {t("file.report.startVoice")}
                      </>
                    )}
                  </button>
                )}
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder={t("file.report.descriptionPlaceholder")}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {isListening && (
                <div className="mt-1 flex items-center text-sm text-blue-600">
                  <svg className="h-4 w-4 mr-1 animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  {t("file.report.listening")}
                </div>
              )}
            </div>


            {/* Location */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <svg className="h-5 w-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{t("file.report.location")}</span>
              </div>
              
              {locationLoading ? (
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t("file.report.fetchingLocation")}
                </div>
              ) : formData.latitude && formData.longitude ? (
                <p className="text-sm text-gray-600">
                  📍 {t("file.report.locationDetected")}: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                </p>
              ) : (
                <p className="text-sm text-yellow-600">
                  ⚠️ {t("file.report.locationNotAvailable")}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("file.report.photoLabel")}
              </label>
              
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
                  >
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : cameraMode ? (
                <div className="space-y-4">
                  <video 
                    ref={videoRef} 
                    className="w-full h-64 object-cover rounded-lg border border-gray-300"
                    autoPlay
                    playsInline
                  />
                  <div className="flex space-x-3">
                    <button 
                      type="button" 
                      onClick={capturePhoto}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      {t("file.report.capturePhoto")}
                    </button>
                    <button 
                      type="button" 
                      onClick={stopCamera}
                      className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {t("common.cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg py-8 px-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      <span className="block mt-2 text-sm font-medium text-gray-600">{t("file.report.uploadFromDevice")}</span>
                      <span className="block text-xs text-gray-500">{t("file.report.fileRequirements")}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                    </div>
                  </label>
                  
                  <button 
                    type="button" 
                    onClick={startCamera}
                    className="flex-1 border-2 border-dashed border-gray-300 rounded-lg py-8 px-4 text-center hover:border-green-400 hover:bg-green-50 transition-colors"
                  >
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    <span className="block mt-2 text-sm font-medium text-gray-600">{t("file.report.takePhoto")}</span>
                    <span className="block text-xs text-gray-500">{t("file.report.useCamera")}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t("file.report.processing")}
                </>
              ) : (
                t("file.report.submitButton")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}