import { Wallet } from "lucide-react";
import { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import styles from "./WalletConnect.module.css";

const WalletConnect = () => {
  const {
    account,
    isConnected,
    error,
    isLoading,
    connectWallet,
    disconnectWallet,
    formatAddress,
  } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleConnect = async () => {
    await connectWallet();
    setShowDropdown(false);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setShowDropdown(false);
  };

  return (
    <div className={styles.walletContainer}>
      <button
        className={`${styles.walletButton} ${
          isConnected ? styles.connected : ""
        }`}
        onClick={toggleDropdown}
      >
        <Wallet size={20} className={styles.walletIcon} />
        {isConnected ? formatAddress(account) : "Connect Wallet"}
      </button>

      {showDropdown && (
        <div className={styles.dropdown}>
          {isConnected ? (
            <>
              <div className={styles.addressBox}>
                <p className={styles.addressLabel}>Connected:</p>
                <p className={styles.address}>{account}</p>
              </div>
              <button
                className={styles.disconnectButton}
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            </>
          ) : (
            <>
              <button
                className={`${styles.connectButton} ${
                  isLoading ? styles.loading : ""
                }`}
                onClick={handleConnect}
                disabled={isLoading}
              >
                {isLoading ? "Connecting..." : "Connect MetaMask"}
              </button>
              {error && <p className={styles.error}>{error}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
