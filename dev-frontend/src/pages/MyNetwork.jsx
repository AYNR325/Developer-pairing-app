import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MyNetwork() {
  const [userData, setUserData] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/check-auth', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setUserData(response.data.user);
          // Fetch pending requests and connections after getting user data
          fetchPendingRequests(response.data.user._id);
          fetchConnections(response.data.user._id);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUserData();
  }, [token]);

  const fetchPendingRequests = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/match/requests/${userId}`);
      if (response.data.success) {
        setPendingRequests(response.data.requests);
      }
    } catch (err) {
      console.error('Error fetching pending requests:', err);
    }
  };

  const fetchConnections = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/match/connections/${userId}`);
      if (response.data.success) {
        setConnections(response.data.connections);
      }
    } catch (err) {
      console.error('Error fetching connections:', err);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/match/request/${requestId}/accept`, {
        userId: userData._id
      });
      if (response.data.success) {
        // Refresh both pending requests and connections
        fetchPendingRequests(userData._id);
        fetchConnections(userData._id);
      }
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/match/request/${requestId}/reject`, {
        userId: userData._id
      });
      if (response.data.success) {
        // Refresh pending requests
        fetchPendingRequests(userData._id);
      }
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  const handleRemoveConnection = async (connectionId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/match/connection/${connectionId}`, {
        data: { userId: userData._id }
      });
      if (response.data.success) {
        // Refresh connections
        fetchConnections(userData._id);
      }
    } catch (err) {
      console.error('Error removing connection:', err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black border-b border-[#8D2B7E]/20 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-[#8D2B7E] text-2xl">&lt;/&gt;</span>
            <span className="text-[#8D2B7E] text-2xl font-semibold">DevHub</span>
          </div>
          <nav className="flex space-x-6">
            <Link to="/dashboard" className="hover:text-[#8D2B7E]">Home</Link>
            <Link to="/network" className="hover:text-[#8D2B7E]">My Network</Link>
            <Link to="/chats" className="hover:text-[#8D2B7E]">Chats</Link>
          </nav>
          <div className="w-10 h-10 bg-[#8D2B7E] rounded-full overflow-hidden flex items-center justify-center">
            {userData?.profilePicture && userData.profilePicture !== 'data:image/jpeg;base64' ? (
              <img 
                src={userData.profilePicture.startsWith('data:') ? 
                     userData.profilePicture : 
                     `data:image/jpeg;base64,${userData.profilePicture}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Error loading profile picture:', e);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <span className="text-white text-lg font-semibold">{userData?.username?.charAt(0)?.toUpperCase() || 'U'}</span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">My Network</h1>

        {/* Pending Requests Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Pending Requests</h2>
          {pendingRequests.length === 0 ? (
            <p className="text-gray-400">No pending connection requests</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingRequests.map(request => (
                <div key={request._id} className="bg-[#111] rounded-3xl border border-[#8D2B7E]/20 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-[#8D2B7E] rounded-full overflow-hidden flex items-center justify-center">
                      {request.fromUser.profilePicture && request.fromUser.profilePicture !== 'data:image/jpeg;base64' ? (
                        <img 
                          src={request.fromUser.profilePicture.startsWith('data:') ? 
                               request.fromUser.profilePicture : 
                               `data:image/jpeg;base64,${request.fromUser.profilePicture}`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Error loading profile picture:', e);
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-white text-2xl font-semibold">
                          {request.fromUser.username?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{request.fromUser.username}</h3>
                      <p className="text-sm text-gray-400">
                        {request.fromUser.experienceYear} years experience
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm mb-2">
                      <span className="text-gray-400">Languages: </span>
                      {request.fromUser.preferredLanguages?.join(', ') || 'N/A'}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-400">Availability: </span>
                      {request.fromUser.availability || 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request._id)}
                      className="flex-1 bg-[#8D2B7E] text-white py-2 rounded-lg hover:bg-[#8D2B7E]/80 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Connections Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Connections</h2>
          {connections.length === 0 ? (
            <p className="text-gray-400">No connections yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections.map(connection => (
                <div key={connection.connectionId} className="bg-[#111] rounded-3xl border border-[#8D2B7E]/20 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-[#8D2B7E] rounded-full overflow-hidden flex items-center justify-center">
                      {connection.profilePicture && connection.profilePicture !== 'data:image/jpeg;base64' ? (
                        <img 
                          src={connection.profilePicture.startsWith('data:') ? 
                               connection.profilePicture : 
                               `data:image/jpeg;base64,${connection.profilePicture}`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Error loading profile picture:', e);
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-white text-2xl font-semibold">
                          {connection.username?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{connection.username}</h3>
                      <p className="text-sm text-gray-400">
                        {connection.experienceYear} years experience
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm mb-2">
                      <span className="text-gray-400">Languages: </span>
                      {connection.preferredLanguages?.join(', ') || 'N/A'}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-400">Availability: </span>
                      {connection.availability || 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/chats/${connection._id}`}
                      className="flex-1 bg-[#8D2B7E] text-white py-2 rounded-lg text-center hover:bg-[#8D2B7E]/80 transition-colors"
                    >
                      Message
                    </Link>
                    <button
                      onClick={() => handleRemoveConnection(connection.connectionId)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyNetwork;
