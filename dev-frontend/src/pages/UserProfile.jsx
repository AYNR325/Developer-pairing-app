import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setUserProfile(response.data.user);
        } else {
          setError('Failed to fetch user profile');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.response?.data?.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8D2B7E] mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#8D2B7E] text-white px-4 py-2 rounded hover:bg-[#8D2B7E]/80"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">User not found</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#8D2B7E] text-white px-4 py-2 rounded hover:bg-[#8D2B7E]/80"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b-2 border-[#FF96F5] p-3 sm:p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-[#8D2B7E] text-xl sm:text-2xl">&lt;/&gt;</span>
            <span className="text-[#8D2B7E] text-xl sm:text-2xl font-semibold">DevHub</span>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#8D2B7E] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#8D2B7E]/80 transition-colors text-sm sm:text-base"
          >
            ← Back
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Profile Hero Card */}
        <div className="bg-gradient-to-br from-[#2D033B] via-[#111] to-[#2D033B] rounded-2xl sm:rounded-3xl border-2 border-[#8D2B7E]/50 p-6 sm:p-8 mb-6 sm:mb-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8D2B7E]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF96F5]/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 mb-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-[#8D2B7E] to-[#FF96F5] rounded-2xl sm:rounded-3xl overflow-hidden flex items-center justify-center shadow-xl border-4 border-[#8D2B7E]/30">
                  {userProfile?.profilePicture ? (
                    <img 
                      src={`data:image/jpeg;base64,${userProfile.profilePicture}`}
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold">
                      {userProfile?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-4 border-[#2D033B]"></div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                  {userProfile?.username || 'User'}
                </h1>
                <p className="text-gray-300 text-base sm:text-lg mb-4 flex items-center gap-2">
                  <span>📧</span>
                  {userProfile?.email || 'No email provided'}
                </p>
              </div>
            </div>

            {/* Bio */}
            {userProfile?.bio && (
              <div className="bg-[#111]/50 rounded-xl p-4 sm:p-5 border border-[#8D2B7E]/20 mb-6">
                <h3 className="text-sm font-semibold text-[#FF96F5] uppercase tracking-wide mb-2 flex items-center gap-2">
                  <span>📝</span> Bio
                </h3>
                <p className="text-white text-sm sm:text-base leading-relaxed">{userProfile.bio}</p>
              </div>
            )}

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <div className="bg-[#111]/50 rounded-xl p-4 border border-[#8D2B7E]/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📍</span>
                  <h3 className="text-xs font-semibold text-[#FF96F5] uppercase tracking-wide">Location</h3>
                </div>
                <p className="text-white text-sm sm:text-base font-medium">
                  {userProfile?.location || 'Not specified'}
                </p>
              </div>

              {/* Experience Level */}
              <div className="bg-[#111]/50 rounded-xl p-4 border border-[#8D2B7E]/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">⭐</span>
                  <h3 className="text-xs font-semibold text-[#FF96F5] uppercase tracking-wide">Level</h3>
                </div>
                <p className="text-white text-sm sm:text-base font-medium">
                  {userProfile?.experienceLevel ? 
                    userProfile.experienceLevel.charAt(0) + userProfile.experienceLevel.slice(1).toLowerCase() 
                    : 'Not specified'}
                </p>
              </div>

              {/* Experience Years */}
              <div className="bg-[#111]/50 rounded-xl p-4 border border-[#8D2B7E]/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">💼</span>
                  <h3 className="text-xs font-semibold text-[#FF96F5] uppercase tracking-wide">Experience</h3>
                </div>
                <p className="text-white text-sm sm:text-base font-medium">
                  {userProfile?.experienceYear !== undefined && userProfile?.experienceYear !== null 
                    ? `${userProfile.experienceYear} year${userProfile.experienceYear !== 1 ? 's' : ''}`
                    : 'Not specified'}
                </p>
              </div>

              {/* Availability */}
              <div className="bg-[#111]/50 rounded-xl p-4 border border-[#8D2B7E]/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">⏰</span>
                  <h3 className="text-xs font-semibold text-[#FF96F5] uppercase tracking-wide">Availability</h3>
                </div>
                <p className="text-white text-sm sm:text-base font-medium">
                  {userProfile?.availability ? 
                    userProfile.availability.replace('-', ' ').charAt(0) + userProfile.availability.slice(1).toLowerCase()
                    : 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Programming Languages */}
          <div className="bg-gradient-to-br from-[#2D033B] via-[#111] to-[#2D033B] rounded-2xl sm:rounded-3xl border-2 border-[#8D2B7E]/50 p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8D2B7E]/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-[#FF96F5] mb-4 flex items-center gap-2">
                <span>💻</span> Programming Languages
              </h3>
              {userProfile?.preferredLanguages && userProfile.preferredLanguages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userProfile.preferredLanguages.map((lang, index) => (
                    <span 
                      key={index}
                      className="bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm sm:text-base">No programming languages specified</p>
              )}
            </div>
          </div>

          {/* Additional Skills */}
          <div className="bg-gradient-to-br from-[#2D033B] via-[#111] to-[#2D033B] rounded-2xl sm:rounded-3xl border-2 border-[#8D2B7E]/50 p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF96F5]/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-[#FF96F5] mb-4 flex items-center gap-2">
                <span>🚀</span> Additional Skills
              </h3>
              {userProfile?.additionalSkills && userProfile.additionalSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userProfile.additionalSkills.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-[#8D2B7E]/20 text-white border border-[#8D2B7E]/50 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm sm:text-base">No additional skills specified</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base font-medium"
          >
            ← Go Back
          </button>
          <Link 
            to={`/network`}
            className="bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white px-6 py-3 rounded-lg hover:from-[#A259C6] hover:to-[#FF96F5] transition-all text-sm sm:text-base font-semibold shadow-lg text-center"
          >
            View Network
          </Link>
        </div> */}
      </div>
    </div>
  );
}

export default UserProfile; 