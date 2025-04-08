import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { animated, useSpring } from "@react-spring/web";
import axios from "axios";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgMusic from "../assets/audio/memory-bg.mp3";
import background from "../assets/images/mode1.gif";
import { useDifficulty } from "./DifficultyContext";

// Card Images for different difficulties
const cardImagesByDifficulty = {
  green: [
    { id: 1, image: "/images/meteor.png" },
    { id: 2, image: "/images/meteor.png" },
    { id: 3, image: "/images/comet.png" },
    { id: 4, image: "/images/comet.png" },
  ],
  yellow: [
    { id: 1, image: "/images/meteor.png" },
    { id: 2, image: "/images/meteor.png" },
    { id: 3, image: "/images/moon.png" },
    { id: 4, image: "/images/moon.png" },
    { id: 5, image: "/images/comet.png" },
    { id: 6, image: "/images/comet.png" },
  ],
  red: [
    { id: 1, image: "/images/earth.png" },
    { id: 2, image: "/images/earth.png" },
    { id: 3, image: "/images/jupiter.png" },
    { id: 4, image: "/images/jupiter.png" },
    { id: 5, image: "/images/mars.png" },
    { id: 6, image: "/images/mars.png" },
    { id: 7, image: "/images/mercury.png" },
    { id: 8, image: "/images/mercury.png" },
    { id: 9, image: "/images/neptune.png" },
    { id: 10, image: "/images/neptune.png" },
    { id: 11, image: "/images/saturn.png" },
    { id: 12, image: "/images/saturn.png" },
  ],
};

// Audio files for matching and final congratulation
const matchAudioFiles = {
  green: ["/audio/wonderful.mp3"],
  yellow: ["/audio/wonderful.mp3", "/audio/NiceJob.mp3"],
  red: [
    "/audio/wonderful.mp3",
    "/audio/NiceJob.mp3",
    "/audio/Greatwork.mp3",
    "/audio/KeepItGoing.mp3",
    "/audio/Amazing.mp3",
  ],
};

const congratsAudio = "/audio/congrats.mp3";

// Shuffle Logic
const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const saveGameData = async (gameData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/memory/save",
      gameData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("Game data saved successfully", response.data);
  } catch (error) {
    console.error(
      "Error saving game data:",
      error.response ? error.response.data : error.message
    );
  }
};

const saveGameResult = async (score, time, moves) => {
  try {
    const userId = localStorage.getItem("userID");
    if (!userId) {
      console.error("No user ID found in localStorage");
      return;
    }

    console.log("Saving game result:", { userId, score, time, moves });
    const response = await axios.post(
      "http://localhost:5000/api/game-results",
      {
        userId,
        score,
        time,
        moves,
      }
    );
    console.log("Game result saved successfully:", response.data);
  } catch (error) {
    console.error("Failed to save game result:", error);
  }
};

// Styled Components
const StyledGameContainer = styled(Box)(({ mouseDisabled }) => ({
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: `url(${background})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "relative",
  pointerEvents: mouseDisabled ? "none" : "auto",
}));

const PixelButton = styled(Box)(() => ({
  display: "inline-block",
  backgroundColor: "#2c2c54",
  color: "#fff",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "14px",
  padding: "15px 30px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
  "&:hover": {
    backgroundColor: "#40407a",
    borderColor: "#00aaff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const PixelBox = styled(Box)(() => ({
  position: "absolute",
  bottom: "10%",
  left: "1%",
  backgroundColor: "#ff4d4f",
  color: "#fff",
  padding: "10px 20px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "12px",
  textAlign: "center",
  marginBottom: "10px",
}));

const PixelTimerBox = styled(Box)(() => ({
  position: "absolute",
  bottom: "5%",
  left: "1%",
  backgroundColor: "#2c2c54",
  color: "#fff",
  padding: "10px 20px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "12px",
  textAlign: "center",
}));

const CardContainer = styled(Box)({
  perspective: "1000px",
  cursor: "pointer",
  width: "120px",
  height: "120px",
});

const CardInner = styled(animated.div)({
  position: "relative",
  width: "100%",
  height: "100%",
  transformStyle: "preserve-3d",
  transition: "transform 0.6s",
});

const CardFront = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
  transform: "rotateY(180deg)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});

const CardBack = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#2c2c54",
  border: "2px solid #00aaff",
  borderRadius: "8px",
  transform: "rotateY(0deg)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#2c2c54",
  border: "2px solid #00d9ff",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
  padding: "20px",
  textAlign: "center",
  borderRadius: "10px",
};

const PixelTypography = styled(Typography)(() => ({
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "24px",
  color: "#fff",
  letterSpacing: "1px",
  textShadow: `
    -1px -1px 0 #ff0000,  
    1px -1px 0 #ff7f00, 
    1px 1px 0 #ffd700, 
    -1px 1px 0 #ff4500`,
}));

const PixelButtonModal = styled(Button)(() => ({
  backgroundColor: "#2c2c54",
  color: "#fff",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "14px",
  padding: "15px 30px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
  "&:hover": {
    backgroundColor: "#40407a",
    borderColor: "#00aaff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

// Card Component
const Card = ({ card, handleClick, flipped, matched }) => {
  const { transform } = useSpring({
    transform: flipped || matched ? "rotateY(180deg)" : "rotateY(0deg)",
    config: { tension: 500, friction: 30 },
  });

  return (
    <CardContainer onClick={handleClick}>
      <CardInner style={{ transform }}>
        <CardFront>
          <img
            src={card.image}
            alt="Card front"
            style={{ width: "140%", height: "140%" }}
          />
        </CardFront>
        <CardBack>
          <img
            src="/images/Back2.png"
            alt="Card back"
            style={{ width: "140%", height: "140%" }}
          />
        </CardBack>
      </CardInner>
    </CardContainer>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  handleClick: PropTypes.func.isRequired,
  flipped: PropTypes.bool.isRequired,
  matched: PropTypes.bool.isRequired,
};

const MemoryGame = () => {
  const navigate = useNavigate();
  const { difficulty } = useDifficulty();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [initialReveal, setInitialReveal] = useState(true);
  const [mouseDisabled, setMouseDisabled] = useState(false);
  const [bgVolume] = useState(
    parseInt(localStorage.getItem("bgVolume"), 10) || 0
  );
  const [sfxVolume] = useState(
    parseInt(localStorage.getItem("sfxVolume"), 10) || 0
  );
  const audioRef = useRef(null);
  const [audioIndex, setAudioIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  // Memoize the current difficulty cards
  const currentDifficultyCards = useMemo(() => {
    return cardImagesByDifficulty[difficulty] || [];
  }, [difficulty]);

  // Memoize the handleNewGame function
  const handleNewGame = useCallback(() => {
    console.log("Starting new game with difficulty:", difficulty);
    if (!currentDifficultyCards || currentDifficultyCards.length === 0) {
      console.error("No cards found for difficulty:", difficulty);
      return;
    }

    const newCards = [...currentDifficultyCards];
    const shuffledCards = shuffleArray(newCards);

    setCards(shuffledCards);
    setMatchedCards([]);
    setFlippedCards([]);
    setFailedAttempts(0);
    setTimer(0);
    setTimerActive(false);
    setInitialReveal(true);
    setAudioIndex(0);

    setMouseDisabled(true);
    setTimeout(() => {
      setMouseDisabled(false);
    }, 2000);

    setTimeout(() => {
      setInitialReveal(false);
      setTimerActive(true);
    }, 1500);
  }, [difficulty, currentDifficultyCards]);

  // Memoize the handleCardClick function
  const handleCardClick = useCallback(
    (card) => {
      if (
        !matchedCards.includes(card.id) &&
        flippedCards.length < 2 &&
        !flippedCards.some((c) => c.id === card.id) &&
        !mouseDisabled
      ) {
        setFlippedCards((prev) => [...prev, card]);
      }
    },
    [matchedCards, flippedCards, mouseDisabled]
  );

  // Memoize the handleBackButton function
  const handleBackButton = useCallback(() => {
    setOpenModal(true);
  }, []);

  // Memoize the handleModalYes function
  const handleModalYes = useCallback(() => {
    setOpenModal(false);
    localStorage.removeItem("gameCompleted");
    navigate("/play");
  }, [navigate]);

  // Memoize the handleModalNo function
  const handleModalNo = useCallback(() => {
    setOpenModal(false);
  }, []);

  // Initialize the game when the component mounts or difficulty changes
  useEffect(() => {
    if (difficulty) {
      handleNewGame();
    }
  }, [difficulty, handleNewGame]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Card matching effect
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;
      setTimeout(() => {
        if (card1.image === card2.image) {
          setMatchedCards((prev) => [...prev, card1.id, card2.id]);
          if (audioIndex < matchAudioFiles.length) {
            const nextAudio = new Audio(matchAudioFiles[audioIndex]);
            nextAudio.volume = sfxVolume / 100;
            nextAudio.play();
            setAudioIndex(audioIndex + 1);
          }
        } else {
          setFailedAttempts((prev) => prev + 1);
        }
        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards, audioIndex, sfxVolume]);

  // Game completion effect
  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      const congrats = new Audio(congratsAudio);
      congrats.volume = sfxVolume / 100;
      congrats.play();

      setTimerActive(false);

      const score = 100 - failedAttempts;
      const time = timer;
      const moves = matchedCards.length / 2;

      saveGameResult(score, time, moves);

      const saveData = async () => {
        try {
          await saveGameData({
            userID: localStorage.getItem("userID"),
            gameDate: new Date(),
            failed: failedAttempts,
            difficulty,
            completed: 1,
            timeTaken: timer,
          });
          localStorage.setItem("gameCompleted", "true");
          setTimeout(() => {
            navigate("/congratulations");
          }, 1000);
        } catch (error) {
          console.error("Error saving game data:", error);
        }
      };

      saveData();
    }
  }, [
    matchedCards,
    cards.length,
    navigate,
    sfxVolume,
    failedAttempts,
    timer,
    difficulty,
  ]);

  // Get grid configuration based on difficulty
  const getGridConfig = () => {
    switch (difficulty) {
      case "green":
        return { xs: 6, spacing: 6, maxWidth: 600, marginTop: "-80px" }; // 2x2 grid
      case "yellow":
        return { xs: 4, spacing: 10, maxWidth: 700, marginTop: "-50px" }; // 3x2 grid
      case "red":
        return { xs: 3, spacing: 8, maxWidth: 700, marginTop: "-120px" }; // 4x3 grid
      default:
        return { xs: 6, spacing: 6, maxWidth: 600, marginTop: "-80px" };
    }
  };

  const gridConfig = getGridConfig();

  return (
    <StyledGameContainer mouseDisabled={mouseDisabled}>
      <audio ref={audioRef} src={bgMusic} loop />
      <PixelButton
        onClick={handleBackButton}
        sx={{ alignSelf: "flex-start", margin: 2 }}
      >
        Back
      </PixelButton>
      <PixelTimerBox>Timer: {timer}s</PixelTimerBox>
      <PixelBox>Learning Moments: {failedAttempts}</PixelBox>
      <Grid
        container
        spacing={gridConfig.spacing}
        justifyContent="center"
        sx={{ maxWidth: gridConfig.maxWidth, marginTop: gridConfig.marginTop }}
      >
        {cards.map((card) => (
          <Grid item xs={gridConfig.xs} key={card.id}>
            <Card
              card={card}
              handleClick={() => handleCardClick(card)}
              flipped={
                initialReveal ||
                flippedCards.some((c) => c.id === card.id) ||
                matchedCards.includes(card.id)
              }
              matched={matchedCards.includes(card.id)}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <PixelButton
          onClick={() => {
            handleNewGame();
          }}
          sx={{ mt: 2 }}
        >
          New Game
        </PixelButton>
      </Box>

      <Modal open={openModal} onClose={handleModalNo}>
        <Box sx={modalStyle}>
          <PixelTypography variant="h6">
            Are you sure you want to go back to the play page?
          </PixelTypography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              marginTop: 2,
            }}
          >
            <PixelButtonModal
              onClick={() => {
                handleModalYes();
              }}
              variant="contained"
              color="primary"
            >
              Yes
            </PixelButtonModal>
            <PixelButtonModal
              onClick={handleModalNo}
              variant="contained"
              color="secondary"
            >
              No
            </PixelButtonModal>
          </Box>
        </Box>
      </Modal>
    </StyledGameContainer>
  );
};

export default MemoryGame;
