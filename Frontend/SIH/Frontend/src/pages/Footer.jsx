import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-2 transform group-hover:scale-105 transition-transform duration-300 shadow-lg">
                <img 
                  src="/logo.png"
                  alt="TrustLine Logo" 
                  className="h-12 w-12 object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                TrustLine
              </span>
            </Link>
            <p className="text-gray-300 leading-relaxed mb-6 text-sm lg:text-base">
              {t("footer.description")}
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4 mb-6">
              {[
                { icon: "fab fa-facebook-f", color: "hover:text-blue-400" },
                { icon: "fab fa-twitter", color: "hover:text-blue-300" },
                { icon: "fab fa-instagram", color: "hover:text-pink-400" },
                { icon: "fab fa-linkedin-in", color: "hover:text-blue-400" },
                { icon: "fab fa-youtube", color: "hover:text-red-400" }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`text-gray-400 ${social.color} transition-all duration-300 transform hover:scale-110 bg-gray-800 p-2 rounded-lg`}
                >
                  <i className={`${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: "fas fa-shield-alt", text: t("footer.secure"), color: "text-green-400" },
                { icon: "fas fa-lock", text: t("footer.encrypted"), color: "text-blue-400" },
                { icon: "fas fa-certificate", text: "SSL Certified", color: "text-yellow-400" }
              ].map((badge, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm px-3 py-2 rounded-lg text-xs border border-gray-700 hover:border-gray-600 transition-all">
                  <i className={`${badge.icon} ${badge.color} mr-1`}></i>
                  {badge.text}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <i className="fas fa-link text-blue-400 mr-2 text-sm"></i>
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-3">
              {[
                { icon: "fas fa-home", text: t("footer.home"), path: "/" },
                { icon: "fas fa-info-circle", text: t("footer.about"), path: "/about" },
                { icon: "fas fa-cogs", text: t("footer.howItWorks"), path: "/how-it-works" },
                { icon: "fas fa-lightbulb", text: t("footer.awareness"), path: "/awareness" },
                { icon: "fas fa-star", text: t("footer.testimonials"), path: "/testimonials" }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group py-1"
                  >
                    <i className={`${link.icon} text-blue-400 mr-3 text-sm group-hover:scale-110 transition-transform`}></i>
                    <span className="group-hover:translate-x-1 transition-transform">{link.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <i className="fas fa-headset text-blue-400 mr-2 text-sm"></i>
              {t("footer.support")}
            </h3>
            <ul className="space-y-3">
              {[
                { icon: "fas fa-question-circle", text: t("footer.faq"), path: "/faq" },
                { icon: "fas fa-envelope", text: t("footer.contact"), path: "/contact" },
                { icon: "fas fa-user-shield", text: t("footer.privacy"), path: "/privacy" },
                { icon: "fas fa-file-contract", text: t("footer.terms"), path: "/terms" },
                { icon: "fas fa-sitemap", text: t("footer.sitemap"), path: "/sitemap" }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group py-1"
                  >
                    <i className={`${link.icon} text-blue-400 mr-3 text-sm group-hover:scale-110 transition-transform`}></i>
                    <span className="group-hover:translate-x-1 transition-transform">{link.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <i className="fas fa-address-book text-blue-400 mr-2 text-sm"></i>
              {t("footer.contactUs")}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <i className="fas fa-map-marker-alt text-blue-400 mt-1 mr-3 group-hover:scale-110 transition-transform"></i>
                <span className="text-gray-300 leading-relaxed">
                  123 Trust Avenue, Suite 456<br />
                  San Francisco, CA 94107
                </span>
              </li>
              <li className="flex items-center group">
                <i className="fas fa-phone-alt text-blue-400 mr-3 group-hover:scale-110 transition-transform"></i>
                <span className="text-gray-300">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center group">
                <i className="fas fa-envelope text-blue-400 mr-3 group-hover:scale-110 transition-transform"></i>
                <span className="text-gray-300">support@trustline.com</span>
              </li>
              
              {/* Help Card */}
              <li className="pt-2">
                <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/30 p-4 rounded-xl border border-blue-700/30 backdrop-blur-sm hover:border-blue-600/50 transition-all duration-300">
                  <div className="flex items-center font-semibold text-blue-200 mb-2">
                    <i className="fas fa-life-ring mr-2 text-blue-400"></i>
                    {t("footer.helpLine")}
                  </div>
                  <div className="text-white text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    1-800-TRUST-ME
                  </div>
                  <div className="text-blue-300 text-xs mt-1 flex items-center">
                    <i className="fas fa-clock mr-1"></i>
                    {t("footer.available247")}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-700/50 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-semibold mb-2 flex items-center justify-center lg:justify-start">
                <i className="fas fa-newspaper text-blue-400 mr-2"></i>
                {t("footer.newsletter")}
              </h3>
              <p className="text-gray-300 text-sm max-w-md">{t("footer.newsletterDesc")}</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full lg:w-auto space-y-3 sm:space-y-0 sm:space-x-3">
              <input 
                type="email" 
                placeholder={t("footer.emailPlaceholder")}
                className="bg-gray-800/50 backdrop-blur-sm text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-64 border border-gray-700"
              />
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 font-semibold">
                <i className="fas fa-paper-plane mr-2"></i>
                {t("footer.subscribe")}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 mt-8 pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} TrustLine. {t("footer.rights")}
              </p>
              <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
                <Link to="/cookies" className="hover:text-gray-300 transition-colors">Cookie Policy</Link>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col items-center lg:items-end space-y-2">
              <span className="text-gray-400 text-sm">{t("footer.paymentMethods")}:</span>
              <div className="flex space-x-3 text-2xl">
                {["fab fa-cc-visa", "fab fa-cc-mastercard", "fab fa-cc-amex", "fab fa-cc-paypal", "fab fa-cc-apple-pay"].map((icon, index) => (
                  <div key={index} className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                    <i className={icon}></i>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
        >
          <i className="fas fa-chevron-up"></i>
        </button>
      </div>
    </footer>
  );
};

export default Footer;