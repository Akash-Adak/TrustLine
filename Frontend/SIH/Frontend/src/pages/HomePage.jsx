import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from "react-i18next";
import LoginPage from './LoginPage';
// Custom Icons
const SecurityIcon = ({ className = "h-12 w-12" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417V21h18v-.583c0-3.46-1.6-6.634-4.382-8.433z" />
  </svg>
);

const CyberCrimeIcon = ({ className = "h-12 w-12" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const QuickReportIcon = ({ className = "h-12 w-12" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Real-time Counter
const Counter = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      
      return () => clearInterval(timer);
    }
  }, [end, duration, isInView]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// Language Selector
const LanguageSelector = () => {
  const { i18n } = useTranslation();
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' }
  ];

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm">
        <span>🌐</span>
        <span className="hidden sm:inline">{languages.find(lang => lang.code === i18n.language)?.name}</span>
      </button>
      <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => i18n.changeLanguage(language.code)}
            className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors flex items-center space-x-2 text-sm ${
              i18n.language === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
            }`}
          >
            <span className="text-base">{language.flag}</span>
            <span>{language.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Mobile Menu Component
const MobileMenu = ({ isOpen, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: isOpen ? 0 : '100%' }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 lg:hidden"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="space-y-4">
            <Link to="/report/new" className="block py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold text-center">
              Report Issue
            </Link>
            <Link to="/cyber-crime" className="block py-3 px-4 border border-gray-300 rounded-lg font-semibold text-center">
              Cyber Crime
            </Link>
            <Link to="/track" className="block py-3 px-4 text-gray-700 rounded-lg font-semibold text-center hover:bg-gray-50">
              Track Report
            </Link>
          </nav>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Hero Section */}
      <section className="relative py-8 md:py-16 bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                <div className="w-3 h-8 bg-yellow-400 rounded"></div>
                <span className="text-yellow-300 font-semibold text-sm md:text-base">{t('home.hero.badge')}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {t('home.hero.title')}
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 opacity-95 leading-relaxed">
                {t('home.hero.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 justify-center lg:justify-start">
                <Link
                  to="/report/new"
                  className="bg-yellow-400 text-blue-900 font-bold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg hover:bg-yellow-300 transition-all flex items-center justify-center shadow-lg"
                >
                  <QuickReportIcon className="h-5 w-5 mr-2" />
                  {t('home.hero.cta.primary')}
                </Link>
                <Link
                  to="/cyber-crime"
                  className="border-2 border-white text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg hover:bg-white hover:bg-opacity-10 transition-all flex items-center justify-center"
                >
                  <CyberCrimeIcon className="h-5 w-5 mr-2" />
                  {t('home.hero.cta.cyber')}
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-2xl max-w-md mx-auto lg:max-w-none">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-blue-100 rounded-lg p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-blue-800"><Counter end={12500} /></div>
                    <div className="text-xs sm:text-sm text-blue-600">{t('home.stats.reports')}</div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-green-800"><Counter end={9200} /></div>
                    <div className="text-xs sm:text-sm text-green-600">{t('home.stats.resolved')}</div>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-purple-800"><Counter end={42} /></div>
                    <div className="text-xs sm:text-sm text-purple-600">{t('home.stats.authorities')}</div>
                  </div>
                  <div className="bg-orange-100 rounded-lg p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-orange-800"><Counter end={98} suffix="%" /></div>
                    <div className="text-xs sm:text-sm text-orange-600">{t('home.stats.satisfaction')}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">{t('home.quickActions.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">{t('home.quickActions.subtitle')}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            <Link to="/report/civic" className="group">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all h-full"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <div className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-lg">
                    <SecurityIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">{t('home.quickActions.civic.title')}</h3>
                </div>
                <p className="text-blue-100 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">{t('home.quickActions.civic.description')}</p>
                <div className="flex items-center text-xs sm:text-sm font-semibold">
                  <span>{t('home.quickActions.time')}</span>
                  <span className="ml-auto bg-white text-blue-600 px-2 sm:px-3 py-1 rounded-full text-xs">2 {t('home.quickActions.minutes')}</span>
                </div>
              </motion.div>
            </Link>

            <Link to="/report/cyber" className="group">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all h-full"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <div className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-lg">
                    <CyberCrimeIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">{t('home.quickActions.cyber.title')}</h3>
                </div>
                <p className="text-green-100 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">{t('home.quickActions.cyber.description')}</p>
                <div className="flex items-center text-xs sm:text-sm font-semibold">
                  <span>{t('home.quickActions.time')}</span>
                  <span className="ml-auto bg-white text-green-600 px-2 sm:px-3 py-1 rounded-full text-xs">2 {t('home.quickActions.minutes')}</span>
                </div>
              </motion.div>
            </Link>

            <Link to="/track" className="group sm:col-span-2 lg:col-span-1">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all h-full"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <div className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-lg">
                    <QuickReportIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">{t('home.quickActions.track.title')}</h3>
                </div>
                <p className="text-purple-100 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">{t('home.quickActions.track.description')}</p>
                <div className="flex items-center text-xs sm:text-sm font-semibold">
                  <span>{t('home.quickActions.time')}</span>
                  <span className="ml-auto bg-white text-purple-600 px-2 sm:px-3 py-1 rounded-full text-xs">1 {t('home.quickActions.minute')}</span>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-12 bg-red-50 border-t border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-6 sm:mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-red-800 mb-2">{t('home.emergency.title')}</h2>
            <p className="text-red-600 text-sm sm:text-base">{t('home.emergency.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {t('home.emergency.numbers', { returnObjects: true }).map((emergency, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-md border border-red-200"
              >
                <div className="text-lg sm:text-2xl font-bold text-red-600 mb-1">{emergency.number}</div>
                <div className="font-semibold text-gray-800 text-xs sm:text-sm">{emergency.service}</div>
                <div className="text-xs text-gray-600 mt-1 leading-tight">{emergency.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">{t('home.features.title')}</h2>
              <div className="space-y-4 sm:space-y-6">
                {t('home.features.items', { returnObjects: true }).map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg mt-1 flex-shrink-0">
                      <div className="text-blue-600 font-bold text-sm">✓</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{feature.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mt-8 lg:mt-0"
            >
              <div className="w-full h-48 sm:h-64 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <SecurityIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Government Service Platform</p>
                </div>
              </div>
              <h3 className="font-bold text-lg sm:text-xl mb-2">{t('home.features.demoTitle')}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{t('home.features.demoDescription')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <LoginPage 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

    </div>
  );
}