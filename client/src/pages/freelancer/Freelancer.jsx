import React, { useEffect, useState } from 'react';
import '../../styles/freelancer/freelancer.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Freelancer = () => {
  const [isDataUpdateOpen, setIsDataUpdateOpen] = useState(false);
  const [freelancerData, setFreelancerData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [description, setDescription] = useState('');
  const [freelancerId, setFreelancerId] = useState('');
  const [updateSkills, setUpdateSkills] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [applicationsCount, setApplicationsCount] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) fetchUserData(id);
    fetchApplications();
  }, []);

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-freelancer/${id}`);
      const data = response.data;

      setFreelancerData(data);
      setFreelancerId(data._id);
      setSkills(Array.isArray(data.skills) ? data.skills : []);
      setDescription(data.description || '');
      setUpdateSkills(data.skills.join(', ')); // Pre-fill input
      setUpdateDescription(data.description || '');
    } catch (err) {
      console.error('Failed to fetch freelancer data:', err);
    }
  };

  const updateUserData = async () => {
    try {
      const skillArray = updateSkills.split(',').map(s => s.trim()).filter(Boolean);

      await axios.post(`${process.env.REACT_APP_API_URL}/update-freelancer`, {
        freelancerId,
        updateSkills: skillArray,
        description: updateDescription
      });

      await fetchUserData(freelancerId);
      alert("User data updated");
      setIsDataUpdateOpen(false);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-applications`);
      const filtered = response.data.filter(app => app.freelancerId === localStorage.getItem('userId'));
      setApplicationsCount(filtered);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  return (
    <>
      {freelancerData ? (
        <div className="freelancer-home">
          <div className="home-cards">
            <div className="home-card">
              <h4>Current projects</h4>
              <p>{freelancerData.currentProjects.length}</p>
              <button onClick={() => navigate('/my-projects')}>View projects</button>
            </div>

            <div className="home-card">
              <h4>Completed projects</h4>
              <p>{freelancerData.completedProjects.length}</p>
              <button onClick={() => navigate('/my-projects')}>View projects</button>
            </div>

            <div className="home-card">
              <h4>Applications</h4>
              <p>{applicationsCount.length}</p>
              <button onClick={() => navigate('/myApplications')}>View Applications</button>
            </div>

            <div className="home-card">
              <h4>Funds</h4>
              <p>Available: ₹{freelancerData.funds}</p>
            </div>
          </div>

          <div className="freelancer-details">
            {!isDataUpdateOpen ? (
              <div className="freelancer-details-data">
                <span>
                  <h4>My Skills</h4>
                  <div className="skills">
                    {Array.isArray(skills) && skills.length > 0 ? (
                      skills.map((skill, index) => (
                        <h5 className="skill" key={index}>{skill}</h5>
                      ))
                    ) : (
                      <p>No skills available</p>
                    )}
                  </div>
                </span>

                <span>
                  <h4>Description</h4>
                  <p>{description || "Please add your description"}</p>
                </span>

                <button className="btn btn-outline-success" onClick={() => setIsDataUpdateOpen(true)}>
                  Update
                </button>
              </div>
            ) : (
              <div className="freelancer-details-update">
                <span>
                  <label htmlFor="mySkills"><h4>My Skills</h4></label>
                  <input
                    type="text"
                    className="form-control"
                    id="mySkills"
                    placeholder="Enter skills comma-separated"
                    value={updateSkills}
                    onChange={(e) => setUpdateSkills(e.target.value)}
                  />
                </span>

                <span>
                  <label htmlFor="description-textarea"><h4>Description</h4></label>
                  <textarea
                    className="form-control"
                    id="description-textarea"
                    placeholder="Enter your description"
                    value={updateDescription}
                    onChange={(e) => setUpdateDescription(e.target.value)}
                  ></textarea>
                </span>

                <button className="btn btn-outline-success mt-3" onClick={updateUserData}>
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading freelancer data...</p>
      )}
    </>
  );
};

export default Freelancer;
