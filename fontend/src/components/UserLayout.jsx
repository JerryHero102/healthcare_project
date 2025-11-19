import { useState, useEffect } from 'react';
import HeaderUser from '@/pages/UserPage/HeaderUser';
import Footer from '@/pages/UserPage/Home/Footer';
import UserSidebar from './UserSidebar';
import Sidenav from './Sidenav';

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-open sidebar on desktop, close on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderUser onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <UserSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
      <Sidenav />
      <Footer />
    </div>
  );
};

export default UserLayout;

