import React, { useState, useEffect } from 'react';
import { Settings, Bell, Shield, CreditCard, Users, Globe, Smartphone, Mail, Lock, Save, Eye, EyeOff } from 'lucide-react';

const OwnerSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      businessName: 'Smart Parking Solutions',
      email: 'owner@smartparking.com',
      phone: '+1 234-567-8900',
      address: '123 Business Ave, Suite 100',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      website: 'www.smartparking.com',
      timezone: 'America/New_York'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      bookingAlerts: true,
      paymentAlerts: true,
      maintenanceAlerts: true,
      dailyReports: false,
      weeklyReports: true,
      monthlyReports: true
    },
    payment: {
      defaultPaymentMethod: 'credit_card',
      autoRefundEnabled: true,
      refundPolicy: '24_hours',
      lateFeeEnabled: true,
      lateFeeAmount: 5.00,
      cancellationPolicy: '2_hours',
      currency: 'USD',
      taxRate: 8.5
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      ipWhitelist: ['192.168.1.1', '10.0.0.1'],
      apiRateLimit: 1000,
      logRetention: 90
    },
    integrations: {
      googleAnalytics: true,
      facebookPixel: false,
      googleAds: true,
      mailchimp: true,
      stripeConnect: true,
      paypalConnect: true,
      quickbooksConnect: false
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Globe }
  ];

  const handleInputChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleToggle = (category, field) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Saving settings:', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addIPToWhitelist = () => {
    const ip = prompt('Enter IP address to whitelist:');
    if (ip) {
      setSettings(prev => ({
        ...prev,
        security: {
          ...prev.security,
          ipWhitelist: [...prev.security.ipWhitelist, ip]
        }
      }));
    }
  };

  const removeIPFromWhitelist = (index) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        ipWhitelist: prev.security.ipWhitelist.filter((_, i) => i !== index)
      }
    }));
  };

  return (
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account and business settings</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <tab.icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                    <input
                      type="text"
                      value={settings.general.businessName}
                      onChange={(e) => handleInputChange('general', 'businessName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={settings.general.email}
                      onChange={(e) => handleInputChange('general', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={settings.general.phone}
                      onChange={(e) => handleInputChange('general', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={settings.general.website}
                      onChange={(e) => handleInputChange('general', 'website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={settings.general.address}
                      onChange={(e) => handleInputChange('general', 'address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={settings.general.city}
                      onChange={(e) => handleInputChange('general', 'city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={settings.general.state}
                      onChange={(e) => handleInputChange('general', 'state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={settings.general.zipCode}
                      onChange={(e) => handleInputChange('general', 'zipCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      value={settings.general.country}
                      onChange={(e) => handleInputChange('general', 'country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option>America/New_York</option>
                      <option>America/Los_Angeles</option>
                      <option>America/Chicago</option>
                      <option>Europe/London</option>
                      <option>Asia/Tokyo</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {Object.entries({
                    emailNotifications: 'Email Notifications',
                    smsNotifications: 'SMS Notifications',
                    bookingAlerts: 'Booking Alerts',
                    paymentAlerts: 'Payment Alerts',
                    maintenanceAlerts: 'Maintenance Alerts',
                    dailyReports: 'Daily Reports',
                    weeklyReports: 'Weekly Reports',
                    monthlyReports: 'Monthly Reports'
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <button
                        type="button"
                        onClick={() => handleToggle('notifications', key)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 ${
                          settings.notifications[key] ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                          style={{ transform: settings.notifications[key] ? 'translateX(1.25rem)' : 'translateX(0)' }}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Payment Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Payment Method</label>
                    <select
                      value={settings.payment.defaultPaymentMethod}
                      onChange={(e) => handleInputChange('payment', 'defaultPaymentMethod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="stripe">Stripe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={settings.payment.currency}
                      onChange={(e) => handleInputChange('payment', 'currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.payment.taxRate}
                      onChange={(e) => handleInputChange('payment', 'taxRate', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Late Fee Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.payment.lateFeeAmount}
                      onChange={(e) => handleInputChange('payment', 'lateFeeAmount', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Refund Policy</label>
                    <select
                      value={settings.payment.refundPolicy}
                      onChange={(e) => handleInputChange('payment', 'refundPolicy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="24_hours">24 Hours</option>
                      <option value="48_hours">48 Hours</option>
                      <option value="7_days">7 Days</option>
                      <option value="no_refund">No Refund</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
                    <select
                      value={settings.payment.cancellationPolicy}
                      onChange={(e) => handleInputChange('payment', 'cancellationPolicy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="2_hours">2 Hours</option>
                      <option value="4_hours">4 Hours</option>
                      <option value="24_hours">24 Hours</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.payment.autoRefundEnabled}
                        onChange={() => handleToggle('payment', 'autoRefundEnabled')}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Enable Automatic Refunds</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.payment.lateFeeEnabled}
                        onChange={() => handleToggle('payment', 'lateFeeEnabled')}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Enable Late Fees</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Security Configuration</h3>
                
                {/* Password Change */}
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Change Password</h4>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </form>
                </div>

                {/* Security Options */}
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={() => handleToggle('security', 'twoFactorAuth')}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Enable Two-Factor Authentication</span>
                  </label>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      min="5"
                      max="120"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Rate Limit (requests/hour)</label>
                    <input
                      type="number"
                      min="100"
                      value={settings.security.apiRateLimit}
                      onChange={(e) => handleInputChange('security', 'apiRateLimit', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Log Retention (days)</label>
                    <input
                      type="number"
                      min="7"
                      max="365"
                      value={settings.security.logRetention}
                      onChange={(e) => handleInputChange('security', 'logRetention', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">IP Whitelist</label>
                      <button
                        type="button"
                        onClick={addIPToWhitelist}
                        className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700"
                      >
                        Add IP
                      </button>
                    </div>
                    <div className="space-y-2">
                      {settings.security.ipWhitelist.map((ip, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-700">{ip}</span>
                          <button
                            type="button"
                            onClick={() => removeIPFromWhitelist(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Settings */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Third-Party Integrations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries({
                    googleAnalytics: { name: 'Google Analytics', desc: 'Track website traffic and user behavior' },
                    facebookPixel: { name: 'Facebook Pixel', desc: 'Track conversions from Facebook ads' },
                    googleAds: { name: 'Google Ads', desc: 'Track ad performance and conversions' },
                    mailchimp: { name: 'Mailchimp', desc: 'Email marketing automation' },
                    stripeConnect: { name: 'Stripe Connect', desc: 'Process credit card payments' },
                    paypalConnect: { name: 'PayPal Connect', desc: 'Process PayPal payments' },
                    quickbooksConnect: { name: 'QuickBooks', desc: 'Accounting integration' }
                  }).map(([key, config]) => (
                    <label key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.integrations[key]}
                            onChange={() => handleToggle('integrations', key)}
                            className="mr-3"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{config.name}</p>
                            <p className="text-xs text-gray-500">{config.desc}</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default OwnerSettingsPage;
