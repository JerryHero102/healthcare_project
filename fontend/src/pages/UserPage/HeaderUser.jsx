import { useState } from 'react';
import styles from './Home/Header.module.css';
import Profile_U from './auth/Profile_U';
import { Menu } from 'lucide-react';

const HeaderUser = ({ onMenuToggle }) => {
    const user = {
    name: 'Trần Văn Nam', //tôi cần lấy tên user từ Profile_U ở đây
    role: 'Bệnh nhân'
  };
  return (
    <div className={styles.header}>

      {/* Logo + Menu */}
      <div className={styles.leftSection}>
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 mr-2 hover:bg-gray-100 rounded transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        <a href="/" className={styles.logo}>
          HealthCare
        </a>
        <nav className={`${styles.nav} hidden lg:flex`}>
          <a href="/" className={styles.navLink}>
            Trang chủ
          </a>
          <a href="/dat-lich-hen" className={styles.navLink}>
            Đặt lịch hẹn
          </a>
          <a href="/chuyen-khoa" className={styles.navLink}>
            Chuyên Khoa
          </a>
          <a href="/chuyen-gia" className={styles.navLink}>
            Chuyên Gia
          </a>
          <a href="/dich-vu" className={styles.navLink}>
            Dịch vụ
          </a>
          <a href="/Profile_u" className={styles.navLink}>
            Thông tin cá nhân
          </a>
        </nav>
      </div>

      {/* ✅ Phần bên phải: Login hoặc Hotline */}
      <div className={styles.rightSection}>
        <a>
            user: {user.name} ({user.role})
        </a>
      </div>

    </div>
  );
};

export default HeaderUser;
