import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import "./Register.css"; // Assuming you have some styles for this

const firebaseConfig = {
  apiKey: "AIzaSyDZCa4Z9BuDG7bsWRlOiV12FREFJd5zphc",
  appId: "1:618462469952:web:fb3f4984b6b5703c2424a5",
  messagingSenderId: "618462469952",
  projectId: "vacmed-fa567",
  authDomain: "vacmed-fa567.firebaseapp.com",
  storageBucket: "vacmed-fa567.firebasestorage.app",
  measurementId: "G-Z2EDFF7YP7",
};

// Initialize Firebase
const auth = getAuth();

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      alert(`Registration Successful! Welcome ${userCredential.user.email}`);
      navigate('/login'); // Navigate back to login page after successful registration
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <img src="/assets/registeri.png" alt="Register" className="register-image" />
        <h2>Create Account</h2>
        {error && <p className="error-message">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button onClick={handleRegister}>Create Account</button>
        <p>
          Already have an account? <span onClick={() => navigate('/login')} className="signin-link">Sign In</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
