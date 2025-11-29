import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';

function CompleteProfile() {
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem('profileStep');
    return saved ? parseInt(saved) : 1;
  });
  const [photoPreview, setPhotoPreview] = useState(() => {
    const saved = localStorage.getItem('profilePhoto');
    return saved || null;
  });
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      username: '',
      location: '',
      bio: '',
      experienceLevel: 'Beginner',
      experienceYears: 0,
      programmingLanguages: [],
      domains: [],
      availability: 'Full-time',
      photo: null
    },
    mode: 'onChange'
  });

  // Save step to localStorage
  useEffect(() => {
    localStorage.setItem('profileStep', step.toString());
  }, [step]);

  // Save photo preview to localStorage
  useEffect(() => {
    if (photoPreview) {
      localStorage.setItem('profilePhoto', photoPreview);
    }
  }, [photoPreview]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const subscription = watch((value) => {
      const { email, username, ...rest } = value;
      localStorage.setItem('profileForm', JSON.stringify(rest));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Get token from localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          const userData = response.data.user;
          
          // Clear any existing form data when loading a new user
          localStorage.removeItem('profileForm');
          localStorage.removeItem('profileStep');
          localStorage.removeItem('profilePhoto');
          
          // Always set email and username from API
          setValue('email', userData.email);
          setValue('username', userData.username);

          // Set other fields from API data
          setValue('location', userData.location || '');
          setValue('bio', userData.bio || '');
          setValue('experienceLevel', userData.experienceLevel || 'BEGINNER');
          setValue('experienceYears', userData.experienceYear || 0);
          setValue('programmingLanguages', userData.preferredLanguages || []);
          setValue('domains', userData.additionalSkills || []);
          setValue('availability', userData.availability || 'FULL-TIME');
          
          if (userData.profilePicture) {
            setPhotoPreview(`data:image/jpeg;base64,${userData.profilePicture}`);
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token, setValue]);

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress the image
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas dimensions to max 200x200 while maintaining aspect ratio
          const MAX_WIDTH = 200;
          const MAX_HEIGHT = 200;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with reduced quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
          setPhotoPreview(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLanguageToggle = (language) => {
    const currentLanguages = watch('programmingLanguages') || [];
    const updatedLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter(lang => lang !== language)
      : [...currentLanguages, language];
    setValue('programmingLanguages', updatedLanguages);
  };

  const handleDomainToggle = (domain) => {
    const currentDomains = watch('domains') || [];
    const updatedDomains = currentDomains.includes(domain)
      ? currentDomains.filter(d => d !== domain)
      : [...currentDomains, domain];
    setValue('domains', updatedDomains);
  };

  // Clear localStorage when form is submitted successfully
  const onSubmit = async (data) => {
    try {
      // Validate required fields
      if (!data.programmingLanguages || data.programmingLanguages.length === 0) {
        // alert("Please select at least one programming language");
        toast.error("Please select at least one programming language", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          
        });
        return;
      }
      if (!data.domains || data.domains.length === 0) {
        // alert("Please select at least one domain");
        toast.error("Please select at least one domain", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          
        });
        return;
      }

      // Transform the data to match backend field names
      const submitData = {
        location: data.location,
        bio: data.bio,
        experienceLevel: data.experienceLevel,
        experienceYear: data.experienceYears,
        preferredLanguages: data.programmingLanguages,
        availability: data.availability,
        additionalSkills: data.domains,
        profilePicture: photoPreview ? photoPreview.split(',')[1] : null // Remove the data URL prefix
      };

      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/complete-profile`, submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Clear all saved data after successful submission
      localStorage.removeItem('profileForm');
      localStorage.removeItem('profileStep');
      localStorage.removeItem('profilePhoto');
      
      // alert("Profile updated!");
      toast.success('Profile updated!', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        
                        });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // alert(err.response?.data?.message || "Error updating profile");
      toast.error(err.response?.data?.message || "Error updating profile", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        
      });
    }
  };

  const programmingLanguages = [
    'JavaScript', 'Python', 'Java',
    'C++', 'Ruby', 'PHP',
    'Swift', 'Kotlin', 'Go'
  ];

  const domainSkills = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Cloud Computing',
    'DevOps',
    'Cybersecurity',
    'UI/UX Design',
    'Game Development',
    'Blockchain',
    'AR/VR',
    'IoT'
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"

/>
      <div className="flex items-center gap-2 mb-8">
        <span className="text-[#8D2B7E] text-2xl">&lt;/&gt;</span>
        <span className="text-[#8D2B7E] text-2xl font-semibold">DevHub</span>
      </div>

      <div className="max-w-3xl mx-auto bg-[#111] rounded-2xl p-8 border border-[#8D2B7E]/20">
        <h1 className="text-3xl font-bold mb-4">Create your profile</h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 ? (
            <>
              <p className="text-gray-400 mb-8">
                Thank you for joining our platform, let's set up your profile this will help the team to identify and mention you.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                <div>
                    <input
                      type="text"
                      placeholder="Username"
                      {...register("username", {
                        required: "Username is required",
                        pattern: {
                          value: /^[a-zA-Z0-9_-]+$/,
                          message: "Username can only contain letters, numbers, underscores and dashes"
                        }
                      })}
                      disabled
                      className={`w-full bg-black border ${errors.username ? 'border-red-500' : 'border-[#8D2B7E]/20'} rounded-md p-3 focus:outline-none focus:border-[#8D2B7E] disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      disabled
                      className={`w-full bg-black border ${errors.email ? 'border-red-500' : 'border-[#8D2B7E]/20'} rounded-md p-3 focus:outline-none focus:border-[#8D2B7E] disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      placeholder="Location"
                      {...register("location", {
                        required: "Location is required",
                        minLength: { value: 2, message: "Location must be at least 2 characters" }
                      })}
                      className={`w-full bg-black border ${errors.location ? 'border-red-500' : 'border-[#8D2B7E]/20'} rounded-md p-3 focus:outline-none focus:border-[#8D2B7E]`}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                    )}
                  </div>
                  <div>
                    <textarea
                      placeholder="Add Bio"
                      {...register("bio", {
                        required: "Bio is required",
                        maxLength: { value: 500, message: "Bio must be less than 500 characters" }
                      })}
                      rows="4"
                      className={`w-full bg-black border ${errors.bio ? 'border-red-500' : 'border-[#8D2B7E]/20'} rounded-md p-3 focus:outline-none focus:border-[#8D2B7E]`}
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  {photoPreview ? (
                    <div className="relative">
                      <img 
                        src={photoPreview} 
                        alt="Profile preview" 
                        className="w-32 h-32 rounded-full object-cover mb-4"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview(null);
                          setValue('photo', null);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-[#8D2B7E] rounded-full mb-4 flex items-center justify-center">
                      <span className="text-white text-4xl font-semibold">
                        {watch('username')?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="w-40 h-40 bg-[#8D2B7E]/20 rounded-3xl"></div>
                  <input
                    type="file"
                    {...register("photo")}
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                    accept="image/*"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="mt-4 text-white cursor-pointer hover:text-[#8D2B7E] transition-colors"
                  >
                    ADD YOUR PHOTO
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#8D2B7E] text-white px-8 py-2 rounded-md hover:bg-[#8D2B7E]/80 transition-colors"
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-400 mb-8">
                Add your Experience, Skills & programming languages.
              </p>

              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="mb-2">Experience Level:</p>
                    <div className="flex gap-4">
                      {['Beginner', 'Intermediate', 'Expert'].map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setValue('experienceLevel', level)}
                          className={`px-4 py-2 rounded-md ${
                            watch('experienceLevel') === level
                              ? 'bg-[#8D2B7E] text-white'
                              : 'bg-black border border-[#8D2B7E]/20'
                          }`}
                        >
                          {level.charAt(0) + level.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                    {errors.experienceLevel && (
                      <p className="text-red-500 text-sm mt-1">{errors.experienceLevel.message}</p>
                    )}
                  </div>

                  <div>
                    <p className="mb-2">Experience Year:</p>
                    <input
                      type="number"
                      {...register("experienceYears", {
                        required: "Experience years is required",
                        min: { value: 0, message: "Experience years cannot be negative" },
                        max: { value: 50, message: "Please enter a valid experience" }
                      })}
                      min="0"
                      className={`w-32 bg-black border ${errors.experienceYears ? 'border-red-500' : 'border-[#8D2B7E]/20'} rounded-md p-3 focus:outline-none focus:border-[#8D2B7E]`}
                    />
                    {errors.experienceYears && (
                      <p className="text-red-500 text-sm mt-1">{errors.experienceYears.message}</p>
                    )}
                  </div>

                  <div>
                    <p className="mb-2">Select Your Programming Languages (Multi-select)</p>
                    <div className="grid grid-cols-3 gap-3">
                      {programmingLanguages.map(lang => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => handleLanguageToggle(lang)}
                          className={`px-4 py-2 rounded-md ${
                            (watch('programmingLanguages') || []).includes(lang)
                              ? 'bg-[#8D2B7E] text-white'
                              : 'bg-black border border-[#8D2B7E]/20'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                    {errors.programmingLanguages && (
                      <p className="text-red-500 text-sm mt-1">{errors.programmingLanguages.message}</p>
                    )}
                  </div>

                  <div>
                    <p className="mb-2">Select Your Domains (Multi-select)</p>
                    <div className="grid grid-cols-2 gap-3">
                      {domainSkills.map(domain => (
                        <button
                          key={domain}
                          type="button"
                          onClick={() => handleDomainToggle(domain)}
                          className={`px-4 py-2 rounded-md ${
                            (watch('domains') || []).includes(domain)
                              ? 'bg-[#8D2B7E] text-white'
                              : 'bg-black border border-[#8D2B7E]/20'
                          }`}
                        >
                          {domain}
                        </button>
                      ))}
                    </div>
                    {errors.domains && (
                      <p className="text-red-500 text-sm mt-1">{errors.domains.message}</p>
                    )}
                  </div>

                  <div>
                    <p className="mb-2">Availability</p>
                    <div className="flex gap-4">
                      {['Full-time', 'Weekends', 'Part-time'].map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setValue('availability', time)}
                          className={`px-4 py-2 rounded-md ${
                            watch('availability') === time
                              ? 'bg-[#8D2B7E] text-white'
                              : 'bg-black border border-[#8D2B7E]/20'
                          }`}
                        >
                          {time.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                    {errors.availability && (
                      <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-transparent border border-[#8D2B7E]/20 text-white px-8 py-2 rounded-md hover:border-[#8D2B7E] transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="bg-[#8D2B7E] text-white px-8 py-2 rounded-md hover:bg-[#8D2B7E]/80 transition-colors"
                >
                  Save
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;