import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import './UserList.css';
import Sidebar from '../Dash/Sidebar';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/faculty');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const getImageSrc = (user) => {
    if (user.profileImage && user.profileImage.data && user.profileImage.contentType) {
      const base64String = btoa(
        new Uint8Array(user.profileImage.data.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      return `data:${user.profileImage.contentType};base64,${base64String}`;
    } else {
      return '';
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = user.fullname.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    return fullName.includes(searchTermLower);
  });

  return (
    <div className="frame-container">
      <div className="left-frame">
        <Sidebar />
      </div>
      <div className="right-frame">
        {loading ? (
          <div className="loader">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <div className="user-list-container">
            <div className="search-bar">
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by name"
              />
            </div>
            <div className="faculty">FACULTY</div>
            <div className="user-cards">
              {filteredUsers.map((user) => (
                <div key={user._id} className="user-card">
                  <div className="image-container">
                    {user.profileImage && user.profileImage.data ? (
                      <img src={getImageSrc(user)} alt={user.fullname} />
                    ) : (
                      <span className="no-image">No Image Available</span>
                    )}
                  </div>
                  <div className="details">
                    <h3> {user.fullname}</h3>
                    <p>Mobile: {user.mobile}</p>
                    <p>Branch: {user.branch}</p>
                    <p>Email: {user.email}</p>
                    <button className="view-more-btn">View More</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;