import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Car, Upload, X, Plus, Trash2 } from 'lucide-react';
import { ownerAPI } from '../../services/api';
import MapSelector from '../../components/MapSelector';

const AddNewSlotPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    totalSlots: '',
    hourlyRate: '',
    dailyRate: '',
    weeklyRate: '',
    monthlyRate: '',
    latitude: 13.0827,
    longitude: 80.2707,
    operatingHours: {
      monday: { open: '08:00', close: '22:00', closed: false },
      tuesday: { open: '08:00', close: '22:00', closed: false },
      wednesday: { open: '08:00', close: '22:00', closed: false },
      thursday: { open: '08:00', close: '22:00', closed: false },
      friday: { open: '08:00', close: '22:00', closed: false },
      saturday: { open: '08:00', close: '22:00', closed: false },
      sunday: { open: '08:00', close: '22:00', closed: false }
    },
    features: {
      covered: false,
      security: false,
      cctv: false,
      lighting: false,
      disabledAccess: false,
      evCharging: false,
      carWash: false,
      valet: false
    },
    images: [],
    rules: [
      'No overnight parking',
      'Payment required at entry'
    ]
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [newRule, setNewRule] = useState('');

  const weekDays = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Parking name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.totalSlots || formData.totalSlots <= 0) {
      newErrors.totalSlots = 'Total slots must be greater than 0';
    }
    if (!formData.hourlyRate || formData.hourlyRate <= 0) {
      newErrors.hourlyRate = 'Hourly rate must be greater than 0';
    }
    if (!formData.dailyRate || formData.dailyRate <= 0) {
      newErrors.dailyRate = 'Daily rate must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        pricePerHour: parseFloat(formData.hourlyRate),
        totalSpots: parseInt(formData.totalSlots)
      };

      await ownerAPI.addParkingSlot(payload);
      navigate('/owner/parking-slots');
    } catch (error) {
      console.error('Error creating parking slot:', error);
      alert('Failed to create parking slot');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: field === 'closed' ? value : value
        }
      }
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addRule = () => {
    if (newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const removeRule = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Parking Slot</h1>
        <p className="mt-2 text-gray-600">Add a new parking location to your portfolio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parking Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder="Downtown Parking Complex"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.address ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="123 Main Street, Downtown"
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mark Location on Map *
              </label>
              <MapSelector
                initialCenter={{ lat: formData.latitude, lng: formData.longitude }}
                onLocationSelected={(pos) => setFormData(p => ({ ...p, latitude: pos.lat, longitude: pos.lng }))}
                height="250px"
              />
              <p className="mt-1 text-xs text-gray-500 italic">
                Selected: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your parking facility..."
              />
            </div>
          </div>
        </div>

        {/* Capacity and Pricing */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Capacity & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Slots *
              </label>
              <div className="relative">
                <Car className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="totalSlots"
                  value={formData.totalSlots}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.totalSlots ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="50"
                />
              </div>
              {errors.totalSlots && (
                <p className="mt-1 text-sm text-red-600">{errors.totalSlots}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Rate ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.hourlyRate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="5.00"
                />
              </div>
              {errors.hourlyRate && (
                <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Rate ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="dailyRate"
                  value={formData.dailyRate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.dailyRate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="25.00"
                />
              </div>
              {errors.dailyRate && (
                <p className="mt-1 text-sm text-red-600">{errors.dailyRate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Rate ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="weeklyRate"
                  value={formData.weeklyRate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="120.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Rate ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="monthlyRate"
                  value={formData.monthlyRate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="400.00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Operating Hours</h2>
          <div className="space-y-4">
            {weekDays.map((day) => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-24">
                  <label className="text-sm font-medium text-gray-700 capitalize">
                    {day.slice(0, 3)}
                  </label>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={!formData.operatingHours[day].closed}
                    onChange={(e) => handleOperatingHoursChange(day, 'closed', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Closed</span>
                </label>
                {!formData.operatingHours[day].closed && (
                  <>
                    <input
                      type="time"
                      value={formData.operatingHours[day].open}
                      onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={formData.operatingHours[day].close}
                      onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Features & Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries({
              covered: 'Covered Parking',
              security: '24/7 Security',
              cctv: 'CCTV Surveillance',
              lighting: 'Well Lit',
              disabledAccess: 'Disabled Access',
              evCharging: 'EV Charging',
              carWash: 'Car Wash',
              valet: 'Valet Service'
            }).map(([key, label]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.features[key]}
                  onChange={() => handleFeatureToggle(key)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Images</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center cursor-pointer hover:text-primary-600"
              >
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Click to upload images</span>
                <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rules */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Parking Rules</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Add a new rule..."
              />
              <button
                type="button"
                onClick={addRule}
                className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {formData.rules.map((rule, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-sm text-gray-700">{rule}</span>
                <button
                  type="button"
                  onClick={() => removeRule(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/owner/parking-slots')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Parking Slot'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewSlotPage;
