import styles from './Header.module.css';

const Header = () => {
  return (
    <div className={styles.header}>

      {/* ✅ Phần bên phải: Login hoặc Hotline */}
      <div className={styles.rightSection}>
        <a href="fontend/Login" className={styles.navLink}>
        <button className={styles.loginButton}>
          Đăng nhập
        </button>
        </a>
      </div>

    </div>
  );
};

export default Header;
