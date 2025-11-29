import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function MyNetwork() {
  const [userData, setUserData] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('connections');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setUserData(response.data.user);
          // Fetch pending requests, sent requests, and connections after getting user data
          fetchPendingRequests(response.data.user._id);
          fetchSentRequests(response.data.user._id);
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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/match/requests/${userId}`);
      if (response.data.success) {
        setPendingRequests(response.data.requests);
      }
    } catch (err) {
      console.error('Error fetching pending requests:', err);
    }
  };

  const fetchSentRequests = async (userId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/match/sent-requests/${userId}`);
      if (response.data.success) {
        setSentRequests(response.data.requests);
      }
    } catch (err) {
      console.error('Error fetching sent requests:', err);
    }
  };

  const fetchConnections = async (userId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/match/connections/${userId}`);
      if (response.data.success) {
        setConnections(response.data.connections);
      }
    } catch (err) {
      console.error('Error fetching connections:', err);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/match/request/${requestId}/accept`, {
        userId: userData._id
      });
      if (response.data.success) {
        // Refresh all data
        fetchPendingRequests(userData._id);
        fetchSentRequests(userData._id);
        fetchConnections(userData._id);
      }
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/match/request/${requestId}/reject`, {
        userId: userData._id
      });
      if (response.data.success) {
        // Refresh all data
        fetchPendingRequests(userData._id);
        fetchSentRequests(userData._id);
        fetchConnections(userData._id);
      }
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  const handleRemoveConnection = async (connectionId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/match/connection/${connectionId}`, {
        data: { userId: userData._id }
      });
      if (response.data.success) {
        // Refresh all data
        fetchPendingRequests(userData._id);
        fetchSentRequests(userData._id);
        fetchConnections(userData._id);
      }
    } catch (err) {
      console.error('Error removing connection:', err);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/match/request/${requestId}`, {
        data: { userId: userData._id }
      });
      if (response.data.success) {
        // Refresh all data
        fetchPendingRequests(userData._id);
        fetchSentRequests(userData._id);
        fetchConnections(userData._id);
      }
    } catch (err) {
      console.error('Error canceling request:', err);
    }
  };

  const handleStartChat = async (otherUserId) => {
    try {
      // Create or get conversation with the user
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/direct-messages/conversation/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Navigate to chat page with conversation
        navigate('/chats', { state: { selectedConversation: response.data.conversation } });
      }
    } catch (err) {
      console.error('Error starting chat:', err);
    }
  };

  if (loading) {
    return <div className="text-white bg-black h-screen flex-col items-center justify-center gap-4">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8D2B7E]"></div>
    <div className="text-white bg-black h-screen flex items-center justify-center  font-bold"> Loading...</div>
    </div>
    
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black border-b border-[#8D2B7E]/20 p-3 sm:p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-[#8D2B7E] text-xl sm:text-2xl">&lt;/&gt;</span>
            <span className="text-[#8D2B7E] text-xl sm:text-2xl font-semibold">DevHub</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-6">
            <Link to="/dashboard" className="hover:text-[#8D2B7E] text-sm lg:text-base transition-colors">Home</Link>
            <Link to="/network" className="hover:text-[#8D2B7E] text-sm lg:text-base transition-colors">My Network</Link>
            <Link to="/chats" className="hover:text-[#8D2B7E] text-sm lg:text-base transition-colors">Chats</Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-white hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            {/* Profile Picture */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#8D2B7E] rounded-full overflow-hidden flex items-center justify-center">
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
                <span className="text-white text-sm sm:text-lg font-semibold">{userData?.username?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#8D2B7E]/20 mt-2 pt-3 pb-2">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/dashboard" 
                className="px-4 py-2 hover:bg-gray-800/50 rounded-lg transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/network" 
                className="px-4 py-2 hover:bg-gray-800/50 rounded-lg transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Network
              </Link>
              <Link 
                to="/chats" 
                className="px-4 py-2 hover:bg-gray-800/50 rounded-lg transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Chats
              </Link>
            </nav>
          </div>
        )}
      </header>

      <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">My Network</h1>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 sm:mb-8 bg-gray-900/50 p-1 rounded-lg w-full sm:w-fit overflow-x-auto">
          <button
            onClick={() => setActiveTab('connections')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
              activeTab === 'connections'
                ? 'bg-[#8D2B7E] text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            My Connections ({connections.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
              activeTab === 'pending'
                ? 'bg-[#8D2B7E] text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Pending Requests ({pendingRequests.length + sentRequests.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'connections' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">My Connections</h2>
            {connections.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-lg">No connections yet</p>
                <p className="text-gray-500 text-sm mt-2">Start connecting with other developers!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {connections.map(connection => (
                  <div key={connection.connectionId} className="bg-[#111] rounded-2xl sm:rounded-3xl border border-[#8D2B7E]/20 p-4 sm:p-6 hover:border-[#8D2B7E]/40 transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#8D2B7E] rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
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
                          <span className="text-white text-lg sm:text-2xl font-semibold">
                            {connection.username?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link 
                          to={`/user/${connection._id}`}
                          className="text-base sm:text-lg font-semibold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer block truncate"
                        >
                          {connection.username}
                        </Link>
                        <p className="text-xs sm:text-sm text-gray-400">
                          {connection.experienceYear} years experience
                        </p>
                      </div>
                    </div>
                    <div className="mb-3 sm:mb-4">
                      <p className="text-xs sm:text-sm mb-1.5 sm:mb-2">
                        <span className="text-gray-400">Languages: </span>
                        <span className="break-words">{connection.preferredLanguages?.join(', ') || 'N/A'}</span>
                      </p>
                      <p className="text-xs sm:text-sm">
                        <span className="text-gray-400">Availability: </span>
                        {connection.availability || 'N/A'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartChat(connection._id)}
                        className="flex-1 bg-[#8D2B7E] text-white py-1.5 sm:py-2 rounded-lg hover:bg-[#8D2B7E]/80 transition-colors text-xs sm:text-sm"
                      >
                        Message
                      </button>
                      <button
                        onClick={() => handleRemoveConnection(connection.connectionId)}
                        className="flex-1 bg-red-600 text-white py-1.5 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pending' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Pending Requests</h2>
            
            {/* Received Requests */}
            {pendingRequests.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-3 sm:mb-4">Received Requests ({pendingRequests.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {pendingRequests.map(request => (
                    <div key={request._id} className="bg-[#111] rounded-2xl sm:rounded-3xl border border-[#8D2B7E]/20 p-4 sm:p-6 hover:border-[#8D2B7E]/40 transition-colors">
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#8D2B7E] rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
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
                            <span className="text-white text-lg sm:text-2xl font-semibold">
                              {request.fromUser.username?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link 
                            to={`/user/${request.fromUser._id}`}
                            className="text-base sm:text-lg font-semibold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer block truncate"
                          >
                            {request.fromUser.username}
                          </Link>
                          <p className="text-xs sm:text-sm text-gray-400">
                            {request.fromUser.experienceYear} years experience
                          </p>
                        </div>
                      </div>
                      <div className="mb-3 sm:mb-4">
                        <p className="text-xs sm:text-sm mb-1.5 sm:mb-2">
                          <span className="text-gray-400">Languages: </span>
                          <span className="break-words">{request.fromUser.preferredLanguages?.join(', ') || 'N/A'}</span>
                        </p>
                        <p className="text-xs sm:text-sm">
                          <span className="text-gray-400">Availability: </span>
                          {request.fromUser.availability || 'N/A'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          className="flex-1 bg-[#8D2B7E] text-white py-1.5 sm:py-2 rounded-lg hover:bg-[#8D2B7E]/80 transition-colors text-xs sm:text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          className="flex-1 bg-gray-600 text-white py-1.5 sm:py-2 rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm"
                        >
                          Ignore
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sent Requests */}
            {sentRequests.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-3 sm:mb-4">Sent Requests ({sentRequests.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {sentRequests.map(request => (
                    <div key={request._id} className="bg-[#111] rounded-2xl sm:rounded-3xl border border-[#8D2B7E]/20 p-4 sm:p-6 hover:border-[#8D2B7E]/40 transition-colors">
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#8D2B7E] rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                          {request.toUser.profilePicture && request.toUser.profilePicture !== 'data:image/jpeg;base64' ? (
                            <img 
                              src={request.toUser.profilePicture.startsWith('data:') ? 
                                   request.toUser.profilePicture : 
                                   `data:image/jpeg;base64,${request.toUser.profilePicture}`} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Error loading profile picture:', e);
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-white text-lg sm:text-2xl font-semibold">
                              {request.toUser.username?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link 
                            to={`/user/${request.toUser._id}`}
                            className="text-base sm:text-lg font-semibold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer block truncate"
                          >
                            {request.toUser.username}
                          </Link>
                          <p className="text-xs sm:text-sm text-gray-400">
                            {request.toUser.experienceYear} years experience
                          </p>
                        </div>
                      </div>
                      <div className="mb-3 sm:mb-4">
                        <p className="text-xs sm:text-sm mb-1.5 sm:mb-2">
                          <span className="text-gray-400">Languages: </span>
                          <span className="break-words">{request.toUser.preferredLanguages?.join(', ') || 'N/A'}</span>
                        </p>
                        <p className="text-xs sm:text-sm">
                          <span className="text-gray-400">Availability: </span>
                          {request.toUser.availability || 'N/A'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCancelRequest(request._id)}
                          className="flex-1 bg-gray-600 text-white py-1.5 sm:py-2 rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm"
                        >
                          Cancel Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No requests message */}
            {pendingRequests.length === 0 && sentRequests.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-lg">No pending requests</p>
                <p className="text-gray-500 text-sm mt-2">All caught up!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyNetwork;
