import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

// === Create Global Context ===
export const GeneralContext = createContext();

// === Context Provider ===
const GeneralContextProvider = ({ children }) => {
  const WS = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  // ✅ Initialize socket
  const socket = io(WS, {
    transports: ['websocket'],
    withCredentials: true,
    reconnectionAttempts: 5,
  });

  // ✅ Socket lifecycle logging
  useEffect(() => {
    

    socket.on('connect', () => {
      
    });

    socket.on('connect_error', (err) => {
      console.error('❌ WebSocket connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.warn('⚠️ WebSocket disconnected:', reason);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, WS]);

  // === User States ===
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');

  const inputs = { username, email, password, usertype };

  const login = async () => {
    try {
      const response = await axios.post(`${WS}/login`, { email, password });
      const data = response.data;
      saveUserToLocal(data);
      redirectUser(data.usertype);
    } catch (err) {
      console.error('Login Failed:', err);
      alert('Login Failed. Check your credentials.');
    }
  };

  const register = async () => {
    try {
      const response = await axios.post(`${WS}/register`, inputs);
      const data = response.data;
      saveUserToLocal(data);
      redirectUser(data.usertype);
    } catch (err) {
      console.error('Registration Failed:', err);
      alert('Registration Failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.clear();
    setUsername('');
    setEmail('');
    setPassword('');
    setUsertype('');
    navigate('/');
  };

  const saveUserToLocal = (data) => {
    localStorage.setItem('userId', data._id);
    localStorage.setItem('username', data.username);
    localStorage.setItem('email', data.email);
    localStorage.setItem('usertype', data.usertype);

    setUsername(data.username);
    setEmail(data.email);
    setUsertype(data.usertype);
  };

  const redirectUser = (type) => {
    if (type === 'freelancer') {
      navigate('/freelancer');
    } else if (type === 'client') {
      navigate('/client');
    } else if (type === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    const localUsertype = localStorage.getItem('usertype');
    const localUsername = localStorage.getItem('username');
    const localEmail = localStorage.getItem('email');

    if (localUsertype && localUsername && localEmail) {
      setUsertype(localUsertype);
      setUsername(localUsername);
      setEmail(localEmail);
      redirectUser(localUsertype);
    }
  }, []);

  return (
    <GeneralContext.Provider
      value={{
        socket,
        login,
        register,
        logout,
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        usertype,
        setUsertype,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
