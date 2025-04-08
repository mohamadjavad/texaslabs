import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import WalletConnect from "./WalletConnect";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("userID");

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/history");
    } else {
      navigate("/login");
    }
  };

  const handleLogoClick = () => {
    navigate("/play");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={handleLogoClick}>
        <span className={styles.logoText}>WonderCards</span>
      </div>

      <div className={styles.actions}>
        <button className={styles.profileButton} onClick={handleProfileClick}>
          <User size={20} className={styles.icon} />
          <span>{isLoggedIn ? "Profile" : "Login"}</span>
        </button>
        <WalletConnect />
      </div>
    </header>
  );
};

export default Header;
