import axios from "axios";
import { Lock, LogIn, User, UserPlus } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userID", response.data.userID);
      onLogin();
      navigate("/play");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("User not found. Please register first.");
      } else {
        setError(error.response?.data.message || "Error logging in");
      }
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div
      className={styles.pageBackground}
      // style={{ backgroundImage: `url(${backgroundGif})` }}
    >
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <div className={styles.titleContainer}>
            <LogIn size={32} className={styles.titleIcon} />
            <h2>Login</h2>
          </div>
          <div className={styles.inputContainer}>
            <User className={styles.inputIcon} />
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className={styles.input}
            />
          </div>
          <div className={styles.inputContainer}>
            <Lock className={styles.inputIcon} />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={styles.input}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button
              type="submit"
              className={`${styles.button} ${styles.loginButton}`}
            >
              <LogIn size={20} className={styles.buttonIcon} />
              Login
            </button>
            <button
              type="button"
              onClick={handleRegisterRedirect}
              className={`${styles.button} ${styles.registerButton}`}
            >
              <UserPlus size={20} className={styles.buttonIcon} />
              Register
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
