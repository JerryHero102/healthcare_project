import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Stethoscope, 
  Users, 
  Heart, 
  FileText,
  User,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

const UserSidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    chuyenKhoa: false,
    dichVu: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      id: 'home',
      label: 'Trang chủ',
      icon: Home,
      path: '/',
      exact: true
    },
    {
      id: 'dat-lich',
      label: 'Đặt lịch hẹn',
      icon: Calendar,
      path: '/dat-lich-hen'
    },
    {
      id: 'chuyen-khoa',
      label: 'Chuyên khoa',
      icon: Stethoscope,
      path: '/chuyen-khoa',
      children: [
        { label: 'Nội khoa', path: '/noi-khoa' },
        { label: 'Tai mũi họng', path: '/tai-mui-hong' },
        { label: 'Chẩn đoán hình ảnh', path: '/chan-doan-hinh-anh' },
        { label: 'Xét nghiệm sinh hóa', path: '/xet-nghiem-sinh-hoa' }
      ]
    },
    {
      id: 'chuyen-gia',
      label: 'Chuyên gia',
      icon: Users,
      path: '/chuyen-gia'
    },
    {
      id: 'dich-vu',
      label: 'Dịch vụ',
      icon: Heart,
      path: '/dich-vu',
      children: [
        { label: 'Chăm sóc tại nhà', path: '/cham-soc-tai-nha' },
        { label: 'Khám tổng quát', path: '/kham-suc-khoe-tong-quat' },
        { label: 'Tư vấn dinh dưỡng', path: '/tu-van-dinh-duong' },
        { label: 'Xét nghiệm tại nhà', path: '/xet-nghiem-tai-nha' },
        { label: 'Phục hồi chức năng', path: '/phuc-hoi-chuc-nang' },
        { label: 'Khám bệnh trực tuyến', path: '/kham-benh-truc-tuyen' }
      ]
    },
    {
      id: 'profile',
      label: 'Thông tin cá nhân',
      icon: User,
      path: '/Profile_u'
    }
  ];

  const sidebarContent = (
    <aside className={`h-screen bg-white text-black flex flex-col shadow-lg transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-0 overflow-hidden lg:w-64 lg:overflow-visible'
    }`}>
      {/* Header */}
      <div className="bg-[#EDFFFA] text-[#FFC419] text-xl font-bold px-4 py-4 flex items-center justify-between border-b border-gray-200">
        <span className="whitespace-nowrap">HealthCare</span>
        <button
          onClick={onToggle}
          className="lg:hidden p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Đóng menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isItemActive = item.exact 
              ? location.pathname === item.path 
              : isActive(item.path);
            const isSectionExpanded = expandedSections[item.id];

            return (
              <li key={item.id}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleSection(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                        isItemActive
                          ? 'bg-[#FFC419] text-black font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`transition-transform ${
                          isSectionExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    {isSectionExpanded && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const isChildActive = isActive(child.path);
                          return (
                            <li key={child.path}>
                              <Link
                                to={child.path}
                                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                  isChildActive
                                    ? 'bg-[#FFF4D6] text-black font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                                onClick={onToggle}
                              >
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isItemActive
                        ? 'bg-[#FFC419] text-black font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={onToggle}
                  >
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500 text-center">
          © 2024 HealthCare
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 ${isOpen ? '' : 'hidden lg:block'}`}>
        {sidebarContent}
      </div>
    </>
  );
};

export default UserSidebar;

