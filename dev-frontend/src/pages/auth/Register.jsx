import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock } from 'lucide-react';
import { ToastContainer,toast } from 'react-toastify';

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, data);
      if(res?.data?.success){
        // alert("Registration successful");
        toast.success('Registration successful', {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                  
                  });
        navigate("/auth/login");
      } else {
        // alert(res.data.message);
        toast.error(res.data.message, {
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
      // alert("Registration failed");
      toast.error('Registration failed', {
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#8D2B7E]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FF96F5]/10 rounded-full blur-[120px] pointer-events-none"></div>

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
      
      <div className="w-full max-w-md space-y-8 bg-[#111]/60 backdrop-blur-xl rounded-3xl border border-[#8D2B7E]/30 p-8 shadow-[0_0_40px_rgba(141,43,126,0.2)] relative z-10 transition-all hover:shadow-[0_0_60px_rgba(141,43,126,0.3)]">
        <div className="text-center">
           <div className="inline-flex justify-center items-center h-16 w-16 rounded-full bg-gradient-to-tr from-[#8D2B7E] to-[#FF96F5] mb-6 shadow-lg">
              <User className="h-8 w-8 text-white" />
           </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF96F5] to-[#8D2B7E] mb-2">Create Account</h1>
          <p className="text-gray-400">Join our community of developers today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none transition-colors group-focus-within:text-[#FF96F5]">
                <User className="h-5 w-5 text-gray-500 group-focus-within:text-[#FF96F5]" />
              </div>
              <input
                type="text"
                {...register('username', { 
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                className="w-full bg-black/50 text-white pl-10 pr-4 py-4 rounded-xl border border-[#8D2B7E]/20 focus:outline-none focus:border-[#FF96F5] focus:ring-1 focus:ring-[#FF96F5] placeholder-gray-600 transition-all duration-300"
                placeholder="Username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1 ml-1">{errors.username.message}</p>
              )}
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none transition-colors group-focus-within:text-[#FF96F5]">
                <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-[#FF96F5]" />
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
                className="w-full bg-black/50 text-white pl-10 pr-4 py-4 rounded-xl border border-[#8D2B7E]/20 focus:outline-none focus:border-[#FF96F5] focus:ring-1 focus:ring-[#FF96F5] placeholder-gray-600 transition-all duration-300"
                placeholder="Email Address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none transition-colors group-focus-within:text-[#FF96F5]">
                <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-[#FF96F5]" />
              </div>
              <input
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className="w-full bg-black/50 text-white pl-10 pr-4 py-4 rounded-xl border border-[#8D2B7E]/20 focus:outline-none focus:border-[#FF96F5] focus:ring-1 focus:ring-[#FF96F5] placeholder-gray-600 transition-all duration-300"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 ml-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center text-sm">
            <span className="text-gray-400 mr-1">Already have an account?</span>
            <Link to="/auth/login" className="text-[#FF96F5] hover:text-[#8D2B7E] hover:underline font-medium transition-colors">
              Sign in
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(141,43,126,0.4)] hover:shadow-[0_0_30px_rgba(141,43,126,0.6)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#A259C6] hover:to-[#8D2B7E]"
          >
            {isLoading ? (
               <span className="flex items-center justify-center gap-2">
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 Creating account...
              </span>
            ) : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;