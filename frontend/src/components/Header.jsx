import { Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import WalletConnect from "./WalletConnect";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("userID");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/history");
    } else {
      navigate("/login");
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/play");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={handleLogoClick}>
        <span className={styles.logoText}>WonderCards</span>
      </div>

      {isMobile ? (
        <>
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {isMobileMenuOpen && (
            <div className={styles.mobileMenu}>
              <button
                className={styles.profileButton}
                onClick={handleProfileClick}
              >
                <User size={20} className={styles.icon} />
                <span>{isLoggedIn ? "Profile" : "Login"}</span>
              </button>
              <div className={styles.walletContainer}>
                <WalletConnect />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={styles.actions}>
          <button className={styles.profileButton} onClick={handleProfileClick}>
            <User size={20} className={styles.icon} />
            <span>{isLoggedIn ? "Profile" : "Login"}</span>
          </button>
          <WalletConnect />
        </div>
      )}
    </header>
  );
};

export default Header;
