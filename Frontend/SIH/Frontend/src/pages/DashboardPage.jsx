import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getMyComplaints } from '../services/api';
import ReportCard from '../components/ReportCard';
import { useTranslation } from 'react-i18next';

export default function GovernmentDashboardPage() {
  const { t, i18n } = useTranslation();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  const user = JSON.parse(localStorage.getItem("userDetails") || "null");

  // Enhanced statistics with trends
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    inProgress: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    trend: 'up' // up, down, stable
  });

  // Department statistics
  const [departmentStats, setDepartmentStats] = useState({});

  useEffect(() => {
    console.log(user);
    const fetchComplaints = async () => {
      try {
        const response = await getMyComplaints();
        setComplaints(response.data);
        // console.log(response);
        calculateStats(response.data);
        calculateDepartmentStats(response.data);
      } catch (err) {
        setError(t('user-dashboard.dashboard.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
    
    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(fetchComplaints, 30000);
    
    return () => clearInterval(intervalId);
  }, [t]);

  // Calculate comprehensive statistics
  const calculateStats = (complaintsData) => {
    const total = complaintsData.length;
    const pending = complaintsData.filter(c => c.status === 'PENDING').length;
    const resolved = complaintsData.filter(c => c.status === 'RESOLVED').length;
    const inProgress = complaintsData.filter(c => c.status === 'IN_PROGRESS').length;
    const highPriority = complaintsData.filter(c => c.priority === 'HIGH').length;
    const mediumPriority = complaintsData.filter(c => c.priority === 'MEDIUM').length;
    const lowPriority = complaintsData.filter(c => c.priority === 'LOW').length;
    
    // Simple trend calculation (could be enhanced with historical data)
    const trend = resolved > pending ? 'up' : pending > resolved ? 'down' : 'stable';
    
    setStats({ 
      total, 
      pending, 
      resolved, 
      inProgress, 
      highPriority, 
      mediumPriority, 
      lowPriority,
      trend 
    });
  };

  // Calculate department-wise statistics
  const calculateDepartmentStats = (complaintsData) => {
    const departments = {};
    
    complaintsData.forEach(complaint => {
      const dept = complaint.department || 'general';
      if (!departments[dept]) {
        departments[dept] = {
          total: 0,
          pending: 0,
          resolved: 0,
          inProgress: 0,
          name: dept
        };
      }
      
      departments[dept].total++;
      departments[dept][complaint.status]++;
    });
    
    setDepartmentStats(departments);
  };

  // Filter and sort complaints
  const filteredComplaints = useMemo(() => {
    let filtered = complaints.filter(complaint => {
      const matchesFilter = filter === 'all' || complaint.status === filter;
      const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || complaint.department === selectedDepartment;
      const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
      
      // Time range filtering
      const complaintDate = new Date(complaint.createdAt);
      const now = new Date();
      let matchesTimeRange = true;
      
      switch (timeRange) {
        case 'today':
          matchesTimeRange = complaintDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          matchesTimeRange = complaintDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          matchesTimeRange = complaintDate >= monthAgo;
          break;
        default:
          matchesTimeRange = true;
      }
      
      return matchesFilter && matchesSearch && matchesDepartment && matchesPriority && matchesTimeRange;
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [complaints, filter, searchTerm, selectedDepartment, priorityFilter, timeRange, sortBy]);

  // Get unique departments for filter
  const departments = useMemo(() => {
    const depts = [...new Set(complaints.map(c => c.department).filter(Boolean))];
    return depts;
  }, [complaints]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-gray-200">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('user-dashboard.dashboard.loadingTitle')}</h2>
          <p className="text-gray-600">{t('user-dashboard.dashboard.loadingMessage')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl border border-red-200 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-red-800 mb-4">{t('user-dashboard.dashboard.errorTitle')}</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors w-full shadow-md"
          >
            {t('user-dashboard.dashboard.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{t('user-dashboard.dashboard.title')}</h1>
                  <p className="text-gray-600">{user?.name || t('user-dashboard.dashboard.welcome')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600 font-medium">{t('user-dashboard.dashboard.quickStats.citizenId')}</p>
                  <p className="text-lg font-semibold text-gray-800">{user?.id || 'N/A'}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <p className="text-sm text-green-600 font-medium">{t('user-dashboard.dashboard.quickStats.region')}</p>
                  <p className="text-lg font-semibold text-gray-800">{user?.region || t('user-dashboard.dashboard.quickStats.defaultRegion')}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <p className="text-sm text-purple-600 font-medium">{t('user-dashboard.dashboard.quickStats.memberSince')}</p>
                  <p className="text-lg font-semibold text-gray-800">{user?.joinDate || '2023'}</p>
                </div>
              </div>
            </div>
            
            <Link
              to="/report/new"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center mt-6 lg:mt-0 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {t('user-dashboard.dashboard.newReportButton')}
            </Link>
          </div>
        </div>

        {/* Enhanced Statistics Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Main Statistics */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 00-6 6v3.5a.5.5 0 001 0V10a5 5 0 0110 0v3.5a.5.5 0 001 0V10a6 6 0 00-6-6z" />
              </svg>
              {t('user-dashboard.dashboard.statsOverview')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                title={t('user-dashboard.dashboard.stats.total')}
                value={stats.total}
                icon="📊"
                color="blue"
                trend={stats.trend}
              />
              <StatCard 
                title={t('user-dashboard.dashboard.stats.pending')}
                value={stats.pending}
                icon="⏳"
                color="yellow"
              />
              <StatCard 
                title={t('user-dashboard.dashboard.stats.resolved')}
                value={stats.resolved}
                icon="✅"
                color="green"
              />
              <StatCard 
                title={t('user-dashboard.dashboard.stats.inProgress')}
                value={stats.inProgress}
                icon="🚀"
                color="purple"
              />
            </div>
          </div>

          {/* Priority Statistics */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {t('user-dashboard.dashboard.priorityOverview')}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <PriorityCard 
                level="HIGH"
                count={stats.highPriority}
                color="red"
              />
              <PriorityCard 
                level="MEDIUM"
                count={stats.mediumPriority}
                color="orange"
              />
              <PriorityCard 
                level="LOW"
                count={stats.lowPriority}
                color="green"
              />
            </div>
          </div>
        </div>

        {/* Department Statistics */}
        {Object.keys(departmentStats).length > 0 && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h11-2zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
              {t('user-dashboard.dashboard.departmentOverview')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(departmentStats).map(([dept, data]) => (
                <DepartmentCard key={dept} data={data} />
              ))}
            </div>
          </div>
        )}

        {/* Reports Section */}
        {complaints.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 border border-gray-200">
            {/* Enhanced Filters */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div className="relative w-full lg:w-96">
                  <input
                    type="text"
                    placeholder={t('user-dashboard.dashboard.searchPlaceholder')}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <select 
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">{t('user-dashboard.dashboard.sort.newest')}</option>
                    <option value="oldest">{t('user-dashboard.dashboard.sort.oldest')}</option>
                    <option value="priority">{t('user-dashboard.dashboard.sort.priority')}</option>
                    <option value="title">{t('user-dashboard.dashboard.sort.title')}</option>
                  </select>

                  <select 
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <option value="all">{t('user-dashboard.dashboard.timeRange.all')}</option>
                    <option value="today">{t('user-dashboard.dashboard.timeRange.today')}</option>
                    <option value="week">{t('user-dashboard.dashboard.timeRange.week')}</option>
                    <option value="month">{t('user-dashboard.dashboard.timeRange.month')}</option>
                  </select>
                </div>
              </div>

              {/* Filter Chips */}
              <div className="flex flex-wrap gap-3 mb-4">
                <FilterChip 
                  label={t('user-dashboard.dashboard.filters.all')}
                  active={filter === 'all'}
                  onClick={() => setFilter('all')}
                  color="gray"
                />
                <FilterChip 
                  label={t('user-dashboard.dashboard.filters.pending')}
                  active={filter === 'PENDING'}
                  onClick={() => setFilter('PENDING')}
                  color="yellow"
                />
                <FilterChip 
                  label={t('user-dashboard.dashboard.filters.inProgress')}
                  active={filter === 'IN_PROGRESS'}
                  onClick={() => setFilter('IN_PROGRESS')}
                  color="purple"
                />
                <FilterChip 
                  label={t('user-dashboard.dashboard.filters.resolved')}
                  active={filter === 'RESOLVED'}
                  onClick={() => setFilter('RESOLVED')}
                  color="green"
                />
              </div>

              {/* Advanced Filters */}
              <div className="flex flex-wrap gap-3">
                <select 
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="all">{t('user-dashboard.dashboard.filters.allDepartments')}</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <select 
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">{t('user-dashboard.dashboard.filters.allPriorities')}</option>
                  <option value="HIGH">{t('user-dashboard.dashboard.filters.high')}</option>
                  <option value="MEDIUM">{t('user-dashboard.dashboard.filters.medium')}</option>
                  <option value="LOW">{t('user-dashboard.dashboard.filters.low')}</option>
                </select>
              </div>
            </div>
            
            {/* Reports Grid */}
            {filteredComplaints.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredComplaints.map((complaint) => (
                  <ReportCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('user-dashboard.dashboard.noResults.title')}</h3>
                <p className="text-gray-600 mb-4">{t('user-dashboard.dashboard.noResults.message')}</p>
                <button 
                  onClick={() => {
                    setFilter('all'); 
                    setSearchTerm('');
                    setSelectedDepartment('all');
                    setPriorityFilter('all');
                    setTimeRange('all');
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {t('user-dashboard.dashboard.noResults.clearFilters')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <EmptyState t={t} />
        )}

        {/* Enhanced Quick Tips Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {t('user-dashboard.dashboard.tips.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TipCard 
              icon="📝"
              title={t('user-dashboard.dashboard.tips.tip1.title')}
              description={t('user-dashboard.dashboard.tips.tip1.description')}
              color="blue"
            />
            <TipCard 
              icon="🕒"
              title={t('user-dashboard.dashboard.tips.tip2.title')}
              description={t('user-dashboard.dashboard.tips.tip2.description')}
              color="green"
            />
            <TipCard 
              icon="📞"
              title={t('user-dashboard.dashboard.tips.tip3.title')}
              description={t('user-dashboard.dashboard.tips.tip3.description')}
              color="purple"
            />
            <TipCard 
              icon="🔍"
              title={t('user-dashboard.dashboard.tips.tip4.title')}
              description={t('user-dashboard.dashboard.tips.tip4.description')}
              color="orange"
            />
          </div>
        </div>


      </div>
    </div>
  );
}

// Stat Card Component
const StatCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    red: 'bg-red-50 border-red-200 text-red-700'
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${colorClasses[color]}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
      {trend && (
        <div className="flex items-center mt-2 text-xs">
          {trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️'}
          <span className="ml-1">
            {trend === 'up' ? 'Improving' : trend === 'down' ? 'Needs attention' : 'Stable'}
          </span>
        </div>
      )}
    </div>
  );
};

// Priority Card Component
const PriorityCard = ({ level, count, color }) => {
  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    green: 'bg-green-50 border-green-200 text-green-700'
  };

  const icons = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${colorClasses[color]} text-center`}>
      <div className="text-2xl mb-2">{icons[level]}</div>
      <p className="text-sm font-medium capitalize">{level} Priority</p>
      <h3 className="text-2xl font-bold mt-1">{count}</h3>
    </div>
  );
};

// Department Card Component
const DepartmentCard = ({ data }) => {
  const progress = data.total > 0 ? Math.round((data.resolved / data.total) * 100) : 0;
  
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
      <h4 className="font-semibold text-gray-800 mb-2 truncate">{data.name}</h4>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Total: {data.total}</span>
        <span>Resolved: {data.resolved}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-600 h-2 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{progress}% resolved</div>
    </div>
  );
};

// Filter Chip Component
const FilterChip = ({ label, active, onClick, color }) => {
  const colorClasses = {
    gray: active ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    yellow: active ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    purple: active ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    green: active ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'
  };

  return (
    <button 
      className={`px-4 py-2 rounded-full font-medium transition-colors ${colorClasses[color]}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

// Tip Card Component
const TipCard = ({ icon, title, description, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
  };

  return (
    <div className={`p-5 rounded-xl border-2 ${colorClasses[color]}`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ t }) => (
  <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-4xl mx-auto border border-gray-200">
    <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('user-dashboard.dashboard.noReports.title')}</h2>
    <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
      {t('user-dashboard.dashboard.noReports.message')}
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-800 mb-2">{t('user-dashboard.dashboard.noReports.feature1.title')}</p>
        <p className="text-xs text-gray-600">{t('user-dashboard.dashboard.noReports.feature1.description')}</p>
      </div>
      
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-800 mb-2">{t('user-dashboard.dashboard.noReports.feature2.title')}</p>
        <p className="text-xs text-gray-600">{t('user-dashboard.dashboard.noReports.feature2.description')}</p>
      </div>
      
      <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-800 mb-2">{t('user-dashboard.dashboard.noReports.feature3.title')}</p>
        <p className="text-xs text-gray-600">{t('user-dashboard.dashboard.noReports.feature3.description')}</p>
      </div>
    </div>
    
    <Link
      to="/report/new"
      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
      {t('user-dashboard.dashboard.noReports.button')}
    </Link>
  </div>
);