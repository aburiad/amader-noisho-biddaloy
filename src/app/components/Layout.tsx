import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { useSettings } from "../context/SettingsContext";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings, loading } = useSettings();

  // Show loading state if settings are not loaded yet
  if (loading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const navLinks = settings.nav_links || [];
  const quickLinks = settings.quick_links || [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              {/* <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div> */}
              <div className="w-[100px] lg:w-[158px] h-10  flex items-center justify-center">
                <img src={settings.logo_url} alt="site-logo" />
              </div>
              {/* <span className="text-xl font-semibold text-gray-900">
                {settings.site_name}
              </span> */}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? "bg-blue-50 text-primary"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? "bg-blue-50 text-primary"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* School Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
              <div className="w-[100px] lg:w-[158px] h-10  flex items-center justify-center">
                <img src={settings.logo_url} alt="site-logo" />
              </div>
                {/* <h3 className="text-lg">{settings.site_name}</h3> */}
              </div>
              <p className="text-gray-400 leading-relaxed">
                {settings.footer_text}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg mb-4">দ্রুত লিংক</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg mb-4">যোগাযোগ</h3>
              <ul className="space-y-2 text-gray-400">
                <li>ফোন: {settings.phone}</li>
                <li>ইমেইল: <a href="mailto:{settings.email}">{settings.email}</a> </li>
                <li>ঠিকানা: {settings.address}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>{settings.footer_copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
