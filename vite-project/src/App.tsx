import React, { useState, useEffect } from "react";
import "./App.css"; // External CSS for styling
import getServiceIcon from "./assets/get-service-icon.png";
import offerServiceIcon from "./assets/offer-service-icon.png";
import childIcon from "./assets/baby.png";
import adultIcon from "./assets/adult.png";
import agedIcon from "./assets/aged.png";
import paraMedIcon from "./assets/para_med.png";
import logo from "./assets/freelancer-logo.png";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZCa4Z9BuDG7bsWRlOiV12FREFJd5zphc",
  appId: "1:618462469952:web:fb3f4984b6b5703c2424a5",
  messagingSenderId: "618462469952",
  projectId: "vacmed-fa567",
  authDomain: "vacmed-fa567.firebaseapp.com",
  storageBucket: "vacmed-fa567.firebasestorage.app",
  measurementId: "G-Z2EDFF7YP7",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const App: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and register forms

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      setIsLoggedIn(true);
      alert("Signed In Successfully!");
    } catch (error: any) {
      alert("Error in logging in");
      setErrorMessage(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    alert("Logged Out Successfully!");
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      alert(`Registration Successful! Welcome ${userCredential.user.email}`);
      setIsRegistering(false); // Switch back to login after successful registration
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <img src={logo} alt="Freelancer Logo" className="app-logo" />
        {isLoggedIn && (
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        )}
      </header>
      <main className="app-main">
        {!isLoggedIn ? (
          !isRegistering ? (
            <div className="login-container">
              <div className="login-box">
                <h2 className="login-title">Sign In</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="login-input"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="login-input"
                />
                <button onClick={handleLogin} className="login-button">
                  Sign In
                </button>
                <p className="register-link">
                  Don't have an account?{" "}
                  <button onClick={() => setIsRegistering(true)} className="signin-link">
  Create Account
</button>

                </p>
              </div>
            </div>
          ) : (
            <div className="register-container">
              <div className="register-box">
                <h2>Create Account</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                />
                <button onClick={handleRegister}>Create Account</button>
                <p>
                  Already have an account?{" "}
                  <span onClick={() => setIsRegistering(false)} className="signin-link">
                    Sign In
                  </span>
                </p>
              </div>
            </div>
          )
        ) : (
          <div className="card-container">
            <div className="info-card">
              <a href="vacc-chart.html?serviceType=getService" className="info-card-link">
                <img src={childIcon} alt="Child Registration" />
              </a>
              <h3>Child Registration</h3>
            </div>
            <div className="info-card">
              <a href="AddAdult.html?serviceType=getService" className="info-card-link">
                <img src={adultIcon} alt="Vaccination Schedule" />
              </a>
              <h3>Adult Registration</h3>
            </div>
            <div className="info-card">
              <a href="search.html?serviceType=getService" className="info-card-link">
                <img src={agedIcon} alt="Reminders & Alerts" />
              </a>
              <h3>Senior Citizen</h3>
            </div>
            <div className="info-card">
              <a href="index.html?serviceType=offerService" className="info-card-link">
                <img src={paraMedIcon} alt="Digital Reports" />
              </a>
              <h3>Para-medical Professional</h3>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
