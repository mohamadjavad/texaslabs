import { useEffect, useState } from "react";

export const useWallet = () => {
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkIfWalletIsConnected();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountChanged);
      }
    };
  }, []);

  // Handle account change
  const handleAccountChanged = async (accounts) => {
    if (accounts.length === 0) {
      // Disconnected
      setAccount("");
      setIsConnected(false);
    } else {
      // Account changed
      setAccount(accounts[0]);
      setIsConnected(true);
    }
  };

  // Check if wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask is not installed!");
        return false;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        return true;
      }

      return false;
    } catch (err) {
      setError("Error checking wallet connection: " + err.message);
      return false;
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (!window.ethereum) {
        setError("MetaMask is not installed!");
        setIsLoading(false);
        return false;
      }

      // Request accounts from MetaMask
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        setIsLoading(false);
        return true;
      } else {
        setError("No accounts found");
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      if (err.code === 4001) {
        // User rejected the request
        setError("Please connect to MetaMask.");
      } else {
        setError("Error connecting to wallet: " + err.message);
      }
      setIsLoading(false);
      return false;
    }
  };

  // Disconnect wallet (for UI purposes)
  const disconnectWallet = () => {
    setAccount("");
    setIsConnected(false);
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return {
    account,
    isConnected,
    error,
    isLoading,
    connectWallet,
    disconnectWallet,
    formatAddress,
  };
};
