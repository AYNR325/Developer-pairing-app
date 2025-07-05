import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EXPERIENCE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const LANGUAGE_OPTIONS = [
  'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'PHP', 'Swift', 'Go', 'C#', 'Kotlin', 'Rust', 'TypeScript', 'Dart', 'Scala', 'Perl', 'Shell', 'C'
];
const AVAILABILITY_OPTIONS = ['Full-time', 'Part-time', 'Weekends'];

function Search() {
  const [userData, setUserData] = useState(null);
  const [filters, setFilters] = useState({ experienceYear: '', preferredLanguages: [], availability: '' });
  const [searchName, setSearchName] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState({}); // { userId: 'pending' | 'sent' }
  const [hasSearched, setHasSearched] = useState(false); // Track if user has searched or filtered
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/check-auth', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          console.log('User profile picture data:', response.data.user.profilePicture);
          setUserData(response.data.user);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    if (token) fetchUserData();
  }, [token]);

  // Fetch recommended developers or search results
  const fetchResults = async (customFilters = null, customSearchName = null) => {
    if (!userData) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('userId', userData._id);
      const nameToUse = customSearchName !== null ? customSearchName : searchName;
      const filtersToUse = customFilters !== null ? customFilters : filters;
      if (nameToUse.trim()) {
        params.append('name', nameToUse.trim());
      } else {
        if (filtersToUse.experienceYear) {
          params.append('experienceYear', filtersToUse.experienceYear);
        }
        if (filtersToUse.preferredLanguages && filtersToUse.preferredLanguages.length > 0) {
          filtersToUse.preferredLanguages.forEach(lang => {
            params.append('preferredLanguages', lang);
          });
        }
        if (filtersToUse.availability) {
          params.append('availability', filtersToUse.availability);
        }
      }
      const res = await axios.get(`http://localhost:3000/api/match?${params.toString()}`);
      if (res.data.success) {
        console.log('Developer profile pictures:', res.data.users.map(u => u.profilePicture));
        setResults(res.data.users);
      }
    } catch (err) {
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  // On userData load, fetch recommended developers using user's profile, but do NOT set filters
  useEffect(() => {
    if (userData) {
      fetchResults({
        experienceYear: userData.experienceYear || '',
        preferredLanguages: userData.preferredLanguages || [],
        availability: userData.availability || ''
      }, '');
    }
    // eslint-disable-next-line
  }, [userData]);

  // Filter change handler
  const handleFilterChange = (key, value) => {
    setHasSearched(true);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Multi-select for languages
  const handleLanguageToggle = (lang) => {
    setHasSearched(true);
    setFilters(prev => ({
      ...prev,
      preferredLanguages: prev.preferredLanguages.includes(lang)
        ? prev.preferredLanguages.filter(l => l !== lang)
        : [...prev.preferredLanguages, lang]
    }));
  };

  // Search button
  const handleSearch = () => {
    setHasSearched(true);
    fetchResults();
  };

  // Clear filters
  const handleClear = () => {
    setHasSearched(true);
    setFilters({ experienceYear: '', preferredLanguages: [], availability: '' });
    setSearchName('');
    fetchResults({ experienceYear: '', preferredLanguages: [], availability: '' }, '');
  };

  // Send connection request
  const handleConnect = async (targetUserId) => {
    setRequestStatus(prev => ({ ...prev, [targetUserId]: 'pending' }));
    try {
      const response = await axios.post('http://localhost:3000/api/match/request', {
        fromUserId: userData._id,
        toUserId: targetUserId
      });
      if (response.data.success) {
        setRequestStatus(prev => ({ ...prev, [targetUserId]: 'sent' }));
        // Update the results to reflect the new connection status
        setResults(prev => prev.map(user => 
          user._id === targetUserId 
            ? { ...user, connectionStatus: 'pending' }
            : user
        ));
      }
    } catch (err) {
      console.error('Error sending connection request:', err);
      setRequestStatus(prev => ({ ...prev, [targetUserId]: 'error' }));
    }
  };

  // Get button text and state based on connection status
  const getConnectionButtonProps = (user) => {
    switch (user.connectionStatus) {
      case 'pending':
        return {
          text: 'Request Pending',
          disabled: true,
          className: 'bg-gray-600'
        };
      case 'accepted':
        return {
          text: 'Connected',
          disabled: true,
          className: 'bg-green-600'
        };
      case 'none':
        return {
          text: requestStatus[user._id] === 'sent' ? 'Request Sent' : 
                requestStatus[user._id] === 'pending' ? 'Sending...' : 'Connect',
          disabled: requestStatus[user._id] === 'sent' || requestStatus[user._id] === 'pending',
          className: requestStatus[user._id] === 'sent' ? 'bg-gray-600' : 'bg-[#8D2B7E] hover:bg-[#8D2B7E]/80'
        };
      default:
        return {
          text: 'Connect',
          disabled: false,
          className: 'bg-[#8D2B7E] hover:bg-[#8D2B7E]/80'
        };
    }
  };

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
        <h1 className="text-3xl font-bold mb-6">Find Developers</h1>
        {/* Search bar for developer name */}
        <div className="flex items-center mb-6">
          <input
            type="text"
            className="flex-1 bg-black border border-[#8D2B7E]/20 rounded-l-lg px-4 py-2 text-white focus:outline-none"
            placeholder="Search for developer mate..."
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
          />
          <button
            className="bg-[#8D2B7E] text-white px-4 py-2 rounded-r-lg"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <div>
            <label className="block mb-1">Experience</label>
            <select
              className="bg-black border border-[#8D2B7E]/20 rounded-lg px-4 py-2"
              value={filters.experienceYear}
              onChange={e => handleFilterChange('experienceYear', e.target.value)}
            >
              <option value="">All</option>
              {EXPERIENCE_OPTIONS.map(y => (
                <option key={y} value={y}>{y} year{y > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Language</label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map(lang => (
                <button
                  key={lang}
                  type="button"
                  className={`px-3 py-1 rounded-lg border border-[#8D2B7E]/20 ${filters.preferredLanguages.includes(lang) ? 'bg-[#8D2B7E] text-white' : 'bg-black text-white'}`}
                  onClick={() => handleLanguageToggle(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1">Availability</label>
            <select
              className="bg-black border border-[#8D2B7E]/20 rounded-lg px-4 py-2"
              value={filters.availability}
              onChange={e => handleFilterChange('availability', e.target.value)}
            >
              <option value="">All</option>
              {AVAILABILITY_OPTIONS.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <button className="px-4 py-2 bg-[#8D2B7E] text-white rounded-lg" onClick={handleSearch}>Search</button>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-lg" onClick={handleClear}>Clear Filter</button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.length === 0 && hasSearched ? (
              <div className="col-span-full text-center text-gray-400">No developers found.</div>
            ) : results.map(dev => {
              const buttonProps = getConnectionButtonProps(dev);
              return (
                <div key={dev._id} className="bg-[#111] rounded-3xl border border-[#8D2B7E]/20 p-6 flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#8D2B7E] rounded-full overflow-hidden flex items-center justify-center mb-4">
                    {dev.profilePicture && dev.profilePicture !== 'data:image/jpeg;base64' ? (
                      <img 
                        src={dev.profilePicture.startsWith('data:') ? 
                             dev.profilePicture : 
                             `data:image/jpeg;base64,${dev.profilePicture}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Error loading developer picture:', e);
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-white text-3xl font-semibold">{dev.username?.charAt(0)?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <div className="text-center mb-4">
                    <p className="text-lg font-bold">{dev.username}</p>
                    <p className="text-sm">Experience: {dev.experienceYear || 'N/A'} year{dev.experienceYear > 1 ? 's' : ''}</p>
                    <p className="text-sm">Languages: {dev.preferredLanguages?.join(', ') || 'N/A'}</p>
                    <p className="text-sm">Availability: {dev.availability || 'N/A'}</p>
                  </div>
                  <button
                    className={`px-6 py-2 rounded-lg ${buttonProps.className} text-white mt-auto`}
                    disabled={buttonProps.disabled}
                    onClick={() => handleConnect(dev._id)}
                  >
                    {buttonProps.text}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search; 