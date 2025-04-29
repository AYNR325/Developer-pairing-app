import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem('token');

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/check-auth', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          console.log('Complete user data:', response.data.user); // For debugging
          setUserData(response.data.user);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  const challenges = [
    {
      id: 1,
      title: "Transforming Cancer Navigation with Open Data & APIs",
      description: "Support care Navigators with digital tools that integrate openly available datasets and APIs. Enhance patient care and support systems.",
      author: "Shravani Sawant"
    },
    {
      id: 2,
      title: "Transforming Cancer Navigation with Open Data & APIs",
      description: "Support care Navigators with digital tools that integrate openly available datasets and APIs. Enhance patient care and support systems.",
      author: "Shravani Sawant"
    },
    {
      id: 3,
      title: "Transforming Cancer Navigation with Open Data & APIs",
      description: "Support care Navigators with digital tools that integrate openly available datasets and APIs. Enhance patient care and support systems.",
      author: "Shravani Sawant"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header - Made Sticky */}
      <header className="bg-black border-b border-[#8D2B7E]/20 p-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-[#8D2B7E] text-2xl">&lt;/&gt;</span>
            <span className="text-[#8D2B7E] text-2xl font-semibold">DevHub</span>
          </div>
          <div className="flex items-center space-x-8">
            <input
              type="search"
              placeholder="Search"
              className="bg-black border border-[#8D2B7E]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#8D2B7E]"
            />
            <nav className="flex space-x-6">
              <Link to="/dashboard" className="hover:text-[#8D2B7E]">Home</Link>
              <Link to="/network" className="hover:text-[#8D2B7E]">My Network</Link>
              <Link to="/chats" className="hover:text-[#8D2B7E]">Chats</Link>
            </nav>
            <div className="w-10 h-10 bg-[#8D2B7E] rounded-full overflow-hidden">
              {userData?.profilePicture ? (
                <img 
                  src={userData.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  {userData?.username?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-[73px]"> {/* Added padding-top to account for fixed header */}
        {/* Sidebar - Made Sticky */}
        <aside className="w-64 bg-[#8D2B7E] fixed left-0 top-[73px] bottom-0 flex flex-col">
          <nav className="p-4 space-y-4 flex-grow">
            <Link to="/dashboard" className="block py-2 px-4 bg-[#8D2B7E] text-white rounded">
              Dashboard
            </Link>
            <Link to="/join-challenge" className="block py-2 px-4 hover:bg-[#8D2B7E]/80 text-white rounded">
              Join Challenge
            </Link>
            <Link to="/create-challenge" className="block py-2 px-4 hover:bg-[#8D2B7E]/80 text-white rounded">
              Create Challenge
            </Link>
            <Link to="/help" className="block py-2 px-4 hover:bg-[#8D2B7E]/80 text-white rounded">
              Help Center
            </Link>
          </nav>
          {/* Sign Out Button */}
          <div className="p-4 border-t border-[#8D2B7E]/20">
            <button
              onClick={handleSignOut}
              className="w-full py-2 px-4 bg-[#111] text-white rounded hover:bg-[#222] transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.414l-4.293 4.293a1 1 0 01-1.414 0L4 7.414 5.414 6l3.293 3.293L12 6l2 1.414z" clipRule="evenodd" />
              </svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content - Added margin-left to account for fixed sidebar */}
        <main className="flex-1 p-8 ml-64">
          {/* Profile Card */}
          <div className="bg-[#111] rounded-3xl border border-[#8D2B7E]/20 p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-[#8D2B7E] rounded-full overflow-hidden">
                {userData?.profilePicture ? (
                  <img 
                    src={userData.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-3xl">
                    {userData?.username?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-lg">Name: {userData?.username || 'Not set'}</p>
                <p>Experience: {userData?.experienceYear ? `${userData.experienceYear} year${userData.experienceYear > 1 ? 's' : ''}` : 'Not set'}</p>
                <p>Languages: {userData?.preferredLanguages?.length > 0 ? userData.preferredLanguages.join(', ') : 'Not set'}</p>
                <p>Additional Skills: {userData?.additionalSkills?.length > 0 ? userData.additionalSkills.join(', ') : 'Not set'}</p>
                <p>Availability: {userData?.availability || 'Not set'}</p>
                <Link 
                  to="/completeprofile" 
                  className="inline-block mt-4 px-6 py-2 bg-[#8D2B7E] text-white rounded-lg hover:bg-[#8D2B7E]/80 transition-colors"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map(challenge => (
              <div 
                key={challenge.id} 
                className="bg-[#111] rounded-3xl border border-[#8D2B7E]/20 p-6"
              >
                <p className="text-[#8D2B7E] mb-2">~ By{challenge.author}</p>
                <h3 className="text-lg font-semibold mb-2">{challenge.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{challenge.description}</p>
                <button className="px-6 py-2 bg-[#8D2B7E] text-white rounded-lg hover:bg-[#8D2B7E]/80 transition-colors">
                  View
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
