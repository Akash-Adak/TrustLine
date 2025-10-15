import axios from "axios";

// Create axios instance
const baseUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
});

// --- Auth Token Interceptor ---
// Automatically attach token to every request if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Token Helper ---
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
};

// --- Authentication Calls ---
export const registerUser = (name, email, password) =>
  api.post("/auth/register", { name, email, password });

export const verifyOtp = (email, otp) =>
  api.post("/auth/verify-otp", { email, otp });

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.data.token) {
    setAuthToken(response.data.token); // store token in localStorage
  }
  return response;
};

export const logoutUser = (email) => {
  setAuthToken(null); // clear token
  return api.post(`/auth/logout/${email}`);
};

// --- Complaint Calls ---
export const fileComplaint = (data, isMultipart = false) => {
  if (isMultipart) {
    return api.post("/complaints", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } else {
    return api.post("/complaints", data);
  }
};

export const getMyComplaints = () => api.get("/complaints/my");

export const getComplaintById = (id) => api.get(`/complaints/${id}`);

// --- Password Reset ---
export const requestPasswordReset = (email) =>
  api.post("/auth/forget-password", { email });

export const resetPassword = (email, otp, newPassword) =>
  api.post("/auth/reset-password", { email, otp, newPassword });

// --- User Profile ---
export const getUserProfile = () => api.get("/auth/profile").then(res => res.data);

export const updateUserProfile = (profileData) =>
  api.put("/auth/profile", profileData).then(res => res.data);

export default api;
