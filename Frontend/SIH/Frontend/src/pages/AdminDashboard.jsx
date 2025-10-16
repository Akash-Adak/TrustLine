import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { fetchLocation } from "../contexts/fetchLocation";

export default function AdminDashboard() {
  const [category, setCategory] = useState("ALL");
  const [subcategory, setSubcategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ 
    total: 0, pending: 0, resolved: 0, rejected: 0,
    users: 0, activeToday: 0, avgResolutionTime: 0
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState("7d");
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [userActions, setUserActions] = useState({});
  const [location, setLocation] = useState(null);
  const categories = [
    { value: "ALL", label: "All Categories", icon: "📋" },
    { value: "CYBER_CRIME", label: "Cyber Crime", icon: "🔒" },
    { value: "CIVIC_ISSUE", label: "Civic Issue", icon: "🏛️" },
    { value: "OTHER", label: "Other", icon: "📄" },
    { value: "POTHOLES", label: "Potholes", icon: "🛣️" }
  ];

  const civicSubcategories = [
    { value: "", label: "All Civic Issues" },
    { value: "POTHOLE", label: "Pothole" },
    { value: "GARBAGE", label: "Garbage" },
    { value: "STREET_LIGHT", label: "Street Light" },
    { value: "WATER_SUPPLY", label: "Water Supply" },
    { value: "ROAD_SAFETY", label: "Road Safety" }
  ];

  const statusOptions = [
    { value: "ALL", label: "All Statuses" },
    { value: "PENDING", label: "Pending", icon: "⏳" },
    { value: "IN_PROGRESS", label: "In Progress", icon: "⚡" },
    { value: "RESOLVED", label: "Resolved", icon: "✅" },
    { value: "REJECTED", label: "Rejected", icon: "❌" }
  ];

  const timeRanges = [
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" }
  ];

  const navigationItems = [
    { id: "overview", label: "Dashboard Overview", icon: "🏠" },
    { id: "complaints", label: "Complaint Management", icon: "📋" },
    { id: "users", label: "User Management", icon: "👥" },
    { id: "analytics", label: "Analytics & Reports", icon: "📊" },
    { id: "departments", label: "Department Status", icon: "🏢" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "settings", label: "System Settings", icon: "⚙️" }
  ];

  // Mobile detection
  const isMobile = () => window.innerWidth < 768;

  useEffect(() => {
    const handleResize = () => {
      if (isMobile()) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log("Users state updated:", users);
  }, [users]);

  useEffect(() => {
    console.log("Complaints state updated:", complaints);
  }, [complaints]);

  const shouldShowComplaint = (complaint) => {
    if (!complaint) return false;
    if (category !== "ALL" && complaint.category !== category) return false;
    if (category === "CIVIC_ISSUE" && subcategory && complaint.subcategory !== subcategory) return false;
    if (statusFilter !== "ALL" && complaint.status !== statusFilter) return false;
    if (searchTerm && !complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !complaint.user?.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  };
async function testLocation(lat, lon) {
  const address = await fetchLocation(lat, lon);
  console.log("Address:", address);
}
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "ALL") params.append("category", category);
      if (category === "CIVIC_ISSUE" && subcategory) params.append("subcategory", subcategory);
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const url = params.toString() ? `/admin/complaints?${params.toString()}` : "/admin/complaints";
      const res = await api.get(url);
      
      if (res.data && Array.isArray(res.data)) {
        setComplaints(res.data);
        console.log("✅ Complaints fetched:", res.data.length);
      } else {
        console.error("❌ Invalid complaints data:", res.data);
        setComplaints([]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch complaints:", err);
      toast.error("Failed to fetch complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/complaints/stats");
      if (res.data && typeof res.data === 'object') {
        setStats(res.data);
      } else {
        console.error("❌ Invalid stats data:", res.data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch stats:", err);
      toast.error("Failed to fetch stats");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      if (res.data && Array.isArray(res.data)) {
        setUsers(res.data);
        console.log("✅ Users fetched:", res.data.length);
      } else {
        console.error("❌ Invalid users data:", res.data);
        setUsers([]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
      toast.error("Failed to fetch users");
      setUsers([]);
    }
  };

  const handleStatusChange = async (id, status, priority = null) => {
    try {
      const updateData = { status };
      if (priority) updateData.priority = priority;
      
      await api.put(`/admin/complaints/${id}/status`, updateData);
      toast.success(`✅ Status updated to ${status}`);
      
      fetchComplaints();
      fetchStats();
      addManualActivity(`Complaint #${id} status changed to ${status}`);
    } catch (err) {
      console.error("❌ Failed to update status:", err);
      toast.error("Failed to update status");
    }
  };




  const handleUserAction = async (userId, action) => {
    try {
      setUserActions(prev => ({ ...prev, [userId]: 'loading' }));
      await api.patch(`/admin/users/${userId}`, { action });
      toast.success(`User ${action} successfully`);
      fetchUsers();
      fetchStats();
      addManualActivity(`User ${action === 'activate' ? 'activated' : 'deactivated'}`);
    } catch (err) {
      console.error(`❌ Failed to ${action} user:`, err);
      toast.error(`Failed to ${action} user`);
    } finally {
      setUserActions(prev => ({ ...prev, [userId]: null }));
    }
  };

  const addManualActivity = (message) => {
    const activity = { 
      id: Date.now() + Math.random(), 
      type: "MANUAL_ACTION", 
      message, 
      timestamp: new Date()
    };
    setActivities(prev => [activity, ...prev.slice(0, 9)]);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING": return "bg-amber-50 text-amber-700 border border-amber-200 shadow-sm";
      case "IN_PROGRESS": return "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm";
      case "RESOLVED": return "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm";
      case "REJECTED": return "bg-red-50 text-red-700 border border-red-200 shadow-sm";
      default: return "bg-gray-50 text-gray-700 border border-gray-200 shadow-sm";
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case "CYBER_CRIME": return "text-purple-700 bg-purple-50 border border-purple-200";
      case "CIVIC_ISSUE": return "text-indigo-700 bg-indigo-50 border border-indigo-200";
      case "OTHER": return "text-gray-700 bg-gray-50 border border-gray-200";
      default: return "text-gray-700 bg-gray-50 border border-gray-200";
    }
  };

  const getUserRoleBadge = (role) => {
    switch (role) {
      case "ROLE_ADMIN": 
      case "ADMIN": return "bg-red-50 text-red-700 border border-red-200";
      case "ROLE_MODERATOR": 
      case "MODERATOR": return "bg-purple-50 text-purple-700 border border-purple-200";
      default: return "bg-blue-50 text-blue-700 border border-blue-200";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleString("en-US", { 
        year: "numeric", 
        month: "short", 
        day: "numeric", 
        hour: "2-digit", 
        minute: "2-digit" 
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const diffMs = new Date() - new Date(dateStr);
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch (error) {
      return "Invalid Date";
    }
  };

  const viewComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowComplaintModal(true);
    addManualActivity(`Viewed complaint #${complaint.id} details`);
  };

  const toggleSidebar = () => {
    if (isMobile()) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  // Activity Feed Component
  const ActivityFeed = () => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="p-4 md:p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">📊</span>
            Recent Activity
          </h3>
          <div className="flex items-center text-green-600 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6">
        <div className="space-y-3 max-h-60 md:max-h-80 overflow-y-auto">
          {activities.length === 0 ? (
            <div className="text-center text-gray-500 py-4 md:py-8">
              <div className="text-3xl md:text-4xl mb-2">📭</div>
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            activities.map(activity => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900 font-medium truncate">{activity.message}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {activity.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {activities.length > 0 && (
          <button 
            onClick={() => setActivities([])} 
            className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear All Activity
          </button>
        )}
      </div>
    </div>
  );

  // Quick Actions Component
  const QuickActions = () => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="p-4 md:p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="mr-2">⚡</span>
          Quick Actions
        </h3>
      </div>
      <div className="p-4 md:p-6 space-y-3">
        <button 
          onClick={() => addManualActivity("Report generation initiated")}
          className="w-full flex items-center justify-between p-3 md:p-4 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all group"
        >
          <div className="flex items-center">
            <span className="text-lg mr-3">📊</span>
            <div>
              <div className="font-medium text-gray-900">Generate Report</div>
              <div className="text-xs md:text-sm text-gray-500">Export system analytics</div>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-blue-500">→</span>
        </button>
        
        <button 
          onClick={() => addManualActivity("Announcement creation started")}
          className="w-full flex items-center justify-between p-3 md:p-4 text-left border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all group"
        >
          <div className="flex items-center">
            <span className="text-lg mr-3">📢</span>
            <div>
              <div className="font-medium text-gray-900">Send Announcement</div>
              <div className="text-xs md:text-sm text-gray-500">Notify all users</div>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-green-500">→</span>
        </button>
        
        <button 
          onClick={() => addManualActivity("Maintenance scheduling opened")}
          className="w-full flex items-center justify-between p-3 md:p-4 text-left border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all group"
        >
          <div className="flex items-center">
            <span className="text-lg mr-3">🔧</span>
            <div>
              <div className="font-medium text-gray-900">System Maintenance</div>
              <div className="text-xs md:text-sm text-gray-500">Schedule downtime</div>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-purple-500">→</span>
        </button>
      </div>
    </div>
  );

  // System Health Component
  const SystemHealth = () => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="p-4 md:p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="mr-2">💚</span>
          System Health
        </h3>
      </div>
      <div className="p-4 md:p-6 space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-2 md:mr-3"></div>
            <span className="text-sm font-medium text-gray-900">Database</span>
          </div>
          <span className="text-xs md:text-sm text-green-600 font-medium">Healthy</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-2 md:mr-3"></div>
            <span className="text-sm font-medium text-gray-900">API Services</span>
          </div>
          <span className="text-xs md:text-sm text-green-600 font-medium">Online</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full mr-2 md:mr-3"></div>
            <span className="text-sm font-medium text-gray-900">Storage</span>
          </div>
          <span className="text-xs md:text-sm text-yellow-600 font-medium">78% Used</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-2 md:mr-3"></div>
            <span className="text-sm font-medium text-gray-900">Notifications</span>
          </div>
          <span className="text-xs md:text-sm text-green-600 font-medium">Active</span>
        </div>
      </div>
    </div>
  );

  // Complaint Details Modal
  const ComplaintModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Complaint Details</h3>
            <button 
              onClick={() => setShowComplaintModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        
        {selectedComplaint && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Complaint ID</label>
                <p className="font-semibold">#{selectedComplaint.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(selectedComplaint.status)}`}>
                  {selectedComplaint.status}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="font-semibold">{selectedComplaint.category?.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Priority</label>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  selectedComplaint.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                  selectedComplaint.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {selectedComplaint.priority || 'LOW'}
                </span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Title</label>
              <p className="font-semibold text-lg mt-1">{selectedComplaint.title}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg">
                {selectedComplaint.description || "No description provided"}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">User Information</label>
              <div className="flex items-center space-x-3 mt-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {selectedComplaint.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{selectedComplaint.user?.filledBy || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{selectedComplaint.user?.email}</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              {["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"].map(status => (
                <button 
                  key={status}
                  onClick={() => {
                    handleStatusChange(selectedComplaint.id, status);
                    setShowComplaintModal(false);
                  }}
                  disabled={selectedComplaint.status === status}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    selectedComplaint.status === status 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : status === "RESOLVED" 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : status === "REJECTED" 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {status.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    console.log("🚀 AdminDashboard component mounted");
    fetchComplaints();
    fetchStats();
    fetchUsers();
    addManualActivity("Dashboard initialized and data loaded");

    return () => {
      console.log("🧹 Cleaning up AdminDashboard");
    };
  }, []);

  useEffect(() => { 
    console.log("🔍 Filters changed, fetching complaints...");
    fetchComplaints(); 
  }, [category, subcategory, statusFilter]);

  return (
      <div className="flex w-full h-full bg-slate-50 font-sans">
    

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-xl transition-all duration-300 z-40 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:z-auto
        ${sidebarCollapsed ? 'w-20' : 'w-72'}`}>
        
        <div className="p-4 md:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🏛️</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Gov Portal</h1>
                  <p className="text-sm text-gray-500">Admin Dashboard</p>
                </div>
              </div>
            )}
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-500">
                {mobileMenuOpen ? '✕' : sidebarCollapsed ? '→' : '←'}
              </span>
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile()) setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {(!sidebarCollapsed || mobileMenuOpen) && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      {/* Main Content - FIXED VERSION */}
     <div className="flex-1 flex flex-col w-full">

        <div className="p-4 md:p-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6 md:space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {[
                  { key:"total", label:"Total", icon:"📨", value: stats.total, color:"from-blue-500 to-blue-600", change: "+12%" },
                  { key:"pending", label:"Pending", icon:"⏳", value: stats.pending, color:"from-amber-500 to-orange-500", change: "+5%" },
                  { key:"resolved", label:"Resolved", icon:"✅", value: stats.resolved, color:"from-green-500 to-emerald-600", change: "+18%" },
                  { key:"users", label:"Users", icon:"👥", value: stats.users, color:"from-purple-500 to-indigo-600", change: "+8%" }
                ].map(({key, label, icon, value, color, change}) => (
                  <div key={key} className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-3 md:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-xs md:text-sm font-medium">{label}</p>
                          <div className="flex items-center space-x-1 md:space-x-2 mt-1 md:mt-2">
                            <p className="text-xl md:text-3xl font-bold text-gray-900">{value || 0}</p>
                            <span className="text-green-600 text-xs md:text-sm font-medium">{change}</span>
                          </div>
                        </div>
                        <div className={`w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r ${color} rounded-lg md:rounded-xl flex items-center justify-center`}>
                          <span className="text-white text-sm md:text-xl">{icon}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`h-1 bg-gradient-to-r ${color}`}></div>
                  </div>
                ))}
              </div>

              {/* Dashboard Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                <ActivityFeed />
                <QuickActions />
                <SystemHealth />
              </div>

              {/* Recent Complaints Preview */}
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200">
                <div className="p-4 md:p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Complaints</h3>
                    <button 
                      onClick={() => setActiveTab("complaints")}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View All →
                    </button>
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  {complaints.slice(0, 5).map(complaint => (
                    <div key={complaint.id} className="flex items-center justify-between py-3 md:py-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs md:text-sm font-bold text-gray-600">#{complaint.id}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate text-sm md:text-base">{complaint.title}</p>
                          <p className="text-xs md:text-sm text-gray-500 truncate">{complaint.user?.name} • {getTimeAgo(complaint.createdAt)}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(complaint.status)}`}>
                        {complaint.status.split('_')[0]}
                      </span>
                    </div>
                  ))}
      
                
                </div>
              </div>
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === "complaints" && (
            <div className="space-y-6">
              {/* Advanced Filters */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filter & Search</h3>
                  <button 
                    onClick={() => {
                      setCategory("ALL");
                      setSubcategory("");
                      setStatusFilter("ALL");
                      setSearchTerm("");
                      fetchComplaints();
                      addManualActivity("Filters cleared and data refreshed");
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select 
                      value={category} 
                      onChange={(e) => {
                        setCategory(e.target.value); 
                        if(e.target.value !== "CIVIC_ISSUE") setSubcategory("");
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.icon} {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {category === "CIVIC_ISSUE" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                      <select 
                        value={subcategory} 
                        onChange={(e) => setSubcategory(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {civicSubcategories.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select 
                      value={statusFilter} 
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.icon ? `${opt.icon} ${opt.label}` : opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">All Priorities</option>
                      <option value="HIGH">🔴 High Priority</option>
                      <option value="MEDIUM">🟡 Medium Priority</option>
                      <option value="LOW">🟢 Low Priority</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button 
                      onClick={() => {
                        fetchComplaints(); 
                        fetchStats();
                        addManualActivity("Complaints data refreshed with current filters");
                      }} 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all font-medium"
                    >
                      {loading ? "🔄 Loading..." : "🔍 Apply Filters"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Complaints Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Complaint Management</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Showing {complaints.filter(shouldShowComplaint).length} of {complaints.length} complaints
                      </span>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          📊
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          📥
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading complaints...</p>
                  </div>
                ) : complaints.filter(shouldShowComplaint).length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">📭</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No complaints found</h4>
                    <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {["ID", "Complaint Details", "Category", "User Info", "Timeline", "Status", "Priority", "Actions"].map(header => (
                            <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {complaints.filter(shouldShowComplaint).map(complaint => (
                          <tr key={complaint.id} className="hover:bg-blue-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <span className="text-sm font-bold text-blue-600">#{complaint.id}</span>
                                </div>
                              </div>
                            </td>
                            
                            <td className="px-6 py-4">
                              <div className="max-w-xs">
                                <p className="font-semibold text-gray-900 truncate">{complaint.title}</p>
                                                                <p className="text-sm text-gray-500 mt-1">
                                   {/* {testLocation(complaint.latitude, complaint.longitude)} */}
                                  </p>

                              </div>
                            </td>
                            
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(complaint.category)}`}>
                                {complaint.category?.replace('_', ' ') || "N/A"}
                              </span>
                              {complaint.subcategory && (
                                <div className="mt-1">
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {complaint.subcategory}
                                  </span>
                                </div>
                              )}
                            </td>
                            
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-xs font-bold">
                                    {complaint.user?.name?.charAt(0) || 'U'}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{complaint.user?.name || 'Unknown'}</p>
                                  <p className="text-sm text-gray-500">{complaint.user?.email || ''}</p>
                                </div>
                              </div>
                            </td>
                            
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{formatDate(complaint.createdAt)}</p>
                                <p className="text-xs text-gray-500">{getTimeAgo(complaint.createdAt)}</p>
                              </div>
                            </td>
                            
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(complaint.status)}`}>
                                {complaint.status || "N/A"}
                              </span>
                            </td>
                            
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                complaint.priority === 'HIGH' ? 'bg-red-100 text-red-700 border border-red-200' :
                                complaint.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                'bg-green-100 text-green-700 border border-green-200'
                              }`}>
                                {complaint.priority === 'HIGH' ? '🔴' : complaint.priority === 'MEDIUM' ? '🟡' : '🟢'}
                                {complaint.priority || 'LOW'}
                              </span>
                            </td>
                            
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                {["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"].map(status => (
                                  <button 
                                    key={status}
                                    onClick={() => {
                                      handleStatusChange(
                                                                              complaint.id, 
                                      status,
                                      status === "IN_PROGRESS" ? "HIGH" : null
                                    );
                                    addManualActivity(`Complaint #${complaint.id} status changed to ${status}`);
                                  }}
                                    disabled={complaint.status === status}
                                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                                      complaint.status === status 
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                        : status === "RESOLVED" 
                                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                          : status === "REJECTED" 
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    }`}
                                  >
                                    {status.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {users.length} total users • {users.filter(u => u.status === 'ACTIVE').length} active
                    </span>
                    <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium">
                      ➕ Add User
                    </button>
                  </div>
                </div>

                {users.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">👥</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No users found</h4>
                    <p className="text-gray-500">User data will appear here once available.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {["User", "Role", "Status", "Complaints", "Joined", "Actions"].map(header => (
                            <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                                  <span className="text-white font-bold">
                                    {user.name?.charAt(0) || 'U'}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{user.name}</p>
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getUserRoleBadge(user.role)}`}>
                                {user.role?.replace('ROLE_', '') || 'USER'}
                              </span>
                            </td>
                            
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                                user.status === 'ACTIVE' 
                                  ? 'bg-green-100 text-green-700 border border-green-200' 
                                  : 'bg-red-100 text-red-700 border border-red-200'
                              }`}>
                                {user.status === 'ACTIVE' ? '✅ Active' : '❌ Inactive'}
                              </span>
                            </td>
                            
                            <td className="px-6 py-4">
                              <div className="text-center">
                                <span className="font-semibold text-gray-900">{user.complaintCount || 0}</span>
                                <p className="text-xs text-gray-500">submitted</p>
                              </div>
                            </td>
                            
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
                              <p className="text-xs text-gray-500">{getTimeAgo(user.createdAt)}</p>
                            </td>
                            
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => {
                                    handleUserAction(user.id, user.status === 'ACTIVE' ? 'deactivate' : 'activate');
                                    addManualActivity(`User ${user.name} ${user.status === 'ACTIVE' ? 'deactivated' : 'activated'}`);
                                  }}
                                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                                    user.status === 'ACTIVE' 
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  }`}
                                >
                                  {user.status === 'ACTIVE' ? '❌ Deactivate' : '✅ Activate'}
                                </button>
                                
                                <button className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all">
                                  ✉️ Message
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Analytics & Reports</h3>
                  <div className="flex items-center space-x-4">
                    <select 
                      value={analyticsTimeRange}
                      onChange={(e) => setAnalyticsTimeRange(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {timeRanges.map(range => (
                        <option key={range.value} value={range.value}>{range.label}</option>
                      ))}
                    </select>
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium">
                      📊 Generate Report
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: "Avg Resolution Time", value: `${stats.avgResolutionTime || 0} days`, icon: "⏱️", trend: "-2.3%" },
                    { label: "User Satisfaction", value: "94%", icon: "😊", trend: "+5.1%" },
                    { label: "Department Response", value: "87%", icon: "⚡", trend: "+3.2%" }
                  ].map((item, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm">{item.label}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
                          <p className={`text-sm mt-1 ${item.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {item.trend} from last period
                          </p>
                        </div>
                        <div className="text-3xl">{item.icon}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
                  <div className="text-6xl mb-4">📈</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Analytics Charts</h4>
                  <p className="text-gray-600 mb-4">Interactive charts and graphs will be displayed here</p>
                  <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all">
                    Enable Advanced Analytics
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs Placeholder */}
          {["departments", "notifications", "settings"].includes(activeTab) && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">
                {activeTab === "departments" ? "🏢" : 
                 activeTab === "notifications" ? "🔔" : "⚙️"}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {navigationItems.find(item => item.id === activeTab)?.label}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                This section is under development. {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} management features will be available soon.
              </p>
              <button className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium">
                Explore Available Features
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}