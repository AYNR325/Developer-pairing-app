import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock } from 'lucide-react';

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await axios.post("http://localhost:3000/api/auth/register", data);
      alert("Registration successful");
      navigate("/auth/login");
    } catch (err) {
      alert("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-[#111] rounded-3xl border border-[#8D2B7E]/20 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Register</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-[#8D2B7E]" />
            </div>
            <input
              type="text"
              {...register('username', { 
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              className="w-full bg-black text-white pl-10 pr-4 py-3 rounded-lg border border-[#8D2B7E]/20 focus:outline-none focus:border-[#8D2B7E] placeholder-gray-500"
              placeholder="Username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

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
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className="w-full bg-black text-white pl-10 pr-4 py-3 rounded-lg border border-[#8D2B7E]/20 focus:outline-none focus:border-[#8D2B7E] placeholder-gray-500"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-end items-center text-sm">
            <Link to="/auth/login" className="text-[#8D2B7E] hover:underline">
              Sign in
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#8D2B7E] text-white py-3 rounded-lg hover:bg-[#8D2B7E]/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
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

export default Register;