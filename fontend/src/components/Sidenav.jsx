import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Calendar, Stethoscope, Users, Heart, User } from 'lucide-react';

const Sidenav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close sidenav when route changes (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidenav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Trang chủ', icon: Home, path: '/' },
    { label: 'Đặt lịch hẹn', icon: Calendar, path: '/dat-lich-hen' },
    { label: 'Chuyên khoa', icon: Stethoscope, path: '/chuyen-khoa' },
    { label: 'Chuyên gia', icon: Users, path: '/chuyen-gia' },
    { label: 'Dịch vụ', icon: Heart, path: '/dich-vu' },
    { label: 'Thông tin cá nhân', icon: User, path: '/Profile_u' }
  ];

  return (
    <>
      {/* Toggle Button - Fixed position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-[#FFC419] text-white p-4 rounded-full shadow-lg hover:bg-[#E6AE14] transition-all duration-300 lg:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidenav */}
      <nav
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-[#EDFFFA] text-[#FFC419] text-xl font-bold px-4 py-4 flex items-center justify-between border-b border-gray-200">
          <span>HealthCare</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Đóng menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <ul className="py-4 px-2 space-y-2 overflow-y-auto h-[calc(100vh-80px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-[#FFC419] text-black font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4 bg-white">
          <div className="text-xs text-gray-500 text-center">
            © 2024 HealthCare
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidenav;

