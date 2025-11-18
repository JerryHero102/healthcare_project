import { useState, useEffect } from 'react';
import HeaderUser from './HeaderUser.jsx';
import Body from './Home/Body';
import Footer from './Home/Footer';
import UserSidebar from '@/components/UserSidebar';
import Sidenav from '@/components/Sidenav';

const HomePage = () => {
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
          <Body />
        </main>
      </div>
      <Sidenav />
      <Footer />
    </div>
  );
};

export default HomePage;
