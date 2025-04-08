import axios from "axios";
import { ArrowLeft, Lock, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import styles from "./Register.module.css";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formData
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data.message || "Error registering");
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div
      className={styles.pageBackground}
      // style={{ backgroundImage: `url(${backgroundGif})` }}
    >
      <Header />
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <div className={styles.titleContainer}>
            <UserPlus size={32} className={styles.titleIcon} />
            <h2>Register</h2>
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
              className={`${styles.button} ${styles.registerButton}`}
            >
              <UserPlus size={20} className={styles.buttonIcon} />
              Register
            </button>
            <button
              type="button"
              onClick={handleBackToLogin}
              className={`${styles.button} ${styles.backButton}`}
            >
              <ArrowLeft size={20} className={styles.buttonIcon} />
              Back
            </button>
          </div>
          {message && <p className={styles.message}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
