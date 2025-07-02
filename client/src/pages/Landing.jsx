import React, { useEffect } from 'react';
import '../styles/landing.css';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('usertype');
    if (userType === 'freelancer') {
      navigate('/freelancer');
    } else if (userType === 'client') {
      navigate('/client');
    } else if (userType === 'admin') {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <div className="landing-page">
      <div className="landing-hero">
        {/* Navbar */}
        <div className="landing-nav">
          <h3>Taskizo</h3>
          <button onClick={() => navigate('/authenticate')}>Sign In</button>
        </div>

        {/* Hero Text */}
        <div className="landing-hero-text">
          <h1>Hire Top Talent. Get Work Done. Grow Faster.</h1>
          <p>
            Taskizo is a modern freelancing platform designed to connect
            talented freelancers with businesses and individuals who need tasks
            completed—quickly, efficiently, and securely.
          </p>
          <button onClick={() => navigate('/authenticate')}>Join Now</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
