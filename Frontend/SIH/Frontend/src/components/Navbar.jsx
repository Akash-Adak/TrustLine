import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationContext.jsx";
import { logoutUser, getUserProfile } from "../services/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import LoginPage from '../pages/LoginPage.jsx';

// Enhanced Icons with Government Style
const BellIcon = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
  </svg>
));

const HamburgerIcon = React.memo(({ open }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    {open ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
  </svg>
));

const ChevronDownIcon = React.memo(({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
));

const EmergencyIcon = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
));

// Enhanced Language Flags with colorful backgrounds
const LanguageFlag = React.memo(({ language, showName = false }) => {
  const flagMap = useMemo(() => ({
    en: { flag: "🇺🇸", name: "English", bg: "bg-gradient-to-r from-blue-100 to-red-100" },
    hi: { flag: "🇮🇳", name: "हिंदी", bg: "bg-gradient-to-r from-orange-100 to-green-100" },
    bn: { flag: "🇧🇩", name: "বাংলা", bg: "bg-gradient-to-r from-green-100 to-red-100" }
  }), []);

  const current = flagMap[language] || { flag: "🌐", name: "English", bg: "bg-gray-100" };

  return (
    <div className={`flex items-center space-x-2 ${showName ? 'px-3 py-2 rounded-lg' : ''} ${current.bg}`}>
      <span className="text-2xl">{current.flag}</span>
      {showName && (
        <span className="font-medium text-gray-800">{current.name}</span>
      )}
    </div>
  );
});

// Enhanced User Avatar with status indicator
const UserAvatar = React.memo(({ user, size = 10, showStatus = false }) => {
  const [imageError, setImageError] = useState(false);
  const sizeClass = `h-${size} w-${size}`;
  
  const handleImageError = useCallback(() => setImageError(true), []);

  return (
    <div className="relative">
      <div className={`flex-shrink-0 ${sizeClass} rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center border-2 border-white shadow-md`}>
        {user?.profilePicture && !imageError ? (
          <img 
            src={user.profilePicture} 
            alt={user.name || 'User'} 
            className="h-full w-full object-cover" 
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <span className="text-blue-700 font-bold text-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </span>
        )}
      </div>
      {showStatus && user?.lastActive && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      )}
    </div>
  );
});

// Fixed Custom hook for dropdown management
const useDropdown = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const ref = useRef(null);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        close();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [close]);

  return { isOpen, toggle, open, close, ref };
};

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [user, setUser] = useState(() => {
    try {
      const json = localStorage.getItem("userDetails");
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Enhanced Dropdown management
  const notificationsDropdown = useDropdown();
  const userDropdown = useDropdown();
  const languageDropdown = useDropdown();
  const mobileMenu = useDropdown();
  const quickActionsDropdown = useDropdown();

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Memoized values
  const dashboardPath = useMemo(() => 
    user?.role === "ROLE_ADMIN" ? "/admin-dashboard" : "/dashboard", 
    [user?.role]
  );

  const isAdmin = useMemo(() => user?.role === "ROLE_ADMIN", [user?.role]);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("userDetails");
      
      if (storedToken && (!storedUser || storedUser === "null")) {
        try {
          setIsLoading(true);
          const response = await getUserProfile();
          
          const userFromBackend = response.userDetails || response.user || response;
          
          if (userFromBackend) {
            setUser(userFromBackend);
            localStorage.setItem("userDetails", JSON.stringify(userFromBackend));
          }
        } catch (error) {
          console.error("Failed to fetch user details", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("userDetails");
          setToken(null);
          setUser(null);
          toast.error(t("sessionExpired"));
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [t]);

  // Sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "authToken" || e.key === "userDetails") {
        const newToken = localStorage.getItem("authToken");
        setToken(newToken);
        
        try {
          const json = localStorage.getItem("userDetails");
          const userData = json ? JSON.parse(json) : null;
          setUser(userData);
        } catch {
          setUser(null);
        }
        
        if (!newToken) {
          notificationsDropdown.close();
          mobileMenu.close();
          userDropdown.close();
          languageDropdown.close();
          quickActionsDropdown.close();
        }
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [notificationsDropdown, mobileMenu, userDropdown, languageDropdown, quickActionsDropdown]);

  // Close mobile menu on route change
  useEffect(() => {
    mobileMenu.close();
  }, [location.pathname]);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (user?.email) {
        await logoutUser(user.email);
      }
      
      localStorage.removeItem("authToken");
      localStorage.removeItem("userDetails");
      
      setToken(null);
      setUser(null);
      notificationsDropdown.close();
      mobileMenu.close();
      userDropdown.close();
      
      navigate("/", { replace: true });
      toast.success(t("logoutSuccess"));
    } catch (err) {
      console.error("Logout failed", err);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userDetails");
      setToken(null);
      setUser(null);
      navigate("/", { replace: true });
      toast.error(t("logoutFailed"));
    } finally {
      setIsLoading(false);
    }
  }, [user, navigate, t, notificationsDropdown, mobileMenu, userDropdown]);

  const handleNotificationClick = useCallback((notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    notificationsDropdown.close();
  }, [markAsRead, navigate, notificationsDropdown]);

  const changeLanguage = useCallback((lng) => {
    i18n.changeLanguage(lng);
    languageDropdown.close();
    toast.success(t("languageChanged"));
  }, [i18n, languageDropdown, t]);

  const handleEmergency = useCallback(() => {
    navigate("/emergency");
    toast.warning(t("emergencyModeActivated"));
  }, [navigate, t]);

  const handleQuickAction = useCallback((action) => {
    switch (action) {
      case 'emergency':
        handleEmergency();
        break;
      case 'report':
        navigate("/report/new");
        break;
      case 'track':
        navigate("/track-complaint");
        break;
      case 'awareness':
        navigate("/awareness");
        break;
      default:
        break;
    }
    quickActionsDropdown.close();
  }, [handleEmergency, navigate, quickActionsDropdown]);

  // Enhanced navigation items configuration - Only for logged in users
  const desktopMenuItems = useMemo(() => {
    if (!token) {
      return [
        { to: "/awareness", label: t("nav.awarenessHub"), icon: "📚" },
        { to: "/services", label: t("nav.govServices"), icon: "🏛️" },
        { to: "/schemes", label: t("nav.govSchemes"), icon: "💼" }
      ];
    }

    const baseItems = [
      { to: "/awareness", label: t("nav.awarenessHub"), icon: "📚" },
      { to: "/services", label: t("nav.govServices"), icon: "🏛️" },
      { to: "/schemes", label: t("nav.govSchemes"), icon: "💼" }
    ];

    if (isAdmin) {
      return [
        { to: dashboardPath, label: t("nav.dashboard"), icon: "📊" },
        { to: "/heatmap", label: t("nav.heatmap"), icon: "🗺️" },
        ...baseItems
      ];
    }

    return baseItems;
  }, [token, isAdmin, dashboardPath, t]);

  // Mobile menu items - Only show user-specific items when logged in
  const mobileMenuItems = useMemo(() => {
    if (!token) {
      return [
        { to: "/awareness", label: t("nav.awarenessHub"), icon: "📚" },
        { to: "/services", label: t("nav.govServices"), icon: "🏛️" },
        { to: "/schemes", label: t("nav.govSchemes"), icon: "💼" },
        { to: "/help", label: t("nav.helpSupport"), icon: "❓" }
      ];
    }

    const items = [
      { to: dashboardPath, label: t("nav.dashboard"), icon: "📊" },
      { to: "/awareness", label: t("nav.awarenessHub"), icon: "📚" },
      { to: "/services", label: t("nav.govServices"), icon: "🏛️" },
      { to: "/schemes", label: t("nav.govSchemes"), icon: "💼" }
    ];

    if (!isAdmin) {
      items.push(
        { to: "/report/new", label: t("nav.reportIssue"), icon: "📝" },
        { to: "/myreport", label: t("nav.myReports"), icon: "📋" },
        { to: "/track-complaint", label: t("nav.trackComplaint"), icon: "🔍" }
      );
    }

    items.push(
      { to: "/profile", label: t("nav.profile"), icon: "👤" },
      { to: "/help", label: t("nav.helpSupport"), icon: "❓" }
    );

    return items;
  }, [token, isAdmin, dashboardPath, t]);

  const quickActions = useMemo(() => [
    { 
      action: 'emergency', 
      label: t("nav.emergencyHelp"), 
      icon: <EmergencyIcon />, 
      variant: 'emergency',
      available: true
    },
    { 
      action: 'report', 
      label: t("nav.reportIssue"), 
      icon: "📝", 
      variant: 'primary',
      available: !isAdmin
    },
    { 
      action: 'track', 
      label: t("nav.trackComplaint"), 
      icon: "🔍", 
      variant: 'secondary',
      available: !isAdmin
    },
    { 
      action: 'awareness', 
      label: t("nav.awarenessHub"), 
      icon: "📚", 
      variant: 'secondary',
      available: true
    }
  ], [t, isAdmin]);

  // Active link checker
  const isActiveLink = useCallback((path) => location.pathname === path, [location.pathname]);

  if (isLoading && !user) {
    return (
      <nav className="bg-gradient-to-r from-blue-900 to-indigo-900 shadow-2xl sticky top-0 z-50 border-b-4 border-gold-500">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-blue-700 animate-pulse rounded-lg"></div>
              <div className="h-6 w-48 bg-blue-700 animate-pulse rounded"></div>
            </div>
            <div className="h-10 w-32 bg-blue-700 animate-pulse rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-indigo-900 shadow-2xl sticky top-0 z-50 border-b-4 border-yellow-400">
      {/* Government Header Strip */}
      <div className="bg-red-600 text-white py-1 px-4 text-xs text-center">
        <div className="container mx-auto flex justify-between items-center">
          <span>🔔 {t("nav.govAlert")} - {t("nav.emergencyHelpline")}: <strong>112</strong></span>
          <span className="hidden sm:inline">{currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Enhanced Logo with Government Identity */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="bg-white rounded-xl p-2 shadow-2xl border-4 border-yellow-400 transform group-hover:scale-105 transition-transform duration-200">
              <img 
                src="/logo2.png"
                alt="TrustLine Logo" 
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-wide">TrustLine</span>
              <span className="text-yellow-300 text-xs font-medium hidden sm:inline">Government of India Initiative</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {desktopMenuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isActiveLink(item.to) 
                    ? 'bg-white text-blue-900 shadow-lg transform scale-105' 
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Enhanced Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Quick Actions Dropdown - Only for logged in users */}
            {token && !isAdmin && (
              <div className="relative hidden md:block" ref={quickActionsDropdown.ref}>
                <button 
                  onClick={quickActionsDropdown.toggle}
                  className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-4 py-2 rounded-lg font-bold shadow-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <span>⚡</span>
                  <span className="hidden lg:inline">{t("nav.quickActions")}</span>
                  <ChevronDownIcon className="h-3 w-3" />
                </button>
                
                {quickActionsDropdown.isOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl z-50 border-2 border-yellow-400">
                    <div className="p-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                      <h3 className="font-bold text-blue-900 text-sm">{t("nav.quickActions")}</h3>
                    </div>
                    <div className="p-2 space-y-1">
                      {quickActions.filter(action => action.available).map((action) => (
                        <button
                          key={action.action}
                          onClick={() => handleQuickAction(action.action)}
                          className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                            action.variant === 'emergency' 
                              ? 'bg-red-50 hover:bg-red-100 border-l-4 border-red-500' 
                              : 'hover:bg-blue-50 border-l-4 border-blue-500'
                          }`}
                        >
                          <span className="text-lg">{action.icon}</span>
                          <span className="font-medium text-sm">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Compact Language Switcher */}
            <div className="relative hidden md:block" ref={languageDropdown.ref}>
              <button 
                onClick={languageDropdown.toggle}
                className="flex items-center space-x-1 px-2 py-1.5 rounded-md bg-gradient-to-r from-blue-800 to-purple-800 hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-sm border border-blue-500/30"
                aria-label="Change language"
              >
                <LanguageFlag language={i18n.language} />
                <ChevronDownIcon className="h-3 w-3 text-white" />
              </button>
              
              {languageDropdown.isOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl z-40 border border-gray-200 overflow-hidden">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500">
                    <h3 className="font-semibold text-white text-xs">{t("nav.selectLanguage")}</h3>
                  </div>
                  <div className="p-1">
                    {["en", "hi", "bn"].map(lng => (
                      <button 
                        key={lng} 
                        onClick={() => changeLanguage(lng)} 
                        className={`flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm mb-0.5 transition-all duration-150 ${
                          i18n.language === lng 
                            ? 'bg-blue-50 text-blue-700 font-medium' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <LanguageFlag language={lng} showName={true} />
                        {i18n.language === lng && (
                          <span className="text-green-500 text-sm">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Notifications - Only for logged in users */}
            {token && (
              <div className="relative hidden md:block" ref={notificationsDropdown.ref}>
                <button 
                  onClick={notificationsDropdown.toggle}
                  className="relative p-2 text-white hover:text-yellow-300 rounded-full hover:bg-blue-800 transition-all duration-200 border border-blue-700"
                  aria-label="Notifications"
                >
                  <BellIcon />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white transform translate-x-1 -translate-y-1 shadow-lg">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {notificationsDropdown.isOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl z-30 border-2 border-yellow-400">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl flex justify-between items-center">
                      <h3 className="font-bold text-white text-sm">{t("nav.notifications")}</h3>
                      {notifications.length > 0 && (
                        <button 
                          onClick={markAllAsRead} 
                          className="text-xs text-yellow-300 hover:text-yellow-200 font-medium"
                        >
                          {t("nav.markAllAsRead")}
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => handleNotificationClick(n)} 
                            className={`p-3 border-b cursor-pointer transition-all duration-200 ${
                              !n.read 
                                ? "bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-600" 
                                : "hover:bg-gray-50 border-l-4 border-gray-300"
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              <div className={`w-2 h-2 rounded-full mt-2 ${!n.read ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                              <div className="flex-1">
                                <p className={`text-xs ${!n.read ? "font-bold text-gray-900" : "text-gray-700"}`}>
                                  {n.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(n.date).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center">
                          <div className="text-3xl mb-2">📭</div>
                          <p className="text-gray-500 text-sm">{t("nav.noNotifications")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced User Menu - Only for logged in users */}
            {token ? (
              <div className="relative hidden md:block" ref={userDropdown.ref}>
                <button 
                  onClick={userDropdown.toggle}
                  className="flex items-center space-x-2 text-white hover:text-yellow-300 rounded-xl p-2 hover:bg-blue-800 transition-all duration-200 border border-blue-700"
                  aria-label="User menu"
                >
                  <UserAvatar user={user} size={10} showStatus={true} />
                  <div className="hidden xl:block text-left">
                    <p className="font-medium text-sm leading-tight max-w-32 truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-blue-200 text-xs truncate">
                      {user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Citizen'}
                    </p>
                  </div>
                  <ChevronDownIcon className="h-3 w-3" />
                </button>

                {userDropdown.isOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl z-40 border-2 border-yellow-400 overflow-hidden">
                    {/* User Header */}
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600">
                      <div className="flex items-center space-x-2">
                        <UserAvatar user={user} size={10} />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm truncate">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-blue-200 text-xs truncate">
                            {user?.email || ''}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200" 
                        onClick={userDropdown.close}
                      >
                        <span className="text-lg">👤</span>
                        <span>{t("nav.profile")}</span>
                      </Link>
                      <Link 
                        to={dashboardPath} 
                        className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200" 
                        onClick={userDropdown.close}
                      >
                        <span className="text-lg">📊</span>
                        <span className="text-lg">📊</span>
                        <span>{t("nav.dashboard")}</span>
                      </Link>
                      {!isAdmin && (
                        <Link 
                          to="/myreport" 
                          className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200" 
                          onClick={userDropdown.close}
                        >
                          <span className="text-lg">📋</span>
                          <span>{t("nav.myReports")}</span>
                        </Link>
                      )}
                      <Link 
                        to="/settings" 
                        className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200" 
                        onClick={userDropdown.close}
                      >
                        <span className="text-lg">⚙️</span>
                        <span>{t("nav.settings")}</span>
                      </Link>
                      
                      <div className="border-t border-gray-200 my-2"></div>
                      
                      <button 
                        onClick={handleLogout} 
                        disabled={isLoading} 
                        className="flex items-center space-x-3 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                      >
                        <span className="text-lg">🚪</span>
                        <span>{isLoading ? t("loggingOut") : t("logout")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium"
                >
                  {t("nav.login")}
                </button>
                 <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-5 py-2 rounded-lg font-bold shadow-lg transition-all duration-200 text-sm">
                
                  {t("nav.signUp")}
                </button>
       
              </div>
            )}

            {/* Enhanced Mobile Hamburger */}
            <div className="lg:hidden">
              <button 
                onClick={mobileMenu.toggle}
                className="p-2 text-white hover:text-yellow-300 rounded-lg hover:bg-blue-800 transition-all duration-200 border border-blue-700" 
                aria-label="Toggle menu"
                type="button"
              >
                <HamburgerIcon open={mobileMenu.isOpen} />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu - Compact */}
        {mobileMenu.isOpen && (
          <div className="lg:hidden border-t border-blue-700 bg-blue-800 py-3">
            {/* User Info in Mobile - Only if logged in */}
            {token && (
              <div className="px-4 pb-3 mb-2 border-b border-blue-700">
                <div className="flex items-center space-x-3 bg-blue-700 rounded-lg p-3">
                  <UserAvatar user={user} size={10} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate">{user?.name || 'User'}</p>
                    <p className="text-blue-200 text-xs truncate">{user?.email || ''}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu Items */}
            <div className="px-4 space-y-1">
              {mobileMenuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center space-x-3 py-2 px-3 text-white hover:bg-blue-700 rounded-lg transition-all duration-200 text-sm"
                  onClick={mobileMenu.close}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Quick Actions in Mobile - Only for logged in non-admin users */}
            {token && !isAdmin && (
              <div className="px-4 border-t border-blue-700 pt-3 mt-3">
                <p className="text-blue-300 text-xs font-semibold mb-2 px-2">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.filter(action => action.available).slice(0, 4).map((action) => (
                    <button
                      key={action.action}
                      onClick={() => {
                        handleQuickAction(action.action);
                        mobileMenu.close();
                      }}
                      className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        action.variant === 'emergency' 
                          ? 'bg-red-600 hover:bg-red-500 text-white' 
                          : 'bg-blue-700 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <span className="text-lg mb-1">{action.icon}</span>
                      <span className="text-xs leading-tight text-center">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Language Selector in Mobile */}
            <div className="px-4 border-t border-blue-700 pt-3 mt-3">
              <p className="text-blue-300 text-xs font-semibold mb-2 px-2">Language</p>
              <div className="grid grid-cols-3 gap-2">
                {["en", "hi", "bn"].map(lng => (
                  <button 
                    key={lng} 
                    onClick={() => {
                      changeLanguage(lng);
                      mobileMenu.close();
                    }}
                    className={`flex items-center justify-center py-2 rounded-lg text-xs transition-all duration-200 ${
                      i18n.language === lng 
                        ? 'bg-white text-blue-900 font-bold' 
                        : 'bg-blue-700 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <LanguageFlag language={lng} showName={false} />
                  </button>
                ))}
              </div>
            </div>

            {/* Auth Buttons in Mobile */}
            {!token ? (
              <div className="px-4 border-t border-blue-700 pt-3 mt-3 space-y-2">
                <button 
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    mobileMenu.close();
                  }}
                  className="block w-full py-2.5 text-center text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-all duration-200 font-medium text-sm" 
                >
                  {t("nav.login")}
                </button>
                    <button 
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    mobileMenu.close();
                  }}
                  className="block w-full py-2.5 text-center text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-all duration-200 font-medium text-sm" 
                >
                  {t("nav.signUp")}
                </button>

              </div>
            ) : (
              <div className="px-4 border-t border-blue-700 pt-3 mt-3">
                <button 
                  onClick={() => {
                    handleLogout();
                    mobileMenu.close();
                  }}
                  disabled={isLoading} 
                  className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 text-red-300 bg-red-900 hover:bg-red-800 rounded-lg transition-all duration-200 disabled:opacity-50 font-medium text-sm"
                >
                  <span>🚪</span>
                  <span>{isLoading ? t("loggingOut") : t("logout")}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginPage 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
      )}
    </nav>
  );
}