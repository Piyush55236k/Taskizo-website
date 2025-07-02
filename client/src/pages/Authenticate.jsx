import React, { useState } from 'react';
import '../styles/authenticate.css';
import Login from '../components/Login';
import Register from '../components/Register';
import { useNavigate } from 'react-router-dom';

const Authenticate = () => {
  const [authType, setAuthType] = useState('login');
  const navigate = useNavigate();

  return (
    <div className="authenticate-page">
      <div className="auth-navbar">
        <h3 onClick={() => navigate('/')}>Taskizo</h3>
        <div className="nav-right">
          <p onClick={() => navigate('/')}>Home</p>
        </div>
      </div>

      <div className="auth-toggle">
        <button
          className={authType === 'login' ? 'active' : ''}
          onClick={() => setAuthType('login')}
        >
          Login
        </button>
        <button
          className={authType === 'register' ? 'active' : ''}
          onClick={() => setAuthType('register')}
        >
          Register
        </button>
      </div>

      <div className="auth-container">
        {authType === 'login' ? (
          <Login setAuthType={setAuthType} />
        ) : (
          <Register setAuthType={setAuthType} />
        )}
      </div>
    </div>
  );
};

export default Authenticate;
