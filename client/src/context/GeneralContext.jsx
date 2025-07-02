import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

// === Create Global Context ===
export const GeneralContext = createContext();

// === Context Provider ===
const GeneralContextProvider = ({ children }) => {
  const WS = 'http://localhost:6001';
  const navigate = useNavigate();

  const socket = io(WS, { transports: ['websocket'] });

  // === User States ===
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');

  // === Input Object ===
  const inputs = { username, email, password, usertype };

  // === Login Function ===
  const login = async () => {
    try {
      const response = await axios.post(`${WS}/login`, {
        email,
        password,
      });

      const data = response.data;

      saveUserToLocal(data);

      redirectUser(data.usertype);
    } catch (err) {
      console.error('Login Failed:', err);
      alert('Login Failed. Check your credentials.');
    }
  };

  // === Register Function ===
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

  // === Logout Function ===
  const logout = () => {
    localStorage.clear();
    setUsername('');
    setEmail('');
    setPassword('');
    setUsertype('');
    navigate('/');
  };

  // === Save User to Local Storage ===
  const saveUserToLocal = (data) => {
    localStorage.setItem('userId', data._id);
    localStorage.setItem('username', data.username);
    localStorage.setItem('email', data.email);
    localStorage.setItem('usertype', data.usertype);

    setUsername(data.username);
    setEmail(data.email);
    setUsertype(data.usertype);
  };

  // === Redirect Based on Usertype ===
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

  // === Auto Login Effect ===
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
