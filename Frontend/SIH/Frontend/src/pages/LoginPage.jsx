import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  registerUser,
  verifyOtp,
  loginUser,
  requestPasswordReset,
  resetPassword,
} from "../services/api";
import api from "../services/api";

// Google Icon
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.244 44 30.028 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

export default function LoginPage({ isOpen, onClose }) {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForget, setIsForget] = useState(false);
  const [forgetStep, setForgetStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    newPassword: "",
  });

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        email: "",
        password: "",
        otp: "",
        newPassword: "",
      });
      setError("");
      setShowOtp(false);
      setIsForget(false);
      setForgetStep(1);
      setIsLogin(true);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Register ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData.name, formData.email, formData.password);
      setShowOtp(true);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // --- Verify OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyOtp(formData.email, formData.otp);
      const token = res.data.token;
      localStorage.setItem("authToken", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      onClose();
      navigate("/");
      window.location.reload(); // Refresh to update auth state
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // --- Login ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(formData.email, formData.password);
      const token = res.data.token;
      localStorage.setItem("authToken", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      onClose();
      navigate("/");
      window.location.reload(); // Refresh to update auth state
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // --- Request password reset ---
  const handleRequestPasswordOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(formData.email);
      setForgetStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // --- Reset password ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(formData.email, formData.otp, formData.newPassword);
      setIsForget(false);
      setIsLogin(true);
      setFormData({ ...formData, otp: "", newPassword: "" });
      setError("Password reset successfully! Please login.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // --- Google login ---
  const handleGoogleLogin = () => {
    window.location.href = `http://${baseUrl}/oauth2/authorization/google`;
  };

  // === UI forms ===
  const renderRegisterForm = () => (
    <form onSubmit={showOtp ? handleVerifyOtp : handleRegister}>
      {!showOtp ? (
        <>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Register"}
          </button>
        </>
      ) : (
        <>
          <p className="text-center mb-4 text-gray-600">
            OTP sent to <strong>{formData.email}</strong>
          </p>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-gray-100 text-gray-600"
          />
          <input
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}
    </form>
  );

  const renderLoginForm = () => (
    <form onSubmit={handleLogin}>
      <input
        name="email"
        type="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );

  const renderForgetForm = () => (
    <form
      onSubmit={forgetStep === 1 ? handleRequestPasswordOtp : handleResetPassword}
    >
      <input
        name="email"
        type="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={forgetStep === 2}
      />
      {forgetStep === 2 && (
        <>
          <input
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            name="newPassword"
            type="password"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700 transition duration-200 disabled:opacity-50"
      >
        {loading
          ? forgetStep === 1
            ? "Sending OTP..."
            : "Resetting..."
          : forgetStep === 1
          ? "Send OTP"
          : "Reset Password"}
      </button>
    </form>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Blur Background */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {isForget
                ? "Reset Password"
                : isLogin
                ? "Welcome Back!"
                : "Create Account"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className={`p-3 rounded-lg mb-4 text-center ${
                error.includes("successfully") 
                  ? "bg-green-100 text-green-700 border border-green-200" 
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}>
                {error}
              </div>
            )}

            {isForget
              ? renderForgetForm()
              : isLogin
              ? renderLoginForm()
              : renderRegisterForm()}

            {/* Toggle Links */}
            <div className="text-center mt-4 space-y-2">
              {!isForget && (
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setShowOtp(false);
                    setError("");
                    setFormData({ ...formData, password: "", otp: "" });
                  }}
                  className="text-blue-600 hover:text-blue-800 transition duration-200 block text-sm font-medium"
                >
                  {isLogin
                    ? "Don't have an account? Register"
                    : "Already have an account? Login"}
                </button>
              )}

              {isLogin && !isForget && (
                <button
                  onClick={() => {
                    setIsForget(true);
                    setError("");
                    setShowOtp(false);
                    setForgetStep(1);
                    setFormData({ ...formData, password: "" });
                  }}
                  className="text-red-600 hover:text-red-800 transition duration-200 block text-sm font-medium"
                >
                  Forgot Password?
                </button>
              )}

              {isForget && (
                <button
                  onClick={() => {
                    setIsForget(false);
                    setError("");
                    setForgetStep(1);
                    setFormData({ ...formData, otp: "", newPassword: "" });
                  }}
                  className="text-blue-600 hover:text-blue-800 transition duration-200 block text-sm font-medium"
                >
                  Back to Login
                </button>
              )}
            </div>

            {/* Separator */}
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              <GoogleIcon /> Continue with Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
}