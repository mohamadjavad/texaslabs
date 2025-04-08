import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Header from "./components/Header";
import GameHistory from "./GameHistory/GameHistory";
import Login from "./Login/Login";
import Register from "./Login/Register";
import Congratulations from "./MemoryCardGame/Congratulations";
import { DifficultyProvider } from "./MemoryCardGame/DifficultyContext";
import MemoryGame from "./MemoryCardGame/MemoryGame";
import Play from "./MemoryCardGame/Play";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // const handleLogout = () => {
  //   setIsAuthenticated(false);
  //   localStorage.removeItem('token');
  // };

  return (
    <DifficultyProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/congratulations"
            element={
              isAuthenticated ? <Congratulations /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/memory-card-game"
            element={
              isAuthenticated ? <MemoryGame /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/play"
            element={isAuthenticated ? <Play /> : <Navigate to="/login" />}
          />
          <Route
            path="/history"
            element={
              isAuthenticated ? <GameHistory /> : <Navigate to="/login" />
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </DifficultyProvider>
  );
};

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <App />
  // </StrictMode>
);
