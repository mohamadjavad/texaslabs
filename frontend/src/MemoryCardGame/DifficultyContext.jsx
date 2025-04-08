import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";

const DifficultyContext = createContext();

export const DifficultyProvider = ({ children }) => {
  // Initialize difficulty from localStorage or default to "green"
  const [difficulty, setDifficulty] = useState(() => {
    const savedDifficulty = localStorage.getItem("memoryGameDifficulty");
    return savedDifficulty || "green";
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update localStorage when difficulty changes
  useEffect(() => {
    localStorage.setItem("memoryGameDifficulty", difficulty);
  }, [difficulty]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const value = {
    difficulty,
    setDifficulty,
    isModalOpen,
    openModal,
    closeModal,
  };

  return (
    <DifficultyContext.Provider value={value}>
      {children}
    </DifficultyContext.Provider>
  );
};

DifficultyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useDifficulty = () => {
  const context = useContext(DifficultyContext);
  if (!context) {
    throw new Error("useDifficulty must be used within a DifficultyProvider");
  }
  return context;
};
