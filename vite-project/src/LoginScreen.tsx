import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDZCa4Z9BuDG7bsWRlOiV12FREFJd5zphc',
  appId: '1:618462469952:web:fb3f4984b6b5703c2424a5',
  messagingSenderId: '618462469952',
  projectId: 'vacmed-fa567',
  authDomain: 'vacmed-fa567.firebaseapp.com',
  storageBucket: 'vacmed-fa567.firebasestorage.app',
  measurementId: 'G-Z2EDFF7YP7',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      // Redirect to Welcome Screen after successful login
      window.location.href = '/welcomescreen'; // You can also use react-router for navigation
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F8BBD0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ padding: '16px', maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="material-icons" style={{ fontSize: '80px', color: '#1976D2' }}>health_and_safety</i>
        </div>
        <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>Sign In</h2>
        
        {errorMessage && (
          <div style={{ color: 'red', marginBottom: '10px' }}>
            <p>{errorMessage}</p>
          </div>
        )}
        
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '30px', border: 'none', backgroundColor: '#fff' }}
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '30px', border: 'none', backgroundColor: '#fff' }}
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" disabled />
            <span style={{ fontSize: '14px' }}>Remember</span>
          </div>
          <button
            style={{ fontSize: '14px', color: '#1976D2', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={() => alert('Forgot password logic')}
          >
            Forgot Password?
          </button>
        </div>
        
        <button
          onClick={handleLogin}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '30px',
            backgroundColor: '#1976D2',
            color: '#fff',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Signing In...' : 'SIGN IN'}
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <span>Don't have an account? </span>
          <button
            onClick={() => (window.location.href = '/register')}
            style={{ fontWeight: 'bold', color: '#1976D2', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
