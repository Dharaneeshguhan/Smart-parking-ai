import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Globe,
  Moon,
  Shield,
  Smartphone,
  Mail,
  CreditCard,
  Trash2,
  Download,
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card';
import Button from '../components/Button';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      bookingReminders: true,
      promotional: false
    },
    preferences: {
      language: 'en',
      timezone: 'UTC-5',
      currency: 'USD',
      darkMode: false,
      autoBook: false
    },
    privacy: {
      profileVisibility: 'public',
      locationSharing: true,
      dataAnalytics: true,
      marketingEmails: false
    }
  });

  const [loading, setLoading] = useState(false);

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSelect = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save settings to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      console.log('Account deletion requested');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex-1">
      <div className="flex flex-col">
        <div className="flex-1">
          <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                  <p className="text-sm text-gray-600">Manage your account preferences</p>
                </div>
                <Button onClick={handleSave} loading={loading}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-primary-600" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive booking confirmations and updates via email</p>
                      </div>
                      <button
                        onClick={() => handleToggle('notifications', 'email')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.email ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Push Notifications</h4>
                        <p className="text-sm text-gray-600">Get instant updates on your mobile device</p>
                      </div>
                      <button
                        onClick={() => handleToggle('notifications', 'push')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.push ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.push ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                        <p className="text-sm text-gray-600">Receive text messages for important updates</p>
                      </div>
                      <button
                        onClick={() => handleToggle('notifications', 'sms')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.sms ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Booking Reminders</h4>
                        <p className="text-sm text-gray-600">Get reminders before your booking starts</p>
                      </div>
                      <button
                        onClick={() => handleToggle('notifications', 'bookingReminders')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.bookingReminders ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.bookingReminders ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Promotional Emails</h4>
                        <p className="text-sm text-gray-600">Receive special offers and promotions</p>
                      </div>
                      <button
                        onClick={() => handleToggle('notifications', 'promotional')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.promotional ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.promotional ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-primary-600" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Language</h4>
                        <p className="text-sm text-gray-600">Choose your preferred language</p>
                      </div>
                      <select
                        value={settings.preferences.language}
                        onChange={(e) => handleSelect('preferences', 'language', e.target.value)}
                        className="input-field w-32"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Timezone</h4>
                        <p className="text-sm text-gray-600">Set your local timezone</p>
                      </div>
                      <select
                        value={settings.preferences.timezone}
                        onChange={(e) => handleSelect('preferences', 'timezone', e.target.value)}
                        className="input-field w-32"
                      >
                        <option value="UTC-5">EST</option>
                        <option value="UTC-6">CST</option>
                        <option value="UTC-7">MST</option>
                        <option value="UTC-8">PST</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Currency</h4>
                        <p className="text-sm text-gray-600">Display prices in your currency</p>
                      </div>
                      <select
                        value={settings.preferences.currency}
                        onChange={(e) => handleSelect('preferences', 'currency', e.target.value)}
                        className="input-field w-32"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CAD">CAD</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Dark Mode</h4>
                        <p className="text-sm text-gray-600">Use dark theme for the interface</p>
                      </div>
                      <button
                        onClick={() => handleToggle('preferences', 'darkMode')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.preferences.darkMode ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.preferences.darkMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Auto-booking</h4>
                        <p className="text-sm text-gray-600">Automatically book favorite spots when available</p>
                      </div>
                      <button
                        onClick={() => handleToggle('preferences', 'autoBook')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.preferences.autoBook ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.preferences.autoBook ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary-600" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                        <p className="text-sm text-gray-600">Control who can see your profile</p>
                      </div>
                      <select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => handleSelect('privacy', 'profileVisibility', e.target.value)}
                        className="input-field w-32"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends">Friends Only</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Location Sharing</h4>
                        <p className="text-sm text-gray-600">Share your location for better recommendations</p>
                      </div>
                      <button
                        onClick={() => handleToggle('privacy', 'locationSharing')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.privacy.locationSharing ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.privacy.locationSharing ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Data Analytics</h4>
                        <p className="text-sm text-gray-600">Help us improve with anonymous usage data</p>
                      </div>
                      <button
                        onClick={() => handleToggle('privacy', 'dataAnalytics')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.privacy.dataAnalytics ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.privacy.dataAnalytics ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Marketing Emails</h4>
                        <p className="text-sm text-gray-600">Receive marketing and promotional emails</p>
                      </div>
                      <button
                        onClick={() => handleToggle('privacy', 'marketingEmails')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.privacy.marketingEmails ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.privacy.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Link to="/payment-methods">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-900">Payment Methods</h4>
                            <p className="text-sm text-gray-600">Manage your payment options</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </Link>

                    <Link to="/connected-devices">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center">
                          <Smartphone className="h-5 w-5 text-gray-600 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-900">Connected Devices</h4>
                            <p className="text-sm text-gray-600">Manage your connected devices</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </Link>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <Download className="h-5 w-5 text-gray-600 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">Download Your Data</h4>
                          <p className="text-sm text-gray-600">Request a copy of your data</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <HelpCircle className="h-5 w-5 text-gray-600 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">Help & Support</h4>
                          <p className="text-sm text-gray-600">Get help with your account</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-red-900">Log Out</h4>
                        <p className="text-sm text-red-600">Sign out of your account</p>
                      </div>
                      <Button variant="outline" onClick={handleLogout} className="border-red-300 text-red-600 hover:bg-red-50">
                        <LogOut className="h-4 w-4 mr-2" />
                        Log Out
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-red-900">Delete Account</h4>
                        <p className="text-sm text-red-600">Permanently delete your account and data</p>
                      </div>
                      <Button variant="danger" onClick={handleDeleteAccount}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
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
  );
};

export default SettingsPage;
