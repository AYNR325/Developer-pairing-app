// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const EXPERIENCE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// const LANGUAGE_OPTIONS = [
//   'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'PHP', 'Swift', 'Go', 'C#', 'Kotlin', 'Rust', 'TypeScript', 'Dart', 'Scala', 'Perl', 'Shell', 'C'
// ];
// const AVAILABILITY_OPTIONS = ['Full-time', 'Part-time', 'Weekends'];

// function Search() {
//   const [userData, setUserData] = useState(null);
//   const [filters, setFilters] = useState({ experienceYear: '', preferredLanguages: [], availability: '' });
//   const [searchName, setSearchName] = useState('');
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [requestStatus, setRequestStatus] = useState({}); // { userId: 'pending' | 'sent' }
//   const [hasSearched, setHasSearched] = useState(false); // Track if user has searched or filtered
//   const [activeTab, setActiveTab] = useState('filter'); // 'filter' or 'ai'
//   const [aiMatches, setAiMatches] = useState([]);
//   const [aiLoading, setAiLoading] = useState(false);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/auth/check-auth', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         if (response.data.success) {
//           console.log('User profile picture data:', response.data.user.profilePicture);
//           setUserData(response.data.user);
//         }
//       } catch (err) {
//         console.error('Error fetching user data:', err);
//       }
//     };
//     if (token) fetchUserData();
//   }, [token]);

//   // Fetch recommended developers or search results
//   const fetchResults = async (customFilters = null, customSearchName = null) => {
//     if (!userData) return;
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       params.append('userId', userData._id);
//       const nameToUse = customSearchName !== null ? customSearchName : searchName;
//       const filtersToUse = customFilters !== null ? customFilters : filters;
//       if (nameToUse.trim()) {
//         params.append('name', nameToUse.trim());
//       } else {
//         if (filtersToUse.experienceYear) {
//           params.append('experienceYear', filtersToUse.experienceYear);
//         }
//         if (filtersToUse.preferredLanguages && filtersToUse.preferredLanguages.length > 0) {
//           filtersToUse.preferredLanguages.forEach(lang => {
//             params.append('preferredLanguages', lang);
//           });
//         }
//         if (filtersToUse.availability) {
//           params.append('availability', filtersToUse.availability);
//         }
//       }
//       const res = await axios.get(`http://localhost:3000/api/match?${params.toString()}`);
//       if (res.data.success) {
//         console.log('Developer profile pictures:', res.data.users.map(u => u.profilePicture));
//         setResults(res.data.users);
//       }
//     } catch (err) {
//       console.error('Error fetching results:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch AI recommendations
//   const fetchAIMatches = async () => {
//     if (!userData) return;
//     setAiLoading(true);
//     try {
//       const res = await axios.get(`http://localhost:3000/api/match/ai/developers?userId=${userData._id}`);
//       if (res.data.success) {
//         const matches = res.data.matches || [];
        
//         // Fetch connection status for each AI match (check for pending requests)
//         const matchesWithStatus = await Promise.all(
//           matches.map(async (match) => {
//             try {
//               // Check if there's a connection request (pending or accepted)
//               // We'll check by looking at sent/pending requests
//               const sentRes = await axios.get(`http://localhost:3000/api/match/sent-requests/${userData._id}`);
//               const pendingRes = await axios.get(`http://localhost:3000/api/match/requests/${userData._id}`);
              
//               const allRequests = [
//                 ...(sentRes.data.success ? sentRes.data.requests : []),
//                 ...(pendingRes.data.success ? pendingRes.data.requests : [])
//               ];
              
//               const foundRequest = allRequests.find(req => {
//                 const otherUserId = req.fromUser?._id || req.fromUser;
//                 const targetUserId = req.toUser?._id || req.toUser;
//                 return (String(otherUserId) === String(match.partnerId) || 
//                         String(targetUserId) === String(match.partnerId));
//               });
              
//               return {
//                 ...match,
//                 connectionStatus: foundRequest ? (foundRequest.status || 'pending') : 'none'
//               };
//             } catch (err) {
//               return {
//                 ...match,
//                 connectionStatus: 'none'
//               };
//             }
//           })
//         );
        
//         setAiMatches(matchesWithStatus);
//       }
//     } catch (err) {
//       console.error('Error fetching AI matches:', err);
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   // On userData load, fetch recommended developers using user's profile, but do NOT set filters
//   useEffect(() => {
//     if (userData) {
//       fetchResults({
//         experienceYear: userData.experienceYear || '',
//         preferredLanguages: userData.preferredLanguages || [],
//         availability: userData.availability || ''
//       }, '');
//       // Also fetch AI matches
//       fetchAIMatches();
//     }
//     // eslint-disable-next-line
//   }, [userData]);

//   // Filter change handler
//   const handleFilterChange = (key, value) => {
//     setHasSearched(true);
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   // Multi-select for languages
//   const handleLanguageToggle = (lang) => {
//     setHasSearched(true);
//     setFilters(prev => ({
//       ...prev,
//       preferredLanguages: prev.preferredLanguages.includes(lang)
//         ? prev.preferredLanguages.filter(l => l !== lang)
//         : [...prev.preferredLanguages, lang]
//     }));
//   };

//   // Search button
//   const handleSearch = () => {
//     setHasSearched(true);
//     fetchResults();
//   };

//   // Clear filters
//   const handleClear = () => {
//     setHasSearched(true);
//     setFilters({ experienceYear: '', preferredLanguages: [], availability: '' });
//     setSearchName('');
//     fetchResults({ experienceYear: '', preferredLanguages: [], availability: '' }, '');
//   };

//   // Send connection request
//   const handleConnect = async (targetUserId) => {
//     setRequestStatus(prev => ({ ...prev, [targetUserId]: 'pending' }));
//     try {
//       const response = await axios.post('http://localhost:3000/api/match/request', {
//         fromUserId: userData._id,
//         toUserId: targetUserId
//       });
//       if (response.data.success) {
//         setRequestStatus(prev => ({ ...prev, [targetUserId]: 'sent' }));
//         // Update the results to reflect the new connection status
//         setResults(prev => prev.map(user => 
//           user._id === targetUserId 
//             ? { ...user, connectionStatus: 'pending' }
//             : user
//         ));
//       }
//     } catch (err) {
//       console.error('Error sending connection request:', err);
//       setRequestStatus(prev => ({ ...prev, [targetUserId]: 'error' }));
//     }
//   };

//   // Get button text and state based on connection status
//   const getConnectionButtonProps = (user) => {
//     switch (user.connectionStatus) {
//       case 'pending':
//         return {
//           text: 'Request Pending',
//           disabled: true,
//           className: 'bg-gray-600'
//         };
//       case 'accepted':
//         return {
//           text: 'Connected',
//           disabled: true,
//           className: 'bg-green-600'
//         };
//       case 'none':
//         return {
//           text: requestStatus[user._id] === 'sent' ? 'Request Sent' : 
//                 requestStatus[user._id] === 'pending' ? 'Sending...' : 'Connect',
//           disabled: requestStatus[user._id] === 'sent' || requestStatus[user._id] === 'pending',
//           className: requestStatus[user._id] === 'sent' ? 'bg-gray-600' : 'bg-[#8D2B7E] hover:bg-[#8D2B7E]/80'
//         };
//       default:
//         return {
//           text: 'Connect',
//           disabled: false,
//           className: 'bg-[#8D2B7E] hover:bg-[#8D2B7E]/80'
//         };
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <header className="bg-black border-b border-[#8D2B7E]/20 p-4 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <span className="text-[#8D2B7E] text-2xl">&lt;/&gt;</span>
//             <span className="text-[#8D2B7E] text-2xl font-semibold">DevHub</span>
//           </div>
//           <nav className="flex space-x-6">
//             <Link to="/dashboard" className="hover:text-[#8D2B7E]">Home</Link>
//             <Link to="/network" className="hover:text-[#8D2B7E]">My Network</Link>
//             <Link to="/chats" className="hover:text-[#8D2B7E]">Chats</Link>
//           </nav>
//           <div className="w-10 h-10 bg-[#8D2B7E] rounded-full overflow-hidden flex items-center justify-center">
//             {userData?.profilePicture && userData.profilePicture !== 'data:image/jpeg;base64' ? (
//               <img 
//                 src={userData.profilePicture.startsWith('data:') ? 
//                      userData.profilePicture : 
//                      `data:image/jpeg;base64,${userData.profilePicture}`} 
//                 alt="Profile" 
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   console.error('Error loading profile picture:', e);
//                   e.target.style.display = 'none';
//                 }}
//               />
//             ) : (
//               <span className="text-white text-lg font-semibold">{userData?.username?.charAt(0)?.toUpperCase() || 'U'}</span>
//             )}
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] bg-clip-text text-transparent">
//             Find Your Perfect Developer Match
//           </h1>
//           <p className="text-gray-400 text-lg">Connect with talented developers who share your passion</p>
//         </div>
        
//         {/* Tab Navigation */}
//         <div className="flex space-x-2 mb-8 bg-gray-900/60 backdrop-blur-sm p-1.5 rounded-xl border border-[#8D2B7E]/20 w-fit">
//           <button
//             onClick={() => setActiveTab('filter')}
//             className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
//               activeTab === 'filter'
//                 ? 'bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white shadow-lg shadow-[#8D2B7E]/30'
//                 : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
//             }`}
//           >
//             🔍 Filter Search
//           </button>
//           <button
//             onClick={() => {
//               setActiveTab('ai');
//               if (aiMatches.length === 0 && !aiLoading) {
//                 fetchAIMatches();
//               }
//             }}
//             className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
//               activeTab === 'ai'
//                 ? 'bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white shadow-lg shadow-[#8D2B7E]/30'
//                 : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
//             }`}
//           >
//             🤖 AI Recommendations
//           </button>
//         </div>

//         {/* Filter Search Tab */}
//         {activeTab === 'filter' && (
//           <>
//         {/* Search bar for developer name */}
//         <div className="mb-8">
//           <div className="relative flex items-center">
//             <div className="absolute left-4 text-gray-400">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//           <input
//             type="text"
//               className="w-full bg-gray-900/50 border border-[#8D2B7E]/30 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8D2B7E]/50 focus:border-[#8D2B7E] transition-all"
//               placeholder="Search by developer name..."
//             value={searchName}
//             onChange={e => setSearchName(e.target.value)}
//             onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
//           />
//           <button
//               className="ml-3 bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#8D2B7E]/30 transition-all duration-200"
//             onClick={handleSearch}
//           >
//             Search
//           </button>
//         </div>
//         </div>

//         {/* Filters Section */}
//         <div className="bg-gray-900/40 backdrop-blur-sm border border-[#8D2B7E]/20 rounded-2xl p-6 mb-8">
//           <h2 className="text-xl font-semibold mb-4 text-gray-200">Filter Options</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             {/* Experience Filter */}
//           <div>
//               <label className="block mb-2 text-sm font-medium text-gray-300">Experience Level</label>
//             <select
//                 className="w-full bg-gray-800/50 border border-[#8D2B7E]/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#8D2B7E]/50 transition-all"
//               value={filters.experienceYear}
//               onChange={e => handleFilterChange('experienceYear', e.target.value)}
//             >
//                 <option value="">All Experience Levels</option>
//               {EXPERIENCE_OPTIONS.map(y => (
//                 <option key={y} value={y}>{y} year{y > 1 ? 's' : ''}</option>
//               ))}
//             </select>
//           </div>

//             {/* Availability Filter */}
//             <div>
//               <label className="block mb-2 text-sm font-medium text-gray-300">Availability</label>
//               <select
//                 className="w-full bg-gray-800/50 border border-[#8D2B7E]/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#8D2B7E]/50 transition-all"
//                 value={filters.availability}
//                 onChange={e => handleFilterChange('availability', e.target.value)}
//               >
//                 <option value="">All Availability</option>
//                 {AVAILABILITY_OPTIONS.map(a => (
//                   <option key={a} value={a}>{a}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-end gap-3">
//               <button 
//                 className="flex-1 bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white px-4 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#8D2B7E]/30 transition-all duration-200" 
//                 onClick={handleSearch}
//               >
//                 Apply Filters
//               </button>
//               <button 
//                 className="px-4 py-2.5 bg-gray-700/50 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all" 
//                 onClick={handleClear}
//               >
//                 Clear
//               </button>
//             </div>
//           </div>

//           {/* Languages Filter */}
//           <div>
//             <label className="block mb-3 text-sm font-medium text-gray-300">Programming Languages</label>
//             <div className="flex flex-wrap gap-2">
//               {LANGUAGE_OPTIONS.map(lang => (
//                 <button
//                   key={lang}
//                   type="button"
//                   className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                     filters.preferredLanguages.includes(lang)
//                       ? 'bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white shadow-lg shadow-[#8D2B7E]/30'
//                       : 'bg-gray-800/50 text-gray-300 border border-[#8D2B7E]/20 hover:border-[#8D2B7E]/40 hover:bg-gray-800'
//                   }`}
//                   onClick={() => handleLanguageToggle(lang)}
//                 >
//                   {lang}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Results */}
//         {loading ? (
//           <div className="text-center py-20">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8D2B7E]"></div>
//             <p className="mt-4 text-gray-400">Searching for developers...</p>
//           </div>
//         ) : (
//           <>
//             {results.length === 0 && hasSearched ? (
//               <div className="text-center py-20">
//                 <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 </div>
//                 <p className="text-xl text-gray-400 mb-2">No developers found</p>
//                 <p className="text-gray-500">Try adjusting your filters or search terms</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {results.map(dev => {
//               const buttonProps = getConnectionButtonProps(dev);
//               return (
//                     <div 
//                       key={dev._id} 
//                       className="group bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm rounded-2xl border border-[#8D2B7E]/20 p-6 hover:border-[#8D2B7E]/50 hover:shadow-xl hover:shadow-[#8D2B7E]/10 transition-all duration-300"
//                     >
//                       {/* Profile Section */}
//                       <div className="flex items-center mb-4">
//                         <div className="relative">
//                           <div className="w-16 h-16 bg-gradient-to-br from-[#8D2B7E] to-[#FF96F5] rounded-full overflow-hidden flex items-center justify-center ring-2 ring-[#8D2B7E]/30">
//                     {dev.profilePicture && dev.profilePicture !== 'data:image/jpeg;base64' ? (
//                       <img 
//                         src={dev.profilePicture.startsWith('data:') ? 
//                              dev.profilePicture : 
//                              `data:image/jpeg;base64,${dev.profilePicture}`} 
//                         alt="Profile" 
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           console.error('Error loading developer picture:', e);
//                           e.target.style.display = 'none';
//                         }}
//                       />
//                     ) : (
//                               <span className="text-white text-2xl font-bold">{dev.username?.charAt(0)?.toUpperCase() || 'U'}</span>
//                             )}
//                           </div>
//                           {dev.connectionStatus === 'accepted' && (
//                             <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900"></div>
//                     )}
//                   </div>
//                         <div className="ml-4 flex-1">
//                     <Link 
//                       to={`/user/${dev._id}`}
//                             className="text-lg font-bold text-white hover:text-[#FF96F5] transition-colors block"
//                     >
//                       {dev.username}
//                     </Link>
//                           <p className="text-sm text-gray-400">
//                             {dev.experienceYear ? `${dev.experienceYear} year${dev.experienceYear > 1 ? 's' : ''} experience` : 'No experience listed'}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Skills Section */}
//                       <div className="mb-4">
//                         <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Languages</p>
//                         <div className="flex flex-wrap gap-2">
//                           {dev.preferredLanguages && dev.preferredLanguages.length > 0 ? (
//                             dev.preferredLanguages.slice(0, 3).map((lang, idx) => (
//                               <span key={idx} className="px-2.5 py-1 bg-[#8D2B7E]/20 text-[#FF96F5] text-xs rounded-lg border border-[#8D2B7E]/30">
//                                 {lang}
//                               </span>
//                             ))
//                           ) : (
//                             <span className="text-xs text-gray-500">Not specified</span>
//                           )}
//                           {dev.preferredLanguages && dev.preferredLanguages.length > 3 && (
//                             <span className="px-2.5 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-lg">
//                               +{dev.preferredLanguages.length - 3} more
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       {/* Availability */}
//                       {dev.availability && (
//                         <div className="mb-4 flex items-center text-sm text-gray-400">
//                           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                           </svg>
//                           {dev.availability}
//                   </div>
//                       )}

//                       {/* Connect Button */}
//                   <button
//                         className={`w-full px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${buttonProps.className} ${
//                           !buttonProps.disabled ? 'hover:shadow-lg hover:shadow-[#8D2B7E]/30 hover:scale-[1.02]' : ''
//                         }`}
//                     disabled={buttonProps.disabled}
//                     onClick={() => handleConnect(dev._id)}
//                   >
//                     {buttonProps.text}
//                   </button>
//                 </div>
//               );
//             })}
//               </div>
//             )}
//           </>
//         )}
//           </>
//         )}

//         {/* AI Recommendations Tab */}
//         {activeTab === 'ai' && (
//           <div>
//             <div className="mb-8 p-6 bg-gradient-to-r from-[#8D2B7E]/10 to-[#FF96F5]/10 border border-[#8D2B7E]/30 rounded-2xl backdrop-blur-sm">
//               <div className="flex items-start gap-4">
//                 <div className="w-12 h-12 bg-gradient-to-br from-[#8D2B7E] to-[#FF96F5] rounded-xl flex items-center justify-center flex-shrink-0">
//                   <span className="text-2xl">🤖</span>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-white mb-1">AI-Powered Matching</h3>
//                   <p className="text-sm text-gray-300">
//                     Our advanced AI analyzes your tech stack, experience level, and interests to find the perfect developer partners for you.
//                   </p>
//                 </div>
//               </div>
//             </div>
            
//             {aiLoading ? (
//               <div className="text-center py-20">
//                 <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8D2B7E]"></div>
//                 <p className="mt-4 text-gray-400">Analyzing profiles and generating recommendations...</p>
//               </div>
//             ) : aiMatches.length === 0 ? (
//               <div className="text-center py-20">
//                 <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
//                   </svg>
//                 </div>
//                 <p className="text-xl text-gray-400 mb-2">No AI recommendations available</p>
//                 <p className="text-gray-500 mb-4">We couldn't find any matching developers at the moment</p>
//                 <button
//                   onClick={fetchAIMatches}
//                   className="px-6 py-2.5 bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#8D2B7E]/30 transition-all duration-200"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {aiMatches.map(match => {
//                   // Get button props based on connection status
//                   const getAIButtonProps = () => {
//                     switch (match.connectionStatus) {
//                       case 'pending':
//                         return {
//                           text: 'Request Pending',
//                           disabled: true,
//                           className: 'bg-gray-600'
//                         };
//                       case 'accepted':
//                         return {
//                           text: 'Connected',
//                           disabled: true,
//                           className: 'bg-green-600'
//                         };
//                       case 'none':
//                       default:
//                         return {
//                           text: requestStatus[match.partnerId] === 'sent' ? 'Request Sent' : 
//                                 requestStatus[match.partnerId] === 'pending' ? 'Sending...' : 'Connect',
//                           disabled: requestStatus[match.partnerId] === 'sent' || requestStatus[match.partnerId] === 'pending',
//                           className: requestStatus[match.partnerId] === 'sent' ? 'bg-gray-600' : 'bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] hover:shadow-lg hover:shadow-[#8D2B7E]/30'
//                         };
//                     }
//                   };
                  
//                   const buttonProps = getAIButtonProps();
                  
//                   return (
//                     <div 
//                       key={match.partnerId} 
//                       className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm rounded-2xl border-2 border-[#8D2B7E]/40 p-6 hover:border-[#8D2B7E]/60 hover:shadow-2xl hover:shadow-[#8D2B7E]/20 transition-all duration-300"
//                     >
//                       {/* Compatibility Badge */}
//                       <div className="absolute top-4 right-4 bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
//                         {match.compatibility}% Match
//                       </div>
                      
//                       {/* Profile Section */}
//                       <div className="flex items-center mb-5">
//                         <div className="w-16 h-16 bg-gradient-to-br from-[#8D2B7E] to-[#FF96F5] rounded-full overflow-hidden flex items-center justify-center ring-2 ring-[#8D2B7E]/30">
//                           <span className="text-white text-2xl font-bold">{match.username?.charAt(0)?.toUpperCase() || 'U'}</span>
//                         </div>
//                         <div className="ml-4 flex-1">
//                           <Link 
//                             to={`/user/${match.partnerId}`}
//                             className="text-lg font-bold text-white hover:text-[#FF96F5] transition-colors block"
//                           >
//                             {match.username}
//                           </Link>
//                           <p className="text-sm text-gray-400">AI Recommended Match</p>
//                         </div>
//                       </div>
                      
//                       {/* Reasons */}
//                       {match.reasons && match.reasons.length > 0 && (
//                         <div className="mb-5">
//                           <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Why we matched you</p>
//                           <div className="space-y-2">
//                             {match.reasons.map((reason, idx) => (
//                               <div key={idx} className="flex items-start gap-2 text-sm text-gray-300 bg-gray-800/30 px-3 py-2 rounded-lg border border-[#8D2B7E]/20">
//                                 <span className="text-[#FF96F5] mt-0.5">✓</span>
//                                 <span>{reason}</span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
                      
//                       {/* Connect Button */}
//                       <button
//                         className={`w-full px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${buttonProps.className} ${
//                           !buttonProps.disabled ? 'hover:scale-[1.02]' : ''
//                         }`}
//                         disabled={buttonProps.disabled}
//                         onClick={() => handleConnect(match.partnerId)}
//                       >
//                         {buttonProps.text}
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Search; 


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const EXPERIENCE_OPTIONS = [1,2,3,4,5,6,7,8,9,10];
const LANGUAGE_OPTIONS = [
  'JavaScript','Python','Java','C++','Ruby','PHP','Swift','Go','C#','Kotlin','Rust','TypeScript','Dart','Scala','Perl','Shell','C'
];
const AVAILABILITY_OPTIONS = ['Full-time','Part-time','Weekends'];

function Search() {
  const [userData, setUserData] = useState(null);
  const [filters, setFilters] = useState({ experienceYear: '', preferredLanguages: [], availability: '' });
  const [searchName, setSearchName] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState({}); // { userId: 'pending' | 'sent' | 'error' }
  const [hasSearched, setHasSearched] = useState(false);
  const [aiMatches, setAiMatches] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) setUserData(res.data.user);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    if (token) fetchUserData();
  }, [token]);

  // Load AI matches; attach connectionStatus and keep raw shape where possible
  const fetchAIMatches = async () => {
    if (!userData) return;
    setAiLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/match/ai/developers?userId=${userData._id}`);
      if (!res.data.success) {
        setAiMatches([]);
        setAiLoading(false);
        return;
      }
      const matches = res.data.matches || [];

      // Prefetch sent/pending once
      let sentRequests = [];
      let pendingRequests = [];
      try {
        const [sentRes, pendingRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/match/sent-requests/${userData._id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/match/requests/${userData._id}`)
        ]);
        sentRequests = sentRes.data.success ? sentRes.data.requests : [];
        pendingRequests = pendingRes.data.success ? pendingRes.data.requests : [];
      } catch (err) {
        // fallback per-match below
      }

      const matchesWithStatus = await Promise.all(matches.map(async (m) => {
        try {
          let allRequests = [...sentRequests, ...pendingRequests];
          if (allRequests.length === 0) {
            const [sentRes, pendingRes] = await Promise.all([
              axios.get(`${import.meta.env.VITE_API_URL}/api/match/sent-requests/${userData._id}`),
              axios.get(`${import.meta.env.VITE_API_URL}/api/match/requests/${userData._id}`)
            ]);
            allRequests = [
              ...(sentRes.data.success ? sentRes.data.requests : []),
              ...(pendingRes.data.success ? pendingRes.data.requests : [])
            ];
          }

          // partnerId might be used; fallback to _id if present
          const partnerId = m.partnerId || m._id;
          const found = allRequests.find(req => {
            const from = req.fromUser?._id || req.fromUser;
            const to = req.toUser?._id || req.toUser;
            return String(from) === String(partnerId) || String(to) === String(partnerId);
          });

          return {
            ...m,
            // prefer existing id if present
            _id: m._id || m.partnerId || null,
            partnerId: m.partnerId || m._id || null,
            connectionStatus: found ? (found.status || 'pending') : (m.connectionStatus || 'none')
          };
        } catch (err) {
          return {
            ...m,
            _id: m._id || m.partnerId || null,
            partnerId: m.partnerId || m._id || null,
            connectionStatus: m.connectionStatus || 'none'
          };
        }
      }));

      setAiMatches(matchesWithStatus);

      // If user hasn't run filters/search yet, show AI matches by default
      const noFiltersSet =
        !searchName.trim() &&
        (!filters.experienceYear || filters.experienceYear === '') &&
        (!filters.preferredLanguages || filters.preferredLanguages.length === 0) &&
        (!filters.availability || filters.availability === '');

      if (noFiltersSet) {
        // Some AI items may already match the UI shape (e.g. they have username, profilePicture, preferredLanguages)
        // We'll set results directly to matchesWithStatus so UI can decide how to render AI vs normal items.
        setResults(matchesWithStatus.map(m => ({
          // keep original fields; UI will inspect __aiCompatibility / __aiReasons to detect AI items
          ...m
        })));
      }
    } catch (err) {
      console.error('Error fetching AI matches:', err);
      setAiMatches([]);
    } finally {
      setAiLoading(false);
    }
  };

  // Fetch backend filtered results (only when filters or search applied)
  const fetchResults = async (customFilters = null, customSearchName = null) => {
    if (!userData) return;
    setLoading(true);
    try {
      const nameToUse = customSearchName !== null ? customSearchName : searchName;
      const filtersToUse = customFilters !== null ? customFilters : filters;

      const noFiltersSet =
        !nameToUse.trim() &&
        (!filtersToUse.experienceYear || filtersToUse.experienceYear === '') &&
        (!filtersToUse.preferredLanguages || filtersToUse.preferredLanguages.length === 0) &&
        (!filtersToUse.availability || filtersToUse.availability === '');

      if (noFiltersSet) {
        // Show AI matches by default
        if (aiMatches.length === 0 && !aiLoading) {
          await fetchAIMatches();
        } else {
          setResults(aiMatches.map(m => ({ ...m })));
        }
        setLoading(false);
        return;
      }

      // Build query params for server-side filter/search
      const params = new URLSearchParams();
      params.append('userId', userData._id);
      if (nameToUse.trim()) {
        params.append('name', nameToUse.trim());
      } else {
        if (filtersToUse.experienceYear) params.append('experienceYear', filtersToUse.experienceYear);
        if (filtersToUse.preferredLanguages && filtersToUse.preferredLanguages.length > 0) {
          filtersToUse.preferredLanguages.forEach(lang => params.append('preferredLanguages', lang));
        }
        if (filtersToUse.availability) params.append('availability', filtersToUse.availability);
      }

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/match?${params.toString()}`);
      if (res.data.success) {
        setResults(res.data.users || []);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) fetchAIMatches();
    // eslint-disable-next-line
  }, [userData]);

  const handleFilterChange = (key, value) => {
    setHasSearched(true);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleLanguageToggle = (lang) => {
    setHasSearched(true);
    setFilters(prev => ({
      ...prev,
      preferredLanguages: prev.preferredLanguages.includes(lang)
        ? prev.preferredLanguages.filter(l => l !== lang)
        : [...prev.preferredLanguages, lang]
    }));
  };

  const handleSearch = () => {
    setHasSearched(true);
    fetchResults();
  };

  const handleClear = () => {
    setHasSearched(true);
    setFilters({ experienceYear: '', preferredLanguages: [], availability: '' });
    setSearchName('');
    fetchResults({ experienceYear: '', preferredLanguages: [], availability: '' }, '');
  };

  // helper to normalize id used for requests
  const getDevId = (dev) => dev._id || dev.partnerId || dev.id || null;

  const handleConnect = async (target) => {
    const targetUserId = typeof target === 'string' ? target : getDevId(target);
    if (!userData || !targetUserId) return;
    setRequestStatus(prev => ({ ...prev, [targetUserId]: 'pending' }));
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/match/request`, {
        fromUserId: userData._id,
        toUserId: targetUserId
      });
      if (response.data.success) {
        setRequestStatus(prev => ({ ...prev, [targetUserId]: 'sent' }));
        setResults(prev => prev.map(u => {
          const id = getDevId(u);
          if (String(id) === String(targetUserId)) return { ...u, connectionStatus: 'pending' };
          return u;
        }));
      } else {
        setRequestStatus(prev => ({ ...prev, [targetUserId]: 'error' }));
      }
    } catch (err) {
      console.error('Error sending connection request:', err);
      setRequestStatus(prev => ({ ...prev, [targetUserId]: 'error' }));
    }
  };

  const getConnectionButtonProps = (user) => {
    const id = getDevId(user);
    const status = user.connectionStatus;
    switch (status) {
      case 'pending':
        return { text: 'Request Pending', disabled: true, className: 'bg-gray-600' };
      case 'accepted':
        return { text: 'Connected', disabled: true, className: 'bg-green-600' };
      case 'none':
        return {
          text: requestStatus[id] === 'sent' ? 'Request Sent' :
                requestStatus[id] === 'pending' ? 'Sending...' : 'Connect',
          disabled: requestStatus[id] === 'sent' || requestStatus[id] === 'pending',
          className: requestStatus[id] === 'sent' ? 'bg-gray-600' : 'bg-[#8D2B7E] hover:bg-[#8D2B7E]/80'
        };
      default:
        return { text: 'Connect', disabled: false, className: 'bg-[#8D2B7E] hover:bg-[#8D2B7E]/80' };
    }
  };

  // render helpers
  const renderAICardReasons = (dev) => {
    const reasons = dev.__aiReasons || dev.reasons || [];
    if (!reasons.length) return null;
    return (
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Why we matched you</p>
        <div className="space-y-2">
          {reasons.map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-300 bg-gray-800/30 px-3 py-2 rounded-lg border border-[#8D2B7E]/20">
              <span className="text-[#FF96F5] mt-0.5">✓</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profileForm');
    localStorage.removeItem('profileStep');
    localStorage.removeItem('profilePhoto');
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

      <div className="flex pt-[60px] sm:pt-[73px]">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          onSignOut={handleSignOut} 
        />

        {/* Main Content - Added margin-left to account for fixed sidebar */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64">
          <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] bg-clip-text text-transparent">
            Find Your Perfect Developer Match
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">Connect with talented developers who share your passion</p>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 sm:mb-8">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="w-full bg-white/5 backdrop-blur-md border border-[#8D2B7E]/30 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8D2B7E]/50 focus:border-[#8D2B7E] transition-all text-sm sm:text-base"
                placeholder="Search by developer name..."
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              />
            </div>
            <button
              className="bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg hover:shadow-[#8D2B7E]/30 transition-all duration-200 text-sm sm:text-base whitespace-nowrap"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-[#8D2B7E]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-200">Filter Options</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-300">Experience Level</label>
              <select
                className="w-full bg-white/5 backdrop-blur-md border border-[#8D2B7E]/30 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#8D2B7E]/50 transition-all text-sm sm:text-base"
                value={filters.experienceYear}
                onChange={e => handleFilterChange('experienceYear', e.target.value)}
              >
                <option value="">All Experience Levels</option>
                {EXPERIENCE_OPTIONS.map(y => <option key={y} value={y}>{y} year{y>1?'s':''}</option>)}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-300">Availability</label>
              <select
                className="w-full bg-white/5 backdrop-blur-md border border-[#8D2B7E]/30 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#8D2B7E]/50 transition-all text-sm sm:text-base"
                value={filters.availability}
                onChange={e => handleFilterChange('availability', e.target.value)}
              >
                <option value="">All Availability</option>
                {AVAILABILITY_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div className="flex items-end gap-2 sm:gap-3 sm:col-span-2 lg:col-span-1">
              <button
                className="flex-1 bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#8D2B7E]/30 transition-all duration-200 text-sm sm:text-base"
                onClick={handleSearch}
              >
                Apply Filters
              </button>
              <button
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white/5 border border-white/10 text-white rounded-lg font-semibold hover:bg-white/10 transition-all text-sm sm:text-base"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-3 text-xs sm:text-sm font-medium text-gray-300">Programming Languages</label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map(lang => (
                <button
                  key={lang}
                  type="button"
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                    filters.preferredLanguages.includes(lang)
                      ? 'bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white shadow-lg shadow-[#8D2B7E]/30'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:border-[#8D2B7E]/40 hover:bg-white/10'
                  }`}
                  onClick={() => handleLanguageToggle(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading || aiLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8D2B7E]"></div>
            <p className="mt-4 text-gray-400">{aiLoading ? 'Analyzing profiles and generating recommendations...' : 'Searching for developers...'}</p>
          </div>
        ) : (
          <>
            {results.length === 0 && hasSearched ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-xl text-gray-400 mb-2">No developers found</p>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {results.map(dev => {
                  const isAI = dev.__aiCompatibility !== undefined || dev.__aiReasons !== undefined || dev.reasons !== undefined;
                  const devId = getDevId(dev);
                  const buttonProps = getConnectionButtonProps(dev);
                  return (
                    <div key={devId || dev.username} className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-[#8D2B7E]/20 p-4 sm:p-6 hover:border-[#8D2B7E]/50 hover:shadow-xl hover:shadow-[#8D2B7E]/10 transition-all duration-300 flex flex-col h-full">
                      {/* If AI, show compatibility badge */}
                      {isAI && dev.__aiCompatibility && (
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white px-2 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg z-10">
                          {dev.__aiCompatibility}% Match
                        </div>
                      )}

                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center mb-3 sm:mb-4">
                          <div className="relative">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#8D2B7E] to-[#FF96F5] rounded-full overflow-hidden flex items-center justify-center ring-2 ring-[#8D2B7E]/30">
                              {dev.profilePicture && dev.profilePicture !== 'data:image/jpeg;base64' ? (
                                <img src={dev.profilePicture.startsWith('data:') ? dev.profilePicture : `data:image/jpeg;base64,${dev.profilePicture}`} alt="Profile" className="w-full h-full object-cover" onError={(e)=>{ e.target.style.display='none'; }} />
                              ) : (
                                <span className="text-white text-lg sm:text-2xl font-bold">{dev.username?.charAt(0)?.toUpperCase() || 'U'}</span>
                              )}
                            </div>
                            {dev.connectionStatus === 'accepted' && <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-gray-900"></div>}
                          </div>
                          <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                            <Link to={`/user/${devId}`} className="text-base sm:text-lg font-bold text-white hover:text-[#FF96F5] transition-colors block truncate">
                              {dev.username || dev.name || 'Unknown'}
                            </Link>
                            {/* For AI cards we avoid showing empty experience - show label only if value present */}
                            {(!isAI && dev.experienceYear) ? (
                              <p className="text-xs sm:text-sm text-gray-400">{dev.experienceYear} year{dev.experienceYear>1?'s':''} experience</p>
                            ) : (!isAI ? (
                              <p className="text-xs sm:text-sm text-gray-400">No experience listed</p>
                            ) : (
                              <p className="text-xs sm:text-sm text-gray-400">AI Recommended Match</p>
                            ))}
                          </div>
                        </div>

                        {/* If NOT AI, show Languages + availability as before */}
                        {!isAI ? (
                          <>
                            <div className="mb-4">
                              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Languages</p>
                              <div className="flex flex-wrap gap-2">
                                {dev.preferredLanguages && dev.preferredLanguages.length > 0 ? (
                                  dev.preferredLanguages.slice(0,3).map((lang, idx) => (
                                    <span key={idx} className="px-2.5 py-1 bg-[#8D2B7E]/20 text-[#FF96F5] text-xs rounded-lg border border-[#8D2B7E]/30">{lang}</span>
                                  ))
                                ) : (
                                  <span className="text-xs text-gray-500">Not specified</span>
                                )}
                                {dev.preferredLanguages && dev.preferredLanguages.length > 3 && <span className="px-2.5 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-lg">+{dev.preferredLanguages.length - 3} more</span>}
                              </div>
                            </div>

                            {dev.availability && (
                              <div className="mb-4 flex items-center text-sm text-gray-400">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {dev.availability}
                              </div>
                            )}
                          </>
                        ) : (
                          // AI reasons section (only for AI)
                          renderAICardReasons(dev)
                        )}

                        {/* If AI and no explicit compatibility value passed in badge, optionally show it inline */}
                        {isAI && !dev.__aiCompatibility && dev.compatibility && (
                          <div className="mb-4 text-sm text-gray-400">AI Match: <span className="font-semibold text-white">{dev.compatibility}%</span></div>
                        )}
                      </div>

                      {/* Connect button (works for both AI and non-AI) - Fixed at bottom */}
                      <button
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base mt-auto ${buttonProps.className} ${!buttonProps.disabled ? 'hover:shadow-lg hover:shadow-[#8D2B7E]/30 hover:scale-[1.02]' : ''}`}
                        disabled={buttonProps.disabled}
                        onClick={() => handleConnect(dev)}
                      >
                        {buttonProps.text}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Search;

