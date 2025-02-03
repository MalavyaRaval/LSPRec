import React, { useState, useEffect } from 'react';
import Navbar from './Nav/Navbar';
import Footer from './Footer';
import '../CSS/myprofile.css';
import axiosInstance from './utils/axiosInstance';

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida',
  'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
  'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas',
  'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const MyProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    profilePicture: '',
  });
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/get-user');
        if (response.data && response.data.user) {
          setUser(response.data.user);
          setPreview(response.data.user.profilePicture);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({
          ...user,
          profilePicture: reader.result,
        });
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUser({
      ...user,
      profilePicture: '',
    });
    setPreview('');
  };

  const handleSave = async () => {
    try {
      await axiosInstance.put('/edit-account', user);
      localStorage.setItem('user', JSON.stringify(user));
      setEditing(false);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="content-wrap">
        <div className="container mt-4">
          <h1>My Profile</h1>
          <div className="profile-container">
            <div className="profile-picture">
              {preview ? (
                <img src={preview} alt="Profile" className="img-fluid" />
              ) : (
                <div className="placeholder">No Image</div>
              )}
            </div>
            {editing && (
              <div className="image-buttons">
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {preview && <button onClick={handleRemoveImage}>Remove Image</button>}
              </div>
            )}
            <div className="profile-details">
              {editing ? (
                <div>
                  <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="fullName" className="form-control" value={user.fullName} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" className="form-control" value={user.email} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Address:</label>
                    <input type="text" name="address" className="form-control" value={user.address} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>City:</label>
                    <input type="text" name="city" className="form-control" value={user.city} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>State:</label>
                    <select name="state" className="form-select" value={user.state} onChange={handleChange}>
                      <option defaultValue>Choose...</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Zip:</label>
                    <input type="text" name="zip" className="form-control" value={user.zip} onChange={handleChange} />
                  </div>
                  <button className="btn btn-primary" onClick={handleSave}>Save</button>
                  <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p><strong>Name:</strong> <span>{user.fullName}</span></p>
                  <p><strong>Email:</strong> <span>{user.email}</span></p>
                  <p><strong>Address:</strong> <span>{user.address}</span></p>
                  <p><strong>City:</strong> <span>{user.city}</span></p>
                  <p><strong>State:</strong> <span>{user.state}</span></p>
                  <p><strong>Zip:</strong> <span>{user.zip}</span></p>
                  <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyProfile;