import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Input from "@/components/inputs/Input.jsx";
import { Label } from "@/components/ui/label";
import { validateEmail } from '@/utils/helper.js';
import { UserContext } from '@/context/UserContext.jsx';
import axiosInstance from '@/utils/AxiosInstance.js';
import { API_PATHS } from '@/utils/apiPaths.js';

export function CardDemo({ setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setError('');

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Card className="w-[90vw] md:w-[33vw] bg-white p-3">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg font-semibold text-black">Login to your account</CardTitle>
        <CardDescription className="text-xs text-slate-600">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="grid gap-2">
              <Input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email"
                type="text"
                placeholder="Enter your email"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium">Password</span>
                <a
                  href="#"
                  className="text-[13px] text-blue-600 hover:text-blue-800 underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                type="password"
                placeholder="Enter your password"
                label=""
              />
            </div>
            {error && <p className='text-red-500 text-xs'>{error}</p>}
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
            <button type="button" className="w-full btn-outline">
              Login with Google
            </button>
            <p className="text-[13px] text-slate-800 text-center">
              Don't have an account?{" "}
              <button 
                type="button"
                className="font-medium text-blue-600 hover:text-blue-800 underline"
                onClick={() => setCurrentPage("signup")}
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

