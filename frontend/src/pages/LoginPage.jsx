import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Car,
  Mail,
  Lock,
  AlertCircle
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Card, { CardContent } from '../components/Card';
import Button from '../components/Button';
import { authAPI } from '../services/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Invalid email';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Minimum 6 characters required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setLoginError('');

    try {
      const response = await authAPI.login(formData);
      const { token, id, name, email, role } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, name, email, role }));

      if (role === 'ROLE_OWNER') {
        navigate('/owner/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error) {
      setLoginError(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="min-h-[calc(100vh-70px)] grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT SIDE — LOGIN FORM */}
        <div className="flex items-center justify-center px-6 py-10 bg-gradient-to-br from-slate-100 via-slate-50 to-white">
          <div className="w-full max-w-md">

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 flex items-center justify-center shadow-md">
                <Car className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="mt-4 text-3xl font-black text-slate-800">
                Welcome Back
              </h2>
              <p className="text-slate-500 text-sm">
                Sign in to continue to SmartPark
              </p>
            </div>

            {/* UPDATED CONTAINER STYLE */}
            <Card className="rounded-3xl border border-white/40 bg-white/80 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <CardContent className="p-6">

                {loginError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-sm text-red-700">{loginError}</span>
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>

                  {/* EMAIL */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Email
                    </label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className={`w-full pl-10 pr-3 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${errors.email ? 'border-red-500' : 'border-slate-300'
                          }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className={`w-full pl-10 pr-10 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${errors.password ? 'border-red-500' : 'border-slate-300'
                          }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-slate-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-slate-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-xl shadow-md"
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="text-center mt-6 text-sm">
                  <span className="text-slate-600">
                    Don’t have an account?{' '}
                    <Link to="/signup" className="text-primary-600 font-semibold hover:underline">
                      Sign up
                    </Link>
                  </span>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>

        {/* RIGHT SIDE — IMAGE */}
        <div className="hidden lg:block relative">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600"
            alt="Parking"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white px-8">
              <h2 className="text-4xl font-black mb-4">
                Smart Parking Navigation
              </h2>
              <p className="text-lg text-slate-200">
                AI-powered parking, live routes, and real-time availability.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;