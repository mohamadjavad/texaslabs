import axios from "axios";
import { ArrowLeft, Clock, MoveRight, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GameHistory.module.css";

const GameHistory = () => {
  const [gameResults, setGameResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameResults = async () => {
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) {
          setError("User ID not found");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/game-results/${userId}`
        );
        setGameResults(response.data.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch game results");
        setLoading(false);
      }
    };

    fetchGameResults();
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleBack = () => {
    navigate("/play");
  };

  if (loading) {
    return (
      <div
        className={styles.pageBackground}
        // style={{ backgroundImage: `url(${backgroundGif})` }}
      >
        <div className={styles.container}>
          <div className={styles.loading}>Loading game history...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={styles.pageBackground}
        // style={{ backgroundImage: `url(${backgroundGif})` }}
      >
        <div className={styles.container}>
          <div className={styles.error}>{error}</div>
          <button className={styles.backButton} onClick={handleBack}>
            <ArrowLeft size={20} /> Back to Play
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.pageBackground}
      //   style={{ backgroundImage: `url(${backgroundGif})` }}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className={styles.title}>Game History</h1>
        </div>
        <div className={styles.resultsContainer}>
          {gameResults.length === 0 ? (
            <div className={styles.noResults}>No game results found</div>
          ) : (
            gameResults.map((result, index) => (
              <div key={index} className={styles.resultCard}>
                <div className={styles.resultHeader}>
                  <span className={styles.date}>
                    {new Date(result.date).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.resultDetails}>
                  <div className={styles.stat}>
                    <Trophy size={20} className={styles.icon} />
                    <span>Score: {result.score}</span>
                  </div>
                  <div className={styles.stat}>
                    <Clock size={20} className={styles.icon} />
                    <span>Time: {formatTime(result.time)}</span>
                  </div>
                  <div className={styles.stat}>
                    <MoveRight size={20} className={styles.icon} />
                    <span>Moves: {result.moves}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GameHistory;
