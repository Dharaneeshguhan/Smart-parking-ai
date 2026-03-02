import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Car,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Card, { CardContent } from '../components/Card';
import Button from '../components/Button';
import { authAPI } from '../services/api';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'driver'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [success, setSuccess] = useState(false);

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
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password required';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSignupError('');

    try {
      const { confirmPassword, ...signupData } = formData;
      await authAPI.register(signupData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setSignupError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md w-full text-center shadow-2xl rounded-3xl">
          <CardContent>
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Registration Successful</h2>
            <p className="text-gray-600 mt-2">Redirecting to login...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <Navbar />

      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          {/* HEADER */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 flex items-center justify-center shadow-lg">
              <Car className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="mt-4 text-3xl font-black text-slate-800">
              Create Account
            </h2>
            <p className="text-slate-500 text-sm">
              Join SmartPark and start smarter parking
            </p>
          </div>

          {/* CARD */}
          <Card className="backdrop-blur-xl bg-white/90 border border-white/40 shadow-2xl rounded-3xl">
            <CardContent className="p-7">

              {signupError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-red-700">{signupError}</span>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>

                {/* NAME */}
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  />
                </div>

                {/* EMAIL */}
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  />
                </div>

                {/* PASSWORD */}
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-3"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* ROLE */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {['driver', 'owner'].map(role => (
                    <label
                      key={role}
                      className={`cursor-pointer border rounded-xl p-3 text-center transition font-semibold ${formData.role === role
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-slate-300 hover:border-primary-300'
                        }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={formData.role === role}
                        onChange={handleChange}
                        className="hidden"
                      />
                      {role === 'driver' ? 'Driver' : 'Parking Owner'}
                    </label>
                  ))}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl shadow-lg"
                  loading={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <div className="text-center mt-5 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                  Sign in
                </Link>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;