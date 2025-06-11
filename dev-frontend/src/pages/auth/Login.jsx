import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // const token = localStorage.getItem('token');

  // const onSubmit = async (data) => {
  //   try {
  //     setIsLoading(true);
  //     const res = await axios.post("http://localhost:3000/api/auth/login", data);
  //     if(res?.data?.success){
  //       localStorage.setItem("token", res.data.token);
  //       // alert("Login successful");
  //       toast.success('Login successful', {
  //         position: "top-center",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: false,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "dark",
          
  //         });

  //         const response = await axios.get('http://localhost:3000/api/auth/check-auth', {
  //           headers: { Authorization: `Bearer ${token}` }
  //         });
  //         if (response.data.success && response.data.user.username && response.data.user.email && response.data.user.location && response.data.user.experienceLevel && response.data.user.experienceYear && response.data.user.preferredLanguages && response.data.user.availability && response.data.user.additionalSkills) {
  //           console.log('Complete user data:', response.data.user); // For debugging
  //           // Redirect to dashboard
  //       navigate("/dashboard");

  //         } else{
  //           // Redirect to complete profile if not done
  //       navigate("/completeprofile");
  //         }
        
        
  //     } else {
  //       // alert(res.data.message);
  //       toast.error(res.data.message, {
  //         position: "top-center",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: false,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "dark",
          
  //       });
  //     }
  //   } catch (err) {
  //     // alert("Login failed");
  //     toast.error('Login failed', {
  //       position: "top-center",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: false,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "dark",
        
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
  
      // Step 1: Login request
      const res = await axios.post("http://localhost:3000/api/auth/login", data);
  
      if (res?.data?.success) {
        const token = res.data.token;
        localStorage.setItem("token", token);
  
        // Show toast
        toast.success("Login successful", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
  
        // Step 2: Fetch user profile using token
        const response = await axios.get("http://localhost:3000/api/auth/check-auth", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const user = response.data.user;
        console.log("Fetched user data:", user); // For debugging
        // Step 3: Check if profile is complete
        const isProfileComplete = (user) =>
          user.username?.trim() &&
          user.email?.trim() &&
          user.location?.trim() &&
          user.experienceLevel?.trim() &&
          user.experienceYear !== null &&
          user.experienceYear !== undefined &&
          Array.isArray(user.preferredLanguages) && user.preferredLanguages.length > 0 &&
          Array.isArray(user.additionalSkills) && user.additionalSkills.length > 0 &&
          user.availability?.trim();
        
  
        // Step 4: Navigate based on profile completeness
        if (response.data.success && isProfileComplete(user)) {
          console.log("Complete user data:", user);
          navigate("/dashboard");
        } else {
          navigate("/completeprofile");
        }
      } else {
        toast.error(res.data.message || "Login failed", {
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
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
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
      <div className="w-full max-w-md space-y-8 bg-[#111] rounded-3xl border border-[#8D2B7E]/20 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-[#8D2B7E]" />
            </div>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className="w-full bg-black text-white pl-10 pr-4 py-3 rounded-lg border border-[#8D2B7E]/20 focus:outline-none focus:border-[#8D2B7E] placeholder-gray-500"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#8D2B7E]" />
            </div>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full bg-black text-white pl-10 pr-4 py-3 rounded-lg border border-[#8D2B7E]/20 focus:outline-none focus:border-[#8D2B7E] placeholder-gray-500"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-between items-center text-sm">
            <Link to="/forgot-password" className="text-[#8D2B7E] hover:underline">
              Forgot Password
            </Link>
            <Link to="/auth/register" className="text-[#8D2B7E] hover:underline">
              Sign up
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#8D2B7E] text-white py-3 rounded-lg hover:bg-[#8D2B7E]/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#111] text-gray-400">or</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              className="flex items-center justify-center p-2 bg-black rounded-lg border border-[#8D2B7E]/20 hover:border-[#8D2B7E] transition-colors"
            >
              <img src="/google.png" alt="Google" className="w-6 h-6" />
            </button>
            <button
              type="button"
              className="flex items-center justify-center p-2 bg-black rounded-lg border border-[#8D2B7E]/20 hover:border-[#8D2B7E] transition-colors"
            >
              <img src="/github.png" alt="GitHub" className="w-6 h-6" />
            </button>
            <button
              type="button"
              className="flex items-center justify-center p-2 bg-black rounded-lg border border-[#8D2B7E]/20 hover:border-[#8D2B7E] transition-colors"
            >
              <img src="/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;