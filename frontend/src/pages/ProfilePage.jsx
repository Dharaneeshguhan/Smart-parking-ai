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
  CreditCard
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import Button from '../components/Button';
import { authAPI } from '../services/api';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        vehicleNumber: userData.vehicleNumber || '',
        emergencyContact: userData.emergencyContact || ''
      });
    }
  }, []);

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
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex-1">
      <div className="flex flex-col">
        <div className="flex-1">
          <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                  <p className="text-sm text-gray-600">Manage your personal information</p>
                </div>
                <div className="flex items-center space-x-4">
                  {!editing ? (
                    <Button onClick={() => setEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSave} loading={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="text-center">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-16 w-16 text-primary-600" />
                      </div>
                      {editing && (
                        <button className="absolute bottom-4 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700">
                          <Camera className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{user.name}</h3>
                    <p className="text-gray-600 mb-4">{user.email}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center text-gray-600">
                        <Car className="h-4 w-4 mr-2" />
                        Driver Account
                      </div>
                      <div className="flex items-center justify-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Member since {new Date(user.createdAt || '2024-01-01').toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Bookings</span>
                        <span className="font-semibold text-gray-900">24</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Favorite Spots</span>
                        <span className="font-semibold text-gray-900">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Spent</span>
                        <span className="font-semibold text-gray-900">$342</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {errors.submit && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-700">{errors.submit}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!editing}
                          className={`input-field ${!editing ? 'bg-gray-50' : ''} ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!editing}
                          className={`input-field ${!editing ? 'bg-gray-50' : ''} ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!editing}
                          placeholder="+1 (555) 000-0000"
                          className={`input-field ${!editing ? 'bg-gray-50' : ''} ${errors.phone ? 'border-red-500' : ''}`}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Number
                        </label>
                        <input
                          type="text"
                          name="vehicleNumber"
                          value={formData.vehicleNumber}
                          onChange={handleChange}
                          disabled={!editing}
                          placeholder="ABC 1234"
                          className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={!editing}
                          placeholder="123 Main St, City, State"
                          className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Emergency Contact
                        </label>
                        <input
                          type="text"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleChange}
                          disabled={!editing}
                          placeholder="Name and phone number"
                          className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-primary-600" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Change Password</h4>
                          <p className="text-sm text-gray-600">Update your password regularly</p>
                        </div>
                        <Link to="/change-password">
                          <Button variant="outline" size="small">
                            Change
                          </Button>
                        </Link>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline" size="small">
                          Enable
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Login Activity</h4>
                          <p className="text-sm text-gray-600">View your recent login history</p>
                        </div>
                        <Button variant="outline" size="small">
                          View
                        </Button>
                      </div>
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
