import React, { useState, useEffect } from 'react';
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
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card';
import Button from '../components/Button';

const SettingsPage = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('user_settings');
    return saved ? JSON.parse(saved) : {
      notifications: {
        email: true,
        push: true,
        sms: false,
        bookingReminders: true,
        promotional: false
      },
      preferences: {
        language: 'en',
        timezone: 'UTC+5:30',
        currency: 'INR',
        darkMode: false,
        autoBook: false
      },
      privacy: {
        profileVisibility: 'public',
        locationSharing: true,
        dataAnalytics: true,
        marketingEmails: false
      }
    };
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('user_settings', JSON.stringify(settings));
  }, [settings]);

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
      // Simulate API sync
      await new Promise(resolve => setTimeout(resolve, 1200));
      localStorage.setItem('user_settings', JSON.stringify(settings));
      console.log('User settings synchronized:', settings);
    } catch (error) {
      console.error('Error synchronizing settings:', error);
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
    if (window.confirm('CRITICAL ACTION: Are you sure you want to permanently erase your account and all associated data?')) {
      console.log('Account deletion protocols initiated');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex-1">
      <div className="flex flex-col max-w-5xl mx-auto p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Configuration</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your digital footprint and application behavior</p>
          </div>
          <Button onClick={handleSave} loading={loading} className="px-8 shadow-lg shadow-primary-500/20">
            Sync Preferences
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* LEFT NAV (SCROLL SPY STYLE) */}
          <div className="md:col-span-1 space-y-1">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-white shadow-sm border border-slate-200 text-primary-600 font-black flex items-center gap-3">
              <Bell className="h-4 w-4" /> Communications
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white transition-all text-slate-500 font-bold flex items-center gap-3">
              <Globe className="h-4 w-4" /> Globalization
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white transition-all text-slate-500 font-bold flex items-center gap-3">
              <Shield className="h-4 w-4" /> Privacy Protocol
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white transition-all text-slate-500 font-bold flex items-center gap-3">
              <CreditCard className="h-4 w-4" /> Billing & Vault
            </button>
          </div>

          {/* MAIN CONTENT */}
          <div className="md:col-span-2 space-y-8">

            {/* NOTIFICATIONS */}
            <section className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary-500" />
                  Communication Hub
                </h3>
              </div>
              <div className="p-8 space-y-6">
                {[
                  { id: 'email', title: 'Intelligence Reports', desc: 'Detailed booking summaries via secure email', icon: Mail },
                  { id: 'push', title: 'Real-time Pulse', desc: 'Instant alerts on your primary device', icon: Smartphone },
                  { id: 'sms', title: 'Direct Link', desc: 'Critical status updates via encrypted SMS', icon: Smartphone },
                  { id: 'bookingReminders', title: 'Operational Alerts', desc: 'Advance warnings before scheduled arrival', icon: Bell }
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 rounded-2xl transition-all">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle('notifications', item.id)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${settings.notifications[item.id] ? 'bg-primary-500' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${settings.notifications[item.id] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* PREFERENCES */}
            <section className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-500" />
                  Global Standards
                </h3>
              </div>
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Linguistic Engine</label>
                  <select
                    value={settings.preferences.language}
                    onChange={(e) => handleSelect('preferences', 'language', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-slate-900 transition-all appearance-none cursor-pointer"
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Currency Unit</label>
                  <select
                    value={settings.preferences.currency}
                    onChange={(e) => handleSelect('preferences', 'currency', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-slate-900 transition-all appearance-none cursor-pointer"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* DANGER ZONE */}
            <section className="bg-red-50/30 rounded-3xl border-2 border-red-100 overflow-hidden">
              <div className="p-8 flex items-center justify-between">
                <div>
                  <h4 className="text-red-900 font-black text-xl">Operational Shutdown</h4>
                  <p className="text-red-600/70 font-medium text-sm mt-1">Permanently terminate access and wipe data</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={handleLogout} className="px-4 py-2 font-bold text-red-700 bg-white border-2 border-red-200 rounded-xl hover:bg-red-50 transition-all flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> Exit
                  </button>
                  <button onClick={handleDeleteAccount} className="px-4 py-2 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/20 flex items-center gap-2">
                    <Trash2 className="h-4 w-4" /> Purge Account
                  </button>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
