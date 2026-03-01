import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Car,
  CreditCard,
  Star,
  Activity,
  DollarSign,
  AlertCircle,
  Lock
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import Button from '../components/Button';
import { authAPI } from '../services/api';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    vehicleNumber: '',
    emergencyContact: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setFetching(true);
    try {
      const response = await authAPI.getProfile();
      const userData = response.data;
      setUser(userData);

      // Update local storage if needed
      const currentLocalUser = JSON.parse(localStorage.getItem('user'));
      if (currentLocalUser) {
        localStorage.setItem('user', JSON.stringify({ ...currentLocalUser, ...userData }));
      }

      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        vehicleNumber: userData.vehicleNumber || '',
        emergencyContact: userData.emergencyContact || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to local storage if API fails
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          vehicleNumber: userData.vehicleNumber || '',
          emergencyContact: userData.emergencyContact || ''
        });
      }
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authAPI.updateProfile(formData);
      const updatedUser = response.data;

      // Keep the role from local storage since backend might not return it in profile update if it's separate
      const currentLocalUser = JSON.parse(localStorage.getItem('user'));
      const fullUser = { ...currentLocalUser, ...updatedUser };

      setUser(fullUser);
      localStorage.setItem('user', JSON.stringify(fullUser));
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      vehicleNumber: user?.vehicleNumber || '',
      emergencyContact: user?.emergencyContact || ''
    });
    setEditing(false);
    setErrors({});
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const isOwner = user?.role === 'ROLE_OWNER' || user?.role === 'owner';

  return (
    <div className="min-h-screen bg-gray-50 flex-1">
      <div className="flex flex-col">
        <div className="flex-1">
          {/* PREMIUM HEADER WITH GLASSMORPHISM */}
          <div className="relative h-64 bg-slate-900 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-purple-600"></div>
              <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="absolute bottom-0 left-0 w-full px-8 pb-8 flex items-end justify-between">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl overflow-hidden bg-white">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-50">
                        <User className="h-16 w-16 text-primary-600" />
                      </div>
                    )}
                  </div>
                  {editing && (
                    <button className="absolute -bottom-2 -right-2 p-2 bg-white text-primary-600 rounded-lg shadow-lg hover:bg-primary-50 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="mb-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-white tracking-tight">{user?.name}</h1>
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${isOwner ? 'bg-amber-400 text-amber-950' : 'bg-emerald-400 text-emerald-950'}`}>
                      {isOwner ? 'Parking Master' : 'Valued Driver'}
                    </span>
                  </div>
                  <p className="text-white/70 mt-1 font-medium">{user?.email}</p>
                </div>
              </div>

              {!editing ? (
                <Button onClick={() => setEditing(true)} className="bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20 text-white font-bold px-6 border">
                  <Edit className="h-4 w-4 mr-2" />
                  Customize Profile
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleCancel} className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <X className="h-4 w-4 mr-2" />
                    Discard
                  </Button>
                  <Button onClick={handleSave} loading={loading} className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30">
                    <Save className="h-4 w-4 mr-2" />
                    Commit Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 -mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* SIDEBAR STATS */}
              <div className="space-y-6">
                <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                  <CardHeader className="bg-slate-50 border-b">
                    <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary-600" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Car className="h-4 w-4" /></div>
                          <span className="text-sm font-bold text-slate-600">{isOwner ? 'Total Slots' : 'Total Bookings'}</span>
                        </div>
                        <span className="text-xl font-black text-slate-900">{isOwner ? '15' : '24'}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Star className="h-4 w-4" /></div>
                          <span className="text-sm font-bold text-slate-600">Reputation Score</span>
                        </div>
                        <span className="text-xl font-black text-slate-900">4.9/5.0</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><DollarSign className="h-4 w-4" /></div>
                          <span className="text-sm font-bold text-slate-600">{isOwner ? 'Revenue Target' : 'Cost Savings'}</span>
                        </div>
                        <span className="text-xl font-black text-slate-900">{isOwner ? '92%' : '$128'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Longevity */}
                <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl text-white shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl"><Shield className="h-6 w-6 text-primary-400" /></div>
                    <div>
                      <p className="text-xs text-white/50 uppercase font-black tracking-widest">Safe Member Since</p>
                      <p className="text-lg font-bold">{new Date(user?.createdAt || '2024-01-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* MAIN DETAILS */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-xl shadow-slate-200/50">
                  <CardHeader className="border-b px-8 py-6">
                    <CardTitle className="text-lg font-black text-slate-800 tracking-tight">Personal Profile Intelligence</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    {errors.submit && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-shake">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <p className="text-sm font-bold text-red-700">{errors.submit}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!editing}
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none font-bold text-slate-900 ${!editing ? 'bg-slate-50/50 border-transparent' : 'bg-white border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'} ${errors.name ? 'border-red-500 bg-red-50' : ''}`}
                          />
                        </div>
                        {errors.name && <p className="text-[10px] font-black text-red-500 ml-1">{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Registry Email Address</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!editing}
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none font-bold text-slate-900 ${!editing ? 'bg-slate-50/50 border-transparent' : 'bg-white border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'} ${errors.email ? 'border-red-500 bg-red-50' : ''}`}
                          />
                        </div>
                        {errors.email && <p className="text-[10px] font-black text-red-500 ml-1">{errors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Verified Phone Line</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="+1 (555) 000-0000"
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none font-bold text-slate-900 ${!editing ? 'bg-slate-50/50 border-transparent' : 'bg-white border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'} ${errors.phone ? 'border-red-500 bg-red-50' : ''}`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{isOwner ? 'Operating Region' : 'Primary Vehicle Plate'}</label>
                        <div className="relative group">
                          {isOwner ? <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /> : <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />}
                          <input
                            type="text"
                            name="vehicleNumber"
                            value={formData.vehicleNumber}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder={isOwner ? "Coimbatore Region" : "TN-38-AX-0001"}
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none font-bold text-slate-900 ${!editing ? 'bg-slate-50/50 border-transparent' : 'bg-white border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'}`}
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Digital Residence Address</label>
                        <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="7th Cross St, Gandhipuram, Coimbatore"
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none font-bold text-slate-900 ${!editing ? 'bg-slate-50/50 border-transparent' : 'bg-white border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'}`}
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Emergency Protocols Contract</label>
                        <div className="relative group">
                          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="Next of kin name and verified number"
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none font-bold text-slate-900 ${!editing ? 'bg-slate-50/50 border-transparent' : 'bg-white border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'}`}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-slate-900 text-white">
                  <CardHeader className="border-b border-white/10 px-8 py-6">
                    <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary-400" />
                      Cybersecurity Lockdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="flex flex-col items-start p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left">
                        <p className="font-bold text-sm">Update Password</p>
                        <p className="text-[10px] text-white/50 mt-1 uppercase tracking-widest">Modified 3 months ago</p>
                      </button>
                      <button className="flex flex-col items-start p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left">
                        <p className="font-bold text-sm">2FA Protocols</p>
                        <p className="text-[10px] text-emerald-400 mt-1 uppercase tracking-widest font-black">Active & Shielded</p>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
