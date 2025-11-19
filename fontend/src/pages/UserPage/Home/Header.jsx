import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Lắng nghe login/logout
  useEffect(() => {
    const handleLogin = () => setUser(JSON.parse(localStorage.getItem("user")));
    const handleLogout = () => setUser(null);

    window.addEventListener("user-login", handleLogin);
    window.addEventListener("user-logout", handleLogout);

    return () => {
      window.removeEventListener("user-login", handleLogin);
      window.removeEventListener("user-logout", handleLogout);
    };
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    setUser(null);
    window.dispatchEvent(new Event("user-logout"));
    navigate("/User/Login");
  };

  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <a href="/" className={styles.logo}>HealthCare</a>
        <nav className={styles.nav}>
          <a href="/" className={styles.navLink}>Trang chủ</a>
          <a href="/dat-lich-hen" className={styles.navLink}>Đặt lịch hẹn</a>
          <a href="/chuyen-khoa" className={styles.navLink}>Chuyên Khoa</a>
          <a href="/chuyen-gia" className={styles.navLink}>Chuyên Gia</a>
          <a href="/dich-vu" className={styles.navLink}>Dịch vụ</a>
          {user && (
            <a href="/User/Profile_u" className={styles.navLink}>Thông tin cá nhân</a>
          )}
        </nav>
      </div>

      <div className={styles.rightSection}>
        {!user ? (
          <button
            className="bg-[#e6b800] text-white px-4 py-2 rounded-md hover:bg-[#ccac00]"
            onClick={() => navigate("/User/Login")}
          >
            Đăng nhập
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span>{user.full_name}</span>
            <button
              onClick={handleLogoutClick}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
