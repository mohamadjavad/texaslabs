import { X } from "lucide-react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { useDifficulty } from "./DifficultyContext";
import "./Play.css";

const modalPlayStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    backgroundColor: "#1e1e2e",
    border: "2px solid #4a4e69",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "600px",
    height: "200px",
    width: "90%",
    color: "#fff",
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "hidden",
  },
};

const DifficultyModal = () => {
  const { isModalOpen, closeModal, setDifficulty, difficulty } =
    useDifficulty();
  const navigate = useNavigate();

  const handleDifficultySelect = (level) => {
    setDifficulty(level);
    closeModal();
    navigate("/memory-card-game");
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      style={{
        ...modalPlayStyles,
        content: {
          ...modalPlayStyles.content,
          backgroundColor: "#1e1e2e",
          color: "#fff",
        },
      }}
    >
      <button
        onClick={closeModal}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#fff",
        }}
      >
        <X size={24} />
      </button>

      <h2 className="modal-h2">Select Difficulty</h2>
      <div className="difficulty-selection">
        <button
          onClick={() => handleDifficultySelect("green")}
          className={`difficulty-button green ${
            difficulty === "green" ? "selected" : ""
          }`}
        >
          Easy
        </button>
        <button
          onClick={() => handleDifficultySelect("yellow")}
          className={`difficulty-button yellow ${
            difficulty === "yellow" ? "selected" : ""
          }`}
        >
          Normal
        </button>
        <button
          onClick={() => handleDifficultySelect("red")}
          className={`difficulty-button red ${
            difficulty === "red" ? "selected" : ""
          }`}
        >
          Hard
        </button>
      </div>
    </Modal>
  );
};

export default DifficultyModal;
